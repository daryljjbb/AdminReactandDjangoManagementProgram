import ReusableForm from "./ReusableForm";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useCallback } from "react";
import { Modal, Button, Form, Alert,Row, Col } from "react-bootstrap";

const CreateUserModal = ({show, onHide, onSubmit }) => {
  const initialData = {
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip_code: '',
  };

  const [formData, setFormData] = useState(initialData);

    const fields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'text', required: true },
    { name: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
    { 
        name: 'gender', 
        label: 'Gender', 
        type: 'select', 
        required: true,
        choices: [
            { value: 'M', label: 'Male' },
            { value: 'F', label: 'Female' },
            { value: 'O', label: 'Other' },
        ]
    },
    { name: 'address1', label: 'Address Line 1', type: 'text', required: true },
    { name: 'address2', label: 'Address Line 2', type: 'text', required: false },
    { name: 'city', label: 'City', type: 'text', required: true },
    { name: 'state', label: 'State', type: 'text', required: true },
    { name: 'zip_code', label: 'Zip Code', type: 'text', required: true },
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
      
      toast.success("Customer added successfully!");
    } catch (err) {
      // Errors are likely handled by the hook/toast already, 
      // but the modal stays open so the user can see/fix errors.
      toast.error("Failed to add customer.");
    }
  };
  

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Customer</Modal.Title>
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

export default CreateUserModal;