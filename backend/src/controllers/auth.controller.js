import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.model.js';
import { validationResult } from 'express-validator';

const INVITE_TTL_MS = 48 * 60 * 60 * 1000;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key-change-this', {
    expiresIn: '30d'
  });
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!user.isActivated) {
      return res.status(403).json({
        success: false,
        message: 'Account is not activated'
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

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

export const setupAdmin = async (req, res, next) => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });

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
      role: 'admin',
      isActivated: true
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

// @desc    Change password for logged-in user
// @route   POST /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(e => e.msg)
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin creates an invite → returns token + placeholder user
// @route   POST /api/auth/invites
// @access  Admin
export const createInvite = async (req, res, next) => {
  try {
    const token = crypto.randomBytes(32).toString('hex');
    const suffix = crypto.randomBytes(4).toString('hex');
    const placeholderUsername = `pending_${suffix}`;
    const placeholderPassword = crypto.randomBytes(16).toString('hex');

    const user = await User.create({
      username: placeholderUsername,
      password: placeholderPassword,
      role: 'member',
      isActivated: false,
      inviteToken: token,
      inviteExpiresAt: new Date(Date.now() + INVITE_TTL_MS)
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        expiresAt: user.inviteExpiresAt
      },
      message: 'Invite created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify invite token still valid
// @route   GET /api/auth/invites/:token
// @access  Public
export const getInvite = async (req, res, next) => {
  try {
    const user = await User.findOne({ inviteToken: req.params.token }).select('+inviteToken');

    if (!user || user.isActivated) {
      return res.status(404).json({
        success: false,
        message: 'Invite not found or already used'
      });
    }

    if (!user.inviteExpiresAt || user.inviteExpiresAt < new Date()) {
      return res.status(410).json({
        success: false,
        message: 'Invite has expired'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        expiresAt: user.inviteExpiresAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete registration from invite token
// @route   POST /api/auth/register/:token
// @access  Public
export const registerFromInvite = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(e => e.msg)
      });
    }

    const user = await User.findOne({ inviteToken: req.params.token }).select('+inviteToken');

    if (!user || user.isActivated) {
      return res.status(404).json({
        success: false,
        message: 'Invite not found or already used'
      });
    }

    if (!user.inviteExpiresAt || user.inviteExpiresAt < new Date()) {
      return res.status(410).json({
        success: false,
        message: 'Invite has expired'
      });
    }

    const { username, email, displayName, password } = req.body;

    const existingUsername = await User.findOne({ username, _id: { $ne: user._id } });
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: 'Username already taken'
      });
    }

    const existingEmail = await User.findOne({ email, _id: { $ne: user._id } });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    user.username = username;
    user.email = email;
    user.displayName = displayName;
    user.password = password;
    user.isActivated = true;
    user.inviteToken = undefined;
    user.inviteExpiresAt = undefined;
    await user.save();

    const authToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        token: authToken
      },
      message: 'Registration successful'
    });
  } catch (error) {
    next(error);
  }
};
