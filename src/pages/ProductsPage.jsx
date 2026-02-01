/**
 * Lista de productos disponibles
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../store/slices/productsSlice';
import { goToStep, selectProduct } from '../store/slices/checkoutSlice';
import { ProductList } from '../components/features';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, loading, error } = useSelector((state) => state.products);

  // Cargar productos al montar
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(goToStep(1));
  }, [dispatch]);

  // Seleccionar producto y navegar a checkout
  const handleSelectProduct = (product) => {
    dispatch(selectProduct(product));
    navigate('/checkout');
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Choose Your Product
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Select a product to start your purchase
        </p>
      </div>

      {/* Products Grid */}
      <ProductList 
        products={products}
        loading={loading}
        error={error}
        onSelectProduct={handleSelectProduct}
      />
    </div>
  );
};

export default ProductsPage;