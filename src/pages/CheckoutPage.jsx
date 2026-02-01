/**
 * Formulario de datos del cliente, tarjeta y entrega
 */

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { selectedProduct } = useSelector((state) => state.checkout);

  // Redirigir si no hay producto seleccionado
  if (!selectedProduct) {
    navigate('/');
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Checkout
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Complete your purchase information
        </p>
      </div>

      {/* Selected Product Summary */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Selected Product
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">{selectedProduct.name}</p>
            <p className="text-sm text-gray-600">{selectedProduct.description}</p>
          </div>
          <p className="text-xl font-bold text-indigo-600">
            ${selectedProduct.price.toLocaleString('es-CO')}
          </p>
        </div>
      </Card>

      {/* Placeholder for form */}
      <Card>
        <p className="text-center text-gray-600 py-8">
          Checkout form coming soon...
        </p>
      </Card>
    </div>
  );
};

export default CheckoutPage;