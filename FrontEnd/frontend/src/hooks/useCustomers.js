import { useEffect, useState, useCallback } from "react";
import { fetchCustomers, deleteCustomer, createCustomer, fetchCustomerById } from "../api/customers";

// ✨ ADDED: customerId as an optional second parameter
const useCustomers = (isAuthenticated, customerId = null) => {
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState(null); // ✨ NEW: State for a single customer
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchCustomers({ search: debouncedSearch, page, ordering });
      setCustomers(data.results || data);
      setPagination({ count: data.count || 0, next: data.next, previous: data.previous });
    } catch (err) {
      setError("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, ordering]);


  const removeCustomer = async (id) => {
      if (!window.confirm("Are you sure you want to delete this customer?")) return;

      try {
        await deleteCustomer(id);
        setCustomers(prev => prev.filter(cust => cust.id !== id));
      } catch (err) {
        alert("Failed to delete customer");
      }
    };


 const addCustomer = async (payload) => {
      try {
        await createCustomer(payload);
        await loadCustomers();
      } catch (err) {
        console.error("Create invoice failed:", err);
        throw err;
      }
    };


  // 🔄 NEW: Function to load a SINGLE customer
  const loadSingleCustomer = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchCustomerById(customerId);
      setCustomer(data);
    } catch (err) {
      setError("Customer not found");
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  // 🚀 Trigger correct load logic
  useEffect(() => {
    if (isAuthenticated) {
      if (customerId) {
        loadSingleCustomer(); // Fetch one if ID exists
      } else {
        loadCustomers();    // Otherwise fetch the list
      }
    }
  }, [isAuthenticated, customerId, loadCustomers, loadSingleCustomer]);

   return {
    customers,
    customer,
    loading,
    error,
    search,
    setSearch,
    ordering,
    setOrdering,
    page,
    setPage,
    pagination,
    reload: customerId ? loadSingleCustomer : loadCustomers,
    removeCustomer, // ✅ Use the function name, NOT the placeholder comment
    addCustomer,    // ✅ Use the function name, NOT the placeholder comment
  };
};

export default useCustomers;
