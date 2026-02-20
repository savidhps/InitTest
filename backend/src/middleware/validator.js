const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation result handler
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Validation rules
 */
const validationRules = {
  // Auth validations
  register: [
    body('email')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('firstName')
      .trim()
      .notEmpty().withMessage('First name is required')
      .isLength({ max: 50 }).withMessage('First name must be less than 50 characters'),
    body('lastName')
      .trim()
      .notEmpty().withMessage('Last name is required')
      .isLength({ max: 50 }).withMessage('Last name must be less than 50 characters'),
    body('role')
      .optional()
      .isIn(['admin', 'user']).withMessage('Role must be either admin or user')
  ],

  login: [
    body('email')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
  ],

  // Chat validations
  createRoom: [
    body('name')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Room name must be less than 100 characters'),
    body('type')
      .isIn(['group', 'private']).withMessage('Type must be either group or private'),
    body('participants')
      .isArray({ min: 1 }).withMessage('At least one participant is required')
      .custom((value) => {
        if (!value.every(id => /^[0-9a-fA-F]{24}$/.test(id))) {
          throw new Error('Invalid participant ID format');
        }
        return true;
      })
  ],

  sendMessage: [
    body('content')
      .trim()
      .notEmpty().withMessage('Message content is required')
      .isLength({ max: 5000 }).withMessage('Message must be less than 5000 characters'),
    body('messageType')
      .optional()
      .isIn(['text', 'image', 'file']).withMessage('Invalid message type')
  ],

  // User validations
  updateUser: [
    body('firstName')
      .optional()
      .trim()
      .notEmpty().withMessage('First name cannot be empty')
      .isLength({ max: 50 }).withMessage('First name must be less than 50 characters'),
    body('lastName')
      .optional()
      .trim()
      .notEmpty().withMessage('Last name cannot be empty')
      .isLength({ max: 50 }).withMessage('Last name must be less than 50 characters'),
    body('role')
      .optional()
      .isIn(['admin', 'user']).withMessage('Role must be either admin or user'),
    body('status')
      .optional()
      .isIn(['active', 'inactive']).withMessage('Status must be either active or inactive')
  ],

  // Param validations
  mongoId: [
    param('id')
      .isMongoId().withMessage('Invalid ID format')
  ],

  // Query validations
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
  ]
};

module.exports = {
  validate,
  validationRules
};
