import axiosInstance from './axiosInstance';

export const getAnalytics = async () => {
  try {
    const response = await axiosInstance.get('/analytics');
    return response.data;
  } catch (error) {
    throw error;
  }
};
