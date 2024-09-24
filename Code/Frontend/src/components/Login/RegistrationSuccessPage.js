import React from 'react';
import { Link } from 'react-router-dom';
import './RegistrationSuccessPage.css'; // Import the CSS file

const RegistrationSuccessPage = () => {
  return (
    <div className="registration-success-container">
      <h2>Registration Successful!</h2>
      <p>Your registration was successful.</p>
      <p>Please proceed to <Link to="/login">login</Link> with your new account credentials.</p>
    </div>
  );
};

export default RegistrationSuccessPage;
