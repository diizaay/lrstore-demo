import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const CartSidebar = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(price);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            <h2 className="text-xl font-bold">Carrinho</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCartOpen(false)}
            className="text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingBag className="w-24 h-24 mb-4" />
              <p className="text-lg font-semibold">Carrinho vazio</p>
              <p className="text-sm">Adicione produtos para continuar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedColor}`}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2">{item.name}</h3>
                      {item.selectedColor && (
                        <p className="text-xs text-gray-500 mb-2">Cor: {item.selectedColor}</p>
                      )}
                      <p className="font-bold text-purple-900">{formatPrice(item.price)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id, item.selectedColor)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => updateQuantity(item.id, item.selectedColor, item.quantity - 1)}
                        className="h-8 w-8 rounded-full hover:bg-purple-200"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => updateQuantity(item.id, item.selectedColor, item.quantity + 1)}
                        className="h-8 w-8 rounded-full hover:bg-purple-200"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="font-bold text-purple-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-purple-900">
                {formatPrice(getCartTotal())}
              </span>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-6 rounded-full text-lg"
            >
              Finalizar Compra
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
