import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { register } from '../../api/authService';

const RegistrationPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [registrationData, setRegistrationData] = useState(null);

    const navigate = useNavigate();
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match. Please try again.');
            return;
        }
        try {
            const response = await register(firstName, lastName, email, username, password);
            setRegistrationData(response);
            toast.success('Registration successful');
            navigate('/registration-success');
        } catch (error) {
            toast.error(error);
        }
    };

    return (
        <div>
            <h2>Customer Registration Form</h2>
            <form onSubmit={handleFormSubmit}>
                <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <button type="submit">Register</button>
            </form>
            {registrationData && (
                <div>
                    <h2>Registration Successful!</h2>
                    <p>User ID: {registrationData.userId}</p>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default RegistrationPage;
