import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/api';
import '../styles/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting registration form...');
      const formData = {
        fullName: e.target.fullName.value,
        email: e.target.email.value,
        password: e.target.password.value,
        studentId: e.target.studentId.value
      };
      console.log('Form data:', formData);

      const response = await auth.register(formData);
      console.log('Registration response:', response);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/events');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <input
          type="text"
          name="studentId"
          placeholder="Student ID"
          required
        />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default Register; 