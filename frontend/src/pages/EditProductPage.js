import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct, uploadProductImages } from '../services/productService';
import { useUser } from '../context/UserContext';
import './EditProductPage.css';

const EditProductPage = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [error, setError] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();

  const categories = ['Electronics', 'Books', 'Clothing', 'Home', 'Sports'];

  useEffect(() => {
    if (!user || user.role !== 'seller') {
      navigate('/');
    } else {
      fetchProductDetails();
    }
  }, [user, id, navigate]);

  const fetchProductDetails = async () => {
    try {
      const product = await getProductById(id);
      setName(product.name);
      setBrand(product.brand);
      setPrice(product.price);
      setDescription(product.description);
      setCategory(product.category);
      setImages(product.imageUrls || []);
    } catch (err) {
      setError('Failed to fetch product details');
    }
  };

  const handleImageDragStart = (index) => setDraggedIndex(index);

  const handleImageDrop = (index) => {
    setImages((prevImages) => {
      if (!Array.isArray(prevImages)) return prevImages;
      const updatedImages = [...prevImages];
      const [removedImage] = updatedImages.splice(draggedIndex, 1);
      updatedImages.splice(index, 0, removedImage);
      return updatedImages;
    });
    setDraggedIndex(null);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure required fields are filled
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }
    if (price <= 0) {
      setError('Price must be greater than zero.');
      return;
    }
    try {
      const updatedProductData = {
        name,
        brand,
        price,
        description,
        category,
        imageUrls: images,
      };
      await updateProduct(id, updatedProductData);
      navigate(`/products/${id}`);
    } catch (err) {
      setError('Product update failed');
    }
  };

  const handleImageChange = async (e) => {
    const selectedFiles = [...e.target.files];
    if (!selectedFiles.length) {
      setError('Please select images to upload.');
      return;
    }
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append('images', file));
      await uploadProductImages(id, formData);
      fetchProductDetails();
    } catch (err) {
      setError('Failed to upload images.');
    }
  };

  const handleImageClick = (url) => setExpandedImage(url);

  const closeExpandedView = () => setExpandedImage(null);

  return (
    <div className="edit-product-page">
      <h1 className="page-title">Edit Product</h1>
      <form onSubmit={handleSubmit} className="edit-product-form">
        <div className="form-group">
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="brand">Brand</label>
          <input
            type="text"
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price ($)</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <ReactQuill
            value={description}
            onChange={setDescription}
            placeholder="Write a detailed description, including bullet points if needed"
            theme="snow"
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Existing Images</label>
          <div className="image-preview">
            {images.map((url, index) => (
              <div
                key={index}
                className="image-container"
                draggable
                onDragStart={() => handleImageDragStart(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleImageDrop(index)}
                style={{ position: 'relative' }}
              >
                <img
                  src={url}
                  alt={`Product Image ${index + 1}`}
                  className="existing-image"
                  onClick={() => handleImageClick(url)}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="remove-button"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="new-images">Upload New Images</label>
          <input
            type="file"
            id="new-images"
            onChange={handleImageChange}
            multiple
            accept="image/*"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-button">
          Update Product
        </button>
      </form>
      {expandedImage && (
        <div className="expanded-view" onClick={closeExpandedView}>
          <img src={expandedImage} alt="Expanded Product" />
        </div>
      )}
    </div>
  );
};

export default EditProductPage;