// services/orderService.js

import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const API_URL = `${BASE_URL}/api/orders`;

export const createOrder = async (orderData) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No token found');
    const response = await axios.post(API_URL, orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getUserOrders = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No token found');

    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const getOrderById = async (orderId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No token found');

    const response = await axios.get(`${API_URL}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    throw error;
  }
};
