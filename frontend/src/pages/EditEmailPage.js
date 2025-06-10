import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { updateUserProfile } from '../services/userService';
import './EditPage.css';

const EditEmailPage = () => {
  const { user, setUser } = useUser();
  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email.');
      return;
    }
    try {
      const updatedUser = await updateUserProfile({ ...user, email });
      setUser(updatedUser);
      navigate('/profile');
    } catch (err) {
      if (err.message === 'Email already exists') {
        setError('This email is already associated with another account.');
      } else {
        setError('Failed to update email. Please try again.');
      }
    }
  };

  return (
    <div className="edit-page">
      <h1>Edit Email</h1>
      <div className="input-group">
        <label htmlFor="email">Email <span style={{ color: 'red' }}>*</span></label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>
      {error && <p className="error-text">{error}</p>}
      <button className="save-button" onClick={handleSave}>Save</button>
      <button className="cancel-button" onClick={() => navigate('/profile')}>Cancel</button>
    </div>
  );
};

export default EditEmailPage;