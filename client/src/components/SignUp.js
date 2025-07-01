import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import './AuthForms.css';

const SignUp = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validationSchema = yup.object({
    name: yup.string().required('Full name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase, one lowercase, one number and one special character'
      )
      .required('Password is required'),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
    position: yup.string().required('Position is required')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      position: 'receptionist'
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch('/staff/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
            position: values.position
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Signup failed');
        }

        setSuccess(true);
        setTimeout(() => navigate('/staff/login'), 2000);
      } catch (err) {
        setError(err.message);
      }
    },
  });

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <h2>Create Staff Account</h2>
        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            Account created successfully! Redirecting to login...
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="validation-error">{formik.errors.name}</div>
            )}
          </div>

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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className="validation-error">{formik.errors.confirmPassword}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="position">Position</label>
            <select
              id="position"
              name="position"
              value={formik.values.position}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="receptionist">Receptionist</option>
              <option value="manager">Manager</option>
              <option value="housekeeping">Housekeeping</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <a href="/staff/login">Log in</a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;