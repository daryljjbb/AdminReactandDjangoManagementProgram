// hooks/useInvoices.js
import { useState, useEffect } from "react";
import { fetchInvoices, createInvoice, deleteInvoice } from "../api/invoices";

export default function useInvoices(customerId) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadInvoices = async () => {
    if (!customerId) return;
    setLoading(true);
    const data = await fetchInvoices({ customer: customerId });
    setInvoices(data.results || data);
    setLoading(false);
  };

  const addInvoice = async (payload) => {
    await createInvoice(payload);
    await loadInvoices(); // refresh list
  };

  const removeInvoice = async (id) => {
    await deleteInvoice(id);
    await loadInvoices(); // refresh list
  };

  useEffect(() => {
    loadInvoices();
  }, [customerId]);

  return {
    invoices,
    loading,
    addInvoice,
    removeInvoice,
    reloadInvoices: loadInvoices,
  };
}
