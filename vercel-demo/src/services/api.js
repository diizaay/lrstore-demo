// src/services/api.js
// VERSÃO DEMO - Re-exporta funções de API (mock)

// Importa todas as funções do apiMock
import * as apiMock from './apiMock';

// Flag indicando modo demo
export const USE_MOCK_DATA = true;

// Re-exporta todas as funções individuais para compatibilidade
export const {
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

    // Admin
    getAdminDashboardSummary,
    getAdminProducts,
    getAdminOrders,
    getAdminUsers
} = apiMock;

// Exporta também o default
export default apiMock.default;

// Mock do BACKEND_URL e api axios para compatibilidade
export const BACKEND_URL = 'https://demo.lrstore.com';
export const api = {
    get: () => Promise.resolve({ data: {} }),
    post: () => Promise.resolve({ data: {} }),
    put: () => Promise.resolve({ data: {} }),
    delete: () => Promise.resolve({ data: {} })
};

console.log('🎭 [LRStore] Modo DEMO ativado - usando dados mockados');
