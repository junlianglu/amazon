// pages/MyProductsPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getProductById } from '../services/productService';
import './MyProductsPage.css';

const MyProductsPage = () => {
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSellerProducts = async () => {
      setLoading(true); // Start loading
      try {
        const productDetails = await Promise.all(
          user.products.map(async (productId) => {
            return await getProductById(productId);
          })
        );
        setProducts(productDetails);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false); // End loading
      }
    };

    if (!user || user.role !== 'seller') {
      navigate('/'); // Redirect if not a seller
    } else {
      fetchSellerProducts();
    }
  }, [user, navigate]);

  const handleEditClick = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  return (
    <div className="my-products-page">
      <h2 className="page-title">My Products</h2>
      {loading ? (
        <div className="loading-spinner">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          {error && <p className="error-message">{error}</p>}
          {products.length > 0 ? (
            <div className="product-grid">
              {products.map((product) => (
                <div key={product._id} className="product-card">
                  <img
                    src={product.imageUrls[0]}
                    alt={product.name}
                    className="product-card-image"
                  />
                  <div className="product-card-details">
                    <h3 className="product-card-title">{product.name}</h3>
                    <p className="product-card-price">${product.price.toFixed(2)}</p>
                    <button
                      onClick={() => handleEditClick(product._id)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-products-message">You don't have any products listed yet.</p>
          )}
        </>
      )}
    </div>
  );
};

export default MyProductsPage;