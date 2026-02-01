/**
 * Axios Instance - Configuración base para llamadas HTTP
 */

import axios from 'axios';

const host = globalThis.location.hostname || 'localhost';
const API_URL = `http://${host}:3000/api`;

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 segundos (para polling de Wompi)
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de response (manejo de errores)
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[API] ✅ Response from ${response.config.url}`);
    return response;
  },
  (error) => {
    // Extraer mensaje de error
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error ||
      error.message || 
      'Network error';
    
    console.error(`[API] ❌ Error: ${errorMessage}`);
    
    // Rechazar con mensaje limpio
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;