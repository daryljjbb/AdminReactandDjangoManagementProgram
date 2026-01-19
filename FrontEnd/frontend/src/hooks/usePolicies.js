import { useEffect, useState, useCallback } from "react";
import { fetchPolicies, deletePolicy, createPolicy, fetchPolicyById } from "../api/policies";

// ✨ ADDED: customerId as an optional second parameter
const usePolicies = (isAuthenticated, policyId = null, customerId = null) => {
  const [policies, setPolicies] = useState([]);
  const [policy, setPolicy] = useState(null); // ✨ NEW: State for a single customer
  const [loadingPolicies, setLoadingPolicies] = useState(false);
  const [errorPolicies, setErrorPolicies] = useState("");

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
   const loadPolicies = useCallback(async () => {
    try {
      setLoadingPolicies(true);
      
      // ✨ UPDATE: Include customerId in the API params
      const data = await fetchPolicies({ 
        search: debouncedSearch, 
        page, 
        ordering,
        customer: customerId // This tells Django to filter by ?customer=1
      });

      setPolicies(data.results || data);
      setPagination({ count: data.count || 0, next: data.next, previous: data.previous });
    } catch (err) {
      setErrorPolicies("Failed to load policies");
    } finally {
      setLoadingPolicies(false);
    }
  }, [debouncedSearch, page, ordering, customerId]); // Add customerId to dependencies


  const removePolicy = async (id) => {
      if (!window.confirm("Are you sure you want to delete this policy?")) return;

      try {
        await deletePolicy(id);
        setPolicies(prev => prev.filter(pol => pol.id !== id));
      } catch (err) {
        alert("Failed to delete policy");
      }
    };


 const addPolicy = async (payload) => {
      try {
        await createPolicy(payload);
        await loadPolicies();
      } catch (err) {
        console.error("Create policies failed:", err);
        throw err;
      }
    };


  // 🔄 NEW: Function to load a SINGLE policy
  const loadSinglePolicy = useCallback(async () => {
    try {
      setLoadingPolicies(true);
      setErrorPolicies("");
      const data = await fetchPolicyById(policyId);
      setPolicy(data);
    } catch (err) {
      setErrorPolicies("Policy not found");
    } finally {
      setLoadingPolicies(false);
    }
  }, [policyId]);

  // 🚀 Trigger correct load logic
  useEffect(() => {
    if (isAuthenticated) {
      if (policyId) {
        loadSinglePolicy(); // Fetch one if ID exists
      } else {
        loadPolicies();    // Otherwise fetch the list
      }
    }
  }, [isAuthenticated, policyId, loadPolicies, loadSinglePolicy]);

   return {
    policies,
    policy,
    loadingPolicies,
    errorPolicies,
    search,
    setSearch,
    ordering,
    setOrdering,
    page,
    setPage,
    pagination,
    reload: policyId ? loadSinglePolicy : loadPolicies,
    removePolicy, // ✅ Use the function name, NOT the placeholder comment
    addPolicy,    // ✅ Use the function name, NOT the placeholder comment
  };
};

export default usePolicies;