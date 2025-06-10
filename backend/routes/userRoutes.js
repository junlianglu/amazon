// routes/userRoutes.js

const express = require('express');
const { updateProfile, deleteAccount, getProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get logged-in user profile
router.get('/profile', authMiddleware, getProfile);

// Update user profile
router.put('/profile', authMiddleware, updateProfile);

// Delete user account
router.delete('/account', authMiddleware, deleteAccount);

module.exports = router;