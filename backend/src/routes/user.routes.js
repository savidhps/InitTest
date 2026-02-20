const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, requireRole } = require('../middleware/auth');
const { validationRules, validate } = require('../middleware/validator');

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Private (Admin only)
 */
router.post(
  '/',
  verifyToken,
  requireRole('admin'),
  validationRules.createUser,
  validate,
  userController.create
);

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private (Admin only)
 */
router.get(
  '/',
  verifyToken,
  requireRole('admin'),
  validationRules.pagination,
  validate,
  userController.getAll
);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get(
  '/:id',
  verifyToken,
  validationRules.mongoId,
  validate,
  userController.getById
);

/**
 * @route   PATCH /api/users/:id
 * @desc    Update user
 * @access  Private
 */
router.patch(
  '/:id',
  verifyToken,
  validationRules.mongoId,
  validationRules.updateUser,
  validate,
  userController.update
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  verifyToken,
  requireRole('admin'),
  validationRules.mongoId,
  validate,
  userController.delete
);

module.exports = router;
