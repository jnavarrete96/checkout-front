/**
 * Products API Service
 * 
 * Endpoints para productos del catálogo
 */

import axios from './axios';

/**
 * GET /api/products
 * Lista todos los productos activos con stock disponible
 */
export const getProducts = async () => {
  const { data } = await axios.get('/products');
  return data;
};

/**
 * GET /api/products/:id
 * Obtiene el detalle de un producto específico
 */
export const getProductById = async (productId) => {
  const { data } = await axios.get(`/products/${productId}`);
  return data;
};

export default {
  getProducts,
  getProductById,
};