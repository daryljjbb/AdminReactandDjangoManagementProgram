// hooks/useInvoice.js
//
// PURPOSE:
// --------
// This hook is responsible for loading *one specific invoice*,
// including its up‑to‑date totals (total_amount, total_paid, remaining).
//
// WHY THIS EXISTS:
// ----------------
// - useInvoices.js loads the *list* of invoices for a customer.
//   That list does NOT automatically refresh after payments are added.
//
// - useInvoice.js loads the *single invoice* you are viewing in a modal.
//   This ensures the modal always shows the latest totals.
//
// - This separation prevents stale invoice data and fixes the issue
//   where the payment table and header totals didn’t match.
//

import { useState, useEffect } from "react";
import { fetchInvoiceById } from "../api/invoices";

export default function useInvoice(invoiceId) {
  // Holds the single invoice object (fresh from backend)
  const [invoice, setInvoice] = useState(null);

  // Fetch the invoice from the backend
  const loadInvoice = async () => {
    if (!invoiceId) return null;
    const data = await fetchInvoiceById(invoiceId);
    setInvoice(data);
    return data; // allows parent components to update selectedInvoice
  };

  // Load invoice whenever invoiceId changes
  useEffect(() => {
    loadInvoice();
  }, [invoiceId]);

  return {
    invoice,          // the single invoice object
    reloadInvoice: loadInvoice, // allows parent to manually refresh after payment
  };
}
