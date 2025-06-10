// pages/OrdersPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import './OrdersPage.css';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const OrdersPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('No token found');

        const response = await axios.get(`${BASE_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/'); // Redirect to the homepage or another appropriate page
    }
  }, [user, navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="orders-page">
      <h1 className="orders-title">My Orders</h1>
      <div className="orders-list">
        {orders.length === 0 ? (
          <p className="no-orders-message">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>Order ID: {order._id}</h3>
                <span className="order-status">{order.status}</span>
              </div>
              <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
              <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
              <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod.cardType} ending in {order.paymentMethod.cardNumber.slice(-4)}</p>
              <h4>Products:</h4>
              <ul className="order-products-list">
                {order.products.map((product) => (
                  <li key={product.productId} className="order-product-item">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="order-product-image"
                    />
                    <div className="order-product-details">
                      <span className="product-name">{product.name}</span>
                      <span className="product-quantity">(x{product.quantity})</span>
                      <span className="product-price"> - ${product.price * product.quantity}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersPage;