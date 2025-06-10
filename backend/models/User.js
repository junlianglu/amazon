// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the user schema with name, email, password, role, and other common fields
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is required
  },
  email: {
    type: String,
    required: true, // Email is required and must be unique
    unique: true,
  },
  password: {
    type: String,
    required: true, // Password is required
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'seller'], // Role can be 'user', 'admin', or 'seller'
    default: 'user', // Default role is 'user'
  },
  addresses: [
    {
      fullName: String,
      phoneNumber: String,
      addressLine1: String,
      addressLine2: String,
      deliveryInstructions: String,
      isDefault: Boolean,
    },
  ],
  phoneNumber: {
    type: String, // Contact number for the user
  },
  isVerified: {
    type: Boolean,
    default: false, // Indicates if the user's email is verified
  },
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // References to products in the user's wishlist
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order', // References to orders placed by the user
    },
  ],
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart', // Reference to the user's cart
  },
  paymentMethods: [
    {
      cardNumber: String,
      nameOnCard: String,
      expiryDate: String,
      cardType: String, // e.g., Visa, MasterCard
      isDefault: Boolean,
    },
  ],
}, { timestamps: true });

// Hash password before saving user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); // If password is not modified, continue to the next middleware
  }
  try {
    const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
    this.password = await bcrypt.hash(this.password, salt); // Hash the password with the generated salt
    next();
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;