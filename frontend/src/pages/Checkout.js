import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { ShoppingBag, CreditCard, User, MapPin, Phone, Mail } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Luanda',
    paymentMethod: 'multicaixa-express'
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive'
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: 'Carrinho Vazio',
        description: 'Adicione produtos ao carrinho antes de finalizar.',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      const orderNumber = Math.floor(100000 + Math.random() * 900000);
      
      // Store order in localStorage (mock)
      const order = {
        orderNumber,
        items: cart,
        total: getCartTotal(),
        customerInfo: formData,
        date: new Date().toISOString(),
        status: 'pending'
      };
      
      localStorage.setItem(`order_${orderNumber}`, JSON.stringify(order));
      
      clearCart();
      setIsProcessing(false);
      
      toast({
        title: 'Pedido Realizado!',
        description: `Seu pedido #${orderNumber} foi criado com sucesso.`
      });
      
      navigate(`/pedido/${orderNumber}`);
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto mb-4 text-gray-400" />
          <h1 className="text-3xl font-bold mb-4">Carrinho Vazio</h1>
          <p className="text-gray-600 mb-8">Adicione produtos ao carrinho para continuar.</p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-black mb-8">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            Finalizar Compra
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
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

              {/* Delivery Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Endereço de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
              </Card>

              {/* Payment Method */}
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
                    onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                  >
                    <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="multicaixa-express" id="multicaixa-express" />
                      <Label htmlFor="multicaixa-express" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">Multicaixa Express</p>
                            <p className="text-sm text-gray-600">Pagamento instantâneo via telemóvel</p>
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
                      <RadioGroupItem value="multicaixa-reference" id="multicaixa-reference" />
                      <Label htmlFor="multicaixa-reference" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">Multicaixa Referência</p>
                            <p className="text-sm text-gray-600">Pagamento via ATM com referência</p>
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

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedColor}`} className="flex gap-3 pb-3 border-b">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm line-clamp-2">{item.name}</p>
                        {item.selectedColor && (
                          <p className="text-xs text-gray-500">Cor: {item.selectedColor}</p>
                        )}
                        <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-purple-900">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold">{formatPrice(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Entrega:</span>
                    <span className="font-semibold text-green-600">Grátis</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-purple-900">{formatPrice(getCartTotal())}</span>
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
