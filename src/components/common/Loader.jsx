/**
 * Loader Component
 * Spinner de carga
 */

import PropTypes from 'prop-types';

const Loader = ({ size = 'md', text = '' }) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div 
        className={`animate-spin rounded-full border-b-2 border-indigo-600 ${sizes[size]}`}
      />
      {text && (
        <p className="mt-4 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
};

Loader.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  text: PropTypes.string,
};

export default Loader;