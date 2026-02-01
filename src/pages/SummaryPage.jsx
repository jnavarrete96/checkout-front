/**
 * SummaryPage - Paso 3/5
 * Resumen de la compra antes de procesar el pago
 */

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { processCheckoutPayment } from '../store/slices/checkoutSlice';
import { Card, Button } from '../components/common';

const SummaryPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { 
    selectedProduct, 
    transaction, 
    customerData, 
    deliveryData,
    loading 
  } = useSelector((state) => state.checkout);

  // State para guardar temporalmente los datos de la tarjeta
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [savedCardData] = useState(() => {
    const cardData = localStorage.getItem('temp-card-data');
    return cardData ? JSON.parse(cardData) : null;
  });


  // Redirect si no hay transacción creada
  useEffect(() => {
    if (!transaction || !selectedProduct) {
      navigate('/');
    }
  }, [transaction, selectedProduct, navigate]);

  if (!transaction || !selectedProduct) {
    return null;
  }

  // Calcular montos
  const productAmount = selectedProduct.price;
  const baseFee = 5000;
  const deliveryFee = 10000;
  const totalAmount = transaction.totalAmount;

  // Handle confirm payment
  const handleConfirmPayment = () => {
    setShowConfirmation(true);
  };

  // Handle process payment
  const handleProcessPayment = async () => {
    if (!savedCardData) {
      alert('Card data not found. Please go back and re-enter your card information.');
      navigate('/result');
      return;
    }

    await dispatch(processCheckoutPayment({
      transactionId: transaction.transactionId,
      cardData: savedCardData,
    }));

    // Limpiar datos de tarjeta del localStorage
    localStorage.removeItem('temp-card-data');

    // Navegar a result independientemente del resultado
    navigate('/result');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Order Summary
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Review your order before confirming payment
        </p>
      </div>

      {/* Transaction Info */}
      <Card>
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Transaction Number</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">{transaction.transactionNo}</p>
          </div>
          <div className="text-right">
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
              {transaction.status}
            </span>
          </div>
        </div>
      </Card>

      {/* Grid Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Details */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product</h3>
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="w-24 h-24 bg-linear-to-br from-indigo-100 to-indigo-200 rounded-lg shrink-0 flex items-center justify-center">
                <svg 
                  className="w-10 h-10 text-indigo-400" 
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
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{selectedProduct.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{selectedProduct.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Quantity: 1</span>
                  <span className="text-lg font-semibold text-indigo-600">
                    ${productAmount.toLocaleString('es-CO')}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Customer Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email</span>
                <span className="text-sm font-medium text-gray-900">{customerData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Full Name</span>
                <span className="text-sm font-medium text-gray-900">{customerData.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Phone</span>
                <span className="text-sm font-medium text-gray-900">{customerData.phone}</span>
              </div>
            </div>
          </Card>

          {/* Delivery Information */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Recipient</span>
                <span className="text-sm font-medium text-gray-900">{deliveryData.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Phone</span>
                <span className="text-sm font-medium text-gray-900">{deliveryData.phone}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-600 mb-1">Address</span>
                <span className="text-sm font-medium text-gray-900">
                  {deliveryData.address}<br />
                  {deliveryData.city}, {deliveryData.state}<br />
                  {deliveryData.postalCode && `${deliveryData.postalCode}`}
                </span>
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          {savedCardData && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    •••• •••• •••• {savedCardData.cardNumber.slice(-4)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Expires {savedCardData.cardExpMonth}/{savedCardData.cardExpYear}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Payment Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Product</span>
                  <span className="text-sm font-medium text-gray-900">
                    ${productAmount.toLocaleString('es-CO')}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Base Fee</span>
                  <span className="text-sm font-medium text-gray-900">
                    ${baseFee.toLocaleString('es-CO')}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Delivery Fee</span>
                  <span className="text-sm font-medium text-gray-900">
                    ${deliveryFee.toLocaleString('es-CO')}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="text-base font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-indigo-600">
                    ${totalAmount.toLocaleString('es-CO')} COP
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {showConfirmation ? (
                  <>
		                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                      <p className="text-sm text-yellow-800">
                        <strong>Confirm payment?</strong><br />
                        This action will charge your card.
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handleProcessPayment}
                      loading={loading}
                      fullWidth
                    >
                      Yes, Process Payment
                    </Button>
                    
                    <Button 
                      onClick={() => setShowConfirmation(false)}
                      variant="secondary"
                      disabled={loading}
                      fullWidth
                    >
                      Cancel
                    </Button>
                    
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={handleConfirmPayment}
                      fullWidth
                    >
                      Confirm & Pay
                    </Button>
                    
                    <Button 
                      onClick={() => navigate('/checkout')}
                      variant="outline"
                      fullWidth
                    >
                      Edit Information
                    </Button>
                  </>
                )}
              </div>

              {/* Security Badge */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Secure payment powered by Wompi</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;