import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useUser } from '../context/UserContext';
import { uploadProductImages, createProduct } from '../services/productService';
import { useNavigate } from 'react-router-dom';
import './CreateProductPage.css';

const CreateProductPage = () => {
  const { user, setUser } = useUser();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [hasSelectedImages, setHasSelectedImages] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const categories = ['Electronics', 'Books', 'Clothing', 'Home', 'Sports'];

  useEffect(() => {
    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setHasSelectedImages(files.length > 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      setError('Description is required.');
      return;
    }
    if (price <= 0) {
      setError('Price must be greater than zero.');
      return;
    }

    setLoading(true);
    setSuccessMessage('Creating product...');
    setError(null);

    const newProduct = { name, price, description, category };

    try {
      const product = await createProduct(newProduct);
      setUser((prevUser) => ({
        ...prevUser,
        products: [...prevUser.products, product._id],
      }));

      const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('images', selectedFiles[i]);
      }

      try {
        await uploadProductImages(product._id, formData);
        setSuccessMessage('Product successfully created!');
        setTimeout(() => {
          navigate('/my-products');
        }, 2000); // Redirect after 2 seconds
      } catch (error) {
        console.error('Image upload failed:', error);
        setError('Failed to upload images.');
      }
    } catch (err) {
      setError('Product creation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-product-page">
      <h2 className="page-title">Create New Product</h2>
      <form onSubmit={handleSubmit} className="create-product-form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Product Name<span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="price" className="form-label">
            Price ($)<span className="required">*</span>
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description<span className="required">*</span>
          </label>
          <ReactQuill
            value={description}
            onChange={setDescription}
            placeholder="Write a detailed description, including bullet points if needed"
            theme="snow"
          />
        </div>
        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Category<span className="required">*</span>
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="form-select"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="error-message">{error}</p>}
        {loading && <p className="loading-message">{successMessage}</p>}

        <div className="upload-images-section form-group">
          <h4 className="section-title">Upload Images</h4>
          <input type="file" multiple onChange={handleFileChange} className="file-input" />
          {!hasSelectedImages && <p className="error-message">Please upload at least one image.</p>}
        </div>

        <button type="submit" className="create-button" disabled={!hasSelectedImages || loading}>
          {loading ? 'Processing...' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default CreateProductPage;