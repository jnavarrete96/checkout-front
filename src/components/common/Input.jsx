/**
 * Input reutilizable con label, error y validación
 */

import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label,
  name,
  type = 'text',
  placeholder,
  error,
  required = false,
  icon,
  maxLength,
  className = '',
  ...rest
}, ref) => {
  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input container */}
      <div className="relative">
        {/* Icon (left) */}
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        
        {/* Input */}
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`
            w-full px-3 py-2 border rounded-lg
            focus:ring-2 focus:ring-indigo-500 focus:border-transparent
            transition-colors
            ${icon ? 'pl-10' : ''}
            ${error 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300'
            }
          `}
          {...rest}
        />
      </div>
      
      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  required: PropTypes.bool,
  icon: PropTypes.node,
  maxLength: PropTypes.number,
  className: PropTypes.string,
};

export default Input;