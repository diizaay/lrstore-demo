// src/context/CartContext.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import {
  getUserCart,
  addItemToCartDB,
  updateCartItemDB,
  removeCartItemDB,
  clearCartDB,
  getProductById,
} from "../services/api";

const CartContext = createContext(null);

/**
 * Estrutura interna do item no contexto:
 * {
 *   productId: string,
 *   quantity: number,
 *   selectedColor: string | null,
 *   product: {...produto do backend}
 * }
 */

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // controle do sidebar do carrinho
  const [isCartOpen, setIsCartOpen] = useState(false);

  // -------------------------------------------------------
  // Derivados
  // -------------------------------------------------------
  const totalQty = useMemo(
    () => items.reduce((sum, it) => sum + (it.quantity || 0), 0),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      items.reduce((sum, it) => {
        const price =
          it.product?.promoPrice ||
          it.product?.promo_price ||
          it.product?.price ||
          0;
        return sum + price * (it.quantity || 0);
      }, 0),
    [items]
  );

  const getCartItemsCount = useCallback(() => totalQty, [totalQty]);

  // -------------------------------------------------------
  // Hidratar carrinho a partir da API
  // -------------------------------------------------------
  const _hydrateCartFromApi = useCallback(async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      const cart = await getUserCart(userId);
      const apiItems = Array.isArray(cart?.items) ? cart.items : [];

      const uniqueProductIds = [
        ...new Set(apiItems.map((it) => it.product_id)),
      ].filter(Boolean);

      const productsMap = {};
      for (const pid of uniqueProductIds) {
        try {
          const prod = await getProductById(pid);
          if (prod) {
            productsMap[pid] = prod;
          }
        } catch (err) {
          console.error(
            "[CartContext] Erro ao carregar produto do carrinho:",
            pid,
            err
          );
        }
      }

      const hydrated = apiItems.map((it) => ({
        productId: it.product_id,
        quantity: it.quantity || 1,
        selectedColor: it.selected_color || null,
        product: productsMap[it.product_id] || null,
      }));

      setItems(hydrated);
    } catch (err) {
      console.error("[CartContext] Erro ao carregar carrinho:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // -------------------------------------------------------
  // Carregar carrinho quando o user faz login / troca
  // -------------------------------------------------------
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      _hydrateCartFromApi(user.id);
    } else {
      setItems([]);
    }
  }, [isAuthenticated, user?.id, _hydrateCartFromApi]);

  // -------------------------------------------------------
  // addToCart – usado no frontend: addToCart(product, qty, color)
  // -------------------------------------------------------
  const addToCart = useCallback(
    async (product, quantity = 1, selectedColor = null) => {
      if (!product) return;

      // não autenticado → só memória (podes conectar ao localStorage depois)
      if (!isAuthenticated || !user?.id) {
        setItems((prev) => {
          const idx = prev.findIndex(
            (it) =>
              it.productId === product.id &&
              (it.selectedColor || null) === (selectedColor || null)
          );
          if (idx === -1) {
            return [
              ...prev,
              {
                productId: product.id,
                quantity,
                selectedColor,
                product,
              },
            ];
          }
          const clone = [...prev];
          clone[idx] = {
            ...clone[idx],
            quantity: (clone[idx].quantity || 0) + quantity,
          };
          return clone;
        });
        setIsCartOpen(true);
        return;
      }

      setSyncing(true);
      try {
        const apiItem = {
          product_id: product.id,
          quantity,
          selected_color: selectedColor,
        };

        const cart = await addItemToCartDB(user.id, apiItem);
        const apiItems = Array.isArray(cart?.items) ? cart.items : [];

        const uniqueProductIds = [
          ...new Set(apiItems.map((it) => it.product_id)),
        ].filter(Boolean);

        const productsMap = {};
        for (const pid of uniqueProductIds) {
          if (pid === product.id) {
            productsMap[pid] = product;
          } else {
            try {
              const prod = await getProductById(pid);
              if (prod) {
                productsMap[pid] = prod;
              }
            } catch (err) {
              console.error(
                "[CartContext] Erro ao carregar produto após addToCart:",
                pid,
                err
              );
            }
          }
        }

        const hydrated = apiItems.map((it) => ({
          productId: it.product_id,
          quantity: it.quantity || 1,
          selectedColor: it.selected_color || null,
          product: productsMap[it.product_id] || null,
        }));

        setItems(hydrated);
        setIsCartOpen(true);
      } catch (err) {
        console.error("[CartContext] Erro em addToCart:", err);
      } finally {
        setSyncing(false);
      }
    },
    [isAuthenticated, user?.id]
  );

  // -------------------------------------------------------
  // updateItemQuantity
  // -------------------------------------------------------
  const updateItemQuantity = useCallback(
    async (productId, quantity, selectedColor = null) => {
      if (!productId || quantity <= 0) return;

      if (!isAuthenticated || !user?.id) {
        setItems((prev) =>
          prev.map((it) =>
            it.productId === productId &&
            (it.selectedColor || null) === (selectedColor || null)
              ? { ...it, quantity }
              : it
          )
        );
        return;
      }

      setSyncing(true);
      try {
        const cart = await updateCartItemDB(user.id, productId, {
          quantity,
          selected_color: selectedColor,
        });

        const apiItems = Array.isArray(cart?.items) ? cart.items : [];

        const uniqueProductIds = [
          ...new Set(apiItems.map((it) => it.product_id)),
        ].filter(Boolean);

        const productsMap = {};
        for (const pid of uniqueProductIds) {
          try {
            const prod = await getProductById(pid);
            if (prod) {
              productsMap[pid] = prod;
            }
          } catch (err) {
            console.error(
              "[CartContext] Erro ao carregar produto após updateItemQuantity:",
              pid,
              err
            );
          }
        }

        const hydrated = apiItems.map((it) => ({
          productId: it.product_id,
          quantity: it.quantity || 1,
          selectedColor: it.selected_color || null,
          product: productsMap[it.product_id] || null,
        }));

        setItems(hydrated);
      } catch (err) {
        console.error("[CartContext] Erro em updateItemQuantity:", err);
      } finally {
        setSyncing(false);
      }
    },
    [isAuthenticated, user?.id]
  );

  // -------------------------------------------------------
  // removeFromCart
  // -------------------------------------------------------
  const removeFromCart = useCallback(
    async (productId, selectedColor = null) => {
      if (!productId) return;

      if (!isAuthenticated || !user?.id) {
        setItems((prev) =>
          prev.filter(
            (it) =>
              !(
                it.productId === productId &&
                (it.selectedColor || null) === (selectedColor || null)
              )
          )
        );
        return;
      }

      setSyncing(true);
      try {
        const cart = await removeCartItemDB(user.id, productId, selectedColor);
        const apiItems = Array.isArray(cart?.items) ? cart.items : [];

        const uniqueProductIds = [
          ...new Set(apiItems.map((it) => it.product_id)),
        ].filter(Boolean);

        const productsMap = {};
        for (const pid of uniqueProductIds) {
          try {
            const prod = await getProductById(pid);
            if (prod) {
              productsMap[pid] = prod;
            }
          } catch (err) {
            console.error(
              "[CartContext] Erro ao carregar produto após removeFromCart:",
              pid,
              err
            );
          }
        }

        const hydrated = apiItems.map((it) => ({
          productId: it.product_id,
          quantity: it.quantity || 1,
          selectedColor: it.selected_color || null,
          product: productsMap[it.product_id] || null,
        }));

        setItems(hydrated);
      } catch (err) {
        console.error("[CartContext] Erro em removeFromCart:", err);
      } finally {
        setSyncing(false);
      }
    },
    [isAuthenticated, user?.id]
  );

  // -------------------------------------------------------
  // clearCart
  // -------------------------------------------------------
  const clearCart = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setItems([]);
      return;
    }

    setSyncing(true);
    try {
      await clearCartDB(user.id);
      setItems([]);
    } catch (err) {
      console.error("[CartContext] Erro em clearCart:", err);
    } finally {
      setSyncing(false);
    }
  }, [isAuthenticated, user?.id]);

  const value = {
    items,
    totalQty,
    totalPrice,
    loading,
    syncing,
    // controle do sidebar
    isCartOpen,
    setIsCartOpen,
    // API de carrinho
    addToCart,
    updateItemQuantity,
    removeFromCart,
    clearCart,
    getCartItemsCount,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart deve ser usado dentro de <CartProvider>");
  }
  return ctx;
};
