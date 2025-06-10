// components/ProductCard.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css'; // Added a CSS file for styles

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleImageClick = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    <div className="product-card" onClick={handleImageClick}>
      <div className="product-image-container">
        <img
          src={product.imageUrls[0]}
          alt={product.name}
          className="product-image"
          style={{ cursor: 'pointer' }}
        />
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-price">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;