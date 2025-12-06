// src/components/CartSidebar.jsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom"; // 👈 IMPORTANTE
import { X, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Button } from "./ui/button";

const CartSidebar = () => {
  const {
    items,
    totalQty,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    updateItemQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const navigate = useNavigate(); // 👈 vamos usar para ir ao /checkout

  // Garantir que nunca é undefined
  const safeItems = useMemo(
    () => (Array.isArray(items) ? items : []),
    [items]
  );

  const handleIncrease = (item) => {
    const nextQty = (item.quantity || 1) + 1;
    updateItemQuantity(item.productId, nextQty, item.selectedColor);
  };

  const handleDecrease = (item) => {
    const nextQty = (item.quantity || 1) - 1;
    if (nextQty <= 0) {
      removeFromCart(item.productId, item.selectedColor);
    } else {
      updateItemQuantity(item.productId, nextQty, item.selectedColor);
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
  };

  const handleClear = async () => {
    await clearCart();
  };

  const handleGoToCheckout = () => {
    if (safeItems.length === 0) return; // só por segurança

    // fecha o sidebar
    setIsCartOpen(false);
    // navega para a página de checkout
    navigate("/checkout");
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* SIDEBAR */}
      <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Meu carrinho
            </h2>
            <p className="text-xs text-gray-500">
              {safeItems.length === 0
                ? "Ainda não tens produtos no carrinho."
                : `${safeItems.length} item(s) – ${totalQty} unidade(s)`}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-1.5 hover:bg-gray-100 text-gray-500"
            aria-label="Fechar carrinho"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lista de itens */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {safeItems.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-500">
              O teu carrinho está vazio. Adiciona alguns produtos para começar.
            </div>
          )}

          {safeItems.map((item) => {
            const product = item.product || {};
            const price =
              product.promoPrice ||
              product.promo_price ||
              product.price ||
              0;

            return (
              <div
                key={`${item.productId}-${item.selectedColor || "default"}`}
                className="flex gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white flex items-center justify-center">
                  <img
                    src={product.image || product.imageUrl || "/placeholder.png"}
                    alt={product.name || "Produto"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between gap-1">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {product.name || "Produto sem nome"}
                      </p>
                      {item.selectedColor && (
                        <p className="text-xs text-gray-500">
                          Cor: {item.selectedColor}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        removeFromCart(item.productId, item.selectedColor)
                      }
                      className="text-gray-400 hover:text-red-500"
                      aria-label="Remover item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1">
                      <button
                        type="button"
                        onClick={() => handleDecrease(item)}
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="min-w-[2ch] text-center text-sm font-medium">
                        {item.quantity || 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleIncrease(item)}
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-purple-700">
                        {new Intl.NumberFormat("pt-AO", {
                          style: "currency",
                          currency: "AOA",
                        }).format(price * (item.quantity || 1))}
                      </p>
                      {price > 0 && (
                        <p className="text-[10px] text-gray-400">
                          {new Intl.NumberFormat("pt-AO", {
                            style: "currency",
                            currency: "AOA",
                          }).format(price)}{" "}
                          / unidade
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total</span>
            <span className="text-lg font-bold text-purple-800">
              {new Intl.NumberFormat("pt-AO", {
                style: "currency",
                currency: "AOA",
              }).format(totalPrice || 0)}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 text-xs"
              onClick={handleClear}
              disabled={safeItems.length === 0}
            >
              Limpar carrinho
            </Button>
            <Button
              type="button"
              className="flex-1 text-xs font-semibold bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
              disabled={safeItems.length === 0}
              onClick={handleGoToCheckout}  // 👈 AGORA VAI PARA O CHECKOUT
            >
              Finalizar compra
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CartSidebar;

