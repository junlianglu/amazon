
const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

router.get('/:placeId', async (req, res) => {
  const { placeId } = req.params;

  try {
    const response = await axios.get(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask': 'formattedAddress,addressComponents',
        },
      }
    );
    // Validate essential components
    const addressComponents = response.data.addressComponents;
    const hasStreetNumber = addressComponents.some((component) => component.types.includes('street_number'));
    const hasStreet = addressComponents.some((component) => component.types.includes('route'));
    const hasCity = addressComponents.some((component) => component.types.includes('locality'));
    const hasState = addressComponents.some((component) => component.types.includes('administrative_area_level_1'));
    const hasPostalCode = addressComponents.some((component) => component.types.includes('postal_code'));
    const hasCountry = addressComponents.some((component) => component.types.includes('country'));
    if (hasStreetNumber && hasStreet && hasCity && hasState && hasPostalCode && hasCountry) {
      res.json({
        success: true,
        data: response.data.formattedAddress, // Include the valid address data
      });
    } else {
      res.json({
        success: false,
        message: 'Address is missing required components',
      });
    }
  } catch (error) {
    console.error('Error fetching place details:', error.message);
    res.status(500).json({ error: 'Failed to fetch place details' });
  }
});

module.exports = router;
