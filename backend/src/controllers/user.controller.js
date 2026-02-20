const User = require('../models/User');

class UserController {
  /**
   * Search users (for chat)
   * GET /api/users/search
   */
  async searchUsers(req, res, next) {
    try {
      const { q = '', limit = 20 } = req.query;
      const currentUserId = req.user.userId;

      const query = {
        _id: { $ne: currentUserId }, // Exclude current user
        status: 'active' // Only active users
      };

      // Search by name or email
      if (q) {
        query.$or = [
          { firstName: { $regex: q, $options: 'i' } },
          { lastName: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } }
        ];
      }

      const users = await User.find(query)
        .select('firstName lastName email avatarUrl status')
        .limit(parseInt(limit))
        .sort({ firstName: 1, lastName: 1 });

      res.json({
        success: true,
        data: { users }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all users
   * GET /api/users
   */
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 50, role, status } = req.query;

      const query = {};
      if (role) query.role = role;
      if (status) query.status = status;

      const users = await User.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      const total = await User.countDocuments(query);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new user
   * POST /api/users
   */
  async create(req, res, next) {
    try {
      const { email, password, firstName, lastName, role, status } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Create new user
      const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        role: role || 'user',
        status: status || 'active'
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID
   * GET /api/users/:id
   */
  async getById(req, res, next) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user
   * PATCH /api/users/:id
   */
  async update(req, res, next) {
    try {
      const { firstName, lastName, role, status, avatarUrl } = req.body;

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Update fields
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (role) user.role = role;
      if (status) user.status = status;
      if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

      await user.save();

      res.json({
        success: true,
        message: 'User updated successfully',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user
   * DELETE /api/users/:id
   */
  async delete(req, res, next) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Prevent deleting yourself
      if (user._id.toString() === req.user.userId) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete your own account'
        });
      }

      await user.deleteOne();

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
