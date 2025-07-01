import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import './AuthForms.css';

const StaffLogin = ({ setStaff }) => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const validationSchema = yup.object({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch('/staff/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Login failed');
        }

        const staff = await response.json();
        setStaff(staff);
        navigate('/admin');
      } catch (err) {
        setError(err.message);
      }
    },
  });

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <h2>Staff Login</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="validation-error">{formik.errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="validation-error">{formik.errors.password}</div>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <a href="/staff/signup">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;