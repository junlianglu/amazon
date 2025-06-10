// services/userService.js

import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const API_URL = `${BASE_URL}/api/user`;
const GOOGLE_PLACES_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;

export const getPlaceDetailsWithPostalCode = async (placeId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/place-details/${placeId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw error;
  }
};

export const getSpecificAddressSuggestions = async (query) => {
  try {
    const response = await axios.post(
      `https://places.googleapis.com/v1/places:autocomplete`,
      {
        input: query,
        locationBias: {
          circle: {
            center: {
              latitude: 37.7749, // Replace with your desired coordinates
              longitude: -122.4194,
            },
            radius: 50000,
          },
        },
        languageCode: 'en', // Return results in English
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY, // Use your API key
          'X-Goog-FieldMask': 'suggestions.placePrediction.text,suggestions.placePrediction.placeId',
        },
      }
    );
    const suggestions = await Promise.all(
      response.data.suggestions.map(async (suggestion) => {
        const placeDetails = await getPlaceDetailsWithPostalCode(suggestion.placePrediction.placeId);
        // Check if the placeDetails is valid (i.e., success is true)
        if (placeDetails && placeDetails.success) {
          return placeDetails.data;
        }
        return null; // Return null for invalid addresses
      })
    );
    const validSuggestions = suggestions.filter((suggestion) => suggestion !== null);
    return validSuggestions;
  } catch (error) {
    console.error('Failed to fetch specific address suggestions:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No token found');
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) throw new Error('No token found');

    const response = await axios.put(`${API_URL}/profile`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400 && error.response.data.message === 'Email already exists') {
      throw new Error('Email already exists'); // Custom error
    }
    console.error('Error updating user profile:', error);
    throw error;
  }
};