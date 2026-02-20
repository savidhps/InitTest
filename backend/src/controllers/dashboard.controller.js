const User = require('../models/User');
const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');
const mongoose = require('mongoose');

class DashboardController {
  /**
   * Get dashboard statistics
   * GET /api/dashboard/stats
   */
  async getStats(req, res, next) {
    try {
      const userId = req.user.userId;
      const isAdmin = req.user.role === 'admin';

      let stats = {};

      if (isAdmin) {
        // Admin stats
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: 'active' });
        const totalRooms = await ChatRoom.countDocuments();
        const totalMessages = await Message.countDocuments();

        // Recent activity
        const recentUsers = await User.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('firstName lastName email createdAt');

        stats = {
          totalUsers,
          activeUsers,
          totalRooms,
          totalMessages,
          recentUsers
        };
      } else {
        // User stats - convert userId to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const userRooms = await ChatRoom.countDocuments({
          participants: userObjectId
        });

        const userMessages = await Message.countDocuments({
          senderId: userObjectId
        });

        const recentMessages = await Message.find({
          senderId: userObjectId
        })
          .sort({ createdAt: -1 })
          .limit(5)
          .populate('roomId', 'name type');

        stats = {
          myRooms: userRooms,
          myMessages: userMessages,
          recentMessages
        };
      }

      res.json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      next(error);
    }
  }

  /**
   * Get analytics data
   * GET /api/dashboard/analytics
   */
  async getAnalytics(req, res, next) {
    try {
      const isAdmin = req.user.role === 'admin';

      if (!isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      // Get user growth (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const userGrowth = await User.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      // Get message activity (last 7 days)
      const messageActivity = await Message.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      // Role distribution
      const roleDistribution = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]);

      res.json({
        success: true,
        data: {
          analytics: {
            userGrowth,
            messageActivity,
            roleDistribution
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
