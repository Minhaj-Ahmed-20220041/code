import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../authContext';
import './Login.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login } from '../../api/authService';

const Login = () => {
  const { dispatch } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);

      const { token, user } = response;
      localStorage.setItem('sessionToken', token);
      localStorage.setItem('username', user.username);

      dispatch({ type: 'LOGIN', payload: user });
      toast.success('Successfully logged in');

      // Check if the user is an admin and set the redirect path accordingly
      let redirectPath = '/';
      if (user.role === 'admin') {
        redirectPath = '/dashboard/home';
      } else {
        redirectPath = new URLSearchParams(location.search).get('redirect') || '/';
      }

      navigate(redirectPath, { replace: true }); // Navigate to the desired page after successful login
    } catch (error) {
      toast.error(error);
    }
  };


  const handleRegisterClick = () => {
    navigate('/register'); // Navigate to register page when register button is clicked
  };

  return (
    <div className="container" id="container">
      <div className="form-container sign-in-container">
        <form onSubmit={handleSubmit}>
          <h1>Sign in</h1>
          <input type="text" placeholder="Username" name="username" value={formData.username} onChange={handleChange} />
          <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
          <a href="/forget-password">Forgot your password?</a>
          <button type="submit">Sign In</button>
        </form>
      </div>
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" id="signIn">Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h2>Don't have an account?</h2>
            <h5>Sign up and start your journey with us</h5>
            <button id="signUp" onClick={handleRegisterClick}>Sign Up</button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
