import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle2, Package, CreditCard, MapPin, Phone, Mail } from 'lucide-react';

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Retrieve order from localStorage
    const orderData = localStorage.getItem(`order_${orderNumber}`);
    if (orderData) {
      setOrder(JSON.parse(orderData));
    }
  }, [orderNumber]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(price);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Pedido não encontrado</h1>
          <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-pink-500 to-purple-500">
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-black mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
              Pedido Confirmado!
            </span>
          </h1>
          <p className="text-gray-600 text-lg">Obrigado pela sua compra</p>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Order Number */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Detalhes do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Número do Pedido</p>
                  <p className="text-xl font-bold text-purple-900">#{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data</p>
                  <p className="font-semibold">{new Date(order.date).toLocaleDateString('pt-AO')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                    Pendente
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl font-bold text-purple-900">{formatPrice(order.total)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Informações de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.customerInfo.paymentMethod === 'multicaixa-express' ? (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src="https://ncrangola.vtexassets.com/assets/vtex/assets-builder/ncrangola.ncr-theme/2.18.4/icons/multicaixa___5b49c0b5273522cd4700f5b1dacb9688.svg"
                      alt="Multicaixa"
                      className="h-8"
                    />
                    <div>
                      <p className="font-bold">Multicaixa Express</p>
                      <p className="text-sm text-gray-600">Pagamento instantâneo</p>
                    </div>
                  </div>
                  <div className="bg-white rounded p-3 text-sm">
                    <p className="font-semibold mb-2">Instruções:</p>
                    <ol className="list-decimal list-inside space-y-1 text-gray-700">
                      <li>Abra o aplicativo Multicaixa Express</li>
                      <li>Selecione "Pagamentos"</li>
                      <li>Insira o número do pedido: <strong>#{order.orderNumber}</strong></li>
                      <li>Confirme o pagamento de {formatPrice(order.total)}</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src="https://ncrangola.vtexassets.com/assets/vtex/assets-builder/ncrangola.ncr-theme/2.18.4/icons/multicaixa___5b49c0b5273522cd4700f5b1dacb9688.svg"
                      alt="Multicaixa"
                      className="h-8"
                    />
                    <div>
                      <p className="font-bold">Multicaixa Referência</p>
                      <p className="text-sm text-gray-600">Pagamento via ATM</p>
                    </div>
                  </div>
                  <div className="bg-white rounded p-3">
                    <p className="font-semibold mb-2">Referência de Pagamento:</p>
                    <p className="text-3xl font-black text-purple-900 mb-3">{order.orderNumber}</p>
                    <p className="text-sm text-gray-700 mb-2">Vá a qualquer ATM Multicaixa e:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                      <li>Selecione "Pagamentos"</li>
                      <li>Insira a referência: <strong>{order.orderNumber}</strong></li>
                      <li>Confirme o valor: {formatPrice(order.total)}</li>
                    </ol>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer & Delivery Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Informações de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">{order.customerInfo.name}</p>
                    <p className="text-sm text-gray-600">{order.customerInfo.address}</p>
                    <p className="text-sm text-gray-600">{order.customerInfo.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <p className="text-sm">{order.customerInfo.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <p className="text-sm">{order.customerInfo.email}</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                ✓ Entrega grátis em Luanda - Receberá em até 1 hora (dias úteis)
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      {item.selectedColor && (
                        <p className="text-sm text-gray-600">Cor: {item.selectedColor}</p>
                      )}
                      <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-purple-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button
            onClick={() => navigate('/produtos')}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-6 rounded-full"
          >
            Continuar Comprando
          </Button>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="flex-1 py-6 rounded-full font-bold"
          >
            Voltar ao Início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
