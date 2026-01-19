import useCustomers from "../hooks/useCustomers";
import useAuth from "../hooks/useAuth";
import ReusableSearchForm from "../components/ReusableSearchForm";
import CreateUserModal from "../components/CreateUserModal";
import { Button, Table, Form, Pagination, Spinner } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { useState } from "react";

const Customers = () => {
  // ✅ 1. Destructure everything needed from the hook
  const { 
    customers, 
    loading, 
    error,           // Added
    search, 
    setSearch, 
    ordering,        // Added
    setOrdering, 
    page, 
    setPage, 
    pagination,
    addCustomer,
    removeCustomer   // Added
  } = useCustomers(true);

  const { isAdmin } = useAuth();

  const [showModal, setShowModal] = useState(false);

  // ✅ 2. Calculate Total Pages for the Bootstrap Pagination
  const PAGE_SIZE = 5; 
  const totalPages = Math.ceil(pagination.count / PAGE_SIZE);

  // ✅ 3. Toggle ordering (asc/desc)
  const toggleOrdering = (field) => {
    if (ordering === field) {
      setOrdering(`-${field}`); // descending
    } else {
      setOrdering(field); // ascending
    }
    setPage(1); // Reset to page 1 when sort changes
  };

  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Customers</h2>
        {/* Optional: Show a spinner while the debounced search is fetching */}
        {loading && <Spinner animation="border" size="sm" variant="primary" />}
      </div>

      {/* ✅ 4. Search Form (Debounced) */}
      <ReusableSearchForm
        fields={[{ name: 'search', label: 'Search by name or email...', type: 'text', required: false }]}
        initialData={{ search: search }}
        // ✅ Ensure this is updating the search state immediately
        onChange={(name, value) => {
            console.log("Typing:", value); // Debug: Check if this shows in Console
            setSearch(value);
        }} 
        // Prevent the button from refreshing the whole page
        onSubmit={(e) => e.preventDefault()}
    />

    <Button onClick={() => setShowModal(true)}>Add Customer</Button>

      <hr />

      {customers.length === 0 && !loading ? (
        <p className="text-muted">No customers found.</p>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th 
                  onClick={() => toggleOrdering("name")} 
                  style={{ cursor: 'pointer' }}
                >
                  Name {ordering.includes("name") && (ordering.startsWith("-") ? " ↓" : " ↑")}
                </th>
                <th 
                  onClick={() => toggleOrdering("email")} 
                  style={{ cursor: 'pointer' }}
                >
                  Email {ordering.includes("email") && (ordering.startsWith("-") ? " ↓" : " ↑")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>
                    <Link to={`/customers/${customer.id}`}>View</Link>
                    
                    {isAdmin && (
                      <>
                        <span className="mx-2 text-muted">|</span>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => removeCustomer(customer.id)}
                        >
                          Remove
                        </Button>
                      </>
                    )}
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </Table>

          {/* ✅ 5. Bootstrap Pagination Controls */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev 
                  disabled={!pagination.previous} 
                  onClick={() => setPage(page - 1)} 
                />
                
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === page}
                    onClick={() => setPage(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}

                <Pagination.Next 
                  disabled={!pagination.next} 
                  onClick={() => setPage(page + 1)} 
                />
              </Pagination>
            </div>
          )}
          <div className="text-center text-muted small">
            Total results: {pagination.count}
          </div>
          
        </>
      )}
      <CreateUserModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={addCustomer}
      />
    </div>
  );
};

export default Customers;