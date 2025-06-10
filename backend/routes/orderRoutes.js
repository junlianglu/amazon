// routes/orderRoutes.js

const express = require('express');
const { createOrder, getUserOrders, getOrderById } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new order
router.post('/', authMiddleware, createOrder);

// Get user orders
router.get('/', authMiddleware, getUserOrders);

// Get order by ID
router.get('/:id', authMiddleware, getOrderById);

module.exports = router;