// src/pages/EditAddressPage.js

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { updateUserProfile, getSpecificAddressSuggestions } from '../services/userService';
import './EditAddressPage.css'; // Ensure to create this CSS file for styles

const EditAddressPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { index: addressIndex } = useParams();
  const isNewAddress = addressIndex === 'new';

  const [address, setAddress] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState(null);

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isNewAddress) {
      setAddress({
        fullName: '',
        phoneNumber: '',
        addressLine1: '',
        addressLine2: '',
        deliveryInstructions: '',
      });
    } else {
      const idx = parseInt(addressIndex, 10);
      if (isNaN(idx) || !user.addresses[idx]) {
        navigate('/profile');
      } else {
        setAddress({ ...user.addresses[idx] });
      }
    }
  }, [addressIndex, user.addresses, isNewAddress, navigate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchSuggestions = async (query) => {
    try {
      if (!query.trim()) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }
      const results = await getSpecificAddressSuggestions(query);
      setSuggestions(results);
      setShowDropdown(true);
    } catch (err) {
      console.error('Error fetching address suggestions:', err);
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setAddress((prev) => ({
      ...prev,
      addressLine1: suggestion,
    }));
    setSuggestions([]);
    setShowDropdown(false);
  };

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return digits;
    const formatted = [
      match[1],
      match[2] ? '-' + match[2] : '',
      match[3] ? '-' + match[3] : '',
    ].join('');
    return formatted;
  };

  const handleInputChange = (field, value, skipFetch = false) => {
    if (field === 'phoneNumber') {
      value = formatPhoneNumber(value);
    }

    if (field === 'addressLine1') {
      if (!value.trim() || skipFetch) {
        setSuggestions([]);
        setShowDropdown(false);
      } else {
        fetchSuggestions(value);
      }
    }

    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  const handleSave = async () => {
    if (!address) return;
    const { fullName, phoneNumber, addressLine1 } = address;

    if (!fullName.trim() || !phoneNumber.trim() || !addressLine1.trim()) {
      setError('Please fill in all required fields: Full Name, Phone Number, and Address.');
      return;
    }

    if (!/^\d{3}-\d{3}-\d{4}$/.test(phoneNumber)) {
      setError('Phone number must be in the format xxx-xxx-xxxx.');
      return;
    }

    let updatedAddresses;
    if (isNewAddress) {
      updatedAddresses = [...user.addresses, address];
      if (updatedAddresses.length === 1) {
        updatedAddresses[0].isDefault = true;
      }
    } else {
      const idx = parseInt(addressIndex, 10);
      updatedAddresses = user.addresses.map((addr, i) => (i === idx ? address : addr));
    }

    try {
      const updatedProfile = { ...user, addresses: updatedAddresses };
      const userData = await updateUserProfile(updatedProfile);
      setUser(userData);
      setError(null);
      navigate('/profile');
    } catch (err) {
      console.error('Failed to update address:', err);
      setError('Failed to update address. Please try again.');
    }
  };

  if (!address) return null;

  return (
    <div className="edit-address-page">
    <h2 className="page-title">{isNewAddress ? 'Add a New Address' : 'Edit Address'}</h2>
        <div className="form-container">
            <div className="form-group">
            <label>
                Full Name <span className="required">*</span>
            </label>
            <input
                type="text"
                value={address.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="form-input"
                placeholder="Enter your full name"
            />
            </div>

            <div className="form-group">
            <label>
                Phone Number <span className="required">*</span>
            </label>
            <input
                type="text"
                value={address.phoneNumber}
                maxLength={12}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="form-input"
                placeholder="e.g., 123-456-7890"
            />
            </div>

            <div className="form-group" ref={dropdownRef} style={{ position: 'relative' }}>
            <label>
                Primary Address <span className="required">*</span>
            </label>
            <input
                type="text"
                value={address.addressLine1}
                onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                className="form-input"
                placeholder="Enter your primary address"
            />
            {showDropdown && (
                <ul className="suggestions-dropdown">
                {suggestions.map((suggestion, index) => (
                    <li
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSelectSuggestion(suggestion)}
                    >
                    {suggestion}
                    </li>
                ))}
                </ul>
            )}
            </div>

            <div className="form-group">
            <label>Secondary Address</label>
            <input
                type="text"
                value={address.addressLine2}
                onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                className="form-input"
                placeholder="Apartment, suite, etc. (optional)"
            />
            </div>

            <div className="form-group">
            <label>Delivery Instructions</label>
            <textarea
                value={address.deliveryInstructions}
                onChange={(e) => handleInputChange('deliveryInstructions', e.target.value)}
                className="form-input textarea"
                placeholder="Additional delivery instructions (optional)"
            ></textarea>
            </div>

            <div className="button-group">
            <button onClick={handleSave} className="save-button">
                Save
            </button>
            <button onClick={handleCancel} className="cancel-button">
                Cancel
            </button>
            </div>
            {error && <p className="error-message">{error}</p>}
        </div>
    </div>
  );
};

export default EditAddressPage;