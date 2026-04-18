import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key-change-this', {
    expiresIn: '30d'
  });
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        role: user.role,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create admin user (only for initial setup)
// @route   POST /api/auth/setup
// @access  Public (should be disabled after first use)
export const setupAdmin = async (req, res, next) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({});
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists'
      });
    }

    const { username, password } = req.body;

    const user = await User.create({
      username,
      password,
      role: 'admin'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        role: user.role,
        token
      },
      message: 'Admin user created successfully'
    });
  } catch (error) {
    next(error);
  }
};
