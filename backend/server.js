const PORT = process.env.PORT || 8080;

const express = require('express');
const connectDB = require('./config/dbConfig');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const placeDetailsRoutes = require('./routes/placeDetailsRoutes')
const chatRoute = require('./routes/chatRoute');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['https://j685a5a7v0.execute-api.us-west-1.amazonaws.com', 'https://d3m0v6e3ul1hd1.cloudfront.net', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  }));
app.options('*', cors()); // enable pre-flight across-the-board


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/place-details', placeDetailsRoutes);
app.use('/api/chat', chatRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


