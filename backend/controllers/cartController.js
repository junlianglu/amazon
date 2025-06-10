// controllers/cartController.js

const Cart = require('../models/Cart');

// Add item to cart
exports.addItemToCart = async (req, res) => {
  const { productId, quantity, price, name, imageUrl } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      cart = new Cart({ user: req.user.userId, products: [] });
    }

    const existingProductIndex = cart.products.findIndex(product => product.productId.toString() === productId);
    if (existingProductIndex >= 0) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity, price, name, imageUrl });
    }

    cart.totalPrice = cart.products.reduce((acc, product) => acc + product.price * product.quantity, 0);
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user cart
exports.getCart = async (req, res) => {
    try {
      const cart = await Cart.findOne({ user: req.user.userId });
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      res.status(200).json(cart);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  
// Remove item from cart
exports.removeItemFromCart = async (req, res) => {
  const { productId } = req.params;
  try {
    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = cart.products.filter(product => product.productId.toString() !== productId);
    cart.totalPrice = cart.products.reduce((acc, product) => acc + product.price * product.quantity, 0);
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update item quantity in the user's cart
exports.updateItemQuantity = async (req, res) => {
  try {
    console.log('in update quantity controller');
    const { productId } = req.params;
    const { quantity } = req.body;
    console.log('in update quantity controller 1');
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    console.log('in update quantity controller 2');
    const productIndex = cart.products.findIndex((item) => item.productId.toString() === productId.toString());
    console.log('in update quantity controller 3');
    console.log(cart.products[0].productId.toString() === productId.toString());
    console.log(cart.products[0].productId.toString());
    console.log(productId.toString());
    console.log(productIndex);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    cart.products[productIndex].quantity = quantity;

    // Recalculate the total price
    cart.totalPrice = cart.products.reduce((total, item) => total + item.price * item.quantity, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating item quantity', error });
  }
};
