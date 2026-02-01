/**
 * Products Slice - Gestión de productos del catálogo
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProducts } from '../../api/products.api';

// Async thunk para cargar productos
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const products = await getProducts();
      return products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Actualizar stock después de compra exitosa
    updateProductStock: (state, action) => {
      const { productId, quantity } = action.payload;
      const product = state.items.find(p => p.id === productId);
      if (product) {
        product.stockQuantity -= quantity;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products - pending
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Fetch products - fulfilled
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      // Fetch products - rejected
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateProductStock } = productsSlice.actions;
export default productsSlice.reducer;