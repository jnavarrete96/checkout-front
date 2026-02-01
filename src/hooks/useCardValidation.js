/**
 * useCardValidation Hook
 * Detecta tipo de tarjeta (VISA/MasterCard) y valida formato
 */

import { useMemo } from 'react';

const useCardValidation = (cardNumber) => {
  const cleaned = cardNumber.replaceAll(/\s/g, '');

  const cardBrand = useMemo(() => {
    if (/^4/.test(cleaned)) return 'VISA';
    if (/^5[1-5]/.test(cleaned)) return 'MASTERCARD';
    return null;
  }, [cleaned]);

  const isValid = useMemo(() => {
    return cleaned.length === 16 && /^\d+$/.test(cleaned);
  }, [cleaned]);

  // Formatear número con espacios cada 4 dígitos
  const formatCardNumber = (value) => {
    const cleaned = value.replaceAll(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  return {
    cardBrand,
    isValid,
    formatCardNumber,
  };
};

export default useCardValidation;