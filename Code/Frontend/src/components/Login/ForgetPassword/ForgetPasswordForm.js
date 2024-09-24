import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { forgetPassword } from '../../../api/authService';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a request to your backend to handle the forgot password flow
      const response = await forgetPassword(email);
      toast.success(response.message);
      localStorage.setItem('forgotPasswordEmail', email);
      navigate('/enter-verification-code');
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleFormSubmit}>
        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit">Get Verification Code</button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
