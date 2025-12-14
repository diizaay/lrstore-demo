// src/context/WishlistContext.jsx
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
  getUserFavorites,
  addFavorite,
  removeFavorite,
  getProductById,
} from "../services/api";


const STORAGE_KEY = "lrstore_wishlist";
const WishlistContext = createContext(null);

/**
 * Estrutura interna:
 * wishlist = [ product, product, ... ]
 * onde product vem do backend (id, name, price, images, etc.)
 */

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // -------------------------------------------------------
  // Helpers localStorage (para quando não estiver logado)
  // -------------------------------------------------------
  const loadFromStorage = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch (err) {
      console.error("[WishlistContext] Erro ao ler storage:", err);
      return [];
    }
  }, []);

  const saveToStorage = useCallback((items) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items || []));
    } catch (err) {
      console.error("[WishlistContext] Erro ao gravar storage:", err);
    }
  }, []);

  // -------------------------------------------------------
  // Carregar favoritos (local ou da API) ao iniciar
  // -------------------------------------------------------
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // Se não estiver logado, só usa localStorage
        if (!isAuthenticated || !user?.id) {
          const localItems = loadFromStorage();
          setWishlist(localItems);
          return;
        }

        // Se estiver logado:
        // 1) carregar favoritos do backend
        // 2) buscar detalhes dos produtos
        const favs = await getUserFavorites(user.id);
        const productIds = [
          ...new Set(favs.map((f) => f.product_id)),
        ].filter(Boolean);

        const products = [];
        for (const pid of productIds) {
          try {
            const prod = await getProductById(pid);
            if (prod) products.push(prod);
          } catch (err) {
            console.error(
              "[WishlistContext] Erro ao carregar produto favorito:",
              pid,
              err
            );
          }
        }

        setWishlist(products);
        // opcionalmente, sincronizar favoritos locais com a conta
        const localItems = loadFromStorage();
        const localsToSync = localItems.filter(
          (lp) => !productIds.includes(lp.id)
        );
        if (localsToSync.length > 0) {
          setSyncing(true);
          try {
            for (const prod of localsToSync) {
              try {
                await addFavorite(user.id, prod.id);
              } catch (e) {
                console.warn(
                  "[WishlistContext] Erro ao sincronizar favorito local:",
                  prod.id,
                  e
                );
              }
            }
          } finally {
            setSyncing(false);
          }
        }
        // atualiza o storage local para refletir backend
        saveToStorage(products);
      } catch (err) {
        console.error("[WishlistContext] Erro ao inicializar wishlist:", err);
        if (!isAuthenticated) {
          setWishlist(loadFromStorage());
        }
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [isAuthenticated, user?.id, loadFromStorage, saveToStorage]);

  // -------------------------------------------------------
  // isInWishlist
  // -------------------------------------------------------
  const isInWishlist = useCallback(
    (productId) => {
      if (!productId) return false;
      return wishlist.some((p) => p.id === productId);
    },
    [wishlist]
  );

  // -------------------------------------------------------
  // addToWishlist(product)
  // -------------------------------------------------------
  const addToWishlist = useCallback(
    async (product) => {
      if (!product || !product.id) return;

      // já está?
      if (wishlist.some((p) => p.id === product.id)) {
        return;
      }

      // Se não logado → só localStorage
      if (!isAuthenticated || !user?.id) {
        const next = [...wishlist, product];
        setWishlist(next);
        saveToStorage(next);
        return;
      }

      setSyncing(true);
      try {
        await addFavorite(user.id, product.id);
        const next = [...wishlist, product];
        setWishlist(next);
        saveToStorage(next);
      } catch (err) {
        console.error("[WishlistContext] Erro em addToWishlist:", err);
      } finally {
        setSyncing(false);
      }
    },
    [wishlist, isAuthenticated, user?.id, saveToStorage]
  );

  // -------------------------------------------------------
  // removeFromWishlist(productId)
  // -------------------------------------------------------
  const removeFromWishlist = useCallback(
    async (productId) => {
      if (!productId) return;

      const filtered = wishlist.filter((p) => p.id !== productId);

      // se não logado → só local
      if (!isAuthenticated || !user?.id) {
        setWishlist(filtered);
        saveToStorage(filtered);
        return;
      }

      setSyncing(true);
      try {
        await removeFavorite(user.id, productId);
        setWishlist(filtered);
        saveToStorage(filtered);
      } catch (err) {
        console.error("[WishlistContext] Erro em removeFromWishlist:", err);
      } finally {
        setSyncing(false);
      }
    },
    [wishlist, isAuthenticated, user?.id, saveToStorage]
  );

  // -------------------------------------------------------
  // toggleWishlist(product) – usado nos botões de coração
  // -------------------------------------------------------
  const toggleWishlist = useCallback(
    async (product) => {
      if (!product || !product.id) return;
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product);
      }
    },
    [isInWishlist, addToWishlist, removeFromWishlist]
  );

  const value = useMemo(
    () => ({
      wishlist,
      loading,
      syncing,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
    }),
    [
      wishlist,
      loading,
      syncing,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist deve ser usado dentro de <WishlistProvider>");
  }
  return ctx;
};
