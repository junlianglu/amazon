// context/CartContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCart as fetchCart, addItemToCart as addItemApi, removeItemFromCart as removeItemApi, updateItemQuantity as updateItemQuantityApi } from '../services/cartService';
import { useUser } from '../context/UserContext';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ products: [], totalPrice: 0 });
  const { user } = useUser();

  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        try {
          const cartData = await fetchCart();
          setCart(cartData);
        } catch (error) {
          console.error('Failed to load cart:', error);
        }
      }
    };
    loadCart();
  }, [user]);

  const addItemToCart = async (item) => {
    try {
      const updatedCart = await addItemApi(item);
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw error;
    }
  };

  const removeItemFromCart = async (productId) => {
    try {
      const updatedCart = await removeItemApi(productId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  };

  const updateItemQuantity = async (productId, quantity) => {
    try {
      const updatedCart = await updateItemQuantityApi(productId, quantity);
      setCart(updatedCart);
    } catch (error) {
      console.error('Failed to update item quantity:', error);
    }
  };

  const clearCart = () => {
    setCart({ products: [], totalPrice: 0 });
  };

  return (
    <CartContext.Provider value={{ cart, addItemToCart, removeItemFromCart, updateItemQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
