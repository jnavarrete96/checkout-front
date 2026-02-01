/**
 * App.jsx - Componente principal (refactorizado)
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from './store/slices/productsSlice';
import { selectProduct } from './store/slices/checkoutSlice';
import { ProductList } from './components/features';

function App() {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);
  const { currentStep } = useSelector((state) => state.checkout);

  // Cargar productos al iniciar
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle product selection
  const handleSelectProduct = (product) => {
    dispatch(selectProduct(product));
    console.log('Product selected:', product);
    // TO DO: Navegar a checkout
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Responsive */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                E-Commerce Checkout
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-600">
                Step {currentStep} of 5
              </p>
            </div>
            
            {/* Cart icon (placeholder) */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg 
                className="w-6 h-6 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Responsive padding */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ProductList 
          products={products}
          loading={loading}
          error={error}
          onSelectProduct={handleSelectProduct}
        />
      </main>

      {/* Footer - Responsive */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <p className="text-center text-xs sm:text-sm text-gray-600">
            © 2026 E-Commerce Checkout. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;