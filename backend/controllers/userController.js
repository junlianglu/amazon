// controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Update user profile
exports.updateProfile = async (req, res) => {
  const { name, email, phoneNumber, addresses, paymentMethods, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Handle password update
    if (currentPassword && newPassword) {
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      user.password = newPassword;
    }

    // Check if email already exists for another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      user.email = email;
    }

    // Update all profile attributes if provided
    user.name = name || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.addresses = addresses || user.addresses;
    user.paymentMethods = paymentMethods || user.paymentMethods;

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      await user.remove();
      res.status(200).json({ message: 'User account deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
};

// Get logged-in user
exports.getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };