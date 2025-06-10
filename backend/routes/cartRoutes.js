// routes/cartRoutes.js

const express = require('express');
const { addItemToCart, getCart, removeItemFromCart, updateItemQuantity } = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Add item to cart
router.post('/', authMiddleware, addItemToCart);

// Get user cart
router.get('/', authMiddleware, getCart);

// Remove item from cart
router.delete('/:productId', authMiddleware, removeItemFromCart);

router.put('/:productId', authMiddleware, updateItemQuantity);

module.exports = router;