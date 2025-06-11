# 🛒 Amazon Clone – Online Marketplace Platform

A scalable and feature-rich Amazon-like eCommerce platform supporting user, seller, and admin roles. Built using the MERN stack, integrated with AWS services, OpenAI, and OpenSearch to deliver a smart, modern shopping experience.

## 🚀 Features

- 👥 Role-based access (User, Seller, Admin) with JWT authentication
- 🛍️ Product browsing, searching, filtering, and full cart/checkout flow
- 🧾 Order history, payment method management, and address autocomplete
- 🧠 AI-powered virtual assistant (OpenAI) for product Q&A and guidance
- 📦 Seller dashboard with product listing, editing, and drag-and-drop image uploads
- 🔎 AWS OpenSearch integration for full-text search and smart recommendations
- 🌍 Google Places API for checkout address autocomplete
- ☁️ AWS S3 + CloudFront for fast, secure media hosting

## 🛠 Tech Stack

**Frontend**
- React 18
- React Router
- Context API
- Modular components (Cart, Products, Orders, Chatbot)

**Backend**
- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT + bcrypt for authentication

**Cloud & AI**
- AWS S3 & CloudFront (image upload + delivery)
- AWS OpenSearch (search and recommendation)
- OpenAI API (chatbot assistant)
- Google Places API (location autocomplete)

## ⚙️ Setup

```bash
git clone https://github.com/junlianglu/amazon.git
cd amazon

# 1️⃣  Backend
cd backend
cp .env.example .env           # add your keys
npm install
npm start &                    # starts on http://localhost:8080
cd ..

# 2️⃣  Frontend
cd frontend
cp .env.example .env           # ensure REACT_APP_API_URL points to your backend
npm install
npm start                    # React server on http://localhost:3000
```

## 🌐 Live Demo

⚠️ Deployment available upon request to prevent abuse and stay within AWS free tier limits.

Feel free to reach out via [LinkedIn](https://linkedin.com/in/junliang-lu) or [email](mailto:junliang.lu.dev@gmail.com) for access.
