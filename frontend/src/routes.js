// routes.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateProductPage from './pages/CreateProductPage';
import EditProductPage from './pages/EditProductPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage.js';
import MyProductsPage from './pages/MyProductsPage';
import EditAddressPage from './pages/EditAddressPage';
import EditPaymentMethodPage from './pages/EditPaymentMethodPage';
import EditNamePage from './pages/EditNamePage';
import EditEmailPage from './pages/EditEmailPage';
import EditPhonePage from './pages/EditPhonePage';
import EditPasswordPage from './pages/EditPasswordPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products/:id" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/checkout-success" element={<CheckoutSuccessPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/create-product" element={<CreateProductPage />} />
      <Route path="/edit-product/:id" element={<EditProductPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/my-products" element={<MyProductsPage />} />
      <Route path="/edit-address/:index" element={<EditAddressPage />} />
      <Route path="/edit-payment-method/:index" element={<EditPaymentMethodPage />} />
      <Route path="/edit-name" element={<EditNamePage />} />
      <Route path="/edit-email" element={<EditEmailPage />} />
      <Route path="/edit-phone" element={<EditPhonePage />} />
      <Route path="/edit-password" element={<EditPasswordPage />} />
    </Routes>
  );
};

export default AppRoutes;