import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import './LoginAndSecurityComponent.css';

const LoginAndSecurityComponent = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <div className="login-security-container">
      <h1 className="section-title">Login & Security</h1>
      <div className="login-security-content">
        <div className="security-item">
          <div className="item-details">
            <strong>Name</strong>
            <p className="item-value">{user.name}</p>
          </div>
          <button
            className="edit-button"
            onClick={() => navigate('/edit-name')}
          >
            Edit
          </button>
        </div>
        <div className="security-item">
          <div className="item-details">
            <strong>Email</strong>
            <p className="item-value">{user.email}</p>
          </div>
          <button
            className="edit-button"
            onClick={() => navigate('/edit-email')}
          >
            Edit
          </button>
        </div>
        <div className="security-item">
          <div className="item-details">
            <strong>Primary mobile number</strong>
            <p className="item-value">{user.phoneNumber}</p>
          </div>
          <button
            className="edit-button"
            onClick={() => navigate('/edit-phone')}
          >
            Edit
          </button>
        </div>
        <div className="security-item">
          <div className="item-details">
            <strong>Password</strong>
            <p className="item-value">**********</p>
          </div>
          <button
            className="edit-button"
            onClick={() => navigate('/edit-password')}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginAndSecurityComponent;