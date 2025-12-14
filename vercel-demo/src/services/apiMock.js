// src/services/apiMock.js
// Adaptador de API que usa dados mockados para demonstração no Vercel

import { categories, products, mockUser, mockAddresses, mockOrders } from '../data/mockData';

// Flag para ativar/desativar modo mock
export const USE_MOCK_DATA = true;

// Simula delay de rede para parecer mais realista
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Helper para simular resposta de sucesso
const mockResponse = async (data) => {
  await delay();
  return data;
};

// Helper para simular erro
const mockError = async (message, status = 404) => {
  await delay();
  throw { response: { status, data: { detail: message } } };
};

// ====================== CATEGORIAS ======================

export const getCategories = async () => {
  return mockResponse(categories);
};

export const getCategoryBySlug = async (slug) => {
  const category = categories.find(c => c.slug === slug);
  if (!category) {
    return mockError('Categoria não encontrada');
  }
  return mockResponse(category);
};

// ====================== PRODUTOS ======================

export const getProducts = async (params = {}) => {
  let filtered = [...products];

  // Filtrar por categoria
  if (params.category) {
    filtered = filtered.filter(p => p.category === params.category);
  }

  // Filtrar por featured
  if (params.featured !== undefined) {
    filtered = filtered.filter(p => p.featured === params.featured);
  }

  // Filtrar por is_new
  if (params.is_new !== undefined) {
    filtered = filtered.filter(p => p.is_new === params.is_new);
  }

  // Filtrar por is_promo
  if (params.is_promo !== undefined) {
    filtered = filtered.filter(p => p.is_promo === params.is_promo);
  }

  // Busca por texto
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }

  return mockResponse(filtered);
};

export const getProductById = async (id) => {
  const product = products.find(p => p.id === id);
  if (!product) {
    return mockError('Produto não encontrado');
  }
  return mockResponse(product);
};

// ====================== AUTENTICAÇÃO ======================

// Dados de usuário demo salvos no localStorage
const DEMO_AUTH_KEY = 'lrstore_demo_auth';

export const registerUser = async (data) => {
  await delay(500);

  const user = {
    id: `user-${Date.now()}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    is_admin: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const authData = {
    user,
    access_token: 'demo-token-' + Date.now(),
    token_type: 'bearer'
  };

  localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(authData));
  return authData;
};

export const loginUser = async (data) => {
  await delay(500);

  // Para demo, aceita qualquer credencial
  const user = {
    ...mockUser,
    email: data.email
  };

  const authData = {
    user,
    access_token: 'demo-token-' + Date.now(),
    token_type: 'bearer'
  };

  localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(authData));
  return authData;
};

export const getCurrentUser = async () => {
  const auth = JSON.parse(localStorage.getItem(DEMO_AUTH_KEY) || '{}');
  return mockResponse(auth.user || null);
};

export const updateProfile = async (userId, profileData) => {
  const auth = JSON.parse(localStorage.getItem(DEMO_AUTH_KEY) || '{}');
  const updatedUser = {
    ...auth.user,
    ...profileData,
    updated_at: new Date().toISOString()
  };

  const authData = {
    ...auth,
    user: updatedUser
  };

  localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(authData));
  return mockResponse(updatedUser);
};

export const changeUserPassword = async (data) => {
  await delay(500);
  return mockResponse({ detail: 'Senha atualizada com sucesso (demo).' });
};

// ====================== ENDEREÇOS ======================

const DEMO_ADDRESSES_KEY = 'lrstore_demo_addresses';

const getStoredAddresses = () => {
  const stored = localStorage.getItem(DEMO_ADDRESSES_KEY);
  return stored ? JSON.parse(stored) : [...mockAddresses];
};

const saveAddresses = (addresses) => {
  localStorage.setItem(DEMO_ADDRESSES_KEY, JSON.stringify(addresses));
};

export const getUserAddresses = async () => {
  return mockResponse(getStoredAddresses());
};

export const createUserAddress = async (data) => {
  const addresses = getStoredAddresses();
  const newAddress = {
    id: `addr-${Date.now()}`,
    user_id: mockUser.id,
    contact_name: data.contactName,
    phone: data.phone,
    province: data.province,
    municipality: data.municipio,
    neighborhood: data.bairro,
    street: data.street,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  addresses.push(newAddress);
  saveAddresses(addresses);
  return mockResponse(newAddress);
};

export const updateUserAddress = async (addressId, data) => {
  const addresses = getStoredAddresses();
  const index = addresses.findIndex(a => a.id === addressId);

  if (index === -1) {
    return mockError('Endereço não encontrado');
  }

  addresses[index] = {
    ...addresses[index],
    contact_name: data.contactName,
    phone: data.phone,
    province: data.province,
    municipality: data.municipio,
    neighborhood: data.bairro,
    street: data.street,
    updated_at: new Date().toISOString()
  };

  saveAddresses(addresses);
  return mockResponse(addresses[index]);
};

export const deleteUserAddress = async (addressId) => {
  const addresses = getStoredAddresses();
  const filtered = addresses.filter(a => a.id !== addressId);

  if (filtered.length === addresses.length) {
    return mockError('Endereço não encontrado');
  }

  saveAddresses(filtered);
  return mockResponse(true);
};

// ====================== CARRINHO ======================

const DEMO_CART_KEY = 'lrstore_demo_cart';

const getStoredCart = () => {
  const stored = localStorage.getItem(DEMO_CART_KEY);
  return stored ? JSON.parse(stored) : { id: 'cart-demo', user_id: mockUser.id, items: [], updated_at: new Date().toISOString() };
};

const saveCart = (cart) => {
  localStorage.setItem(DEMO_CART_KEY, JSON.stringify(cart));
};

export const getUserCart = async (userId) => {
  return mockResponse(getStoredCart());
};

export const addItemToCartDB = async (userId, item) => {
  const cart = getStoredCart();

  // Verificar se item já existe
  const existingIndex = cart.items.findIndex(
    i => i.product_id === item.product_id && i.selected_color === item.selected_color
  );

  if (existingIndex >= 0) {
    cart.items[existingIndex].quantity += item.quantity;
  } else {
    cart.items.push(item);
  }

  cart.updated_at = new Date().toISOString();
  saveCart(cart);
  return mockResponse(cart);
};

export const updateCartItemDB = async (userId, productId, payload) => {
  const cart = getStoredCart();
  const item = cart.items.find(
    i => i.product_id === productId && i.selected_color === (payload.selected_color || null)
  );

  if (item) {
    item.quantity = payload.quantity;
    cart.updated_at = new Date().toISOString();
    saveCart(cart);
  }

  return mockResponse(cart);
};

export const removeCartItemDB = async (userId, productId, selectedColor = null) => {
  const cart = getStoredCart();
  cart.items = cart.items.filter(
    i => !(i.product_id === productId && i.selected_color === selectedColor)
  );
  cart.updated_at = new Date().toISOString();
  saveCart(cart);
  return mockResponse(cart);
};

export const clearCartDB = async (userId) => {
  const cart = getStoredCart();
  cart.items = [];
  cart.updated_at = new Date().toISOString();
  saveCart(cart);
  return mockResponse(true);
};

// ====================== FAVORITOS ======================

const DEMO_FAVORITES_KEY = 'lrstore_demo_favorites';

const getStoredFavorites = () => {
  const stored = localStorage.getItem(DEMO_FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveFavorites = (favorites) => {
  localStorage.setItem(DEMO_FAVORITES_KEY, JSON.stringify(favorites));
};

export const getUserFavorites = async (userId) => {
  return mockResponse(getStoredFavorites());
};

export const addFavoriteDB = async (userId, productId) => {
  const favorites = getStoredFavorites();

  // Verificar se já existe
  const exists = favorites.find(f => f.product_id === productId);
  if (exists) {
    return mockResponse(exists);
  }

  const newFavorite = {
    id: `fav-${Date.now()}`,
    user_id: userId,
    product_id: productId,
    created_at: new Date().toISOString()
  };

  favorites.push(newFavorite);
  saveFavorites(favorites);
  return mockResponse(newFavorite);
};

export const removeFavoriteDB = async (userId, productId) => {
  const favorites = getStoredFavorites();
  const filtered = favorites.filter(f => f.product_id !== productId);

  if (filtered.length === favorites.length) {
    return mockError('Favorito não encontrado');
  }

  saveFavorites(filtered);
  return mockResponse({ detail: 'Favorito removido.' });
};

// ALIASES DE COMPATIBILIDADE
export const addFavorite = addFavoriteDB;
export const removeFavorite = removeFavoriteDB;

// ====================== PEDIDOS ======================

const DEMO_ORDERS_KEY = 'lrstore_demo_orders';

const getStoredOrders = () => {
  const stored = localStorage.getItem(DEMO_ORDERS_KEY);
  return stored ? JSON.parse(stored) : [...mockOrders];
};

const saveOrders = (orders) => {
  localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(orders));
};

export const createOrder = async (orderData) => {
  const orders = getStoredOrders();
  const orderNumber = String(100000 + orders.length);

  const newOrder = {
    order_number: orderNumber,
    user_id: mockUser.id,
    customer: orderData.customer,
    items: orderData.items,
    total: orderData.total,
    payment_method: orderData.payment_method,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  orders.push(newOrder);
  saveOrders(orders);

  return mockResponse({ order: newOrder });
};

export const getOrderByNumber = async (orderNumber) => {
  const orders = getStoredOrders();
  const order = orders.find(o => o.order_number === orderNumber);

  if (!order) {
    return mockError('Pedido não encontrado');
  }

  return mockResponse({ order });
};

export const getMyOrders = async (options = {}) => {
  const orders = getStoredOrders();
  return mockResponse(orders);
};

// ====================== SUPORTE ======================

export const sendSupportMessage = async (payload) => {
  await delay(500);
  return mockResponse({
    id: `msg-${Date.now()}`,
    ...payload,
    status: 'pending',
    created_at: new Date().toISOString()
  });
};

// ====================== PAGAMENTOS (MOCK) ======================

export const startMulticaixaExpressPayment = async ({ orderNumber, amount, phone }) => {
  await delay(1000);
  return mockResponse({
    transaction_id: `TXN-DEMO-${Date.now()}`,
    status: 'pending',
    message: 'Pagamento Express iniciado (DEMO)'
  });
};

export const startMulticaixaReferencePayment = async ({ orderNumber, amount }) => {
  await delay(1000);
  return mockResponse({
    reference: '999 999 999',
    entity: '11604',
    expiry_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    message: 'Referência gerada (DEMO)'
  });
};

export const getPaymentStatusApi = async (transactionId) => {
  await delay(500);
  return mockResponse({
    transaction_id: transactionId,
    status: 'completed',
    order_number: '123456'
  });
};

// ====================== ADMIN (DESABILITADO PARA DEMO) ======================

export const getAdminDashboardSummary = async () => {
  return mockError('Funcionalidade admin não disponível na demo', 403);
};

export const getAdminProducts = async () => {
  return mockError('Funcionalidade admin não disponível na demo', 403);
};

export const getAdminOrders = async () => {
  return mockError('Funcionalidade admin não disponível na demo', 403);
};

export const getAdminUsers = async () => {
  return mockError('Funcionalidade admin não disponível na demo', 403);
};

// ALIASES DE COMPATIBILIDADE PARA ADMIN
export const getAdminCategories = getAdminDashboardSummary;
export const createAdminProduct = getAdminDashboardSummary;
export const updateAdminProduct = getAdminDashboardSummary;
export const deleteAdminProduct = getAdminDashboardSummary;
export const createAdminCategory = getAdminDashboardSummary;
export const updateAdminCategory = getAdminDashboardSummary;
export const deleteAdminCategory = getAdminDashboardSummary;
export const getAdminOrder = getAdminDashboardSummary;
export const updateAdminOrderStatus = getAdminDashboardSummary;
export const getAdminUser = getAdminDashboardSummary;
export const updateAdminUser = getAdminDashboardSummary;

// Exportar todas as funções necessárias
export default {
  // Categorias
  getCategories,
  getCategoryBySlug,

  // Produtos
  getProducts,
  getProductById,

  // Auth
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  changeUserPassword,

  // Endereços
  getUserAddresses,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,

  // Carrinho
  getUserCart,
  addItemToCartDB,
  updateCartItemDB,
  removeCartItemDB,
  clearCartDB,

  // Favoritos
  getUserFavorites,
  addFavoriteDB,
  removeFavoriteDB,
  addFavorite,
  removeFavorite,

  // Pedidos
  createOrder,
  getOrderByNumber,
  getMyOrders,

  // Suporte
  sendSupportMessage,

  // Pagamentos
  startMulticaixaExpressPayment,
  startMulticaixaReferencePayment,
  getPaymentStatusApi,

  // Admin (desabilitado)
  getAdminDashboardSummary,
  getAdminProducts,
  getAdminOrders,
  getAdminUsers
};
export const uploadAdminAsset = getAdminDashboardSummary;
