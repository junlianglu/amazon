// models/Cart.js

const mongoose = require('mongoose');

// Define the cart schema with user reference and products
const cartSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Reference to the user who owns the cart
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true, // Reference to the product in the cart
        },
        quantity: {
          type: Number,
          required: true, // Quantity of the product in the cart
          min: 1, // Minimum quantity is 1
        },
        price: {
          type: Number,
          required: true, // Price of the product at the time it was added to the cart
        },
        name: String,
        imageUrl: String,
      },
    ],
    totalPrice: {
      type: Number,
      required: true, // Total price of all products in the cart
      default: 0,
    },
    isPurchased: {
      type: Boolean,
      default: false, // Indicates if the cart has been converted into an order
    },
    couponCode: {
      type: String, // Coupon code applied to the cart
    },
    discountAmount: {
      type: Number,
      default: 0, // Total discount amount applied to the cart
    },
    lastUpdated: {
      type: Date,
      default: Date.now, // Last time the cart was updated
    },
  }, { timestamps: true });
  
  const Cart = mongoose.model('Cart', cartSchema);
  module.exports = Cart;
  