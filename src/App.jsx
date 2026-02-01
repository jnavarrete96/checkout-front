/**
 * App.jsx - Componente principal
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from './store/slices/productsSlice';

function App() {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);
  const { currentStep } = useSelector((state) => state.checkout);

  // Cargar productos al iniciar
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            E-Commerce Checkout
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Step {currentStep} of 5
          </p>
        </header>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}

        {/* Products list (temporal) */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-2xl font-bold text-indigo-600">
                    ${product.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    Stock: {product.stockQuantity}
                  </span>
                </div>
                <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                  Select Product
                </button>
              </div>
            ))}
          </div>
        )}

        {/* No products */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No products available</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;