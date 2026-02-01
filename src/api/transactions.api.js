/**
 * Transactions API Service
 * 
 * Endpoints para transacciones y pagos
 */

import axios from './axios';

/**
 * POST /api/transactions
 * Crea una nueva transacción (checkout como invitado)
 */
export const createTransaction = async (data) => {
  const { data: response } = await axios.post('/transactions', data);
  return response;
};

/**
 * GET /api/transactions/:id
 * Obtiene el detalle completo de una transacción
 */
export const getTransaction = async (transactionId) => {
  const { data } = await axios.get(`/transactions/${transactionId}`);
  return data;
};

/**
 * GET /api/transactions/recover?email=xxx
 * Recupera una transacción PENDING por email
 */
export const recoverTransaction = async (email) => {
  const { data } = await axios.get('/transactions/recover', {
    params: { email },
  });
  return data;
};

/**
 * PATCH /api/transactions/:id/process-payment
 * Procesa el pago de una transacción usando Wompi
 */
export const processPayment = async (transactionId, cardData) => {
  const { data } = await axios.patch(
    `/transactions/${transactionId}/process-payment`,
    cardData
  );
  return data;
};

export default {
  createTransaction,
  getTransaction,
  recoverTransaction,
  processPayment,
};
