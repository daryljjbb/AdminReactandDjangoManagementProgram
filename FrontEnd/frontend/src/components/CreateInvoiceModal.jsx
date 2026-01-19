import ReusableForm from "./ReusableForm";
import { useState, useEffect} from "react";
import { toast } from "react-hot-toast";
import { useCallback } from "react";
import { Modal, Button, Form, Alert,Row, Col } from "react-bootstrap";

const CreateInvoiceModal = ({show, onHide, onSubmit, policy}) => {
  const initialData = {
    invoice_number: '',
    amount: policy?.premium_amount || '0.00', // auto-fill from policy
    agency_fee: '0.00',
    status: '',
    issue_date: '',
    due_date: '',
  };

  const [formData, setFormData] = useState(initialData);

    const fields = [
    { name: 'invoice_number', label: 'Invoice Number', type: 'text', required: true },
    { name: 'issue_date', label: 'Issue Date', type: 'date', required: true },
    { name: 'due_date', label: 'Due Date', type: 'date', required: true },
    { name: 'agency_fee', label: 'Agency Fee', type: 'number', required: true },
    { name: 'amount', label: 'Amount', type: 'number', required: true, readOnly: true },
        
    { 
        name: 'status', 
        label: 'Status', 
        type: 'select', 
        required: true,
        choices: [
            { value: 'unpaid', label: 'Unpaid' },
            { value: 'partial', label: 'Partial Paid' },
            { value: 'paid', label: 'Paid in Full' },
        ]
    },
    
  ];
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);

  // ✨ NEW: Wrapper function to handle the async flow
  const handleInternalSubmit = async (data) => {
    try {
      // 1. Run the actual addCustomer function from the hook
      await onSubmit(data); 
      
      // 2. If successful, close the modal using the prop from parent
      onHide(); 
      
      // 3. Reset the form for the next time it's opened
      setFormData(initialData); 
      
      toast.success("Policy added successfully!");
    } catch (err) {
      // Errors are likely handled by the hook/toast already, 
      // but the modal stays open so the user can see/fix errors.
      toast.error("Failed to add policy.");
    }
  };

  useEffect(() => {
  if (policy) {
    setFormData((prev) => ({
      ...prev,
      amount: policy.premium_amount,
    }));
  }
}, [policy, show]);

  

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
         <ReusableForm
          fields={fields}
          initialData={formData}
          setFormData={setFormData}
          onSubmit={handleInternalSubmit} // ✨ Use the wrapper here
      />
     </Modal.Body>
    </Modal>
    
  );
};

export default CreateInvoiceModal;