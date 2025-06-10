// models/Product.js

const mongoose = require('mongoose');

// Define the product schema with fields for product details
const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true, // Product name is required
    },
    description: {
      type: String,
      required: true, // Product description is required
    },
    price: {
      type: Number,
      required: true, // Product price is required
    },
    category: {
      type: String,
      required: true, // Product category is required
    },
    stock: {
      type: Number,
      default: 0, // Default stock is 0 if not specified
    },
    imageUrls: [
      {
        type: String, // URLs or paths to product images
      },
    ],
    brand: {
      type: String, // Brand of the product
    },
    ratings: {
      type: Number,
      default: 0, // Average rating of the product, default is 0
    },
    numReviews: {
      type: Number,
      default: 0, // Number of reviews for the product, default is 0
    },
    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the seller of the product
    },
    discount: {
      type: Number, // Discount percentage on the product
    },
    isFeatured: {
      type: Boolean,
      default: false, // Indicates if the product is featured
    },
    dimensions: {
      weight: Number, // Weight of the product
      length: Number,
      width: Number,
      height: Number,
    },
    sku: {
      type: String,
      unique: true, // Stock Keeping Unit, unique identifier for the product
    },
    tags: [
      {
        type: String, // Tags for searching and categorizing products
      },
    ],
    specifications: {
      material: String,
      color: String,
      warranty: String,
    },
  }, { timestamps: true });
  
  const Product = mongoose.model('Product', productSchema);
  module.exports = Product;