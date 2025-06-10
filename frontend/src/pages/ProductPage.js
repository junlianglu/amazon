// pages/ProductPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import Chatbox from '../components/Chatbox';
import './ProductPage.css';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const ProductPage = () => {
  const { id } = useParams();
  const { user } = useUser();
  const { addItemToCart } = useCart();
  const [quantity, setQuantity] = useState(1); // New state for quantity
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartMessage, setCartMessage] = useState('');
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products/${id}`);
        setProduct(response.data);
        setSelectedImage(response.data.imageUrls[0]); // Default selected image
      } catch (err) {
        setError('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    const fetchSimilarProducts = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/products/${id}/similar`);
        setSimilarProducts(res.data);
      } catch (error) {
        console.error('Error fetching similar products:', error);
      }
    };

    fetchProduct();
    fetchSimilarProducts();

    setCartMessage('');
    setQuantity(1);
    window.scrollTo(0, 0);
  }, [id]);

  const toggleDescription = () => {
    setShowFullDescription((prev) => !prev);
  };

  const handleMouseEnter = () => {
    setHovering(true);
  };
  
  const handleMouseLeave = () => {
    setHovering(false);
  };

  const handleZoom = (e) => {
    const bounds = e.target.getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top) / bounds.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (product) {
      try {
        await addItemToCart({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: quantity, // Use selected quantity
          imageUrl: product.imageUrls ? product.imageUrls[0] : '',
        });
        setCartMessage('Item added to cart!');
      } catch {
        setCartMessage('Failed to add item to cart.');
      }
    }
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // Adjust the structure to separate the sections
  return (
    <div className="product-page">
      <div className="product-container">
        <div className="product-images">
          {/* Thumbnails */}
          <div className="thumbnail-slider">
            {product.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail ${selectedImage === url ? 'active' : ''}`}
                onMouseEnter={() => handleImageClick(url)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div
            className="main-image"
            onMouseMove={handleZoom}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={openModal}
          >
            <img src={selectedImage} alt="Product" />
            <div
              className="magnifier"
              style={{
                backgroundImage: `url(${selectedImage})`,
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />
            {/* Text below the image */}
            <div className="image-below-text">
              {hovering ? 'Click image to open expanded view' : 'Roll over image to zoom in'}
            </div>
          </div>
        </div>

        <div className="product-description">
          <h2>{product.name}</h2>
          {product.brand && <p className="brand"><b>Brand: </b>{product.brand}</p>}
          <hr className="section-divider" /> {/* Horizontal line below brand */}
          <div className="description">
            <h4>About this item</h4>
            <div
              className="rich-text-description"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  showFullDescription ? product.description : product.description.substring(0, 800)
                ),
              }}
            />
            {product.description.length > 200 && (
              <button onClick={toggleDescription} className="show-more">
                {showFullDescription ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>
        </div>

        <div className="purchase-options">
          <p className="price">${product.price.toFixed(2)}</p>
          <label>
            Quantity:
            <select
              value={quantity}
              onChange={handleQuantityChange}
              className="quantity-select"
            >
              {[...Array(10).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </label>
          <button onClick={handleAddToCart} className="add-to-cart">
            Add to Cart
          </button>
          {cartMessage && <p className="cart-message">{cartMessage}</p>}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Expanded Product" />
            <button className="close-modal" onClick={closeModal}>
              ×
            </button>
          </div>
        </div>
      )}

      <h2>Similar Products</h2>
      <div className="similar-products">
        {similarProducts.length > 0 ? (
          similarProducts.map((similarProduct) => (
            <ProductCard key={similarProduct._id} product={similarProduct} />
          ))
        ) : (
          <p>No similar products found.</p>
        )}
      </div>

      <div className="chatbox-container">
        <Chatbox product={product} />
      </div>
    </div>
  );
};

export default ProductPage;