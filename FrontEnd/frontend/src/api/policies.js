// api/policies.js
import api from "./axios";

// ✅ Added 'params' argument to handle search, page, and ordering
export const fetchPolicies = async (params = {}) => {
  const response = await api.get("policies/", { params });
  return response.data; // This will now return { count, next, previous, results }
};

export const fetchPolicyById = async (id) => {
  const response = await api.get(`policies/${id}/`);
  return response.data;
};

export const createPolicy = async (payload) => {
  const response = await api.post("policies/", payload);
  return response.data;
};

export const deletePolicy = async (id) => {
  await api.delete(`policies/${id}/`);
};