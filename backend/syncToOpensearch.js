const client = require('./config/opensearchClient'); // Elasticsearch client instance
const Product = require('./models/Product'); // Mongoose Product model
const mongoose = require('mongoose');
require('dotenv').config(); // For MongoDB connection URI

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.once('open', async () => {
  console.log('Connected to MongoDB');
  try {
    const products = await Product.find({});
    
    for (const product of products) {
      await client.index({
        index: 'products',
        id: product._id.toString(),
        body: {
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          brand: product.brand,
          imageUrls: product.imageUrls
          // add any other fields you want to sync
        }
      });
    }
    console.log('All products synced to Elasticsearch');
  } catch (error) {
    console.error('Error syncing products:', error);
  } finally {
    mongoose.connection.close(); // Close MongoDB connection
  }
});
