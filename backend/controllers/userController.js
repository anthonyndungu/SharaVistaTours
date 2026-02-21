import { User } from '../models/index.js';
import { Op } from 'sequelize';
import logger from '../utils/logger.js';

// @desc    Get all users (Admin only)
// @route   GET /api/v1/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    // 1. Permission Check
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Access denied. Admin privileges required.'
      });
    }

    // 2. Build Query Options
    const queryOptions = {
      attributes: { 
        exclude: ['password', 'password_reset_token', 'password_reset_expires', 'password_changed_at'] 
      },
      order: [['created_at', 'DESC']]
    };

    // 3. Filter by Role (e.g., ?role=client)
    if (req.query.role) {
      const validRoles = ['client', 'admin', 'super_admin'];
      if (validRoles.includes(req.query.role)) {
        queryOptions.where = { ...queryOptions.where, role: req.query.role };
      } else {
        return res.status(400).json({
          status: 'fail',
          message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
        });
      }
    }

    // 4. Search by Name or Email (e.g., ?search=john)
    if (req.query.search) {
      const searchTerm = `%${req.query.search}%`;
      queryOptions.where = {
        ...queryOptions.where,
        [Op.or]: [
          { name: { [Op.iLike]: searchTerm } },
          { email: { [Op.iLike]: searchTerm } }
        ]
      };
    }

    // 5. Filter by Verification Status (e.g., ?is_verified=true)
    if (req.query.is_verified !== undefined) {
      const isVerified = req.query.is_verified === 'true';
      queryOptions.where = { ...queryOptions.where, is_verified: isVerified };
    }

    // 6. Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15; // Default 15 users per page
    const offset = (page - 1) * limit;

    queryOptions.limit = limit;
    queryOptions.offset = offset;

    // 7. Execute Query
    const { count, rows: users } = await User.findAndCountAll(queryOptions);

    res.status(200).json({
      status: 'success',
      results: users.length,
      total: count,
      page,
      pages: Math.ceil(count / limit),
      data: { users }
    });
  } catch (err) {
    logger.error('Get all users error:', err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};

// @desc    Verify a user (Admin only)
// @route   PATCH /api/v1/users/:id/verify
// @access  Private/Admin
export const verifyUser = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      await t.rollback();
      return res.status(403).json({ status: 'fail', message: 'Access denied' });
    }

    const user = await User.findByPk(req.params.id, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    await user.update({ is_verified: true }, { transaction: t });
    await t.commit();

    res.status(200).json({
      status: 'success',
      message: `User ${user.name} has been verified and can now log in.`,
      data: { user }
    });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ status: 'error', message: err.message });
  }
};