/**
 * CheckoutPage - Paso 2/5
 * Formulario de checkout con validación
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CheckoutForm from '../components/features/CheckoutForm';
import { Card } from '../components/common';
import { goToStep } from '../store/slices/checkoutSlice';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { selectedProduct } = useSelector((state) => state.checkout);

  useEffect(() => {
    if (selectedProduct) {
      dispatch(goToStep(2));
    }
  }, [selectedProduct, dispatch]);

  // Redirect si no hay producto seleccionado
  useEffect(() => {
    if (!selectedProduct) {
      navigate('/');
    }
  }, [selectedProduct, navigate]);

  if (!selectedProduct) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Complete Your Purchase
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Fill in your information to continue
        </p>
      </div>

      {/* Selected Product Summary (Mobile/Tablet) */}
      <Card className="lg:hidden">
        <div className="flex items-start gap-4">
          {/* Product Image Placeholder */}
          <div className="w-20 h-20 bg-linear-to-br from-indigo-100 to-indigo-200 rounded-lg shrink-0 flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-indigo-400" 
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
          
          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {selectedProduct.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {selectedProduct.description}
            </p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xl font-bold text-indigo-600">
                ${selectedProduct.price.toLocaleString('es-CO')}
              </span>
              <span className="text-sm text-gray-500">
                Qty: 1
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Layout: Form + Product Summary (Desktop) */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <CheckoutForm />
        </div>

        {/* Product Summary (Desktop Sidebar) */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>
              
              {/* Product Image */}
              <div className="w-full h-48 bg-linear-to-br from-indigo-100 to-indigo-200 rounded-lg mb-4 flex items-center justify-center">
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
              
              {/* Product Details */}
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {selectedProduct.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                    {selectedProduct.description}
                  </p>
                </div>
                
                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Product</span>
                    <span className="font-medium text-gray-900">
                      ${selectedProduct.price.toLocaleString('es-CO')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Fee</span>
                    <span className="font-medium text-gray-900">
                      $5,000
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium text-gray-900">
                      $10,000
                    </span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-indigo-600">
                      ${(selectedProduct.price + 15000).toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;