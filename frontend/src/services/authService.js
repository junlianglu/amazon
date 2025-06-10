// services/authService.js

import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const API_URL = `${BASE_URL}/api/auth`;

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data.token;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const register = async (name, email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { name, email, password, role });
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};