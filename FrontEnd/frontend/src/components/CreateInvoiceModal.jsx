import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-hot-toast";
import ReusableForm from "./ReusableForm";

const CreateInvoiceModal = ({ show, onHide, onSubmit, policy }) => {
  // Hooks MUST come first — always.
  const today = new Date().toISOString().slice(0, 10);

  const initialData = {
    amount: policy?.premium_amount || 0,
    agency_fee: 0.0,
    total_amount: policy?.premium_amount || 0,
    issue_date: today,
    due_date: "",
  };

  const [formData, setFormData] = useState(initialData);

 useEffect(() => {
  const base = Number(formData.amount) || 0;
  const fee = Number(formData.agency_fee) || 0;

  setFormData(prev => ({
    ...prev,
    total_amount: base + fee,
  }));
}, [formData.agency_fee, formData.amount]);



  useEffect(() => {
    if (show && policy) {
      setFormData({
        amount: policy.premium_amount || 0,
        agency_fee: 0.0,
        total_amount: policy.premium_amount || 0,
        issue_date: today,
        due_date: "",
      });
    }
  }, [show, policy]);

  // After hooks, NOW we can safely early-return
  if (!policy) return null;

  const fields = [
    {
      name: "amount",
      label: "Base Amount",
      type: "number",
      required: true,
      readOnly: true,
    },
    {
      name: "agency_fee",
      label: "Agency Fee",
      type: "number",
      required: true,
    },
    {
      name: "total_amount",
      label: "Total Amount",
      type: "number",
      required: true,
      readOnly: true,
    },
    {
      name: "issue_date",
      label: "Issue Date",
      type: "date",
      required: true,
    },
    {
      name: "due_date",
      label: "Due Date",
      type: "date",
      required: true,
    },
  ];

  const handleSubmit = async (data) => {
    const total = Number(data.amount) + Number(data.agency_fee);

    if (total <= 0) {
      toast.error("Total amount must be greater than zero.");
      return;
    }

    await onSubmit({
      ...data,
      total_amount: total,
      policy: policy.id,
    });

    onHide();
  };

  

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create Invoice</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          <strong>Policy:</strong> {policy.policy_type} — #{policy.policy_number}
        </p>

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

export default CreateInvoiceModal;
