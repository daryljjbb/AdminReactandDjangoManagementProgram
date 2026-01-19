import ReusableForm from "./ReusableForm";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useCallback } from "react";
import { Modal, Button, Form, Alert,Row, Col } from "react-bootstrap";

const CreatePolicyModal = ({show, onHide, onSubmit }) => {
  const initialData = {
    policy_number: '',
    policy_type: '',
    effective_date: '',
    expiration_date: '',
    premium_amount: '0.00',
  };

  const [formData, setFormData] = useState(initialData);

    const fields = [
    { name: 'policy_number', label: 'Policy Number', type: 'text', required: true },
    { 
        name: 'policy_type', 
        label: 'Policy Type', 
        type: 'select', 
        required: true,
        choices: [
            { value: 'auto', label: 'Auto' },
            { value: 'home', label: 'Home' },
            { value: 'life', label: 'Life' },
        ]
    },
    { name: 'effective_date', label: 'Effective Date', type: 'date', required: true },
    { name: 'expiration_date', label: 'Expiration Date', type: 'date', required: true },
    { name: 'premium_amount', label: 'Premium', type: 'number', required: true },
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
  

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Policy</Modal.Title>
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

export default CreatePolicyModal;