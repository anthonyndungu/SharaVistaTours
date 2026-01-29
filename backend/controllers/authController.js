import { User } from '../models/index.js';
import { signToken } from '../middleware/auth.js';
import { sendEmail } from '../utils/email.js';
import logger from '../utils/logger.js';
import crypto from 'crypto';

// @desc    Signup new user
// @route   POST /api/v1/auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'Passwords do not match'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: 'client'
    });

    // Generate token
    const token = signToken(user.id);

    // Remove password from output
    user.password = undefined;

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json({
      status: 'success',
      message: 'Account created successfully! Please verify your email.',
      token,
      data: { user }
    });
  } catch (err) {
    logger.error('Signup error:', err);
    
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        status: 'fail',
        message: 'Email already exists'
      });
    }
    
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password!'
      });
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ where: { email } });
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    // 3) Generate token
    const token = signToken(user.id);

    // 4) Remove password from output
    user.password = undefined;

    logger.info(`User logged in: ${user.email}`);

    res.status(200).json({
      status: 'success',
      token,
      data: { user }
    });
  } catch (err) {
    logger.error('Login error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong during login'
    });
  }
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'password_changed_at', 'password_reset_token', 'password_reset_expires'] }
    });

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    logger.error('Get me error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// @desc    Update current user
// @route   PATCH /api/v1/auth/updateMe
// @access  Private
export const updateMe = async (req, res) => {
  try {
    // 1) Create user update object
    const updateData = {};
    
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.email) updateData.email = req.body.email;
    if (req.body.phone) updateData.phone = req.body.phone;

    // 2) Update user
    const user = await User.findByPk(req.user.id);
    await user.update(updateData);

    // 3) Send updated user
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'password_changed_at', 'password_reset_token', 'password_reset_expires'] }
    });

    logger.info(`User updated: ${user.email}`);

    res.status(200).json({
      status: 'success',
      data: { user: updatedUser }
    });
  } catch (err) {
    logger.error('Update me error:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// @desc    Update current user password
// @route   PATCH /api/v1/auth/updateMyPassword
// @access  Private
export const updateMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // 1) Check if passwords match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'New passwords do not match'
      });
    }

    // 2) Get current user
    const user = await User.findByPk(req.user.id);

    // 3) Check if current password is correct
    if (!(await user.correctPassword(currentPassword, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Current password is incorrect'
      });
    }

    // 4) Update password
    user.password = newPassword;
    await user.save();

    // 5) Log user in with new token
    const token = signToken(user.id);

    logger.info(`Password updated for user: ${user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
      token
    });
  } catch (err) {
    logger.error('Update password error:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ where: { email: req.body.email } });
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'There is no user with that email address'
      });
    }

    // 2) Generate random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validate: false });

    // 3) Send reset token to user's email
    try {
      const resetURL = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;
      
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 minutes)',
        message: `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
      });
    } catch (err) {
      user.password_reset_token = null;
      user.password_reset_expires = null;
      await user.save({ validate: false });

      logger.error('Error sending email:', err);
      
      return res.status(500).json({
        status: 'fail',
        message: 'There was an error sending the email. Try again later!'
      });
    }
  } catch (err) {
    logger.error('Forgot password error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// @desc    Reset password
// @route   PATCH /api/v1/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    // 1) Get user based on token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      where: {
        password_reset_token: hashedToken,
        password_reset_expires: { [Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.status(400).json({
        status: 'fail',
        message: 'Token is invalid or has expired'
      });
    }

    // 2) Set new password
    user.password = req.body.password;
    user.password_reset_token = null;
    user.password_reset_expires = null;
    await user.save();

    // 3) Log user in with new token
    const token = signToken(user.id);

    logger.info(`Password reset for user: ${user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully',
      token,
      data: { user }
    });
  } catch (err) {
    logger.error('Reset password error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    // In JWT, we don't need to do anything server-side
    // Client should delete the token
    
    logger.info(`User logged out: ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (err) {
    logger.error('Logout error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};