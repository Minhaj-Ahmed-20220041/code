import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/order`;

export const placeOrder = async (orderData) => {
  try {
    const response = await axios.post(API_URL, orderData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('sessionToken')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to place order:', error);
    throw error;
  }
};

export const orderHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/history`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('sessionToken')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to place order:', error);
    throw error;
  }
};

export const getOrder = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('sessionToken')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get order:', error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${orderId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('sessionToken')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to delete order:', error);
    throw error;
  }
};

export const getAllOrders = async (page, limit, userKeyword) => {
  try {
    const response = await axios.get(`${API_URL}/all?page=${page}&limit=${limit}&user=${userKeyword}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('sessionToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error.response.data.error;
  }
};

export const changeOrderStatus = async (orderId, newStatus) => {
  try {
    await axios.put(`${API_URL}/${orderId}/status`, { orderStatus: newStatus }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('sessionToken')}`,
      },
    });
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw error.response.data.error;
  }
};



