import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from './axios';
import {
  createTransaction,
  getTransaction,
  recoverTransaction,
  processPayment,
} from './transactions.api';

/* -------------------- MOCK AXIOS -------------------- */
vi.mock('./axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('Transactions API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createTransaction should POST transaction data', async () => {
    const payload = {
      customerEmail: 'juan@test.com',
      productId: '1',
      quantity: 1,
    };

    const mockResponse = {
      id: 'tx_123',
      status: 'PENDING',
    };

    axios.post.mockResolvedValueOnce({
      data: mockResponse,
    });

    const result = await createTransaction(payload);

    expect(axios.post).toHaveBeenCalledWith('/transactions', payload);
    expect(result).toEqual(mockResponse);
  });

  it('getTransaction should fetch transaction by id', async () => {
    const mockTransaction = {
      id: 'tx_123',
      status: 'PENDING',
      amount: 3500000,
    };

    axios.get.mockResolvedValueOnce({
      data: mockTransaction,
    });

    const result = await getTransaction('tx_123');

    expect(axios.get).toHaveBeenCalledWith('/transactions/tx_123');
    expect(result).toEqual(mockTransaction);
  });

  it('recoverTransaction should fetch transaction by email', async () => {
    const mockTransaction = {
      id: 'tx_456',
      status: 'PENDING',
    };

    axios.get.mockResolvedValueOnce({
      data: mockTransaction,
    });

    const result = await recoverTransaction('juan@test.com');

    expect(axios.get).toHaveBeenCalledWith('/transactions/recover', {
      params: { email: 'juan@test.com' },
    });
    expect(result).toEqual(mockTransaction);
  });

  it('processPayment should PATCH payment data', async () => {
    const cardData = {
      cardNumber: '4242424242424242',
      cardExpMonth: '12',
      cardExpYear: '26',
      cardCvc: '123',
      cardHolder: 'JUAN PEREZ',
    };

    const mockResponse = {
      id: 'tx_123',
      status: 'APPROVED',
    };

    axios.patch.mockResolvedValueOnce({
      data: mockResponse,
    });

    const result = await processPayment('tx_123', cardData);

    expect(axios.patch).toHaveBeenCalledWith(
      '/transactions/tx_123/process-payment',
      cardData
    );
    expect(result).toEqual(mockResponse);
  });
});
