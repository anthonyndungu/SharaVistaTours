import { User, sequelize } from '../models/index.js';
import { Op } from 'sequelize'; // ✅ Added missing import
import { signToken } from '../middleware/auth.js';
import { sendEmail } from '../utils/email.js';
import logger from '../utils/logger.js';
import crypto from 'crypto';

// Helper to filter user object for response
const filterUser = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    profile_picture: user.profile_picture,
    is_verified: user.is_verified,
    created_at: user.created_at
  };
};

// @desc    Signup new user
// @route   POST /api/v1/auth/signup
// @access  Public
export const signup = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    // 1. Validation
    if (!name || !email || !phone || !password) {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide all required fields (name, email, phone, password)'
      });
    }

    if (password !== confirmPassword) {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'Passwords do not match'
      });
    }

    // 2. Create user (Transaction passed to hook automatically via context if configured, 
    // but here we just pass transaction to create)
    const user = await User.create({
      name,
      email,
      phone,
      password, // Model hook will hash this
      role: 'client' // Force role to client on signup
    }, { transaction: t });

    // 3. Generate token
    const token = signToken(user.id);

    await t.commit();

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json({
      status: 'success',
      message: 'Account created successfully',
      token,
      data: { user: filterUser(user) }
    });
  } catch (err) {
    await t.rollback();
    logger.error('Signup error:', err);

    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        status: 'fail',
        message: 'Email already exists. Please use a different email.'
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

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // 1) Check if email and password exist
//     if (!email || !password) {
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Please provide email and password!'
//       });
//     }

//     // 2) Check if user exists && password is correct
//     // Explicitly select password field since default might exclude it
//     const user = await User.findOne({ 
//       where: { email },
//       attributes: { include: ['password'] } 
//     });

//     if (!user || !(await user.correctPassword(password, user.password))) {
//       return res.status(401).json({
//         status: 'fail',
//         message: 'Incorrect email or password'
//       });
//     }

//     // 3) Generate token
//     const token = signToken(user.id);

//     logger.info(`User logged in: ${user.email}`);

//     res.status(200).json({
//       status: 'success',
//       token,
//       data: { user: filterUser(user) }
//     });
//   } catch (err) {
//     logger.error('Login error:', err);
//     res.status(500).json({
//       status: 'error',
//       message: 'Something went wrong during login'
//     });
//   }
// };

// backend/controllers/authController.js

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
    const user = await User.findOne({
      where: { email },
      attributes: { include: ['password', 'is_verified'] }
    });

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      });
    }

    // ✅ 3) NEW CHECK: Verify if account is activated
    if (!user.is_verified) {
      return res.status(403).json({
        status: 'fail',
        message: 'Account not verified. Please check your email to activate your account before logging in.',
        code: 'ACCOUNT_NOT_VERIFIED' // Optional code for frontend handling
      });
    }

    // 4) Generate token
    const token = signToken(user.id);

    logger.info(`User logged in: ${user.email}`);

    res.status(200).json({
      status: 'success',
      token,
      data: { user: filterUser(user) }
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
      attributes: {
        exclude: ['password', 'password_changed_at', 'password_reset_token', 'password_reset_expires']
      }
    });

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

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
  const t = await sequelize.transaction();
  try {
    // 1) Filter unwanted fields (Security: Prevent role escalation)
    const filteredBody = {};
    if (req.body.name) filteredBody.name = req.body.name;
    if (req.body.email) filteredBody.email = req.body.email;
    if (req.body.phone) filteredBody.phone = req.body.phone;
    if (req.body.profile_picture) filteredBody.profile_picture = req.body.profile_picture;

    // Do NOT allow updating password here (use updateMyPassword)
    // Do NOT allow updating role

    // 2) Update user
    const user = await User.findByPk(req.user.id, { transaction: t });

    if (!user) {
      await t.rollback();
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    await user.update(filteredBody, { transaction: t });

    await t.commit();

    // 3) Fetch updated user
    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password', 'password_changed_at', 'password_reset_token', 'password_reset_expires'] }
    });

    logger.info(`User updated: ${user.email}`);

    res.status(200).json({
      status: 'success',
      data: { user: updatedUser }
    });
  } catch (err) {
    await t.rollback();
    logger.error('Update me error:', err);

    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
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

// @desc    Update current user password
// @route   PATCH /api/v1/auth/updateMyPassword
// @access  Private
// export const updateMyPassword = async (req, res) => {
//   const t = await sequelize.transaction();
//   try {
//     const { currentPassword, newPassword, confirmNewPassword } = req.body;

//     // 1) Validate passwords
//     if (!currentPassword || !newPassword || !confirmNewPassword) {
//       await t.rollback();
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Please provide current password, new password, and confirmation'
//       });
//     }

//       //  Check current password with old password (This is the critical fix to ensure we are comparing the correct values)
//     if (currentPassword === newPassword) {
//       await t.rollback();
//       return res.status(400).json({
//         status: 'fail',
//         message: 'Current password cannot be same as old one!'
//       });
//     }

//     if (newPassword !== confirmNewPassword) {
//       await t.rollback();
//       return res.status(400).json({
//         status: 'fail',
//         message: 'New passwords do not match*******'
//       });
//     }

//     // 2) Get current user (include password)
//     const user = await User.findByPk(req.user.id, {
//       attributes: { include: ['password'] },
//       transaction: t
//     });

//     if (!user) {
//       await t.rollback();
//       return res.status(404).json({ status: 'fail', message: 'User not found' });
//     }

//     // 3) Check current password
//     if (!(await user.correctPassword(currentPassword, user.password))) {
//       await t.rollback();
//       return res.status(401).json({
//         status: 'fail',
//         message: 'Current password is incorrect'
//       });
//     }

//     // 4) Update password (Hook will hash it)
//     user.password = newPassword;
//     await user.save({ transaction: t });

//     await t.commit();

//     // 5) Log user in with new token
//     const token = signToken(user.id);

//     logger.info(`Password updated for user: ${user.email}`);

//     res.status(200).json({
//       status: 'success',
//       message: 'Password updated successfully',
//       token,
//       data: { user: filterUser(user) }
//     });
//   } catch (err) {
//     await t.rollback();
//     logger.error('Update password error:', err);
//     res.status(400).json({
//       status: 'fail',
//       message: err.message
//     });
//   }
// };

export const updateMyPassword = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // 1) Basic Validation: Ensure all fields are present
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide current password, new password, and confirmation'
      });
    }

    // 2) Validation: Ensure New Password matches Confirmation
    if (newPassword !== confirmNewPassword) {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'New passwords do not match'
      });
    }

    // 3) Validation: Ensure New Password is NOT the same as Current Password
    // (No need to hit DB for this, just compare strings)
    if (currentPassword === newPassword) {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'New password cannot be the same as your current password'
      });
    }

    // 4) Get current user from DB (include password hash for verification)
    const user = await User.findByPk(req.user.id, {
      attributes: { include: ['password'] },
      transaction: t
    });

    if (!user) {
      await t.rollback();
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    // 5) ✅ CRITICAL DB CHECK: Compare entered 'currentPassword' with hashed password in DB
    // user.correctPassword(candidate, hashed) returns true if they match
    const isPasswordValid = await user.correctPassword(currentPassword, user.password);
    
    if (!isPasswordValid) {
      await t.rollback();
      return res.status(401).json({
        status: 'fail',
        message: 'Current password is incorrect'
      });
    }

    // 6) Update password (Model hook will automatically hash 'newPassword' before saving)
    user.password = newPassword;
    await user.save({ transaction: t });

    await t.commit();

    // 7) Generate new token (optional, but good practice after security change)
    const token = signToken(user.id);

    logger.info(`Password updated successfully for user: ${user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
      token,
      data: { user: filterUser(user) }
    });
  } catch (err) {
    await t.rollback();
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
  const t = await sequelize.transaction();
  try {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      await t.rollback();
      // Return success anyway to prevent email enumeration attacks
      return res.status(200).json({
        status: 'success',
        message: 'If an account exists with that email, a reset link has been sent.'
      });
    }

    // 2) Generate random reset token
    const resetToken = user.createPasswordResetToken();

    // Save token to DB within transaction
    await user.save({ validate: false, transaction: t });

    // 3) Send reset token to user's email
    try {
      const resetURL = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;

      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 minutes)',
        message: `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}\n\nIf you didn't forget your password, please ignore this email!`
      });

      await t.commit();

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!'
      });
    } catch (err) {
      // If email fails, rollback the token save
      await t.rollback();

      // Clear the token fields manually just in case rollback didn't catch something weird
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
    await t.rollback();
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
  const t = await sequelize.transaction();
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
      },
      transaction: t
    });

    if (!user) {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'Token is invalid or has expired'
      });
    }

    // 2) Set new password
    if (!req.body.password || !req.body.confirmPassword) {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide password and confirmPassword'
      });
    }

    if (req.body.password !== req.body.confirmPassword) {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'Passwords do not match'
      });
    }

    user.password = req.body.password;
    user.password_reset_token = null;
    user.password_reset_expires = null;

    await user.save({ transaction: t });
    await t.commit();

    // 3) Log user in with new token
    const token = signToken(user.id);

    logger.info(`Password reset for user: ${user.email}`);

    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully',
      token,
      data: { user: filterUser(user) }
    });
  } catch (err) {
    await t.rollback();
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
    logger.info(`User logged out: ${req.user?.email || 'unknown'}`);

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully. Please delete the token on the client side.'
    });
  } catch (err) {
    logger.error('Logout error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// @desc    Resend Verification OTP
// @route   POST /api/v1/auth/resend-otp
// @access  Public
export const resendVerificationOTP = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { email } = req.body;

    if (!email) {
      await t.rollback();
      return res.status(400).json({ status: 'fail', message: 'Email is required' });
    }

    const user = await User.findOne({ where: { email }, transaction: t });

    if (!user) {
      await t.rollback();
      // Security: Don't reveal if email exists or not
      return res.status(200).json({
        status: 'success',
        message: 'If an account exists, an OTP has been sent.'
      });
    }

    if (user.is_verified) {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'Account is already verified. Please login.'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save OTP to user record (You need to add these columns to User model if not present)
    // Alternatively, create a separate 'Otp' model. For simplicity, we add to User.
    user.password_reset_token = otp; // Re-using this field for OTP storage temporarily
    user.password_reset_expires = otpExpiry;

    await user.save({ transaction: t });
    await t.commit();

    // Send Email
    await sendEmail({
      email: user.email,
      subject: 'Your Account Verification OTP',
      message: `Hello ${user.name},\n\nYour One-Time Password (OTP) to verify your account is: \n\n🔐 ${otp}\n\nThis code expires in 10 minutes.\n\nIf you did not request this, please ignore this email.`
    });

    logger.info(`OTP sent to ${email}`);

    res.status(200).json({
      status: 'success',
      message: 'OTP sent successfully to your email.'
    });

  } catch (err) {
    await t.rollback();
    logger.error('Resend OTP error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// @desc    Verify OTP and Activate Account
// @route   POST /api/v1/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      await t.rollback();
      return res.status(400).json({ status: 'fail', message: 'Email and OTP are required' });
    }

    const user = await User.findOne({
      where: {
        email,
        password_reset_token: otp, // Check if OTP matches
        password_reset_expires: { [Op.gt]: Date.now() } // Check if not expired
      },
      transaction: t
    });

    if (!user) {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid or expired OTP. Please request a new one.'
      });
    }

    // Activate Account
    user.is_verified = true;
    user.password_reset_token = null; // Clear OTP
    user.password_reset_expires = null;

    await user.save({ transaction: t });
    await t.commit();

    logger.info(`Account verified via OTP: ${email}`);

    res.status(200).json({
      status: 'success',
      message: 'Account verified successfully! You can now log in.'
    });

  } catch (err) {
    await t.rollback();
    logger.error('Verify OTP error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// @desc    Verify a user manually (Admin only)
// @route   PATCH /api/v1/users/:id/verify
// @access  Private/Admin
export const verifyUser = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    // 1. Check Admin Role
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      await t.rollback();
      return res.status(403).json({
        status: 'fail',
        message: 'Access denied. Admin privileges required.'
      });
    }

    // 2. Find User
    const user = await User.findByPk(req.params.id, { transaction: t });

    if (!user) {
      await t.rollback();
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    if (user.is_verified) {
      await t.rollback();
      return res.status(400).json({
        status: 'fail',
        message: 'User is already verified.'
      });
    }

    // 3. Update Status
    user.is_verified = true;
    // Optional: Clear any pending OTPs if they exist
    user.password_reset_token = null;
    user.password_reset_expires = null;

    await user.save({ transaction: t });
    await t.commit();

    logger.info(`User ${user.email} manually verified by Admin ${req.user.email}`);

    res.status(200).json({
      status: 'success',
      message: `User ${user.name} has been verified and can now log in.`,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          is_verified: user.is_verified
        }
      }
    });

  } catch (err) {
    await t.rollback();
    logger.error('Manual verify user error:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
};