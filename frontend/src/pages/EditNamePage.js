import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { updateUserProfile } from '../services/userService';
import './EditPage.css';

const EditNamePage = () => {
  const { user, setUser } = useUser();
  const [name, setName] = useState(user.name);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    try {
      const updatedUser = await updateUserProfile({ ...user, name });
      setUser(updatedUser);
      navigate('/profile');
    } catch {
      setError('Failed to update name. Please try again.');
    }
  };

  return (
    <div className="edit-page">
      <h1>Edit Name</h1>
      <div className="input-group">
        <label htmlFor="name">Name <span style={{ color: 'red' }}>*</span></label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>
      {error && <p className="error-text">{error}</p>}
      <button className="save-button" onClick={handleSave}>Save</button>
      <button className="cancel-button" onClick={() => navigate('/profile')}>Cancel</button>
    </div>
  );
};

export default EditNamePage;