// src/pages/OrderConfirmation.js
import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getOrderByNumber, getPaymentStatusApi } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ok' | 'error'

  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [transactionId, setTransactionId] = useState(null);

  const navState = (location && location.state) || {};
  const paymentMethod = navState.paymentMethod || null;
  const paymentData = navState.paymentData || {};

  const formatPrice = (price) =>
    new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
    }).format(price || 0);

  // Carrega o pedido
  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getOrderByNumber(orderNumber);
        const ord = data.order || data;
        setOrder(ord);

        if (ord.payment_status) {
          setPaymentStatus(ord.payment_status);
        }

        if (paymentData.transaction_id) {
          setTransactionId(paymentData.transaction_id);
        }

        setStatus('ok');
      } catch (err) {
        console.error('[OrderConfirmation] Erro ao buscar pedido:', err);
        setStatus('error');
      }
    };

    if (orderNumber) {
      loadOrder();
    } else {
      setStatus('error');
    }
  }, [orderNumber, paymentData.transaction_id]); // deps normais, sem eslint-disable

  // Polling de status para Multicaixa Express enquanto estiver pending
  useEffect(() => {
    if (
      paymentMethod === 'multicaixa-express' &&
      transactionId &&
      paymentStatus !== 'paid' &&
      paymentStatus !== 'failed'
    ) {
      const interval = setInterval(async () => {
        try {
          const data = await getPaymentStatusApi(transactionId);
          if (data?.status) {
            setPaymentStatus(data.status);
          }
        } catch (err) {
          console.error('[OrderConfirmation] Erro ao obter status do pagamento', err);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [paymentMethod, transactionId, paymentStatus]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>A carregar detalhes do pedido...</p>
      </div>
    );
  }

  if (status === 'error' || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold mb-4">
          Não foi possível encontrar o seu pedido.
        </h1>
        <p className="mb-6 text-gray-600">
          Verifique o número do pedido ou volte para a loja.
        </p>
        <Button
          asChild
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
        >
          <Link to="/conta">Ver meus pedidos</Link>
        </Button>
      </div>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];

  const reference =
    paymentData.reference || order.payment_reference || null;
  const entity = paymentData.entity || '11111';
  const expiryDate = paymentData.expiry_date || null;

  const isPaid = paymentStatus === 'paid';

  const renderMainMessage = () => {
    if (paymentMethod === 'multicaixa-express' && !isPaid) {
      return (
        <p className="text-orange-700 font-semibold">
          O seu pedido foi criado e estamos à espera da confirmação do pagamento
          via Multicaixa Express. Confirme o pagamento na sua app.
        </p>
      );
    }

    if (paymentMethod === 'multicaixa-reference' && !isPaid) {
      return (
        <p className="text-orange-700 font-semibold">
          O seu pedido foi criado. Assim que efetuar o pagamento com a
          referência abaixo, o estado será atualizado para <strong>Pago</strong>.
        </p>
      );
    }

    return (
      <p className="text-green-700 font-semibold">
        Obrigado pela sua compra! Recebemos o seu pedido.
      </p>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Pedido #{order.order_number || orderNumber}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {renderMainMessage()}

            <div>
              <h2 className="font-semibold mb-2">Resumo do Pedido</h2>
              <ul className="space-y-2 text-sm">
                {items.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between border-b pb-1"
                  >
                    <span>
                      {item.name} (x{item.quantity})
                    </span>
                    <span>{formatPrice(item.price * (item.quantity || 1))}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total:</span>
              <span>{formatPrice(order.total)}</span>
            </div>

            {paymentMethod && (
              <div className="mt-4 border-t pt-4 space-y-2">
                <h2 className="font-semibold mb-1">Pagamento</h2>

                <p className="text-sm text-gray-600">
                  Método escolhido:{' '}
                  <span className="font-medium">
                    {paymentMethod === 'multicaixa-express'
                      ? 'Multicaixa Express'
                      : paymentMethod === 'multicaixa-reference'
                      ? 'Multicaixa Referência'
                      : paymentMethod}
                  </span>
                </p>

                <p className="text-sm">
                  Estado do pagamento:{' '}
                  <span
                    className={
                      paymentStatus === 'paid'
                        ? 'text-green-600 font-semibold'
                        : paymentStatus === 'failed'
                        ? 'text-red-600 font-semibold'
                        : 'text-orange-600 font-semibold'
                    }
                  >
                    {paymentStatus === 'paid'
                      ? 'Pago'
                      : paymentStatus === 'failed'
                      ? 'Falhou'
                      : 'Pendente'}
                  </span>
                </p>

                {paymentMethod === 'multicaixa-reference' && reference && (
                  <div className="mt-2 rounded-lg border bg-yellow-50 p-3 text-sm">
                    <p className="font-semibold mb-1">
                      Dados para pagamento via Multicaixa:
                    </p>
                    <p>
                      Entidade: <strong>{entity}</strong>
                    </p>
                    <p>
                      Referência: <strong>{reference}</strong>
                    </p>
                    <p>
                      Valor: <strong>{formatPrice(order.total)}</strong>
                    </p>
                    {expiryDate && (
                      <p className="text-xs text-gray-600 mt-1">
                        Validade: {new Date(expiryDate).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {paymentMethod === 'multicaixa-express' && (
                  <div className="mt-2 rounded-lg border bg-blue-50 p-3 text-sm">
                    <p className="font-semibold mb-1">
                      Pagar com Multicaixa Express
                    </p>
                    {isPaid ? (
                      <p className="text-sm text-green-700">
                        O pagamento via Multicaixa Express foi confirmado com sucesso.
                      </p>
                    ) : (
                      <p className="text-sm text-gray-700">
                        Foi iniciado um pagamento via Multicaixa Express para este
                        pedido. Abra a sua app Multicaixa e confirme o pagamento.
                      </p>
                    )}
                    {transactionId && (
                      <p className="text-xs text-gray-700 mt-1">
                        ID da transação: <strong>{transactionId}</strong>
                      </p>
                    )}
                    {!isPaid && (
                      <p className="text-xs text-gray-500 mt-2">
                        Assim que o pagamento for confirmado, o estado deste pedido
                        será atualizado para &quot;Pago&quot;.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="pt-4 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link to="/conta">Ver meus pedidos</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
              >
                <Link to="/produtos">Continuar a comprar</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderConfirmation;
