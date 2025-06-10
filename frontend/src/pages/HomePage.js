import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../services/productService';
import Chatbox from '../components/Chatbox';
import { useLocation } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('query') || '';
    setQuery(searchQuery);
    setProducts([]);
    setPage(0);
  }, [location.search]);

  useEffect(() => {
    const searchProducts = async () => {
      setLoading(true);
      const newProducts = await fetchProducts({ query, minPrice, maxPrice, sortOrder, page });
      setProducts((prev) => (page === 0 ? newProducts : [...prev, ...newProducts]));
      setHasMore(newProducts.length > 0);
      setLoading(false);
    };

    searchProducts();
  }, [page, query, minPrice, maxPrice, sortOrder]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight &&
      !loading &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="homepage">
      <div className="hero-banner">
        <h1>Welcome to Our Shop</h1>
        <p>Find the best deals on your favorite products!</p>
      </div>

      <div className="filters">
        <div className="price-filters">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="filter-input"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="filter-input"
          />
        </div>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="sort-dropdown"
        >
          <option value="">Sort by Price</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {loading && <p className="loading-message">Loading...</p>}
      {!hasMore && <p className="end-message">No more products to show</p>}

      <Chatbox />
    </div>
  );
};

export default HomePage;