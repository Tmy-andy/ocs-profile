import express from 'express';
import { body } from 'express-validator';
import {
  login,
  getMe,
  setupAdmin,
  createInvite,
  getInvite,
  registerFromInvite
} from '../controllers/auth.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

const loginValidation = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const setupValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
];

const registerValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, underscores'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('displayName')
    .trim()
    .notEmpty().withMessage('Display name is required')
    .isLength({ max: 50 }).withMessage('Display name cannot exceed 50 characters'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match')
];

router.post('/login', loginValidation, login);
router.get('/me', protect, getMe);
router.post('/setup', setupValidation, setupAdmin);

router.post('/invites', protect, adminOnly, createInvite);
router.get('/invites/:token', getInvite);
router.post('/register/:token', registerValidation, registerFromInvite);

export default router;
