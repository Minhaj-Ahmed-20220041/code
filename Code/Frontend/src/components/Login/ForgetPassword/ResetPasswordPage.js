import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetForgetPassword } from '../../../api/authService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const resetToken = localStorage.getItem('resetToken');
    if (!resetToken) {
      console.log('Reset token not found. Please go back and try again.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }
    try {
      await resetForgetPassword(resetToken, password);
      // Clear the reset token from local storage after successful password reset
      localStorage.removeItem('resetToken');
      toast.success('Password reset successful. You can now login with your new password.');
      // Redirect to the login page
      navigate('/password-reset-success');
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleFormSubmit}>
        <input type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
