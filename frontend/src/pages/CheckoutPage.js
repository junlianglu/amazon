// pages/CheckoutPage.js

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/orderService';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(user?.addresses?.find(addr => addr.isDefault) || '');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(user?.paymentMethods?.find(pm => pm.isDefault) || '');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/'); // Redirect to the homepage or another appropriate page
    }
  }, [user, navigate]);

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const orderData = {
        user: user._id,
        products: cart.products.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        totalAmount: cart.totalPrice,
        shippingAddress: `${selectedAddress.addressLine1}${selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ''}`,
        paymentMethod: {
          cardNumber: selectedPaymentMethod.cardNumber,
          expiryDate: selectedPaymentMethod.expiryDate,
          cardType: selectedPaymentMethod.cardType,
          isDefault: selectedPaymentMethod.isDefault,
        },
      };
      await createOrder(orderData); // Call the createOrder service
      clearCart();
      navigate('/checkout-success');
    } catch (err) {
      setError('An error occurred while placing the order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.products.length === 0) {
    return (
      <div className="checkout-page empty">
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="back-to-shopping">
          Back to Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-content">
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          <ul className="order-items">
            {cart.products.map((item) => (
              <li key={item.productId} className="order-item">
                <img src={item.imageUrl} alt={item.name} className="order-item-image" />
                <div className="order-item-info">
                  <p>{item.name} (x{item.quantity})</p>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </li>
            ))}
          </ul>
          <h3>Total: ${cart.totalPrice.toFixed(2)}</h3>
        </div>

        <div className="checkout-details">
          <h2>Shipping Address</h2>
          {user.addresses?.length > 0 ? (
            <select
              value={selectedAddress?._id?.toString() || ''}
              onChange={(e) =>
                setSelectedAddress(
                  user.addresses.find((addr) => addr._id.toString() === e.target.value)
                )
              }
              className="address-dropdown"
            >
              {user.addresses.map((address, index) => (
                <option key={index} value={address._id.toString()}>
                  {address.addressLine1}
                  {address.addressLine2 ? `, ${address.addressLine2}` : ''}
                </option>
              ))}
            </select>
          ) : (
            <p>No addresses available. Please add an address in your profile.</p>
          )}

          <h2>Payment Method</h2>
          {user.paymentMethods?.length > 0 ? (
            <select
              value={selectedPaymentMethod?.cardNumber || ''}
              onChange={(e) =>
                setSelectedPaymentMethod(
                  user.paymentMethods.find((pm) => pm.cardNumber === e.target.value)
                )
              }
              className="payment-dropdown"
            >
              {user.paymentMethods.map((method, index) => (
                <option key={index} value={method.cardNumber}>
                  {method.cardType} ending in {method.cardNumber.slice(-4)} (Expiry: {method.expiryDate})
                </option>
              ))}
            </select>
          ) : (
            <p>No payment methods available. Please add a payment method in your profile.</p>
          )}
        </div>
      </div>

      <div className="checkout-actions">
        <button
          onClick={handlePlaceOrder}
          className="place-order-button"
          disabled={loading || !selectedAddress || !selectedPaymentMethod}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default CheckoutPage;