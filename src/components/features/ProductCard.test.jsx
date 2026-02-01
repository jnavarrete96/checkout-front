import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';

// 🔹 Mock simple del producto base
const baseProduct = {
  id: '1',
  name: 'iPhone 15',
  description: 'Latest Apple smartphone',
  price: 3500000,
  stockQuantity: 20,
  imageUrl: null,
};

describe('ProductCard component', () => {
  it('renderiza correctamente la información del producto', () => {
    render(<ProductCard product={baseProduct} onSelect={vi.fn()} />);

    expect(screen.getByText('iPhone 15')).toBeInTheDocument();
    expect(screen.getByText('Latest Apple smartphone')).toBeInTheDocument();
    expect(screen.getByText('$3.500.000')).toBeInTheDocument();
    expect(screen.getByText('COP')).toBeInTheDocument();
    expect(screen.getByText('Stock: 20')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /select product/i })).toBeInTheDocument();
  });

  it('muestra badge "Low Stock" cuando el stock es menor a 10', () => {
    const lowStockProduct = {
      ...baseProduct,
      stockQuantity: 5,
    };

    render(<ProductCard product={lowStockProduct} onSelect={vi.fn()} />);

    expect(screen.getByText('Low Stock')).toBeInTheDocument();
    expect(screen.getByText('Stock: 5')).toBeInTheDocument();
  });

  it('muestra badge "Out of Stock" cuando el stock es 0', () => {
    const outOfStockProduct = {
      ...baseProduct,
      stockQuantity: 0,
    };
  
    render(<ProductCard product={outOfStockProduct} onSelect={vi.fn()} />);
  
    const labels = screen.getAllByText('Out of Stock');
    expect(labels.length).toBeGreaterThan(1);
  
    expect(
      screen.getByRole('button', { name: /out of stock/i })
    ).toBeDisabled();
  });


  it('ejecuta onSelect con el producto cuando se hace click en el botón', () => {
    const onSelect = vi.fn();

    render(<ProductCard product={baseProduct} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: /select product/i }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(baseProduct);
  });

  it('renderiza la imagen cuando imageUrl está presente', () => {
    const productWithImage = {
      ...baseProduct,
      imageUrl: 'https://example.com/image.jpg',
    };

    render(<ProductCard product={productWithImage} onSelect={vi.fn()} />);

    const img = screen.getByRole('img', { name: /iphone 15/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', productWithImage.imageUrl);
  });
});
