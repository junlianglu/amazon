import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { updateUserProfile } from '../services/userService';

const EditPasswordPage = () => {
  const { user, setUser } = useUser();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSave = async () => {
    // Validate required fields
    if (!currentPassword) {
      setError('Current password is required.');
      return;
    }

    if (!newPassword) {
      setError('New password is required.');
      return;
    }

    if (!reenterPassword) {
      setError('Reentering the new password is required.');
      return;
    }

    // Ensure new passwords match
    if (newPassword !== reenterPassword) {
      setError('New password and reentered password do not match.');
      return;
    }

    try {
      const updatedUser = await updateUserProfile({
        ...user,
        currentPassword, // Verify the current password with the backend
        newPassword,
      });
      setUser(updatedUser);
      navigate('/profile');
    } catch {
      setError('Failed to update password. Please ensure your current password is correct.');
    }
  };

  return (
    <div className="edit-page">
      <h1>Change Password</h1>
      <p>To change the password for your account, use this form.</p>
      <div className="input-group">
        <label htmlFor="currentPassword">Current password <span style={{ color: 'red' }}>*</span></label>
        <input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter your current password"
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="newPassword">New password <span style={{ color: 'red' }}>*</span></label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter your new password"
          required
        />
      </div>
      <div className="input-group">
        <label htmlFor="reenterPassword">Reenter new password <span style={{ color: 'red' }}>*</span></label>
        <input
          id="reenterPassword"
          type="password"
          value={reenterPassword}
          onChange={(e) => setReenterPassword(e.target.value)}
          placeholder="Reenter your new password"
          required
        />
      </div>
      {error && <p className="error-text">{error}</p>}
      <button className="save-button" onClick={handleSave}>Save changes</button>
      <button className="cancel-button" onClick={() => navigate('/profile')}>Cancel</button>
    </div>
  );
};

export default EditPasswordPage;