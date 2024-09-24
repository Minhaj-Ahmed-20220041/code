
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/auth`;

export const login = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/login`, data);
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error.response.data.error;
    }
};

export const register = async (firstName, lastName, email, username, password) => {
    try {
        const response = await axios.post(`${API_URL}/customer/register`, {
            firstName,
            lastName,
            email,
            username,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error.response.data.error;
    }
};

export const forgetPassword = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/forget-password`, { email });
        return response.data;
    } catch (error) {
        console.error('Error sending forgot password request:', error);
        throw error.response.data.error;
    }
};

export const verifyForgetPassword = async (email, verificationCode) => {
    try {
        const response = await axios.patch(`${API_URL}/verify-forget-password`, {
            email,
            verificationCode
        });
        return response.data;
    } catch (error) {
        console.error('Error verifying verification code:', error);
        throw error.response.data.error;
    }
};

export const resetForgetPassword = async (resetToken, password) => {
    try {
        const response = await axios.patch(`${API_URL}/reset-password`, {
            resetToken,
            newPassword: password
          });
        return response.data;
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error.response.data.error;
    }
};
