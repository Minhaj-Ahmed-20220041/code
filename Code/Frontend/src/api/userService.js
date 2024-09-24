import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/users`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('sessionToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getUsers = async () => {
  try {
    const response = await axiosInstance.get('/users');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('sessionToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error.response.data.error;
  }
};

export const editProfile = async (profile) => {
  try {
    const response = await axios.put(`${API_URL}/${profile._id}`, profile, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('sessionToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error.response.data.error;
  }
};

export const getUserList = async () => {
  try {
    const response = await axios.get(`${API_URL}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('sessionToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error.response.data.error;
  }
};

export const deleteUser = async (userId) => {
  try {
    await axios.delete(`${API_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('sessionToken')}`,
      },
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error.response.data.error;
  }
};

export const makeAdmin = async (userId) => {
  try {
    await axios.post(`${API_URL}/${userId}/makeAdmin`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('sessionToken')}`,
        },
      });
  } catch (error) {
    console.error('Error promoting user:', error);
    throw error.response.data.error;
  }
};

export const removeAdmin = async (userId) => {
  try {
    await axios.post(`${API_URL}/${userId}/removeAdmin`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('sessionToken')}`,
        },
      });
  } catch (error) {
    console.error('Error demoting user:', error);
    throw error.response.data.error;
  }
};

export const changePassword = async (data) => {
  try {
    const headers = { headers: getAuthHeaders() };
    const response = await axios.put(`${API_URL}/change/password`, data ,headers);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response.data.error;
  }
};