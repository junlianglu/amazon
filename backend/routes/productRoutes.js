// backend/routes/productRoutes.js

const express = require('express');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, uploadProductImages, searchProducts, getSimilarProducts } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Public routes
router.get('/search', searchProducts);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/:productId/similar', getSimilarProducts);

// Protected routes for sellers
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

router.post('/:id/images', authMiddleware, upload.array('images'), uploadProductImages);

module.exports = router;