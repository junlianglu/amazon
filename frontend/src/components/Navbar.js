import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { FaShoppingCart } from 'react-icons/fa'; // Import cart icon
import amazonLogo from '../assets/amazon-logo.png';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useUser();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    clearCart();
    navigate('/');
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(''); // Clear the search bar
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="amazon-logo">🛍️ Online Marketplace Platform</Link>
      </div>
      <form className="search-bar-container" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Search for products, brands, and more"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      <ul className="navbar-links">
        {user ? (
          <div className="dropdown">
            <span className="dropdown-toggle">Hi, {user.name.split(' ')[0]}</span>
            <div className="dropdown-menu">
              <Link to="/profile">My Profile</Link>
              <Link to="/orders">My Orders</Link>
              {user?.role === 'seller' && (
                <Link to="/my-products">My Products</Link>
              )}
              {user.role === 'seller' && <Link to="/create-product">Create Product</Link>}
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        <button onClick={handleGoToCart} className="cart-button">
          <FaShoppingCart className="cart-icon" />
          <span className="cart-count">{cart.products.reduce((total, item) => total + item.quantity, 0)}</span>
        </button>
      </ul>
    </nav>
  );
};

export default Navbar;