// components/CartItem.js

import React from 'react';
import { useCart } from '../context/CartContext';
import './CartItem.css'; // Add a separate CSS file for styles

const CartItem = ({ item }) => {
  const { addItemToCart, removeItemFromCart, updateItemQuantity } = useCart();

  const handleIncreaseQuantity = () => {
    updateItemQuantity(item.productId, item.quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (item.quantity > 1) {
      updateItemQuantity(item.productId, item.quantity - 1);
    }
  };

  return (
    <div className="cart-item">
      <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
      <div className="cart-item-details">
        <h4 className="item-name">{item.name}</h4>
        <p className="item-price">Price: <strong>${item.price.toFixed(2)}</strong></p>
        <div className="quantity-controls">
          <button onClick={handleDecreaseQuantity} className="quantity-button">-</button>
          <span className="quantity">{item.quantity}</span>
          <button onClick={handleIncreaseQuantity} className="quantity-button">+</button>
        </div>
        <button
          onClick={() => removeItemFromCart(item.productId)}
          className="remove-item-button"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;