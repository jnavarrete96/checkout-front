/**
 * Redux Store - Global State Management
 */

import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import checkoutReducer from './slices/checkoutSlice';

// Middleware para persistir en localStorage
const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Guardar checkout state en localStorage (resiliencia)
  const { checkout } = store.getState();
  if (checkout.transaction || checkout.selectedProduct) {
    localStorage.setItem('checkout-state', JSON.stringify({
      selectedProduct: checkout.selectedProduct,
      customerData: checkout.customerData,
      deliveryData: checkout.deliveryData,
      transaction: checkout.transaction,
      currentStep: checkout.currentStep,
    }));
  }
  
  return result;
};

// Cargar estado inicial desde localStorage
const loadCheckoutState = () => {
  try {
    const serializedState = localStorage.getItem('checkout-state');
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    products: productsReducer,
    checkout: checkoutReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
  preloadedState: {
    checkout: loadCheckoutState() || undefined,
  },
});

export default store;