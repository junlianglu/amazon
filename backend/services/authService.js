const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

// Login function with role handling
exports.login = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const tokenPayload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Include user's role for access control
        profileImage: user.profileImage, // Optional: Include profile image if you need it
        properties: user.properties, // Optional: Include properties if necessary
        bookings: user.bookings,
    };
    
    const token = jwt.sign(
        tokenPayload,
        jwtConfig.secret, 
        jwtConfig.options
    );
    
    return token;
};

// Register function with role support
exports.register = async ({ email, password, name, role = 'user' }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
        email, 
        password: hashedPassword, 
        name, 
        role // Save the user's role (defaults to 'user')
    });
    
    await newUser.save();
    return ({
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
    });
};
