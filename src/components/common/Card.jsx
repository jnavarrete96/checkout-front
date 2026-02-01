/**
 * Card Component
 */

import PropTypes from 'prop-types';

const Card = ({ 
  children, 
  className = '',
  padding = 'default',
  hover = false,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    default: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };
  
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';
  
  return (
    <div 
      className={`bg-white rounded-lg shadow-md ${paddingClasses[padding]} ${hoverClass} ${className}`}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  padding: PropTypes.oneOf(['none', 'sm', 'default', 'lg']),
  hover: PropTypes.bool,
};

export default Card;