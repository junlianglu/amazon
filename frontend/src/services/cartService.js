// services/cartService.js

import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const API_URL = `${BASE_URL}/api/cart`;

export const getCart = async () => {
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
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const addItemToCart = async (item) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No token found');

    const response = await axios.post(
      API_URL,
      item,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

export const removeItemFromCart = async (productId) => {
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
    console.error('Error removing item from cart:', error);
    throw error;
  }
};

export const updateItemQuantity = async (productId, quantity) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No token found');

    const response = await axios.put(
      `${API_URL}/${productId}`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating item quantity:', error);
    throw error;
  }
};
