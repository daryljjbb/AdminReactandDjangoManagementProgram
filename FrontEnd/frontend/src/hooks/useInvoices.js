import { useEffect, useState, useCallback } from "react";
import { fetchInvoices, deleteInvoice, createInvoice, fetchInvoiceById } from "../api/invoices";

// ✨ ADDED: policyId as an optional second parameter
const useInvoices = (isAuthenticated, invoiceId = null, policyId = null) => {
  const [invoices, setInvoices] = useState([]);
  const [invoice, setInvoice] = useState(null); // ✨ NEW: State for a single customer
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [errorInvoices, setErrorInvoices] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [ordering, setOrdering] = useState("name");
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // 🔄 Function to load the LIST
   const loadInvoices = useCallback(async () => {
    try {
      setLoadingInvoices(true);
      
      // ✨ UPDATE: Include policyId in the API params
      const data = await fetchInvoices({ 
        search: debouncedSearch, 
        page, 
        ordering,
        policy: policyId // This tells Django to filter by ?policyid=1
      });

      setInvoices(data.results || data);
      setPagination({ count: data.count || 0, next: data.next, previous: data.previous });
    } catch (err) {
      setErrorInvoices("Failed to load invoices");
    } finally {
      setLoadingInvoices(false);
    }
  }, [debouncedSearch, page, ordering, policyId]); // Add policyId to dependencies


  const removeInvoice = async (id) => {
      if (!window.confirm("Are you sure you want to delete this invoice?")) return;

      try {
        await deleteInvoice(id);
        setInvoices(prev => prev.filter(inv => inv.id !== id));
      } catch (err) {
        alert("Failed to delete invoice");
      }
    };


// Inside useInvoices.js
const addInvoice = async (payload) => {
  try {
    await createInvoice(payload);
    await loadInvoices(); // ✨ This triggers the GET /api/invoices/ again
  } catch (err) {
    console.error("Create invoice failed:", err);
    throw err;
  }
};


  // 🔄 NEW: Function to load a SINGLE policy
  const loadSingleInvoice = useCallback(async () => {
    try {
      setLoadingInvoices(true);
      setErrorInvoices("");
      const data = await fetchInvoiceById(invoiceId);
      setInvoice(data);
    } catch (err) {
      setErrorInvoices("Invoice not found");
    } finally {
      setLoadingInvoices(false);
    }
  }, [invoiceId]);

  // 🚀 Trigger correct load logic
  useEffect(() => {
    if (isAuthenticated) {
      if (invoiceId) {
        loadSingleInvoice(); // Fetch one if ID exists
      } else {
        loadInvoices();    // Otherwise fetch the list
      }
    }
  }, [isAuthenticated, invoiceId, loadInvoices, loadSingleInvoice]);

   return {
    invoices,
    invoice,
    loadingInvoices,
    errorInvoices,
    search,
    setSearch,
    ordering,
    setOrdering,
    page,
    setPage,
    pagination,
    reload: invoiceId ? loadSingleInvoice : loadInvoices,
    removeInvoice, // ✅ Use the function name, NOT the placeholder comment
    addInvoice,    // ✅ Use the function name, NOT the placeholder comment
  };
};

export default useInvoices;