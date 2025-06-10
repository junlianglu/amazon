import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { updateUserProfile } from '../services/userService';
import './PaymentMethodsComponent.css';

const PaymentMethodsComponent = () => {
  const { user, setUser } = useUser();
  const [paymentMethods, setPaymentMethods] = useState(user.paymentMethods || []);
  const navigate = useNavigate();

  const updateUser = async (updatedPaymentMethods) => {
    try {
      const updatedUser = { ...user, paymentMethods: updatedPaymentMethods };
      await updateUserProfile(updatedUser);
      setUser(updatedUser);
      setPaymentMethods(updatedPaymentMethods);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleRemoveMethod = async (index) => {
    const updatedMethods = paymentMethods.filter((_, i) => i !== index);

    if (!updatedMethods.some((m) => m.isDefault) && updatedMethods.length > 0) {
      updatedMethods[0].isDefault = true;
    }

    await updateUser(updatedMethods);
  };

  const handleSetDefault = (index) => {
    const updatedMethods = paymentMethods.map((method, i) => ({
      ...method,
      isDefault: i === index,
    }));
    updateUser(updatedMethods);
  };

  const handleEditMethod = (index) => {
    navigate(`/edit-payment-method/${index}`);
  };

  const handleAddMethod = () => {
    navigate('/edit-payment-method/new');
  };

  return (
    <div className="payment-methods-container">
      <h2 className="section-title">Your Payment Methods</h2>
      <div className="payment-methods-grid">
        {paymentMethods.map((method, index) => (
          <div key={index} className={`payment-method-card ${method.isDefault ? 'default' : ''}`}>
            {method.isDefault && <span className="default-badge">Default</span>}
            <div className="card-details">
              <p className="name-on-card">
                <strong>Name on Card:</strong> {method.nameOnCard}
              </p>
              <p className="card-number">
                <strong>Card Number:</strong> **** **** **** {method.cardNumber.slice(-4)}
              </p>
              <p className="expiry-date">
                <strong>Expiry:</strong> {method.expiryDate}
              </p>
              <p className="card-type">
                <strong>Type:</strong> {method.cardType}
              </p>
            </div>
            <div className="card-actions">
              {!method.isDefault && (
                <button className="btn btn-default" onClick={() => handleSetDefault(index)}>
                  Set as Default
                </button>
              )}
              <button className="btn btn-edit" onClick={() => handleEditMethod(index)}>
                Edit
              </button>
              <button className="btn btn-remove" onClick={() => handleRemoveMethod(index)}>
                Remove
              </button>
            </div>
          </div>
        ))}
        <div className="add-payment-method-card" onClick={handleAddMethod}>
          <div className="add-card-content">
            <span className="add-icon">+</span>
            <p>Add Payment Method</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsComponent;