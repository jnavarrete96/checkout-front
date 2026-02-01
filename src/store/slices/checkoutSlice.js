/**
 * Checkout Slice - Gestión del proceso de compra
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  createTransaction, 
  processPayment, 
  getTransaction,
  recoverTransaction 
} from '../../api/transactions.api';

// Async thunk: Crear transacción (POST /api/transactions)
export const createCheckoutTransaction = createAsyncThunk(
  'checkout/createTransaction',
  async (data, { rejectWithValue }) => {
    try {
      const transaction = await createTransaction(data);
      return transaction;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk: Procesar pago (PATCH /api/transactions/:id/process-payment)
export const processCheckoutPayment = createAsyncThunk(
  'checkout/processPayment',
  async ({ transactionId, cardData }, { rejectWithValue }) => {
    try {
      const result = await processPayment(transactionId, cardData);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk: Recuperar transacción (GET /api/transactions/recover?email=xxx)
export const recoverCheckoutTransaction = createAsyncThunk(
  'checkout/recoverTransaction',
  async (email, { rejectWithValue }) => {
    try {
      const transaction = await recoverTransaction(email);
      return transaction;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk: Obtener detalle de transacción (GET /api/transactions/:id)
export const fetchTransactionDetails = createAsyncThunk(
  'checkout/fetchTransactionDetails',
  async (transactionId, { rejectWithValue }) => {
    try {
      const details = await getTransaction(transactionId);
      return details;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    // Producto seleccionado para comprar
    selectedProduct: null,
    quantity: 1,
    
    // Datos del formulario
    customerData: {
      email: '',
      fullName: '',
      phone: '',
    },
    deliveryData: {
      fullName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
    },
    
    // Transacción actual
    transaction: null,  // Response de POST /api/transactions
    transactionDetails: null,  // Response de GET /api/transactions/:id
    paymentResult: null,  // Response de PATCH /api/transactions/:id/process-payment
    
    // Control de flujo
    currentStep: 1,  // 1=Products, 2=Form, 3=Summary, 4=Processing, 5=Result
    loading: false,
    error: null,
  },
  reducers: {
    // Seleccionar producto para comprar
    selectProduct: (state, action) => {
      state.selectedProduct = action.payload;
      state.quantity = 1;
      state.currentStep = 2;
      state.error = null;
    },
    
    // Actualizar cantidad
    setQuantity: (state, action) => {
      state.quantity = action.payload;
    },
    
    // Guardar datos del cliente
    setCustomerData: (state, action) => {
      state.customerData = action.payload;
    },
    
    // Guardar datos de entrega
    setDeliveryData: (state, action) => {
      state.deliveryData = action.payload;
    },
    
    // Avanzar al siguiente paso
    nextStep: (state) => {
      if (state.currentStep < 5) {
        state.currentStep += 1;
      }
    },
    
    // Retroceder al paso anterior
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    
    // Ir a un paso específico
    goToStep: (state, action) => {
      state.currentStep = action.payload;
    },
    
    // Limpiar checkout (después de compra exitosa)
    clearCheckout: (state) => {
      state.selectedProduct = null;
      state.quantity = 1;
      state.customerData = {
        email: '',
        fullName: '',
        phone: '',
      };
      state.deliveryData = {
        fullName: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
      };
      state.transaction = null;
      state.transactionDetails = null;
      state.paymentResult = null;
      state.currentStep = 1;
      state.loading = false;
      state.error = null;
      
      // Limpiar localStorage
      localStorage.removeItem('checkout-state');
    },
    
    // Limpiar solo el error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ===== CREATE TRANSACTION =====
      .addCase(createCheckoutTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckoutTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transaction = action.payload;
        state.currentStep = 3;  // Ir a Summary
      })
      .addCase(createCheckoutTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ===== PROCESS PAYMENT =====
      .addCase(processCheckoutPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentStep = 4;  // Ir a Processing
      })
      .addCase(processCheckoutPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentResult = action.payload;
        state.currentStep = 5;

        if (state.transaction) {
          state.transaction.status = action.payload.status;
        }
      })
      .addCase(processCheckoutPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentStep = 5;  // Ir a Result (mostrar error)
      })
      
      // ===== RECOVER TRANSACTION =====
      .addCase(recoverCheckoutTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(recoverCheckoutTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const { transaction, product, delivery } = action.payload;
        
        // Restaurar estado desde la transacción recuperada
        state.transaction = transaction;
        state.selectedProduct = product;
        state.deliveryData = {
          fullName: delivery.fullName || '',
          phone: delivery.phone || '',
          address: delivery.address,
          city: delivery.city,
          state: delivery.state,
          postalCode: delivery.postalCode || '',
        };
        state.currentStep = 3;  // Ir a Summary para continuar
      })
      .addCase(recoverCheckoutTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ===== FETCH TRANSACTION DETAILS =====
      .addCase(fetchTransactionDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.transactionDetails = action.payload;
      })
      .addCase(fetchTransactionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  selectProduct,
  setQuantity,
  setCustomerData,
  setDeliveryData,
  nextStep,
  previousStep,
  goToStep,
  clearCheckout,
  clearError,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;