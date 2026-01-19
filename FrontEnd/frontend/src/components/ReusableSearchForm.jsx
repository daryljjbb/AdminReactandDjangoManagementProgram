import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

// The Form component is built to be configurable using props:
// - initialData: An object defining the starting values for the form fields.
// - fields: An array of objects that describes the structure of the form (what inputs to show).
// - onSubmit: The function from the parent component to call when the form is submitted successfully.
const ReusableSearchForm = ({ initialData, fields, onSubmit, onChange}) => {
  // State 1: Manages the data (values) of all the form inputs.
  // It is initialized with the 'initialData' object passed as a prop.
  const [formData, setFormData] = useState(initialData);

  // State 2: Manages any errors that might occur during validation.
  const [errors, setErrors] = useState({});

  // 1. Change Handler Function:
  // This runs every time a user types into any input field.
  const handleChange = (e) => {
    const { name, value } = e.target; // Destructure the input's 'name' and 'value'.
    
    // Update the 'formData' state:
    // We use the spread operator (...) to keep all existing data, and then
    // we use [name]: value to update only the specific field that changed.
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
    
    // Clear the error for this field as the user is actively fixing it.
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: '',
    }));
    if (onChange) {
    onChange(name, value); // 🔥 notify parent
  }
  };

  // 2. Simple Validation Logic:
  // Checks if all required fields have a value.
  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    // Loop through the 'fields' array passed in props.
    fields.forEach(field => {
      // Check if the field is marked as required AND its corresponding value in formData is empty.
      if (field.required && !formData[field.name].trim()) {
        tempErrors[field.name] = `${field.label} is required.`;
        isValid = false;
      }
    });

    setErrors(tempErrors); // Update the errors state.
    return isValid;        // Return whether validation passed or failed.
  };

  // 3. Submission Handler Function:
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default browser form submission (which causes a page reload).

    if (validate()) {
      // If validation passes, call the 'onSubmit' function passed from the parent,
      // providing it with the final form data.
      onSubmit(formData);
    } else {
      console.log('Validation failed. Check the errors state.');
    }
  };

  // 4. Component Structure (JSX):
  return (
    <Form onSubmit={handleSubmit} className="d-flex align-items-center mb-3">
      <Row className="w-100">
         {/* Dynamic Field Rendering: */}
      {/* Map through the 'fields' array to render the correct input for each configuration. */}
        {fields.map(field => (                 
          <Col xs={9} sm={10} key={field.name}> {/* Label for the input */}
            {/* Input Element: */}
            <Form.Control
              type={field.type || 'text'}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              placeholder={field.placeholder || `${field.label}`}
              isInvalid={!!errors[field.name]}
            />
            {/* Error Message Display: */}
            <Form.Control.Feedback type="invalid">
              {errors[field.name]}
            </Form.Control.Feedback>
          </Col>
        ))}
        <Col xs={3} sm={2}>
          <Button variant="primary" type="submit" className="w-100">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ReusableSearchForm;