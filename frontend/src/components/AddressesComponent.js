import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { updateUserProfile } from '../services/userService';
import './AddressesComponent.css';

const AddressesComponent = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const [updatedUser, setUpdatedUser] = useState(user);
  const [defaultAddressIndex, setDefaultAddressIndex] = useState(
    user.addresses.findIndex((addr) => addr.isDefault)
  );

  const handleSetDefault = (index) => {
    const updatedAddresses = updatedUser.addresses.map((address, i) => ({
      ...address,
      isDefault: i === index,
    }));
    setDefaultAddressIndex(index);
    updateUser(updatedAddresses);
  };

  const handleDeleteAddress = async (index) => {
    const updatedAddresses = updatedUser.addresses.filter((_, i) => i !== index);

    if (updatedAddresses.length === 0) {
      setDefaultAddressIndex(null);
    } else if (index === defaultAddressIndex) {
      updatedAddresses[0].isDefault = true;
      setDefaultAddressIndex(0);
    }
    await updateUser(updatedAddresses);
  };

  const handleEditAddress = (index) => {
    navigate(`/edit-address/${index}`);
  };

  const handleAddAddress = () => {
    navigate('/edit-address/new');
  };

  const updateUser = async (addresses) => {
    try {
      const updatedProfile = { ...updatedUser, addresses };
      await updateUserProfile(updatedProfile);
      setUpdatedUser(updatedProfile);
      setUser(updatedProfile);
    } catch {
      console.error('Failed to update address. Please try again.');
    }
  };

  return (
    <div className="addresses-container">
      <h2 className="section-title">Your Addresses</h2>
      <div className="addresses-grid">
        <div className="address-card add-address" onClick={handleAddAddress}>
          <div className="add-address-content">
            <span className="add-icon">+</span>
            <p>Add Address</p>
          </div>
        </div>
        {updatedUser.addresses.map((address, index) => (
          <div
            key={index}
            className={`address-card ${defaultAddressIndex === index ? 'default' : ''}`}
          >
            {defaultAddressIndex === index && (
              <div className="default-tag">Default</div>
            )}
            <div className="address-info">
              <p className="address-name"><strong>{address.fullName}</strong></p>
              <p>{address.addressLine1}</p>
              {address.addressLine2 && <p>{address.addressLine2}</p>}
              <p className="phone-number">{address.phoneNumber}</p>
              {address.deliveryInstructions && (
                <p className="delivery-instructions">
                  <em>{address.deliveryInstructions}</em>
                </p>
              )}
            </div>
            <div className="address-actions">
              <button
                className="btn btn-edit"
                onClick={() => handleEditAddress(index)}
              >
                Edit
              </button>
              <button
                className="btn btn-remove"
                onClick={() => handleDeleteAddress(index)}
              >
                Remove
              </button>
              {defaultAddressIndex !== index && (
                <button
                  className="btn btn-default"
                  onClick={() => handleSetDefault(index)}
                >
                  Set as Default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressesComponent;