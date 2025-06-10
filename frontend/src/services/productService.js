// services/productService.js

import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const API_URL = `${BASE_URL}/api/products`;

export const fetchProducts = async ({ query, minPrice, maxPrice, sortOrder, page = 0, size = 10 }) => {
  try {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (sortOrder) params.append('sortOrder', sortOrder);
    params.append('from', page * size);
    params.append('size', size);
    const response = await fetch(`${API_URL}/search?${params.toString()}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
};

export const uploadProductImages = async (productId, formData) => {
  const token = localStorage.getItem('authToken');
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data', // Ensure multipart/form-data is used for file uploads
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(`${API_URL}/${productId}/images`, formData, config);
  return response.data;
};

export const getAllProducts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No token found');
    const response = await axios.post(API_URL, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No token found');

    const response = await axios.put(`${API_URL}/${productId}`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No token found');

    const response = await axios.delete(`${API_URL}/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
