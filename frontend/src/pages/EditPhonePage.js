import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { updateUserProfile } from '../services/userService';

const EditPhonePage = () => {
  const { user, setUser } = useUser();
  const [phone, setPhone] = useState(user.phoneNumber);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!/^\d{3}-\d{3}-\d{4}$/.test(phone)) {
      setError('Phone number must be in the format xxx-xxx-xxxx.');
      return;
    }
    try {
      const updatedUser = await updateUserProfile({ ...user, phoneNumber: phone });
      setUser(updatedUser);
      navigate('/profile');
    } catch {
      setError('Failed to update phone number. Please try again.');
    }
  };

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return value;
    return [match[1], match[2], match[3]].filter(Boolean).join('-');
  };

  return (
    <div className="edit-page">
      <h1>Edit Phone</h1>
      <div className="input-group">
        <label htmlFor="phone">Phone number <span style={{ color: 'red' }}>*</span></label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
          placeholder="Enter phone number (xxx-xxx-xxxx)"
          maxLength={12} // Add length limit for the phone number
        />
      </div>
      {error && <p className="error-text">{error}</p>}
      <button className="save-button" onClick={handleSave}>Save</button>
      <button className="cancel-button" onClick={() => navigate('/profile')}>Cancel</button>
    </div>
  );
};

export default EditPhonePage;