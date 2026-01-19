import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

/**
 * ReusableForm Component with Validation
 *
 * Props:
 * - fields: array of field definitions (name, label, type, required, choices, readOnly, etc.)
 * - initialData: the current form state (object with key/value pairs)
 * - setFormData: function from parent to update form state
 * - onSubmit: callback when the form is submitted
 *
 * Features:
 * - Controlled inputs (parent owns state)
 * - Required field validation
 * - Error messages shown under inputs
 */
const ReusableForm = ({ fields, initialData, setFormData, onSubmit }) => {
  const [errors, setErrors] = useState({}); // track validation errors

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing/selecting
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate all fields before submit
  const validateForm = () => {
    let newErrors = {};
    fields.forEach((field) => {
      if (field.required && !initialData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true if no errors
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(initialData);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <Form.Group className="mb-3" controlId={field.name} key={field.name}>
          <Form.Label>{field.label}</Form.Label>

          {field.type === "select" ? (
            <Form.Select
              name={field.name}
              value={initialData[field.name] || ""}
              onChange={handleChange}
              disabled={field.readOnly || false}
              isInvalid={!!errors[field.name]} // Bootstrap invalid styling
            >
              <option value="">Select {field.label}</option>
              {field.choices?.map((choice) => (
                <option key={choice.value} value={choice.value}>
                  {choice.label}
                </option>
              ))}
            </Form.Select>
          ) : (
            <Form.Control
              type={field.type || "text"}
              name={field.name}
              value={initialData[field.name] || ""}
              onChange={handleChange}
              readOnly={field.readOnly || false}
              isInvalid={!!errors[field.name]} // Bootstrap invalid styling
            />
          )}

          {/* Validation message */}
          <Form.Control.Feedback type="invalid">
            {errors[field.name]}
          </Form.Control.Feedback>
        </Form.Group>
      ))}

      <Button type="submit" variant="primary">
        Save
      </Button>
    </Form>
  );
};

export default ReusableForm;
