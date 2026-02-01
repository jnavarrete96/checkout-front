/**
 * checkoutSlice.test.js
 * Tests para el slice de checkout
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import checkoutReducer, {
  selectProduct,
  setQuantity,
  setCustomerData,
  setDeliveryData,
  nextStep,
  previousStep,
  goToStep,
  clearCheckout,
  clearError,
  createCheckoutTransaction,
  processCheckoutPayment,
} from '../../store/slices/checkoutSlice';
import * as transactionsApi from '../../api/transactions.api';

// Mock del API
vi.mock('../../api/transactions.api');

describe('checkoutSlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = checkoutReducer(undefined, { type: 'unknown' });

      expect(state).toEqual({
        selectedProduct: null,
        quantity: 1,
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
        transaction: null,
        transactionDetails: null,
        paymentResult: null,
        currentStep: 1,
        loading: false,
        error: null,
      });
    });
  });

  describe('selectProduct reducer', () => {
    it('should set selected product and move to step 2', () => {
      const product = { id: '1', name: 'Product 1', price: 100 };
      const action = selectProduct(product);
      const state = checkoutReducer(undefined, action);

      expect(state.selectedProduct).toEqual(product);
      expect(state.quantity).toBe(1);
      expect(state.currentStep).toBe(2);
      expect(state.error).toBe(null);
    });
  });

  describe('setQuantity reducer', () => {
    it('should update quantity', () => {
      const action = setQuantity(3);
      const state = checkoutReducer(undefined, action);

      expect(state.quantity).toBe(3);
    });
  });

  describe('setCustomerData reducer', () => {
    it('should set customer data', () => {
      const customerData = {
        email: 'test@test.com',
        fullName: 'Test User',
        phone: '1234567890',
      };

      const action = setCustomerData(customerData);
      const state = checkoutReducer(undefined, action);

      expect(state.customerData).toEqual(customerData);
    });
  });

  describe('setDeliveryData reducer', () => {
    it('should set delivery data', () => {
      const deliveryData = {
        fullName: 'Test User',
        phone: '1234567890',
        address: 'Test Address',
        city: 'Test City',
        state: 'Test State',
        postalCode: '12345',
      };

      const action = setDeliveryData(deliveryData);
      const state = checkoutReducer(undefined, action);

      expect(state.deliveryData).toEqual(deliveryData);
    });
  });

  describe('step navigation reducers', () => {
    it('should move to next step', () => {
      const initialState = { ...checkoutReducer(undefined, { type: 'unknown' }), currentStep: 2 };
      const action = nextStep();
      const state = checkoutReducer(initialState, action);

      expect(state.currentStep).toBe(3);
    });

    it('should not move beyond step 5', () => {
      const initialState = { ...checkoutReducer(undefined, { type: 'unknown' }), currentStep: 5 };
      const action = nextStep();
      const state = checkoutReducer(initialState, action);

      expect(state.currentStep).toBe(5);
    });

    it('should move to previous step', () => {
      const initialState = { ...checkoutReducer(undefined, { type: 'unknown' }), currentStep: 3 };
      const action = previousStep();
      const state = checkoutReducer(initialState, action);

      expect(state.currentStep).toBe(2);
    });

    it('should not move below step 1', () => {
      const initialState = { ...checkoutReducer(undefined, { type: 'unknown' }), currentStep: 1 };
      const action = previousStep();
      const state = checkoutReducer(initialState, action);

      expect(state.currentStep).toBe(1);
    });

    it('should go to specific step', () => {
      const action = goToStep(4);
      const state = checkoutReducer(undefined, action);

      expect(state.currentStep).toBe(4);
    });
  });

  describe('clearCheckout reducer', () => {
    it('should reset to initial state', () => {
      const dirtyState = {
        selectedProduct: { id: '1' },
        quantity: 3,
        customerData: { email: 'test@test.com' },
        transaction: { id: 'tx1' },
        currentStep: 5,
        error: 'Some error',
      };

      const action = clearCheckout();
      const state = checkoutReducer(dirtyState, action);

      expect(state.selectedProduct).toBe(null);
      expect(state.quantity).toBe(1);
      expect(state.customerData.email).toBe('');
      expect(state.transaction).toBe(null);
      expect(state.currentStep).toBe(1);
      expect(state.error).toBe(null);
    });
  });

  describe('clearError reducer', () => {
    it('should clear error', () => {
      const initialState = { 
        ...checkoutReducer(undefined, { type: 'unknown' }), 
        error: 'Some error' 
      };

      const action = clearError();
      const state = checkoutReducer(initialState, action);

      expect(state.error).toBe(null);
    });
  });

  describe('createCheckoutTransaction async thunk', () => {
    it('should set loading to true when pending', () => {
      const action = { type: createCheckoutTransaction.pending.type };
      const state = checkoutReducer(undefined, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should set transaction and move to step 3 when fulfilled', () => {
      const mockTransaction = {
        transactionId: 'tx123',
        transactionNo: 'TXN-001',
        status: 'PENDING',
        totalAmount: 100000,
      };

      const action = {
        type: createCheckoutTransaction.fulfilled.type,
        payload: mockTransaction,
      };
      const state = checkoutReducer(undefined, action);

      expect(state.loading).toBe(false);
      expect(state.transaction).toEqual(mockTransaction);
      expect(state.currentStep).toBe(3);
    });

    it('should set error when rejected', () => {
      const errorMessage = 'Failed to create transaction';
      const action = {
        type: createCheckoutTransaction.rejected.type,
        payload: errorMessage,
      };
      const state = checkoutReducer(undefined, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('processCheckoutPayment async thunk', () => {
    it('should set loading and move to step 4 when pending', () => {
      const action = { type: processCheckoutPayment.pending.type };
      const state = checkoutReducer(undefined, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
      expect(state.currentStep).toBe(4);
    });

    it('should set payment result and move to step 5 when fulfilled', () => {
      const mockPaymentResult = {
        transactionId: 'tx123',
        status: 'APPROVED',
        totalAmount: 100000,
        cardBrand: 'VISA',
        cardLastFour: '4242',
      };

      const initialState = {
        ...checkoutReducer(undefined, { type: 'unknown' }),
        transaction: { id: 'tx123', status: 'PENDING' },
      };

      const action = {
        type: processCheckoutPayment.fulfilled.type,
        payload: mockPaymentResult,
      };
      const state = checkoutReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.paymentResult).toEqual(mockPaymentResult);
      expect(state.currentStep).toBe(5);
      expect(state.transaction.status).toBe('APPROVED');
    });

    it('should update transaction status when fulfilled', () => {
      const initialState = {
        ...checkoutReducer(undefined, { type: 'unknown' }),
        transaction: { id: 'tx123', status: 'PENDING' },
      };

      const action = {
        type: processCheckoutPayment.fulfilled.type,
        payload: { status: 'DECLINED' },
      };
      const state = checkoutReducer(initialState, action);

      expect(state.transaction.status).toBe('DECLINED');
    });

    it('should set error when rejected', () => {
      const errorMessage = 'Payment failed';
      const action = {
        type: processCheckoutPayment.rejected.type,
        payload: errorMessage,
      };
      const state = checkoutReducer(undefined, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.currentStep).toBe(5);
    });
  });

  describe('createCheckoutTransaction integration', () => {
    it('should call API with correct data', async () => {
      const mockData = {
        customerEmail: 'test@test.com',
        productId: '123',
      };

      const mockResponse = {
        transactionId: 'tx123',
        status: 'PENDING',
      };

      transactionsApi.createTransaction.mockResolvedValue(mockResponse);

      const dispatch = vi.fn();
      const thunk = createCheckoutTransaction(mockData);

      await thunk(dispatch, () => ({}), undefined);

      expect(transactionsApi.createTransaction).toHaveBeenCalledWith(mockData);
    });
  });

  describe('processCheckoutPayment integration', () => {
    it('should call API with transaction ID and card data', async () => {
      const mockData = {
        transactionId: 'tx123',
        cardData: {
          cardNumber: '4242424242424242',
          cardExpMonth: '12',
          cardExpYear: '28',
          cardCvc: '123',
          cardHolder: 'Test User',
        },
      };

      const mockResponse = {
        transactionId: 'tx123',
        status: 'APPROVED',
      };

      transactionsApi.processPayment.mockResolvedValue(mockResponse);

      const dispatch = vi.fn();
      const thunk = processCheckoutPayment(mockData);

      await thunk(dispatch, () => ({}), undefined);

      expect(transactionsApi.processPayment).toHaveBeenCalledWith(
        mockData.transactionId,
        mockData.cardData
      );
    });
  });
});