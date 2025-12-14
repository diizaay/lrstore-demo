// src/pages/Checkout.js
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { ShoppingBag, CreditCard, User, MapPin } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import {
  createOrder,
  getCurrentUser,
  getUserAddresses,
  startMulticaixaExpressPayment,
  startMulticaixaReferencePayment,
} from '../services/api';

const Checkout = () => {
  // Carrinho vindo do contexto (items/totalPrice, igual ao CartSidebar)
  const { items, totalQty, totalPrice, clearCart } = useCart();
  const cartItems = useMemo(
    () => (Array.isArray(items) ? items : []),
    [items]
  );

  const navigate = useNavigate();

  // Dados do formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Luanda',
    paymentMethod: 'multicaixa-express',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Endereços salvos na conta
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);

  const formatPrice = (price) =>
    new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
    }).format(price || 0);

  const getItemUnitPrice = (item) => {
    const product = item.product || {};
    return (
      product.promoPrice ??
      product.promo_price ??
      product.price ??
      0
    );
  };

  const calcFallbackTotal = () =>
    cartItems.reduce(
      (sum, item) =>
        sum + getItemUnitPrice(item) * (item.quantity || 1),
      0
    );

  // 🔄 Carregar utilizador + endereços ao entrar no checkout
  useEffect(() => {
    (async () => {
      try {
        // Preencher nome/email/telefone a partir do utilizador logado
        const user = await getCurrentUser();
        if (user) {
          setFormData((prev) => ({
            ...prev,
            name: user.name || prev.name,
            email: user.email || prev.email,
            phone: user.phone || prev.phone,
          }));
        }
      } catch (err) {
        console.warn('[Checkout] Não foi possível carregar utilizador atual', err);
      }

      try {
        const list = await getUserAddresses();
        const arr = Array.isArray(list) ? list : [];
        setAddresses(arr);

        if (arr.length > 0) {
          // Seleciona o primeiro endereço como padrão
          const firstId = arr[0].id || arr[0]._id;
          setSelectedAddressId(String(firstId));
          setUseNewAddress(false);
        } else {
          // Sem endereços: obriga a preencher um novo
          setUseNewAddress(true);
        }
      } catch (err) {
        console.warn('[Checkout] Erro ao carregar endereços', err);
        // Se der erro, deixa o utilizador preencher manualmente
        setUseNewAddress(true);
      } finally {
        setAddressesLoading(false);
      }
    })();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Define qual endereço será usado no pedido (salvo ou novo)
  const resolveCustomerAddress = () => {
    // Se tem endereços e NÃO está a usar novo → usar o selecionado
    if (!useNewAddress && addresses.length > 0 && selectedAddressId) {
      const addr = addresses.find(
        (a) => String(a.id || a._id) === String(selectedAddressId)
      );
      if (addr) {
        // Backend dos endereços (pelo api.js) indica estes campos:
        // contact_name, phone, province, municipality, neighborhood, street
        const line = [
          addr.street,
          addr.neighborhood || addr.bairro,
        ]
          .filter(Boolean)
          .join(', ');

        const city =
          addr.municipality ||
          addr.municipio ||
          addr.province ||
          addr.provincia ||
          formData.city;

        return {
          name: addr.contact_name || formData.name,
          phone: addr.phone || formData.phone,
          address: line || formData.address,
          city: city || formData.city,
        };
      }
    }

    // Caso contrário, usa o que foi preenchido manualmente
    return {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
    };
  };

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (isProcessing) return;

    // Validação básica comum
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: 'Erro',
        description: 'Nome, email e telefone são obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    // Validação do endereço:
    // - se NÃO tem endereços ou o user escolheu "usar outro endereço", exige address/city
    // - senão, só exige que haja um endereço selecionado
    if (addresses.length === 0 || useNewAddress) {
      if (!formData.address || !formData.city) {
        toast({
          title: 'Erro',
          description:
            'Por favor, preencha o endereço de entrega (endereço e cidade).',
          variant: 'destructive',
        });
        return;
      }
    } else {
      if (!selectedAddressId) {
        toast({
          title: 'Erro',
          description: 'Selecione um endereço de entrega.',
          variant: 'destructive',
        });
        return;
      }
    }

    if (!cartItems || cartItems.length === 0) {
      toast({
        title: 'Carrinho vazio',
        description: 'Adicione produtos ao carrinho antes de finalizar.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsProcessing(true);

      const total = typeof totalPrice === 'number'
        ? totalPrice
        : calcFallbackTotal();

      const resolvedAddress = resolveCustomerAddress();

      const orderData = {
        customer: {
          name: resolvedAddress.name,
          email: formData.email,
          phone: resolvedAddress.phone,
          address: resolvedAddress.address,
          city: resolvedAddress.city,
        },
        items: cartItems.map((item) => {
          const product = item.product || {};
          const unitPrice = getItemUnitPrice(item);

          return {
            product_id: item.productId || product.id || product._id,
            name: product.name,
            quantity: item.quantity || 1,
            selected_color: item.selectedColor,
            price: unitPrice,
            image: product.image || product.imageUrl,
          };
        }),
        payment_method: formData.paymentMethod,
        total,
      };

      console.log('[Checkout] Enviando orderData:', orderData);

      const data = await createOrder(orderData);
      console.log('[Checkout] Resposta createOrder:', data);

      const order = data?.order || data || {};
      const orderNumber =
        order.order_number || order.orderNumber || order.id;

      // limpar carrinho só depois de criar o pedido
      await (clearCart && clearCart());

      setIsProcessing(false);

      if (!orderNumber) {
        toast({
          title: 'Erro',
          description: 'Não foi possível obter o número do pedido.',
          variant: 'destructive',
        });
        navigate('/conta');
        return;
      }

      // ------------- fluxo de pagamento ------------- //
      const phoneForPayment =
        order.customer?.phone ||
        resolvedAddress.phone ||
        formData.phone;

      try {
        if (formData.paymentMethod === 'multicaixa-express') {
          const payRes = await startMulticaixaExpressPayment({
            orderNumber,
            amount: total,
            phone: phoneForPayment,
          });

          // payRes: { transaction_id, status }
          navigate(`/pedido/${orderNumber}`, {
            state: {
              paymentMethod: 'multicaixa-express',
              paymentData: payRes,
            },
          });
          return;
        }

        if (formData.paymentMethod === 'multicaixa-reference') {
          const refRes = await startMulticaixaReferencePayment({
            orderNumber,
            amount: total,
          });

          // refRes: { reference, entity, expiry_date }
          navigate(`/pedido/${orderNumber}`, {
            state: {
              paymentMethod: 'multicaixa-reference',
              paymentData: refRes,
            },
          });
          return;
        }

        // fallback (se por algum motivo não tiver método)
        navigate(`/pedido/${orderNumber}`);
      } catch (err) {
        console.error('[Checkout] Erro ao iniciar pagamento:', err);
        toast({
          title: 'Erro',
          description:
            'O pedido foi criado, mas ocorreu um erro ao iniciar o pagamento. Verifique na sua conta ou tente novamente.',
          variant: 'destructive',
        });
        navigate(`/pedido/${orderNumber}`);
      }
    } catch (error) {
      console.error('[Checkout] Erro ao criar pedido:', error);
      setIsProcessing(false);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao criar o pedido. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  // Se o carrinho estiver vazio → tela de carrinho vazio
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto mb-4 text-gray-400" />
          <h1 className="text-3xl font-bold mb-4">Carrinho Vazio</h1>
          <p className="text-gray-600 mb-8">
            Adicione produtos ao carrinho para continuar.
          </p>
          <Button
            onClick={() => navigate('/produtos')}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold px-8 py-6 rounded-full"
          >
            Explorar Produtos
          </Button>
        </div>
      </div>
    );
  }

  // UI principal
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-black mb-8">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Finalizar Compra
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Informações Pessoais */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Endereço de Entrega */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Endereço de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {addressesLoading ? (
                    <p className="text-sm text-gray-500">
                      A carregar endereços...
                    </p>
                  ) : addresses.length > 0 ? (
                    <>
                      <RadioGroup
                        value={
                          useNewAddress
                            ? 'new'
                            : selectedAddressId
                        }
                        onValueChange={(val) => {
                          if (val === 'new') {
                            setUseNewAddress(true);
                            setSelectedAddressId(null);
                          } else {
                            setUseNewAddress(false);
                            setSelectedAddressId(val);
                          }
                        }}
                      >
                        {addresses.map((addr) => {
                          const id = String(addr.id || addr._id);
                          const line1 =
                            addr.street ||
                            '';
                          const line2 =
                            addr.neighborhood ||
                            addr.bairro ||
                            '';
                          const city =
                            addr.municipality ||
                            addr.municipio ||
                            addr.province ||
                            addr.provincia ||
                            '';

                          return (
                            <div
                              key={id}
                              className="flex items-start space-x-2 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                            >
                              <RadioGroupItem value={id} id={`addr-${id}`} />
                              <Label
                                htmlFor={`addr-${id}`}
                                className="flex-1 cursor-pointer"
                              >
                                <p className="font-semibold text-sm">
                                  {addr.contact_name || formData.name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {line1}
                                  {line2 && `, ${line2}`}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {city}
                                </p>
                                {addr.phone && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Tel: {addr.phone}
                                  </p>
                                )}
                              </Label>
                            </div>
                          );
                        })}

                        <div className="flex items-start space-x-2 border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="new" id="addr-new" />
                          <Label
                            htmlFor="addr-new"
                            className="flex-1 cursor-pointer"
                          >
                            <p className="font-semibold text-sm">
                              Usar outro endereço
                            </p>
                            <p className="text-xs text-gray-600">
                              Preencher manualmente um novo endereço de
                              entrega.
                            </p>
                          </Label>
                        </div>
                      </RadioGroup>

                      {(useNewAddress || addresses.length === 0) && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <Label htmlFor="address">Endereço Completo *</Label>
                            <Input
                              id="address"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                              required
                              className="mt-1"
                              placeholder="Rua, número, bairro"
                            />
                          </div>
                          <div>
                            <Label htmlFor="city">Cidade *</Label>
                            <Input
                              id="city"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                              className="mt-1"
                            />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    // Sem endereços salvos: mostra formulário normal
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address">Endereço Completo *</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                          placeholder="Rua, número, bairro"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Cidade *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Método de Pagamento */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Método de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, paymentMethod: value }))
                    }
                  >
                    <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem
                        value="multicaixa-express"
                        id="multicaixa-express"
                      />
                      <Label
                        htmlFor="multicaixa-express"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">Multicaixa Express</p>
                            <p className="text-sm text-gray-600">
                              Pagamento instantâneo via telemóvel
                            </p>
                          </div>
                          <img
                            src="https://ncrangola.vtexassets.com/assets/vtex/assets-builder/ncrangola.ncr-theme/2.18.4/icons/multicaixa___5b49c0b5273522cd4700f5b1dacb9688.svg"
                            alt="Multicaixa"
                            className="h-8"
                          />
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem
                        value="multicaixa-reference"
                        id="multicaixa-reference"
                      />
                      <Label
                        htmlFor="multicaixa-reference"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">Multicaixa Referência</p>
                            <p className="text-sm text-gray-600">
                              Pagamento via ATM com referência
                            </p>
                          </div>
                          <img
                            src="https://ncrangola.vtexassets.com/assets/vtex/assets-builder/ncrangola.ncr-theme/2.18.4/icons/multicaixa___5b49c0b5273522cd4700f5b1dacb9688.svg"
                            alt="Multicaixa"
                            className="h-8"
                          />
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-6 rounded-full text-lg"
              >
                {isProcessing ? 'Processando...' : 'Confirmar Pedido'}
              </Button>
            </form>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cartItems.map((item) => {
                    const product = item.product || {};
                    const unitPrice = getItemUnitPrice(item);

                    return (
                      <div
                        key={`${item.productId}-${item.selectedColor || 'default'}`}
                        className="flex gap-3 pb-3 border-b"
                      >
                        <img
                          src={product.image || product.imageUrl || '/placeholder.png'}
                          alt={product.name || 'Produto'}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-sm line-clamp-2">
                            {product.name || 'Produto sem nome'}
                          </p>
                          {item.selectedColor && (
                            <p className="text-xs text-gray-500">
                              Cor: {item.selectedColor}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            Qtd: {item.quantity || 1}
                          </p>
                        </div>
                        <p className="font-bold text-purple-900">
                          {formatPrice(unitPrice * (item.quantity || 1))}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">
                      {formatPrice(
                        typeof totalPrice === 'number'
                          ? totalPrice
                          : calcFallbackTotal()
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Entrega:</span>
                    <span className="font-semibold text-green-600">
                      Grátis
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-purple-900">
                      {formatPrice(
                        typeof totalPrice === 'number'
                          ? totalPrice
                          : calcFallbackTotal()
                      )}
                    </span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                  ✓ Entrega grátis em Luanda
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
