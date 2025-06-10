// models/Order.js

const mongoose = require('mongoose');

// Define the order schema with user reference, products, total amount, and status
const orderSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Reference to the user who placed the order
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
    totalAmount: {
      type: Number,
      required: true, // Total amount for the order
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], // Possible statuses for the order
      default: 'Pending', // Default status is 'Pending'
    },
    shippingAddress: {
      type: String,
      required: true, // Shipping address for the order
    },
    paymentMethod: {
      cardNumber: { type: String, required: true }, // Card number used for payment
      expiryDate: { type: String, required: true }, // Expiry date of the card
      cardType: { type: String, required: true }, // e.g., Visa, MasterCard
      isDefault: { type: Boolean, required: true }, // Whether this is the default payment method
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'], // Payment status for the order
      default: 'Pending', // Default payment status is 'Pending'
    },
    trackingNumber: {
      type: String, // Tracking number for the shipment
    },
    deliveryDate: {
      type: Date, // Estimated or actual delivery date
    },
    orderDate: {
      type: Date,
      default: Date.now, // Date when the order was placed
    },
    estimatedDeliveryDate: {
      type: Date, // Estimated delivery date for the order
    },
    cancellationReason: {
      type: String, // Reason for cancellation if the order is cancelled
    },
  }, { timestamps: true });
  
  const Order = mongoose.model('Order', orderSchema);
  module.exports = Order;