/**
 * ProductList Component
 */

import PropTypes from 'prop-types';
import ProductCard from './ProductCard';
import Loader from '../common/Loader';

const ProductList = ({ products, loading, error, onSelectProduct }) => {
  // Loading state
  if (loading) {
    return <Loader size="lg" text="Loading products..." />;
  }
  
  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-start">
          <svg 
            className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
              clipRule="evenodd" 
            />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-red-800">Error loading products</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <svg 
          className="mx-auto h-12 w-12 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No products available</h3>
        <p className="mt-2 text-sm text-gray-600">Check back later for new products.</p>
      </div>
    );
  }
  
  // Products grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id}
          product={product}
          onSelect={onSelectProduct}
        />
      ))}
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    stockQuantity: PropTypes.number.isRequired,
  })),
  loading: PropTypes.bool,
  error: PropTypes.string,
  onSelectProduct: PropTypes.func.isRequired,
};

export default ProductList;