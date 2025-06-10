// backend/controllers/productController.js

const Product = require('../models/Product');
const client = require('../config/opensearchClient');
const User = require('../models/User');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../config/s3Client');
const { v4: uuidv4 } = require('uuid'); // For unique file names
require('dotenv').config();

exports.getSimilarProducts = async (req, res) => {
  try {
    const { productId } = req.params;

    // Fetch the original product to get its details
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Build the OpenSearch query
    const searchQuery = {
      index: 'products',
      body: {
        query: {
          bool: {
            must: [
              { match: { category: product.category } } // Match the same category
            ],
            should: [
              // { match: { brand: product.brand } },
              { range: { price: { gte: product.price * 0.8, lte: product.price * 1.2 } } }
            ],
            must_not: [
              { term: { _id: productId } } // Exclude the original product
            ]
          }
        },
        size: 5 // Return 5 similar products
      }
    };

    const response = await client.search(searchQuery);
    const similarProducts = response.body.hits.hits.map((hit) => ({
      _id: hit._id,
      ...hit._source
    }));

    res.status(200).json(similarProducts);
  } catch (error) {
    console.error('Error fetching similar products:', error);
    res.status(500).json({ message: 'Error fetching similar products' });
  }
};

exports.searchProducts = async (req, res) => {
    try {
      const { query, minPrice, maxPrice, sortOrder, from = 0, size = 10 } = req.query;
      const searchQuery = {
        index: 'products', // OpenSearch index for your products
        body: {
          query: {
            bool: {
              must: query
                ? {
                    multi_match: {
                      query: query,
                      fields: ['name', 'description', 'category', 'brand'], // Fields for product search
                    },
                  }
                : { match_all: {} }, // Return all products if no query provided
              filter: [],
            },
          },
          sort: [],
          from, // Pagination offset
          size, // Number of results per page
        },
      };
      // Add price range filters
      if (minPrice) {
        searchQuery.body.query.bool.filter.push({ range: { price: { gte: minPrice } } });
      }
      if (maxPrice) {
        searchQuery.body.query.bool.filter.push({ range: { price: { lte: maxPrice } } });
      }
      // Add sorting by price
      if (sortOrder && (sortOrder === 'asc' || sortOrder === 'desc')) {
        searchQuery.body.sort = [{ price: { order: sortOrder } }];
      }
      // Execute the OpenSearch query
      const response = await client.search(searchQuery);
      // Extract product IDs from OpenSearch results
      const productIds = response.body.hits.hits.map((hit) => hit._id);
  
      // Fetch matching products from MongoDB
      const products = await Product.find({ _id: { $in: productIds } });
  
      // Ensure the MongoDB products match OpenSearch order
      const orderedProducts = productIds.map((id) =>
        products.find((product) => product._id.toString() === id)
      );
      res.json(orderedProducts);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

exports.uploadProductImages = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const imageUrls = [];
        for (const file of req.files) {
            const fileName = `${uuidv4()}_${file.originalname}`;
            const uploadParams = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `images/products/${fileName}`,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            await s3Client.send(new PutObjectCommand(uploadParams));
            const imageUrl = `https://d64wzvojpm2li.cloudfront.net/images/products/${encodeURIComponent(fileName)}`;
            imageUrls.push(imageUrl);
        }

        // Update the product with the new image URLs
        product.imageUrls = [...product.imageUrls, ...imageUrls];
        await product.save();

        res.json({ success: true, product });
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ error: 'Failed to upload images' });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product by ID', error });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.role !== 'admin' && user.role !== 'seller') {
      return res.status(403).json({ error: 'Permission denied. Only sellers or admins can create products.' });
    }
    const productData = { ...req.body, seller_id: userId };
    const product = new Product(productData);
    await User.findByIdAndUpdate(userId, { $push: { products: product._id } });
    const savedProduct = await product.save();
    await client.index({
      index: 'products',
      id: savedProduct._id.toString(),
      body: {
        name: savedProduct.name,
        description: savedProduct.description,
        price: savedProduct.price,
        category: savedProduct.category,
        brand: savedProduct.brand,
        imageUrls: savedProduct.imageUrls
      },
    });
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};

// Update product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { name, brand, price, description, category, imageUrls } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, brand, price, description, category, imageUrls },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await client.index({
      index: 'products', // Your OpenSearch index name
      id: updatedProduct._id.toString(), // Use the product ID as the document ID
      body: {
        name: updatedProduct.name,
        price: updatedProduct.price,
        description: updatedProduct.description,
        category: updatedProduct.category,
        brand: updatedProduct.brand,
        imageUrls: updatedProduct.imageUrls
      },
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
};

// Delete product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};
