import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/product`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('sessionToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const addProduct = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${localStorage.getItem('sessionToken')}`
    },
  });
  return response.data;
};

export const addBulkProducts = async (file) => {
  const formData = new FormData();
  formData.append('products', file);
  const headers = { headers: getAuthHeaders() };
  const response = await axios.post(`${API_URL}/bulk`, formData, headers);
  return response.data;
};

export const getProductsun = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getProducts = async (category, page, limit, sortBy, sortOrder, minPrice, maxPrice) => {
  const response = await axios.get(`${API_URL}/list/by?category=${category}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
  return response.data;
};

export const deleteProduct = async (productId) => {
  await axios.delete(`${API_URL}/${productId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('sessionToken')}`
    },
  });
};

export const updateProduct = async (productId, productData) => {
  try {
    const headers = { headers: getAuthHeaders() };

    const response = await axios.put(`${API_URL}/${productId}`, productData, headers);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};

export const fetchProductById = async (productId) => {
  try {
    const headers = { headers: getAuthHeaders() };
    console.log(headers);
    const response = await axios.get(`${API_URL}/${productId}`, headers);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const searchProducts = async (keyword, page, limit, sortBy, sortOrder, minPrice, maxPrice, category, isFeatured) => {
  try {
    if (isFeatured === false) //if true featured products only is fetched along with other filters, if false, all products will be fetched
      isFeatured = "";

    const headers = { headers: getAuthHeaders() };
    const response = await axios.get(
      `${API_URL}/search/by?keyword=${keyword}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}&minPrice=${minPrice}&maxPrice=${maxPrice}&category=${category}&isFeatured=${isFeatured}`
      , headers);
    return response.data;
  } catch (error) {
    console.error('Search failed:', error);
    throw error.response.data.error;
  }
};

export const getFeaturedProduct = async () => {
  try {
    const headers = { headers: getAuthHeaders() };
    const response = await axios.get(`${API_URL}/list/featured`, headers);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};

export const getPopularProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/list/by?limit=10&sortBy=soldCount&sortOrder=desc`);
    return response.data.products;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};

export const getRecommendedProducts = async () => {
  try {
    const headers = { headers: getAuthHeaders() };
    const response = await axios.get(`${API_URL}/recommended/all`, headers);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data.error;
  }
};
