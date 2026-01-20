// api/payments.js
import api from "./axios";

// ✅ Added 'params' argument to handle search, page, and ordering
export const fetchPayments = async (params = {}) => {
  const response = await api.get("payments/", { params });
  return response.data; // This will now return { count, next, previous, results }
};

export const fetchPaymentById = async (id) => {
  const response = await api.get(`payments/${id}/`);
  return response.data;
};

export const createPayment = async (payload) => {
  const response = await api.post("payments/", payload);
  return response.data;
};

export const deletePayment = async (id) => {
  await api.delete(`payments/${id}/`);
};