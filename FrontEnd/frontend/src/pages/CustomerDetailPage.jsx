import { useParams } from "react-router-dom"; // ✨ Import useParams
import useCustomers from "../hooks/useCustomers";
import useInvoices from "../hooks/useInvoices";
import usePolicies from "../hooks/usePolicies";
import useAuth from "../hooks/useAuth"; // Assuming you need isAuthenticated
import ReusableTabs from "../components/ReusableTabs";
import CreateInvoiceModal from "../components/CreateInvoiceModal";
import CreatePolicyModal from "../components/CreatePolicyModal";
import { useState } from "react";
import { Spinner, Alert, Button, Accordion } from "react-bootstrap";
import { Table, Form, Pagination} from "react-bootstrap";
import { Link } from 'react-router-dom';

const CustomerDetailPage = () => {
  const { id } = useParams(); // ✨ Get the ID from the URL (/customers/5)
  const { isAuthenticated } = useAuth();
  const { isAdmin } = useAuth();

   const [showModal, setShowModal] = useState(false);
   

  // Pass isAuthenticated and the ID to the hook
  const { customer, loading, error } = useCustomers(isAuthenticated, id);

   const { 
    policies, 
    addPolicy,
    loadingPolicies, 
    removePolicy   
  } = usePolicies(isAuthenticated, null, id); // We pass null for policyId, and 'id' for customerId

   // Content for the first tab
const PolicyContent = () => (
    <div>
        <Button onClick={() => setShowModal(true)}>Add Policy</Button>

      <hr />

      {policies.length === 0 && !loadingPolicies ? (
        <p className="text-muted">No policies found.</p>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Policy Number</th>
                <th> Policy Type</th>
                <th>Premium</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr key={policy.id}>
                  <td>{policy.policy_number}</td>
                  <td>{policy.policy_type}</td>
                  <td>{policy.premium_amount}</td>
                  <td>
                    <Link to={`/policies/${policy.id}`}>View</Link>
                    
                    {isAdmin && (
                      <>
                        <span className="mx-2 text-muted">|</span>
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => removePolicy(policy.id)}
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
          
        </>
      )}
    </div>
);

const { 
    invoices, 
    addInvoice,
    loadingInvoices, 
    removeInvoice   
  } = useInvoices(isAuthenticated, null, id); // We pass null for policyId, and 'id' for customerId

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // ✨ NEW: Add state to track the selected policy for the invoice
  const [selectedPolicy, setSelectedPolicy] = useState(null);



// Content for the second tab
const InvoiceContent = () => (
  <div className="p-3 bg-light rounded">
    <h3 className="text-success mb-2">Invoices</h3>

    {loadingInvoices ? (
      <Spinner animation="border" size="sm" />
    ) : policies.length === 0 ? (
      <p>No policies found, so no invoices can be created.</p>
    ) : (
      <Accordion>
        {policies.map((pol) => {
          // ✨ FIX 1: Filter the flat array to find invoices for THIS specific policy
          const policyInvoices = invoices.filter(inv => inv.policy === pol.id);

          return (
            <Accordion.Item eventKey={String(pol.id)} key={pol.id}>
              <Accordion.Header>
                <div className="d-flex justify-content-between align-items-center w-100 me-3">
                  <span>{pol.policy_type.toUpperCase()} — Policy #{pol.policy_number}</span>
                  
                  {/* ✨ FIX 2: Added e.stopPropagation() to prevent Accordion from toggling when clicking button */}
                  <Button 
                    size="sm" 
                    variant="primary"
                   onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPolicy(pol);   // store the whole policy object
                      setShowInvoiceModal(true);
                    }}

                  >
                    + Add Invoice
                  </Button>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                {policyInvoices.length > 0 ? (
                  <Table size="sm" striped bordered>
                    <thead>
                      <tr>
                        <th>Inv #</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {policyInvoices.map(inv => (
                        <tr key={inv.id}>
                          <td>{inv.invoice_number}</td>
                          <td>${inv.total_amount}</td>
                          <td>
                             <span className={`badge bg-${inv.status === 'paid' ? 'success' : 'warning'}`}>
                                {inv.status}
                             </span>
                          </td>
                          <td>{inv.due_date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p className="text-muted small">No invoices found for this policy.</p>
                )}
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>
    )}
  </div>
);


// Content for the third tab
const AppointmentContent = () => (
  <div className="p-3 bg-light rounded">
    <h3 className="text-warning mb-2">Appointments</h3>
    <p>
        Coming Soon: Schedule and view appointments with this customer.
    </p>
  </div>
);


// --- 2. Define the Tab Data Configuration ---

// This array is the only data needed to render the entire tab structure.
const TABS_DATA = [
  { 
    eventKey: 'policies', 
    title: 'Policies', 
    content: <PolicyContent /> // Pass the content component here
  },
  { 
    eventKey: 'invoices', 
    title: 'Invoices', 
    content: <InvoiceContent /> 
  },
  { 
    eventKey: 'appointments', 
    title: 'Appointments', 
    content: <AppointmentContent />,
  },
];


  if (loading) return <Spinner animation="border" className="m-5" />;
  
  if (error) return <Alert variant="danger" className="m-5">{error}</Alert>;

  if (!customer) return <p className="m-5">No customer data found.</p>;

  return (
    <div className="container mt-4">
      <Button variant="secondary" href="/customers" className="mb-3">Back to List</Button>
      <div className="card p-4 shadow-sm">
        <h2>Customer Details</h2>
        <hr />
        <p><strong>ID:</strong> {customer.id}</p>
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Phone:</strong> {customer.phone || "N/A"}</p>
        {/* Add more fields as necessary */}
      </div>
      <br />
            <ReusableTabs tabs={TABS_DATA} />
             <CreatePolicyModal
                show={showModal}
                onHide={() => setShowModal(false)}
                // ✨ THE FIX: Inject the customer ID into the payload here
                onSubmit={(policyData) => addPolicy({ ...policyData, customer: id })}
            />
            {/* ✨ FIX: Invoice Modal now uses selectedPolicyId */}
            <CreateInvoiceModal
              show={showInvoiceModal}
              onHide={() => {
                setShowInvoiceModal(false);
                setSelectedPolicy(null);
              }}
              policy={selectedPolicy}   // 👈 NEW
              onSubmit={(invoiceData) =>
                addInvoice({ ...invoiceData, policy: selectedPolicy?.id })
              }
            />

    </div>
  );
};

export default CustomerDetailPage;