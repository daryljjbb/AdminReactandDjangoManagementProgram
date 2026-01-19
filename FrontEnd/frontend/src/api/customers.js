// api/customers.js
import api from "./axios";

// ✅ Added 'params' argument to handle search, page, and ordering
export const fetchCustomers = async (params = {}) => {
  const response = await api.get("customers/", { params });
  return response.data; // This will now return { count, next, previous, results }
};

export const fetchCustomerById = async (id) => {
  const response = await api.get(`customers/${id}/`);
  return response.data;
};

export const createCustomer = async (payload) => {
  const response = await api.post("customers/", payload);
  return response.data;
};

export const deleteCustomer = async (id) => {
  await api.delete(`customers/${id}/`);
};