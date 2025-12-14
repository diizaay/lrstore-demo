// src/services/api.js
import axios from "axios";

/**
 * BACKEND_URL:
 * 1. Usa REACT_APP_BACKEND_URL (ex.: http://127.0.0.1:8000)
 * 2. Se não tiver, usa http(s)://hostname:8000
 */
const FALLBACK_BACKEND_URL = (() => {
  const defaultHost =
    typeof window !== "undefined" ? window.location.hostname : "localhost";
  const defaultProtocol =
    typeof window !== "undefined" ? window.location.protocol : "http:";
  return `${defaultProtocol}//${defaultHost}:8000`;
})();

const sanitizedEnvUrl = process.env.REACT_APP_BACKEND_URL
  ? process.env.REACT_APP_BACKEND_URL.replace(/\/+$/, "")
  : "";

if (!sanitizedEnvUrl) {
  console.warn(
    "[api] REACT_APP_BACKEND_URL não definido. Usando fallback:",
    FALLBACK_BACKEND_URL
  );
}

export const BACKEND_URL = sanitizedEnvUrl || FALLBACK_BACKEND_URL;

// Instância Axios apontando para /api
export const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
});

// --------------------------- helpers internos ------------------------- //

const logApiError = (label, error) => {
  if (error?.response) {
    console.error(
      `[API] ${label} – status`,
      error.response.status,
      "data:",
      error.response.data
    );
  } else if (error?.request) {
    console.error(`[API] ${label} – sem resposta do servidor`, error.request);
  } else {
    console.error(`[API] ${label} – erro`, error?.message);
  }
};

const requestWithFallback = async (method, urls, payload) => {
  let lastError = null;

  for (const url of urls) {
    try {
      switch (method) {
        case "get":
          return await api.get(url, { params: payload });
        case "post":
          return await api.post(url, payload);
        case "put":
          return await api.put(url, payload);
        case "delete":
          return await api.delete(url, { params: payload });
        default:
          throw new Error(
            `Método ${method} não suportado no helper de fallback.`
          );
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        lastError = err;
        continue;
      }
      throw err;
    }
  }

  if (lastError) throw lastError;
  throw new Error("Não foi possível completar a requisição em nenhuma URL.");
};

// Lê user/token guardado pelo AuthContext
const getStoredAuth = () => {
  try {
    const raw = localStorage.getItem("lrstore_auth");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const withAdminHeaders = (config = {}) => {
  const auth = getStoredAuth();
  const adminHeaders = auth?.user?.id
    ? {
        "X-User-Id": auth.user.id,
        "X-Is-Admin": auth.user.is_admin ? "true" : "false",
      }
    : {};

  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      ...adminHeaders,
    },
  };
};

// ------------------------------ CATEGORIAS -------------------------------- //

export const getCategories = async () => {
  try {
    const res = await api.get("/categories");
    return res.data?.categories || [];
  } catch (err) {
    logApiError("getCategories", err);
    throw err;
  }
};

export const getCategoryBySlug = async (slug) => {
  try {
    const res = await api.get(`/categories/${slug}`);
    return res.data;
  } catch (err) {
    logApiError("getCategoryBySlug", err);
    throw err;
  }
};

// -------------------------------- PRODUTOS -------------------------------- //

export const getProducts = async (params = {}) => {
  try {
    const res = await api.get("/products", { params });
    return res.data?.products || [];
  } catch (err) {
    logApiError("getProducts", err);
    throw err;
  }
};

export const getProductById = async (id) => {
  try {
    const res = await api.get(`/products/${id}`);
    return res.data?.product || null;
  } catch (err) {
    logApiError("getProductById", err);
    throw err;
  }
};

// -------------------------------- PEDIDOS --------------------------------- //

export const createOrder = async (orderData) => {
  try {
    const auth = getStoredAuth();
    const payload = {
      ...orderData,
      user_id: orderData.user_id || auth?.user?.id || undefined,
    };
    const res = await api.post("/orders", payload);
    return res.data;
  } catch (err) {
    logApiError("createOrder", err);
    throw err;
  }
};

export const getOrderByNumber = async (orderNumber) => {
  try {
    const res = await api.get(`/orders/${orderNumber}`);
    return res.data;
  } catch (err) {
    logApiError("getOrderByNumber", err);
    throw err;
  }
};

export const getMyOrders = async (options = {}) => {
  try {
    const auth = getStoredAuth();
    const params = {
      user_id: options.user_id || auth?.user?.id,
      email: options.email || auth?.user?.email,
    };
    const sanitizedParams = Object.fromEntries(
      Object.entries(params).filter(([, value]) => !!value)
    );
    const res = await api.get("/orders/my", { params: sanitizedParams });
    return Array.isArray(res.data) ? res.data : res.data?.orders || [];
  } catch (err) {
    logApiError("getMyOrders", err);
    throw err;
  }
};

// -------------------------------- SUPORTE -------------------------------- //

export const sendSupportMessage = async (payload) => {
  try {
    const auth = getStoredAuth();
    const data = {
      ...payload,
      user_id: payload.user_id || auth?.user?.id,
    };
    const res = await api.post("/support-messages", data);
    return res.data;
  } catch (err) {
    logApiError("sendSupportMessage", err);
    throw err;
  }
};

// ----------------------------- PAGAMENTOS -------------------------------- //

// ----------------------- PAGAMENTOS (MOCK) ----------------------- //

export const startMulticaixaExpressPayment = async ({
  orderNumber,
  amount,
  phone,
}) => {
  const payload = {
    order_number: String(orderNumber),
    amount: Number(amount),
    phone: String(phone),
  };

  console.log('[API] startMulticaixaExpressPayment payload', payload);

  const res = await api.post('/payments/multicaixa/express', payload);
  return res.data; // { transaction_id, status }
};

export const startMulticaixaReferencePayment = async ({
  orderNumber,
  amount,
}) => {
  const payload = {
    order_number: String(orderNumber),
    amount: Number(amount),
  };

  console.log('[API] startMulticaixaReferencePayment payload', payload);

  const res = await api.post('/payments/multicaixa/reference', payload);
  return res.data; // { reference, entity, expiry_date }
};

export const getPaymentStatusApi = async (transactionId) => {
  const res = await api.get(`/payments/status/${transactionId}`);
  return res.data; // { transaction_id, status, order_number }
};


// ------------------------------- AUTENTICAÇÃO ------------------------------ //

export const registerUser = async (data) => {
  const payload = {
    name: data.name?.trim(),
    email: data.email?.trim(),
    phone: data.phone?.trim(),
    password: data.password,
  };

  const tryCall = async (url) => {
    try {
      const res = await api.post(url, payload);
      return res.data ?? { ok: true };
    } catch (err) {
      const status = err.response?.status;
      if (status && status >= 200 && status < 300) {
        return err.response?.data ?? { ok: true };
      }
      throw err;
    }
  };

  try {
    return await tryCall("/auth/register");
  } catch (err) {
    if (err.response?.status === 404) {
      return await tryCall("/register");
    }
    logApiError("registerUser", err);
    throw err;
  }
};

export const loginUser = async (data) => {
  const payload = {
    email: data.email?.trim(),
    password: data.password,
  };

  const tryCall = async (url) => {
    try {
      const res = await api.post(url, payload);
      return res.data ?? { ok: true };
    } catch (err) {
      const status = err.response?.status;
      if (status && status >= 200 && status < 300) {
        return err.response?.data ?? { ok: true };
      }
      throw err;
    }
  };

  try {
    return await tryCall("/auth/login");
  } catch (err) {
    if (err.response?.status === 404) {
      return await tryCall("/login");
    }
    logApiError("loginUser", err);
    throw err;
  }
};

// -------------------------------- PERFIL ---------------------------------- //

/**
 * getCurrentUser:
 * como não temos /me no backend, usa o user guardado no localStorage.
 */
export const getCurrentUser = async () => {
  const auth = getStoredAuth();
  return auth?.user || null;
};

/**
 * updateProfile:
 * backend: PATCH /users/{user_id}
 * espera: { name?: string, phone?: string }
 */
export const updateProfile = async (userId, profileData) => {
  if (!userId) {
    const auth = getStoredAuth();
    userId = auth?.user?.id;
  }
  if (!userId) {
    throw new Error("Utilizador não encontrado para atualizar perfil.");
  }

  const payload = {
    name: profileData.name?.trim(),
    phone: profileData.phone?.trim(),
  };

  try {
    const res = await api.patch(`/users/${userId}`, payload);
    return res.data;
  } catch (err) {
    logApiError("updateProfile", err);
    throw err;
  }
};

// -------------------------------- ENDEREÇOS -------------------------------- //

const buildAddressPayload = (data) => {
  const auth = getStoredAuth();
  const userId = auth?.user?.id;
  if (!userId) {
    throw new Error("Utilizador não autenticado para gerir endereços.");
  }

  return {
    user_id: userId,
    contact_name: data.contactName?.trim(),
    phone: data.phone?.trim(),
    province: data.province?.trim(),
    municipality: data.municipio?.trim(),
    neighborhood: data.bairro?.trim(),
    street: data.street?.trim(),
  };
};

export const getUserAddresses = async () => {
  try {
    const auth = getStoredAuth();
    const userId = auth?.user?.id;
    if (!userId) return [];

    const res = await api.get("/users/me/addresses", {
      params: { user_id: userId },
    });

    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.addresses)) return res.data.addresses;
    return [];
  } catch (err) {
    logApiError("getUserAddresses", err);
    throw err;
  }
};

export const createUserAddress = async (data) => {
  const payload = buildAddressPayload(data);

  try {
    const res = await api.post("/users/me/addresses", payload);
    return res.data;
  } catch (err) {
    logApiError("createUserAddress", err);
    throw err;
  }
};

export const updateUserAddress = async (addressId, data) => {
  const payload = buildAddressPayload(data);

  try {
    const res = await api.put(`/users/me/addresses/${addressId}`, payload);
    return res.data;
  } catch (err) {
    logApiError("updateUserAddress", err);
    throw err;
  }
};

export const deleteUserAddress = async (addressId) => {
  try {
    const auth = getStoredAuth();
    const userId = auth?.user?.id;
    await api.delete(`/users/me/addresses/${addressId}`, {
      params: userId ? { user_id: userId } : {},
    });
    return true;
  } catch (err) {
    logApiError("deleteUserAddress", err);
    throw err;
  }
};

// --------------------------- ALTERAÇÃO DE SENHA ---------------------------- //

/**
 * backend: POST /auth/change-password
 * body: { email, current_password, new_password }
 */
export const changeUserPassword = async (data) => {
  const auth = getStoredAuth();
  const email = data.email || auth?.user?.email;
  if (!email) {
    throw new Error("Email do utilizador não encontrado para alterar senha.");
  }

  const payload = {
    email,
    current_password: data.current_password,
    new_password: data.new_password,
  };

  try {
    const res = await api.post("/auth/change-password", payload);
    return res.data;
  } catch (err) {
    logApiError("changeUserPassword", err);
    throw err;
  }
};

// ----------------------------- CARRINHO (DB) ------------------------------- //

/**
 * Carrinho persistente por utilizador
 * rotas backend:
 *  GET    /users/{user_id}/cart
 *  POST   /users/{user_id}/cart/items
 *  PUT    /users/{user_id}/cart/items/{product_id}
 *  DELETE /users/{user_id}/cart/items/{product_id}
 *  DELETE /users/{user_id}/cart
 */

// -------------------------------------------------------------------
// 🛒 CARRINHO (persistência na DB, compatível com server.py)
// -------------------------------------------------------------------

// ----------------------------
// 🛒 CART (DB)
// ----------------------------
export const getUserCart = async (userId) => {
  try {
    const res = await api.get(`/users/${userId}/cart`);
    // backend -> Cart direto: { id, user_id, items, updated_at }
    return res.data;
  } catch (err) {
    console.error("[API] getUserCart", err);
    throw err;
  }
};

export const addItemToCartDB = async (userId, item) => {
  // item: { product_id, quantity, selected_color }
  try {
    const res = await api.post(`/users/${userId}/cart/items`, item);
    // backend responde com Cart
    return res.data;
  } catch (err) {
    console.error("[API] addItemToCartDB", err);
    throw err;
  }
};

export const updateCartItemDB = async (userId, productId, payload) => {
  // payload: { quantity, selected_color }
  try {
    const params = {};
    if (typeof payload.quantity === "number") {
      params.quantity = payload.quantity;
    }
    if (payload.selected_color !== undefined && payload.selected_color !== null) {
      params.selected_color = payload.selected_color;
    }

    const res = await api.put(
      `/users/${userId}/cart/items/${productId}`,
      null,
      { params }
    );
    return res.data; // Cart
  } catch (err) {
    console.error("[API] updateCartItemDB", err);
    throw err;
  }
};

export const removeCartItemDB = async (userId, productId, selectedColor = null) => {
  try {
    const params = {};
    if (selectedColor !== null && selectedColor !== undefined) {
      params.selected_color = selectedColor;
    }

    const res = await api.delete(
      `/users/${userId}/cart/items/${productId}`,
      { params }
    );
    return res.data; // Cart
  } catch (err) {
    console.error("[API] removeCartItemDB", err);
    throw err;
  }
};

export const clearCartDB = async (userId) => {
  try {
    await api.delete(`/users/${userId}/cart`);
    return true;
  } catch (err) {
    console.error("[API] clearCartDB", err);
    throw err;
  }
};



// ----------------------------- FAVORITOS (DB) ------------------------------ //

/**
 * rotas backend:
 *  GET    /users/{user_id}/favorites
 *  POST   /users/{user_id}/favorites?product_id=XYZ
 *  DELETE /users/{user_id}/favorites/{product_id}
 */



/* =================== FAVORITOS NA DB (backend) =================== */

// Buscar favoritos de um utilizador
export const getUserFavorites = async (userId) => {
  const res = await api.get(`/users/${userId}/favorites`);
  // backend devolve lista de docs { id, user_id, product_id, created_at }
  return Array.isArray(res.data) ? res.data : [];
};

// Adicionar favorito na DB
export const addFavoriteDB = async (userId, productId) => {
  const res = await api.post(
    `/users/${userId}/favorites`,
    null,
    {
      params: { product_id: productId }, // 👈 AQUI TEM MESMO DE SER productId
    }
  );
  return res.data;
};

// Remover favorito na DB
export const removeFavoriteDB = async (userId, productId) => {
  const res = await api.delete(`/users/${userId}/favorites/${productId}`);
  return res.data;
};


// ------------------------------ ADMIN API ----------------------------- //

export const getAdminDashboardSummary = async () => {
  try {
    const res = await api.get(
      "/admin/dashboard/summary",
      withAdminHeaders()
    );
    return res.data;
  } catch (err) {
    logApiError("getAdminDashboardSummary", err);
    throw err;
  }
};

export const getAdminProducts = async (params = {}) => {
  try {
    const res = await api.get(
      "/admin/products",
      withAdminHeaders({ params })
    );
    return res.data;
  } catch (err) {
    logApiError("getAdminProducts", err);
    throw err;
  }
};

export const createAdminProduct = async (payload) => {
  try {
    const res = await api.post(
      "/admin/products",
      payload,
      withAdminHeaders()
    );
    return res.data;
  } catch (err) {
    logApiError("createAdminProduct", err);
    throw err;
  }
};

export const updateAdminProduct = async (productId, payload) => {
  try {
    const res = await api.put(
      `/admin/products/${productId}`,
      payload,
      withAdminHeaders()
    );
    return res.data;
  } catch (err) {
    logApiError("updateAdminProduct", err);
    throw err;
  }
};

export const deleteAdminProduct = async (productId) => {
  try {
    const res = await api.delete(
      `/admin/products/${productId}`,
      withAdminHeaders()
    );
    return res.data;
  } catch (err) {
    logApiError("deleteAdminProduct", err);
    throw err;
  }
};

export const getAdminCategories = async () => {
  try {
    const res = await api.get(
      "/admin/categories",
      withAdminHeaders()
    );
    return res.data?.categories || [];
  } catch (err) {
    logApiError("getAdminCategories", err);
    throw err;
  }
};

export const createAdminCategory = async (payload) => {
  try {
    const res = await api.post(
      "/admin/categories",
      payload,
      withAdminHeaders()
    );
    return res.data;
  } catch (err) {
    logApiError("createAdminCategory", err);
    throw err;
  }
};

export const updateAdminCategory = async (categoryId, payload) => {
  try {
    const res = await api.put(
      `/admin/categories/${categoryId}`,
      payload,
      withAdminHeaders()
    );
    return res.data;
  } catch (err) {
    logApiError("updateAdminCategory", err);
    throw err;
  }
};

export const deleteAdminCategory = async (categoryId) => {
  try {
    const res = await api.delete(
      `/admin/categories/${categoryId}`,
      withAdminHeaders()
    );
    return res.data;
  } catch (err) {
    logApiError("deleteAdminCategory", err);
    throw err;
  }
};

export const getAdminOrders = async (params = {}) => {
  try {
    const res = await api.get(
      "/admin/orders",
      withAdminHeaders({ params })
    );
    return res.data;
  } catch (err) {
    logApiError("getAdminOrders", err);
    throw err;
  }
};

export const getAdminOrder = async (orderNumber) => {
  try {
    const res = await api.get(
      `/admin/orders/${orderNumber}`,
      withAdminHeaders()
    );
    return res.data;
  } catch (err) {
    logApiError("getAdminOrder", err);
    throw err;
  }
};

export const updateAdminOrderStatus = async (orderNumber, payload) => {
  try {
    const res = await api.patch(
      `/admin/orders/${orderNumber}`,
      payload,
      withAdminHeaders()
    );
    return res.data;
  } catch (err) {
    logApiError("updateAdminOrderStatus", err);
    throw err;
  }
};

export const getAdminUsers = async (params = {}) => {
  try {
    const res = await api.get(
      "/admin/users",
      withAdminHeaders({ params })
    );
    return res.data;
  } catch (err) {
    logApiError("getAdminUsers", err);
    throw err;
  }
};

export const getAdminUser = async (userId) => {
  try {
    const res = await api.get(
      `/admin/users/${userId}`,
      withAdminHeaders()
    );
    return res.data;
  } catch (err) {
    logApiError("getAdminUser", err);
    throw err;
  }
};

export const updateAdminUser = async (userId, payload) => {
  try {
    const res = await api.patch(
      `/admin/users/${userId}`,
      payload,
      withAdminHeaders()
    );
    return res.data;
  } catch (err) {
    logApiError("updateAdminUser", err);
    throw err;
  }
};

export const getAdminSupportMessages = async (params = {}) => {
  try {
    const res = await api.get(
      "/admin/support-messages",
      withAdminHeaders({ params })
    );
    return res.data;
  } catch (err) {
    logApiError("getAdminSupportMessages", err);
    throw err;
  }
};

export const updateAdminSupportMessage = async (messageId, payload) => {
  try {
    const res = await api.patch(
      `/admin/support-messages/${messageId}`,
      payload,
      withAdminHeaders()
    );
    return res.data;
  } catch (err) {
    logApiError("updateAdminSupportMessage", err);
    throw err;
  }
};

export const uploadAdminAsset = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const config = withAdminHeaders();
    const res = await api.post("/admin/uploads", formData, config);
    return res.data;
  } catch (err) {
    logApiError("uploadAdminAsset", err);
    throw err;
  }
};



// ---------------------------------------------------------------------
// ALIASES PARA COMPATIBILIDADE COM OS CONTEXTOS ANTIGOS
// (CartContext e WishlistContext ainda usam estes nomes)
// ---------------------------------------------------------------------

// ======================================================
// 🔄 ALIASES PARA CONTEXTOS (CartContext / WishlistContext)
// ======================================================

// Carrinho – wrappers amigáveis que o CartContext já espera
// Carrinho
export const addCartItem = addItemToCartDB;
export const updateCartItem = updateCartItemDB;
export const removeCartItem = removeCartItemDB;
export const clearCart = clearCartDB;

// Favoritos
export const addFavorite = addFavoriteDB;
export const removeFavorite = removeFavoriteDB;
