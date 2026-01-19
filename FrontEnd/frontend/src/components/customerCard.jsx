import { deleteCustomer } from "../api/customers";
import { useState } from "react";
import useAuth from "../hooks/useAuth";

const CustomerCard = ({ customer, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

   const { isAdmin, loading } = useAuth();

  const handleDelete = () => {
  onDelete(customer.id);
};


if (loading) return null;

  return (
    <div className="card p-3 mb-2">
      <strong>Name: {customer.name}</strong>
      <div>Email: {customer.email}</div>

      { isAdmin ? (
        <button
        onClick={handleDelete}
        className="btn btn-danger btn-sm mt-2"
        disabled={deleting}
      >
        {deleting ? "Deleting..." : "Delete"}
      </button>
      ) : (
          <span className="badge bg-secondary">View Only</span>
      )}
      

      {error && (
        <small className="text-danger d-block mt-1">
          {error}
        </small>
      )}
    </div>
  );
};

export default CustomerCard;