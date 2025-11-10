import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Categories API
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API}/categories`);
    return response.data.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getCategoryBySlug = async (slug) => {
  try {
    const response = await axios.get(`${API}/categories/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
};

// Products API
export const getProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.category) params.append('category', filters.category);
    if (filters.search) params.append('search', filters.search);
    if (filters.featured !== undefined) params.append('featured', filters.featured);
    
    const response = await axios.get(`${API}/products?${params.toString()}`);
    return response.data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${API}/products/${productId}`);
    return response.data.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Orders API
export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API}/orders`, orderData);
    return response.data.order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrder = async (orderNumber) => {
  try {
    const response = await axios.get(`${API}/orders/${orderNumber}`);
    return response.data.order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Payments API
export const generatePaymentReference = async (orderNumber, amount) => {
  try {
    const response = await axios.post(`${API}/payments/multicaixa/reference`, {
      order_number: orderNumber,
      amount: amount
    });
    return response.data;
  } catch (error) {
    console.error('Error generating payment reference:', error);
    throw error;
  }
};

export const processExpressPayment = async (orderNumber, phone, amount) => {
  try {
    const response = await axios.post(`${API}/payments/multicaixa/express`, {
      order_number: orderNumber,
      phone: phone,
      amount: amount
    });
    return response.data;
  } catch (error) {
    console.error('Error processing express payment:', error);
    throw error;
  }
};

export const getPaymentStatus = async (transactionId) => {
  try {
    const response = await axios.get(`${API}/payments/status/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payment status:', error);
    throw error;
  }
};
