const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { verifyToken } = require('../middleware/auth');
const { validationRules, validate } = require('../middleware/validator');
const upload = require('../middleware/upload');
const { uploadLimiter } = require('../middleware/rateLimiter');

/**
 * @route   GET /api/chat/rooms
 * @desc    Get user's chat rooms
 * @access  Private
 */
router.get('/rooms', verifyToken, chatController.getRooms);

/**
 * @route   POST /api/chat/rooms
 * @desc    Create chat room
 * @access  Private
 */
router.post(
  '/rooms',
  verifyToken,
  validationRules.createRoom,
  validate,
  chatController.createRoom
);

/**
 * @route   GET /api/chat/rooms/:id/messages
 * @desc    Get message history
 * @access  Private
 */
router.get(
  '/rooms/:id/messages',
  verifyToken,
  validationRules.mongoId,
  validationRules.pagination,
  validate,
  chatController.getMessages
);

/**
 * @route   POST /api/chat/upload
 * @desc    Upload file attachment
 * @access  Private
 */
router.post(
  '/upload',
  verifyToken,
  uploadLimiter,
  upload.single('file'),
  chatController.uploadFile
);

module.exports = router;
