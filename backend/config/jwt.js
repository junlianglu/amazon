// config/jwt.js

module.exports = {
  secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  expiresIn: '1d',
};
