/**
 * productsSlice.test.js
 * Tests para el slice de productos
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import productsReducer, { 
  fetchProducts, 
  updateProductStock 
} from '../../store/slices/productsSlice';
import * as productsApi from '../../api/products.api';

// Mock del API
vi.mock('../../api/products.api');

describe('productsSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = productsReducer(undefined, { type: 'unknown' });
      
      expect(state).toEqual({
        items: [],
        loading: false,
        error: null,
      });
    });
  });

  describe('updateProductStock reducer', () => {
    it('should decrease product stock', () => {
      const initialState = {
        items: [
          { id: '1', name: 'Product 1', stockQuantity: 10 },
          { id: '2', name: 'Product 2', stockQuantity: 5 },
        ],
        loading: false,
        error: null,
      };

      const action = updateProductStock({ productId: '1', quantity: 2 });
      const state = productsReducer(initialState, action);

      expect(state.items[0].stockQuantity).toBe(8);
      expect(state.items[1].stockQuantity).toBe(5); // No afectado
    });

    it('should not modify stock if product not found', () => {
      const initialState = {
        items: [
          { id: '1', name: 'Product 1', stockQuantity: 10 },
        ],
        loading: false,
        error: null,
      };

      const action = updateProductStock({ productId: 'non-existent', quantity: 2 });
      const state = productsReducer(initialState, action);

      expect(state.items[0].stockQuantity).toBe(10); // Sin cambios
    });
  });

  describe('fetchProducts async thunk', () => {
    it('should set loading to true when pending', () => {
      const action = { type: fetchProducts.pending.type };
      const state = productsReducer(undefined, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should set products when fulfilled', () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', price: 100 },
        { id: '2', name: 'Product 2', price: 200 },
      ];

      const action = { 
        type: fetchProducts.fulfilled.type, 
        payload: mockProducts 
      };
      const state = productsReducer(undefined, action);

      expect(state.loading).toBe(false);
      expect(state.items).toEqual(mockProducts);
      expect(state.error).toBe(null);
    });

    it('should set error when rejected', () => {
      const errorMessage = 'Failed to fetch products';
      const action = { 
        type: fetchProducts.rejected.type, 
        payload: errorMessage 
      };
      const state = productsReducer(undefined, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.items).toEqual([]);
    });
  });

  describe('fetchProducts integration', () => {
    it('should call API and return products', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', price: 100 },
      ];

      productsApi.getProducts.mockResolvedValue(mockProducts);

      const dispatch = vi.fn();
      const thunk = fetchProducts();

      await thunk(dispatch, () => ({}), undefined);

      expect(productsApi.getProducts).toHaveBeenCalledTimes(1);
    });

    it('should handle API error', async () => {
      const errorMessage = 'Network error';
      productsApi.getProducts.mockRejectedValue(new Error(errorMessage));

      const dispatch = vi.fn();
      const thunk = fetchProducts();

      await thunk(dispatch, () => ({}), undefined);

      // Verificar que dispatch fue llamado con rejected
      const rejectedCall = dispatch.mock.calls.find(
        call => call[0].type === fetchProducts.rejected.type
      );
      expect(rejectedCall).toBeDefined();
    });
  });
});