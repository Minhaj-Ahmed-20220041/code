import axios from 'axios';

const API_URL = 'http://localhost:3001/api/cart';

export const fetchCartItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/list`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
};

export const addToCartBackend = async (productId, quantity) => {
  try {
    const response = await axios.post(`${API_URL}/add`, { productId, quantity });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};
