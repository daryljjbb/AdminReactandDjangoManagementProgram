import { useState, useEffect } from "react";
import api from "../api/axios";

const usePayments = (isAuthenticated, invoiceId) => {
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  const fetchPayments = async () => {
    if (!invoiceId) {
      setPayments([]);
      return;
    }

  const response = await api.get("payments/", {
  params: {
    invoice: invoiceId,
    page_size: 100,   // ← THIS FIXES EVERYTHING
  },
});


    // FIX: DRF returns { count, next, previous, results }
    setPayments(response.data.results || []);
    setLoadingPayments(false);
  };

  const addPayment = async (payload) => {
    const response = await api.post("payments/", payload);
    return response.data;
  };

  const reloadPayments = async () => {
    await fetchPayments();
  };

  useEffect(() => {
    fetchPayments();
  }, [invoiceId]);

  return {
    payments,
    loadingPayments,
    addPayment,
    reloadPayments,
  };
};

export default usePayments;
