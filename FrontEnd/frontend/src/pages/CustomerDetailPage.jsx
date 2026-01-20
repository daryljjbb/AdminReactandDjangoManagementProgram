import { useParams } from "react-router-dom";
import useCustomers from "../hooks/useCustomers";
import usePolicies from "../hooks/usePolicies";
import useInvoices from "../hooks/useInvoices";
import usePayments from "../hooks/usePayments";
import useAuth from "../hooks/useAuth";

import ReusableTabs from "../components/ReusableTabs";
import CreatePolicyModal from "../components/CreatePolicyModal";
import CreateInvoiceModal from "../components/CreateInvoiceModal";
import CreatePaymentModal from "../components/CreatePaymentModal";
import PaymentHistoryModal from "../components/PaymentHistoryModal";

import { useState } from "react";
import { Spinner, Alert, Button, Accordion, Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const CustomerDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated, isAdmin } = useAuth();

  // -----------------------------
  // LOAD CUSTOMER
  // -----------------------------
  const { customer, loading, error } = useCustomers(isAuthenticated, id);

  // -----------------------------
  // LOAD POLICIES
  // -----------------------------
  const {
    policies,
    addPolicy,
    loadingPolicies,
    removePolicy,
  } = usePolicies(isAuthenticated, null, id);

  // -----------------------------
  // LOAD INVOICES
  // -----------------------------
  const {
    invoices,
    addInvoice,
    loadingInvoices,
    removeInvoice,
    reloadInvoices,
  } = useInvoices(isAuthenticated, null, id);

  // -----------------------------
  // PAYMENT STATE + HOOK
  // -----------------------------
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);

  const {
    payments,
    addPayment,
    reloadPayments,
  } = usePayments(isAuthenticated, selectedInvoice?.id);

  // -----------------------------
  // POLICY MODAL STATE
  // -----------------------------
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  // -----------------------------
  // INVOICE MODAL STATE
  // -----------------------------
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  // -----------------------------
  // POLICY TAB
  // -----------------------------
  const PolicyContent = () => (
    <div>
      <Button onClick={() => setShowPolicyModal(true)}>Add Policy</Button>
      <hr />

      {policies.length === 0 && !loadingPolicies ? (
        <p className="text-muted">No policies found.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Policy Number</th>
              <th>Policy Type</th>
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
      )}
    </div>
  );

  // -----------------------------
  // INVOICE TAB
  // -----------------------------
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
            const policyInvoices = invoices.filter(
              (inv) => inv.policy === pol.id
            );

            return (
              <Accordion.Item eventKey={String(pol.id)} key={pol.id}>
                <Accordion.Header>
                  <div className="d-flex justify-content-between align-items-center w-100 me-3">
                    <span>
                      {pol.policy_type.toUpperCase()} — Policy #
                      {pol.policy_number}
                    </span>

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPolicy(pol);
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
                          <th>Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {policyInvoices.map((inv) => (
                          <tr key={inv.id}>
                            <td>{inv.invoice_number}</td>
                            <td>${inv.total_amount}</td>
                            <td>
                              <span
                                className={`badge bg-${
                                  inv.status === "paid"
                                    ? "success"
                                    : "warning"
                                }`}
                              >
                                {inv.status}
                              </span>
                            </td>
                            <td>{inv.due_date}</td>

                            <td className="d-flex gap-2">
                              <Button
                                size="sm"
                                variant="outline-success"
                                onClick={() => {
                                  setSelectedInvoice(inv);
                                  setShowPaymentModal(true);
                                }}
                              >
                                + Payment
                              </Button>

                              <Button
                                size="sm"
                                variant="outline-info"
                                onClick={() => {
                                  setSelectedInvoice(inv);
                                  setShowPaymentHistory(true);
                                }}
                              >
                                View Payments
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p className="text-muted small">
                      No invoices found for this policy.
                    </p>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>
      )}
    </div>
  );

  // -----------------------------
  // APPOINTMENT TAB
  // -----------------------------
  const AppointmentContent = () => (
    <div className="p-3 bg-light rounded">
      <h3 className="text-warning mb-2">Appointments</h3>
      <p>Coming Soon: Schedule and view appointments with this customer.</p>
    </div>
  );

  // -----------------------------
  // TAB CONFIG
  // -----------------------------
  const TABS_DATA = [
    { eventKey: "policies", title: "Policies", content: <PolicyContent /> },
    { eventKey: "invoices", title: "Invoices", content: <InvoiceContent /> },
    { eventKey: "appointments", title: "Appointments", content: <AppointmentContent /> },
  ];

  // -----------------------------
  // PAGE LOADING STATES
  // -----------------------------
  if (loading) return <Spinner animation="border" className="m-5" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!customer) return <p>No customer data found.</p>;

  return (
    <div className="container mt-4">
      <Button variant="secondary" href="/customers" className="mb-3">
        Back to List
      </Button>

      <div className="card p-4 shadow-sm">
        <h2>Customer Details</h2>
        <hr />
        <p><strong>ID:</strong> {customer.id}</p>
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Phone:</strong> {customer.phone || "N/A"}</p>
      </div>

      <br />
      <ReusableTabs tabs={TABS_DATA} />

      {/* POLICY MODAL */}
      <CreatePolicyModal
        show={showPolicyModal}
        onHide={() => setShowPolicyModal(false)}
        onSubmit={(policyData) =>
          addPolicy({ ...policyData, customer: id })
        }
      />

      {/* INVOICE MODAL */}
      <CreateInvoiceModal
        show={showInvoiceModal}
        onHide={() => {
          setShowInvoiceModal(false);
          setSelectedPolicy(null);
        }}
        policy={selectedPolicy}
        onSubmit={async (invoiceData) => {
          await addInvoice({ ...invoiceData, policy: selectedPolicy?.id });
          await reloadInvoices();
        }}
      />

      {/* PAYMENT MODAL */}
      <CreatePaymentModal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        invoice={selectedInvoice}
        onSubmit={async (paymentData) => {
          await addPayment(paymentData);
          await reloadPayments();
          await reloadInvoices(); // refresh invoice totals
        }}
      />

      {/* PAYMENT HISTORY MODAL */}
      <PaymentHistoryModal
        show={showPaymentHistory}
        onHide={() => setShowPaymentHistory(false)}
        invoice={selectedInvoice}
        payments={payments}
      />
    </div>
  );
};

export default CustomerDetailPage;
