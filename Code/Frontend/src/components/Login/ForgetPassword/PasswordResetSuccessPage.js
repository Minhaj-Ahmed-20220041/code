import React from 'react';
import { Link } from 'react-router-dom';
import './PasswordResetSuccessPage.css';
const PasswordResetSuccessPage = () => {
  return (
    <div className='password-success-container'>
      <h2>Password Reset Successful</h2>
      <p>Your password has been reset successfully.</p>
      <p>Please <Link to="/login">login</Link> with your new password.</p>
    </div>
  );
};

export default PasswordResetSuccessPage;
