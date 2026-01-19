import { useState } from "react";

const CustomerForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  /**
   * Handle input changes
   */
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * Client-side validation
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = "Name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    }

    return newErrors;
  };

  /**
   * Submit handler
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      setErrors({});


      // ✅ THIS is where await belongs
      await onSubmit({
        ...formData,
        total: Number(formData.total),
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
      });


    } catch (err) {
      console.error("Create customer failed:", err);

      // Django validation errors come back as an object
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ general: "Failed to create invoice" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 mb-3">
      <h4>Create Customer</h4>

      {errors.general && (
        <div className="alert alert-danger">{errors.general}</div>
      )}

      <div className="mb-2">
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="form-control"
        />
        {errors.customer && (
          <small className="text-danger">{errors.name}</small>
        )}
      </div>

      <div className="mb-2">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-control"
        />
        {errors.email && (
          <small className="text-danger">{errors.email}</small>
        )}
      </div>

    
      <button
        className="btn btn-primary"
        disabled={submitting}
      >
        {submitting ? "Creating..." : "Create Customer"}
      </button>
    </form>
  );

};

export default CustomerForm;
