// controllers/orderController.js

const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    console.log('control1');
    const { shippingAddress, paymentMethod } = req.body;

    // Validate request data
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Shipping address and payment method are required' });
    }
    console.log('control2');
    // Find the cart for the user
    const cart = await Cart.findOne({ user: req.user.userId });
    console.log('control3');
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    console.log('control4');
    // Create a new order
    const order = new Order({
      user: req.user.userId,
      products: cart.products.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      })),
      totalAmount: cart.totalPrice,
      shippingAddress,
      paymentMethod,
      status: 'Pending',
      paymentStatus: 'Pending',
      orderDate: new Date(),
    });
    console.log('control5');
    await order.save();
    console.log('control6');
    // Clear the cart after creating the order
    cart.products = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user.userId });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  // Get order by ID
  exports.getOrderById = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };