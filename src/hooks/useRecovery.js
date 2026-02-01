/**
 * useRecovery Hook
 * Detecta y recupera automáticamente transacciones PENDING al iniciar la app
 */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { recoverCheckoutTransaction } from '../store/slices/checkoutSlice';

const useRecovery = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { transaction } = useSelector((state) => state.checkout);
  
  const [isRecovering, setIsRecovering] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  useEffect(() => {
    const attemptRecovery = async () => {
      // Solo intentar una vez
      if (hasAttempted) return;
      
      // No recuperar si ya hay una transacción en Redux
      if (transaction) {
        setHasAttempted(true);
        return;
      }

      // No recuperar si estamos en la página de resultado
      if (location.pathname === '/result') {
        setHasAttempted(true);
        return;
      }

      // Buscar datos guardados en localStorage
      const savedState = localStorage.getItem('checkout-state');
      
      if (!savedState) {
        setHasAttempted(true);
        return;
      }

      try {
        const parsed = JSON.parse(savedState);
        
        // Verificar si hay email de cliente
        if (!parsed.customerData?.email) {
          setHasAttempted(true);
          return;
        }

        console.log('🔄 Detecting incomplete transaction...');
        console.log('📧 Email found:', parsed.customerData.email);
        
        setIsRecovering(true);

        // Intentar recuperar transacción PENDING
        const result = await dispatch(recoverCheckoutTransaction(parsed.customerData.email));

        if (result.type.endsWith('/fulfilled')) {
          console.log('✅ Pending transaction recovered successfully');
          console.log('🔀 Redirecting to summary...');
          
          // Esperar un momento para que Redux se actualice
          setTimeout(() => {
            navigate('/summary', { replace: true });
          }, 100);
        } else {
          console.log('ℹ️ No pending transaction found - starting fresh');
          // Limpiar localStorage si no hay transacción pendiente
          localStorage.removeItem('checkout-state');
        }
      } catch (error) {
        console.error('❌ Recovery error:', error);
        // En caso de error, limpiar y continuar
        localStorage.removeItem('checkout-state');
      } finally {
        setIsRecovering(false);
        setHasAttempted(true);
      }
    };

    // Ejecutar solo al montar el componente
    attemptRecovery();
  }, [dispatch, navigate, location.pathname, transaction, hasAttempted]);

  return { isRecovering };
};

export default useRecovery;