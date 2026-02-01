/**
 * ResultPage - Paso 5/5
 */

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCheckout } from '../store/slices/checkoutSlice';
import { updateProductStock } from '../store/slices/productsSlice';
import { Card, Button } from '../components/common';

const ResultPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { 
    paymentResult, 
    selectedProduct,
    transaction,
    error 
  } = useSelector((state) => state.checkout);

  // Redirect si no hay resultado
  useEffect(() => {
    if (!paymentResult && !error) {
      navigate('/');
    }
  }, [paymentResult, error, navigate]);

  // Actualizar stock si el pago fue APPROVED
  useEffect(() => {
    if (paymentResult?.status === 'APPROVED' && selectedProduct) {
      dispatch(updateProductStock({
        productId: selectedProduct.id,
        quantity: 1,
      }));
    }
  }, [paymentResult, selectedProduct, dispatch]);

  const handleBackToProducts = () => {
    localStorage.removeItem('temp-card-data');
    dispatch(clearCheckout());
    navigate('/');
  };

  // Determinar estado del pago
  const status = paymentResult?.status || (error ? 'ERROR' : 'UNKNOWN');
  const isSuccess = status === 'APPROVED';
  const isDeclined = status === 'DECLINED';
  const isError = status === 'ERROR' || error;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success State */}
      {isSuccess && (
        <div className="space-y-6">
          {/* Success Icon */}
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg 
                className="h-10 w-10 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Payment Successful!</h2>
            <p className="mt-2 text-gray-600">
              Your order has been confirmed
            </p>
          </div>

          {/* Transaction Details */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Transaction Details
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Transaction Number</span>
                <span className="text-sm font-semibold text-gray-900">
                  {paymentResult.transactionNo}
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {paymentResult.status}
                </span>
              </div>
              
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Total Amount</span>
                <span className="text-lg font-bold text-gray-900">
                  ${paymentResult.totalAmount.toLocaleString('es-CO')} COP
                </span>
              </div>
              
              {paymentResult.wompiTransactionId && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Wompi Transaction ID</span>
                  <span className="text-sm font-mono text-gray-900">
                    {paymentResult.wompiTransactionId}
                  </span>
                </div>
              )}
              
              {paymentResult.cardBrand && paymentResult.cardLastFour && (
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Payment Method</span>
                  <span className="text-sm font-medium text-gray-900">
                    {paymentResult.cardBrand} •••• {paymentResult.cardLastFour}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Product Info */}
          {selectedProduct && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Product Purchased
              </h3>
              <div className="flex items-center gap-4">
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
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedProduct.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">Quantity: 1</p>
                </div>
              </div>
            </Card>
          )}

          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg 
                className="w-5 h-5 text-green-600 mt-0.5 mr-3 shrink-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                  clipRule="evenodd" 
                />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-green-800">
                  Order Confirmed
                </h4>
                <p className="mt-1 text-sm text-green-700">
                  You will receive a confirmation email shortly. Your product will be delivered to the address you provided.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={handleBackToProducts}
            fullWidth
            size="lg"
          >
            Continue Shopping
          </Button>
        </div>
      )}

      {/* Declined State */}
      {isDeclined && (
        <div className="space-y-6">
          {/* Declined Icon */}
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg 
                className="h-10 w-10 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Payment Declined</h2>
            <p className="mt-2 text-gray-600">
              Your payment was declined by the payment gateway
            </p>
          </div>

          {/* Transaction Details */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Transaction Details
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Transaction Number</span>
                <span className="text-sm font-semibold text-gray-900">
                  {paymentResult?.transactionNo || transaction?.transactionNo || 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  DECLINED
                </span>
              </div>
            </div>
          </Card>

          {/* Error Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg 
                className="w-5 h-5 text-red-600 mt-0.5 mr-3 shrink-0" 
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
                <h4 className="text-sm font-medium text-red-800">
                  Payment Failed
                </h4>
                <p className="mt-1 text-sm text-red-700">
                  {paymentResult?.message || 'The payment was declined by your bank. Please try a different payment method or contact your bank.'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate('/summary')}
              variant="primary"
              fullWidth
            >
              Try Again
            </Button>
            <Button 
              onClick={handleBackToProducts}
              variant="outline"
              fullWidth
            >
              Back to Products
            </Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && !isDeclined && (
        <div className="space-y-6">
          {/* Error Icon */}
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
              <svg 
                className="h-10 w-10 text-yellow-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Processing Error</h2>
            <p className="mt-2 text-gray-600">
              Something went wrong while processing your payment
            </p>
          </div>

          {/* Error Details */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Error Details
            </h3>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                {error || paymentResult?.message || 'An unexpected error occurred. Please try again later.'}
              </p>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate('/summary')}
              variant="primary"
              fullWidth
            >
              Try Again
            </Button>
            <Button 
              onClick={handleBackToProducts}
              variant="outline"
              fullWidth
            >
              Back to Products
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPage;