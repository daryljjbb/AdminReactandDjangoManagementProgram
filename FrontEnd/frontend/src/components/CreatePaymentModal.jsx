// CreatePaymentModal.jsx
//
// PURPOSE:
// --------
// A simple, reliable modal for adding a payment to an invoice.
// It receives:
//   - invoice (fresh from useInvoice)
//   - onSubmit (parent handler that adds payment + refreshes invoice + refreshes payments)
//   - show / onHide (modal control)
//
// This modal NEVER loads data itself. It only displays invoice totals
// and collects payment form data.

import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import ReusableForm from "./ReusableForm";

const CreatePaymentModal = ({ show, onHide, onSubmit, invoice }) => {
  const initialData = {
    payment_date: "",
    amount: "",
    method: "",
    note: "",
  };

  const [formData, setFormData] = useState(initialData);

  // Reset form when invoice changes or modal opens
  useEffect(() => {
    if (show) {
      setFormData(initialData);
    }
  }, [show, invoice]);

  if (!invoice) return null; // Safety check

  const remaining =
    Number(invoice.total_amount || 0) -
    Number(invoice.total_paid || 0);

  const fields = [
    { name: "payment_date", label: "Payment Date", type: "date", required: true },
    { name: "amount", label: "Payment Amount", type: "number", required: true },
    {
      name: "method",
      label: "Payment Method",
      type: "select",
      required: true,
      choices: [
        { value: "Cash", label: "Cash" },
        { value: "Credit Card", label: "Credit Card" },
        { value: "Debit Card", label: "Debit Card" },
        { value: "Bank Transfer", label: "Bank Transfer" },
        { value: "Check", label: "Check" },
      ],
    },
    { name: "note", label: "Note", type: "text", required: false },
  ];

  const handleSubmit = async (data) => {
  if (Number(data.amount) <= 0) {
    toast.error("Payment amount must be greater than zero.");
    return;
  }

  if (Number(data.amount) > remaining) {
    toast.error("Payment cannot exceed the remaining balance.");
    return;
  }

  await onSubmit({
    ...data,
    invoice: invoice.id,
    payment_date: data.payment_date || new Date().toISOString().slice(0, 10),
  });

  onHide();
};


  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add Payment</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p><strong>Total Amount:</strong> ${invoice.total_amount}</p>
        <p><strong>Total Paid:</strong> ${invoice.total_paid}</p>
        <p><strong>Remaining:</strong> ${remaining.toFixed(2)}</p>

        <ReusableForm
          fields={fields}
          initialData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
        />
      </Modal.Body>
    </Modal>
  );
};

export default CreatePaymentModal;
