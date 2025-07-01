import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import './AddGuestForm.css';

const AddGuestForm = ({ onGuestAdded }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const validationSchema = yup.object({
    name: yup.string().required('Full name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    phone: yup.string().matches(/^[0-9]+$/, 'Phone should contain only numbers').required('Phone is required'),
    address: yup.string(),
    idType: yup.string().required('ID type is required'),
    idNumber: yup.string().required('ID number is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      idType: 'passport',
      idNumber: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setServerError(null);
      
      try {
        const response = await fetch('/guests', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error('Failed to add guest');
        }

        const newGuest = await response.json();
        onGuestAdded(newGuest);
        formik.resetForm();
      } catch (error) {
        setServerError(error.message);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="guest-form-container">
      <div className="guest-form-header">
        <h2>Add New Guest</h2>
        <p>Please fill in the guest details</p>
      </div>

      {serverError && (
        <div className="form-error-message">
          {serverError}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="guest-form">
        <div className="form-section">
          <h3 className="section-title">Personal Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name*</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-control"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="error-message">{formik.errors.name}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-control"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="error-message">{formik.errors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone*</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="form-control"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="error-message">{formik.errors.phone}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                className="form-control"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Identification</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="idType">ID Type*</label>
              <select
                id="idType"
                name="idType"
                className="form-control"
                value={formik.values.idType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="passport">Passport</option>
                <option value="driver_license">Driver's License</option>
                <option value="national_id">National ID</option>
                <option value="other">Other</option>
              </select>
              {formik.touched.idType && formik.errors.idType && (
                <div className="error-message">{formik.errors.idType}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="idNumber">ID Number*</label>
              <input
                id="idNumber"
                name="idNumber"
                type="text"
                className="form-control"
                value={formik.values.idNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.idNumber && formik.errors.idNumber && (
                <div className="error-message">{formik.errors.idNumber}</div>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={formik.resetForm}>
            Clear
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Guest'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGuestForm;