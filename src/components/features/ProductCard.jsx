/**
 * ProductCard Component
 */

import PropTypes from 'prop-types';
import Card from '../common/Card';
import Button from '../common/Button';

const ProductCard = ({ product, onSelect }) => {
  const { name, description, price, stockQuantity, imageUrl } = product;
  
  const isLowStock = stockQuantity < 10;
  const isOutOfStock = stockQuantity === 0;
  
  return (
    <Card hover className="flex flex-col h-full">
      {/* Image placeholder */}
      <div className="relative w-full h-40 sm:h-48 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg mb-4 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg 
              className="w-16 h-16 text-indigo-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
              />
            </svg>
          </div>
        )}
        
        {/* Stock badge */}
        {isOutOfStock ? (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Out of Stock
          </div>
        ) : isLowStock && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            Low Stock
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {name}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
          {description}
        </p>
        
        {/* Price and Stock */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl sm:text-3xl font-bold text-indigo-600">
              ${price.toLocaleString('es-CO')}
            </span>
            <span className="text-sm text-gray-500 ml-1">COP</span>
          </div>
          <span className="text-sm text-gray-500">
            Stock: {stockQuantity}
          </span>
        </div>
        
        {/* Button */}
        <Button 
          onClick={() => onSelect(product)}
          disabled={isOutOfStock}
          fullWidth
        >
          {isOutOfStock ? 'Out of Stock' : 'Select Product'}
        </Button>
      </div>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    stockQuantity: PropTypes.number.isRequired,
    imageUrl: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ProductCard;