// pages/CheckoutSuccessPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutSuccessPage.css';

const CheckoutSuccessPage = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="checkout-success-page">
      <div className="success-icon">✔️</div>
      <h2>Order Placed Successfully!</h2>
      <p>Your order has been successfully placed. Thank you for shopping with us!</p>
      
      <button onClick={handleBackToHome} className="back-button">Back to Home</button>
    </div>
  );
};

export default CheckoutSuccessPage;