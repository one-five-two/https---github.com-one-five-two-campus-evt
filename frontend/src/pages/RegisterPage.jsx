import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../services/api';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validations, setValidations] = useState({
    fullName: true,
    email: true,
    password: true,
    studentId: true
  });

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength < 2) return 'weak';
    if (strength < 4) return 'medium';
    return 'strong';
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 'weak': return '#f44336';
      case 'medium': return '#ffa726';
      case 'strong': return '#4CAF50';
      default: return '#eee';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setValidations(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await auth.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        studentId: formData.studentId
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/events');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        return value.length >= 2;
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'password':
        return value.length >= 6;
      case 'studentId':
        return /^[0-9]{7,10}$/.test(value);
      default:
        return true;
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Create Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              autoComplete="name"
            />
            <div className={`validation-message ${validations.fullName ? 'valid' : 'invalid'}`}>
              {!validations.fullName && 'Please enter a valid full name'}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
            <div className={`validation-message ${validations.email ? 'valid' : 'invalid'}`}>
              {!validations.email && 'Please enter a valid email address'}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              autoComplete="new-password"
            />
            <div className={`validation-message ${validations.password ? 'valid' : 'invalid'}`}>
              {!validations.password && 'Password must be at least 6 characters long'}
            </div>
          </div>
          <div className="password-strength">
            <div>Password Strength: {formData.password ? checkPasswordStrength(formData.password) : ''}</div>
            <div className="password-strength-meter">
              <div 
                style={{ 
                  width: formData.password ? 
                    (checkPasswordStrength(formData.password) === 'weak' ? '33.33%' : 
                     checkPasswordStrength(formData.password) === 'medium' ? '66.66%' : '100%') : '0%',
                  backgroundColor: getPasswordStrengthColor(checkPasswordStrength(formData.password))
                }} 
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
            />
            <div className={`validation-message ${validations.confirmPassword ? 'valid' : 'invalid'}`}>
              {!validations.confirmPassword && 'Passwords do not match'}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="studentId">Student ID</label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="Enter your student ID"
              required
              autoComplete="off"
            />
            <div className={`validation-message ${validations.studentId ? 'valid' : 'invalid'}`}>
              {!validations.studentId && 'Please enter a valid student ID'}
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <div className="login-prompt">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 