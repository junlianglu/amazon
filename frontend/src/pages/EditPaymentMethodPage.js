// src/pages/EditPaymentMethodPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { updateUserProfile } from '../services/userService';
import './EditPaymentMethodPage.css';

const EditPaymentMethodPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { index: methodIndex } = useParams();

  const isNewMethod = methodIndex === 'new';
  const [method, setMethod] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    if (isNewMethod) {
      setMethod({
        nameOnCard: '',
        cardNumber: '',
        expiryDate: '',
        cardType: 'Visa',
        isDefault: false,
      });
    } else {
      const idx = parseInt(methodIndex, 10);
      if (isNaN(idx) || !user.paymentMethods || !user.paymentMethods[idx]) {
        navigate('/profile');
      } else {
        setMethod({ ...user.paymentMethods[idx] });
      }
    }
  }, [methodIndex, user, isNewMethod, navigate]);

  const formatCardNumber = (value) => {
    return value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5);
  };

  const validateExpiryDate = (expiryDate) => {
    if (expiryDate.length !== 5) return false;

    const [monthStr, yearStr] = expiryDate.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);

    if (month < 1 || month > 12) return false;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    return year > currentYear || (year === currentYear && month >= currentMonth);
  };

  const handleChange = (field, value) => {
    setMethod((prev) => ({
      ...prev,
      [field]:
        field === 'cardNumber'
          ? formatCardNumber(value)
          : field === 'expiryDate'
          ? formatExpiryDate(value)
          : value,
    }));
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  const handleSave = async () => {
    if (!method) return;

    const rawCardNumber = method.cardNumber.replace(/\s/g, '');
    if (!rawCardNumber || rawCardNumber.length !== 16) {
      setError('Card number must be 16 digits.');
      return;
    }

    if (!method.nameOnCard) {
      setError('Name on card is required.');
      return;
    }

    if (!validateExpiryDate(method.expiryDate)) {
      setError('Expiry date must be valid and not expired.');
      return;
    }

    const paymentMethods = user.paymentMethods || [];
    let updatedMethods;

    if (isNewMethod) {
      updatedMethods = [...paymentMethods, method];
      if (updatedMethods.length === 1) {
        updatedMethods[0].isDefault = true;
      }
    } else {
      const idx = parseInt(methodIndex, 10);
      updatedMethods = paymentMethods.map((m, i) => (i === idx ? method : m));
    }

    const updatedUser = { ...user, paymentMethods: updatedMethods };
    try {
      const userData = await updateUserProfile(updatedUser);
      setUser(userData);
      setError(null);
      navigate('/profile');
    } catch (err) {
      console.error('Failed to update user:', err);
      setError('Failed to save payment method. Please try again.');
    }
  };

  if (!method) {
    return null;
  }

  return (
    <div className="edit-payment-method-page">
      <h2 className="page-title">{isNewMethod ? 'Add New Payment Method' : 'Edit Payment Method'}</h2>
      <div className="form-container">
        <div className="form-group">
          <label>Name on Card <span className="required">*</span></label>
          <input
            type="text"
            className="form-input"
            value={method.nameOnCard}
            onChange={(e) => handleChange('nameOnCard', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Card Number <span className="required">*</span></label>
          <input
            type="text"
            maxLength={19}
            className="form-input"
            value={method.cardNumber}
            onChange={(e) => handleChange('cardNumber', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Expiry Date (MM/YY) <span className="required">*</span></label>
          <input
            type="text"
            maxLength={5}
            className="form-input"
            value={method.expiryDate}
            onChange={(e) => handleChange('expiryDate', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Card Type</label>
          <select
            className="form-input"
            value={method.cardType}
            onChange={(e) => handleChange('cardType', e.target.value)}
          >
            <option value="Visa">Visa</option>
            <option value="MasterCard">MasterCard</option>
            <option value="American Express">American Express</option>
            <option value="Discover">Discover</option>
          </select>
        </div>

        <div className="form-actions">
          <button className="btn-save" onClick={handleSave}>
            Save
          </button>
          <button className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default EditPaymentMethodPage;