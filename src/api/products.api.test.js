import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from './axios';
import { getProducts, getProductById } from './products.api';

/* -------------------- MOCK AXIOS -------------------- */
vi.mock('./axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('Products API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getProducts should fetch products list', async () => {
    const mockProducts = [
      { id: '1', name: 'iPhone 15', price: 3500000 },
      { id: '2', name: 'MacBook Pro', price: 8500000 },
    ];

    axios.get.mockResolvedValueOnce({
      data: mockProducts,
    });

    const result = await getProducts();

    expect(axios.get).toHaveBeenCalledWith('/products');
    expect(result).toEqual(mockProducts);
  });

  it('getProductById should fetch product by id', async () => {
    const mockProduct = {
      id: '1',
      name: 'iPhone 15',
      price: 3500000,
      stockQuantity: 5,
    };

    axios.get.mockResolvedValueOnce({
      data: mockProduct,
    });

    const result = await getProductById('1');

    expect(axios.get).toHaveBeenCalledWith('/products/1');
    expect(result).toEqual(mockProduct);
  });
});
