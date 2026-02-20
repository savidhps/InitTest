const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { verifyToken } = require('../middleware/auth');

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard statistics
 * @access  Private
 */
router.get('/stats', verifyToken, dashboardController.getStats);

/**
 * @route   GET /api/dashboard/analytics
 * @desc    Get analytics data
 * @access  Private (Admin only)
 */
router.get('/analytics', verifyToken, dashboardController.getAnalytics);

module.exports = router;
