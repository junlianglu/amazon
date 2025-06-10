import React from 'react';
import AddressesComponent from '../components/AddressesComponent';
import PaymentMethodsComponent from '../components/PaymentMethodsComponent';
import LoginAndSecurityComponent from '../components/LoginAndSecurityComponent';
import './ProfilePage.css';

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account settings and preferences below.</p>
      </div>
      <div className="profile-sections">
        <div className="profile-section">
          <h2>Login & Security</h2>
          <LoginAndSecurityComponent />
        </div>
        <div className="profile-section">
          <h2>Addresses</h2>
          <AddressesComponent />
        </div>
        <div className="profile-section">
          <h2>Payment Methods</h2>
          <PaymentMethodsComponent />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;