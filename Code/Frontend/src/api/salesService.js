import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/sales`;

export const periodSales = async (from, to) => {
    try {
        const response = await axios.get(`${API_URL}/breakdown?from=${from}&to=${to}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('sessionToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error.response.data.error;
    }
};

export const getMonthsSummaryOf = async (year) => {
    try {
        const response = await axios.get(`${API_URL}/months-summary?year=${year}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('sessionToken')}`
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error.response.data.error;
    }
};