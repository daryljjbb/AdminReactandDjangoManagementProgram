import api from "./axios";

/**
 * Fetch all invoices from the backend
 * @returns {Promise<Array>}
 */
export const fetchInvoices = async () => {
  const response = await api.get("invoices/");
  return response.data;
};

export const fetchInvoiceById = async (id) => {
  const response = await api.get(`invoices/${id}/`);
  return response.data;
};


export const createInvoice = async (payload) => {
  const response = await api.post("invoices/", payload);
  return response.data;
};


/**
 * Update invoice status
 * @param {number} id
 * @param {string} status
 */
export const updateInvoicStatus = async (id, status) => {
  const response = await api.patch(`invoices/${id}/`, { status });
  return response.data;
};

/**
 * Delete an invoice by ID
 * @param {number} id
 */
export const deleteInvoice = async (id) => {
  await api.delete(`invoices/${id}/`);
};
