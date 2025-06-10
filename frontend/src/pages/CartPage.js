// pages/CartPage.js

import React from 'react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { Link } from 'react-router-dom';
import './CartPage.css'; // Add a separate CSS file for styles

const CartPage = () => {
  const { cart } = useCart();

  if (cart.products.length === 0) {
    return (
      <div className="cart-page empty">
        <h2>Your cart is empty</h2>
        <Link to="/" className="back-to-shopping">Back to Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <div className="cart-items">
        {cart.products.map((item) => (
          <CartItem key={item.productId} item={item} />
        ))}
      </div>
      <div className="cart-summary">
        <h2>Total Price: ${cart.totalPrice.toFixed(2)}</h2>
        <Link to="/checkout" className="checkout-button">Proceed to Checkout</Link>
      </div>
    </div>
  );
};

export default CartPage;