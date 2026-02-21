import express from 'express';
import {
  signup,
  login,
  getMe,
  updateMe,
  updateMyPassword,
  forgotPassword,
  resetPassword,
  logout,
  resendVerificationOTP,
  verifyOTP
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').trim().notEmpty().withMessage('Phone number is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters'),
  body('confirmNewPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('New passwords do not match');
    }
    return true;
  })
];

const resetPasswordValidation = [
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  })
];

// Routes
router.post('/signup', signupValidation, validate, signup);
router.post('/login', loginValidation, validate, login);
router.post('/forgot-password', body('email').isEmail().withMessage('Please provide a valid email'), validate, forgotPassword);
router.patch('/reset-password/:token', resetPasswordValidation, validate, resetPassword);
router.post('/resend-otp', resendVerificationOTP);
router.post('/verify-otp', verifyOTP);

// Protected routes
router.get('/me', protect, getMe);
router.patch('/updateMe', protect, updateMe);
router.patch('/updateMyPassword', protect, updatePasswordValidation, validate, updateMyPassword);
router.post('/logout', protect, logout);

export default router;