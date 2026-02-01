/**
 * CheckoutForm Component
 * Formulario de checkout con Card + Customer + Delivery
 */

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  setCustomerData, 
  setDeliveryData, 
  createCheckoutTransaction 
} from '../../store/slices/checkoutSlice';
import { Card, Button } from '../common';
import Input from '../common/Input';
import useCardValidation from '../../hooks/useCardValidation';

const CheckoutForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct, loading } = useSelector((state) => state.checkout);

  // Form state
  const [formData, setFormData] = useState({
    // Customer
    customerEmail: '',
    customerFullName: '',
    customerPhone: '',
    
    // Card
    cardNumber: '',
    cardExpMonth: '',
    cardExpYear: '',
    cardCvc: '',
    cardHolder: '',
    
    // Delivery
    deliveryFullName: '',
    deliveryPhone: '',
    deliveryAddress: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryPostalCode: '',
  });

  const [errors, setErrors] = useState({});
  const { cardBrand, isValid: isCardValid, formatCardNumber } = useCardValidation(formData.cardNumber);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number
    if (name === 'cardNumber') {
      const cleaned = value.replaceAll(/\s/g, '');
      if (cleaned.length <= 16 && /^\d*$/.test(cleaned)) {
        setFormData(prev => ({
          ...prev,
          [name]: formatCardNumber(cleaned)
        }));
      }
      return;
    }
    
    // Limit card fields
    if (name === 'cardExpMonth' && value.length > 2) return;
    if (name === 'cardExpYear' && value.length > 2) return;
    if (name === 'cardCvc' && value.length > 4) return;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    // Customer validation
    if (!formData.customerEmail) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
    }
    
    if (!formData.customerFullName || formData.customerFullName.length < 3) {
      newErrors.customerFullName = 'Full name must be at least 3 characters';
    }
    
    if (!formData.customerPhone || formData.customerPhone.length < 7) {
      newErrors.customerPhone = 'Phone must be at least 7 digits';
    }

    // Card validation
    if (!isCardValid) {
      newErrors.cardNumber = 'Invalid card number (16 digits required)';
    }
    
    if (!formData.cardExpMonth || Number.parseInt(formData.cardExpMonth) < 1 || Number.parseInt(formData.cardExpMonth) > 12) {
      newErrors.cardExpMonth = 'Invalid month (01-12)';
    }
    
    if (!formData.cardExpYear || formData.cardExpYear.length !== 2) {
      newErrors.cardExpYear = 'Invalid year (YY format)';
    }
    
    if (!formData.cardCvc || formData.cardCvc.length < 3) {
      newErrors.cardCvc = 'Invalid CVC (3-4 digits)';
    }
    
    if (!formData.cardHolder || formData.cardHolder.length < 3) {
      newErrors.cardHolder = 'Card holder name is required';
    }

    // Delivery validation
    if (!formData.deliveryFullName || formData.deliveryFullName.length < 3) {
      newErrors.deliveryFullName = 'Full name is required';
    }
    
    if (!formData.deliveryPhone || formData.deliveryPhone.length < 7) {
      newErrors.deliveryPhone = 'Phone is required';
    }
    
    if (!formData.deliveryAddress || formData.deliveryAddress.length < 10) {
      newErrors.deliveryAddress = 'Address must be at least 10 characters';
    }
    
    if (!formData.deliveryCity || formData.deliveryCity.length < 3) {
      newErrors.deliveryCity = 'City is required';
    }
    
    if (!formData.deliveryState || formData.deliveryState.length < 3) {
      newErrors.deliveryState = 'State is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    localStorage.setItem('temp-card-data', JSON.stringify({
        cardNumber: formData.cardNumber.replaceAll(/\s/g, ''),
        cardExpMonth: formData.cardExpMonth,
        cardExpYear: formData.cardExpYear,
        cardCvc: formData.cardCvc,
        cardHolder: formData.cardHolder,
    }));

    // Guardar datos en Redux
    dispatch(setCustomerData({
      email: formData.customerEmail,
      fullName: formData.customerFullName,
      phone: formData.customerPhone,
    }));

    dispatch(setDeliveryData({
      fullName: formData.deliveryFullName,
      phone: formData.deliveryPhone,
      address: formData.deliveryAddress,
      city: formData.deliveryCity,
      state: formData.deliveryState,
      postalCode: formData.deliveryPostalCode,
    }));

    // Crear transacción en backend
    const result = await dispatch(createCheckoutTransaction({
      customerEmail: formData.customerEmail,
      customerFullName: formData.customerFullName,
      customerPhone: formData.customerPhone,
      productId: selectedProduct.id,
      quantity: 1,
      deliveryFullName: formData.deliveryFullName,
      deliveryPhone: formData.deliveryPhone,
      deliveryAddress: formData.deliveryAddress,
      deliveryCity: formData.deliveryCity,
      deliveryState: formData.deliveryState,
      deliveryPostalCode: formData.deliveryPostalCode,
    }));

    // Si creó bien, navegar a summary
    if (result.type.endsWith('/fulfilled')) {
      navigate('/summary');
    }
  };

  // Auto-fill delivery with customer data
  const autofillDelivery = () => {
    setFormData(prev => ({
      ...prev,
      deliveryFullName: formData.customerFullName,
      deliveryPhone: formData.customerPhone,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          1. Customer Information
        </h3>
        
        <div className="space-y-4">
          <Input
            label="Email"
            name="customerEmail"
            type="email"
            placeholder="juan@example.com"
            value={formData.customerEmail}
            onChange={handleChange}
            error={errors.customerEmail}
            required
          />
          
          <Input
            label="Full Name"
            name="customerFullName"
            placeholder="Juan Pérez"
            value={formData.customerFullName}
            onChange={handleChange}
            error={errors.customerFullName}
            required
          />
          
          <Input
            label="Phone"
            name="customerPhone"
            type="tel"
            placeholder="3001234567"
            value={formData.customerPhone}
            onChange={handleChange}
            error={errors.customerPhone}
            required
          />
        </div>
      </Card>

      {/* Card Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          2. Payment Information
        </h3>
        
        <div className="space-y-4">
          {/* Card Number with Brand Logo */}
          <div className="relative">
            <Input
              label="Card Number"
              name="cardNumber"
              placeholder="4242 4242 4242 4242"
              value={formData.cardNumber}
              onChange={handleChange}
              error={errors.cardNumber}
              required
              maxLength={19}
            />
            
            {/* Card Brand Logo */}
            {cardBrand && (
              <div className="absolute top-8 right-3">
                {cardBrand === 'VISA' && (
                  <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
                    VISA
                  </div>
                )}
                {cardBrand === 'MASTERCARD' && (
                  <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                    MC
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Month"
              name="cardExpMonth"
              placeholder="MM"
              value={formData.cardExpMonth}
              onChange={handleChange}
              error={errors.cardExpMonth}
              required
              maxLength={2}
            />
            
            <Input
              label="Year"
              name="cardExpYear"
              placeholder="YY"
              value={formData.cardExpYear}
              onChange={handleChange}
              error={errors.cardExpYear}
              required
              maxLength={2}
            />
            
            <Input
              label="CVC"
              name="cardCvc"
              placeholder="123"
              value={formData.cardCvc}
              onChange={handleChange}
              error={errors.cardCvc}
              required
              maxLength={4}
            />
          </div>
          
          <Input
            label="Card Holder"
            name="cardHolder"
            placeholder="JUAN PEREZ"
            value={formData.cardHolder}
            onChange={handleChange}
            error={errors.cardHolder}
            required
          />
        </div>
      </Card>

      {/* Delivery Information */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            3. Delivery Information
          </h3>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={autofillDelivery}
          >
            Same as customer
          </Button>
        </div>
        
        <div className="space-y-4">
          <Input
            label="Full Name"
            name="deliveryFullName"
            placeholder="Juan Pérez"
            value={formData.deliveryFullName}
            onChange={handleChange}
            error={errors.deliveryFullName}
            required
          />
          
          <Input
            label="Phone"
            name="deliveryPhone"
            type="tel"
            placeholder="3001234567"
            value={formData.deliveryPhone}
            onChange={handleChange}
            error={errors.deliveryPhone}
            required
          />
          
          <Input
            label="Address"
            name="deliveryAddress"
            placeholder="Calle 123 #45-67 Apto 501"
            value={formData.deliveryAddress}
            onChange={handleChange}
            error={errors.deliveryAddress}
            required
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City"
              name="deliveryCity"
              placeholder="Medellín"
              value={formData.deliveryCity}
              onChange={handleChange}
              error={errors.deliveryCity}
              required
            />
            
            <Input
              label="State"
              name="deliveryState"
              placeholder="Antioquia"
              value={formData.deliveryState}
              onChange={handleChange}
              error={errors.deliveryState}
              required
            />
          </div>
          
          <Input
            label="Postal Code"
            name="deliveryPostalCode"
            placeholder="050001"
            value={formData.deliveryPostalCode}
            onChange={handleChange}
            error={errors.deliveryPostalCode}
          />
        </div>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/')}
          className="flex-1"
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          loading={loading}
          className="flex-1"
        >
          Continue to Summary
        </Button>
      </div>
    </form>
  );
};

export default CheckoutForm;