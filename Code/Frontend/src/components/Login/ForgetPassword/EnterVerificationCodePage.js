import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyForgetPassword } from '../../../api/authService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EnterVerificationCodePage = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('forgotPasswordEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await verifyForgetPassword(email, verificationCode);
      // Assuming the backend responds with a reset token upon successful verification
      const resetToken = response.resetToken;
      if (resetToken) {
        // Store the reset token in local storage
        localStorage.setItem('resetToken', resetToken);
        toast.success("Code verified.")
        // Redirect to the password reset page
        navigate('/reset-password');
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div>
      <h2>Enter Verification Code</h2>
      <form onSubmit={handleFormSubmit}>
        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Enter verification code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} required />
        <button type="submit">Verify Code</button>
      </form>
    </div>
  );
};

export default EnterVerificationCodePage;
