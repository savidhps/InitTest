const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');

class ChatController {
  /**
   * Get user's chat rooms
   * GET /api/chat/rooms
   */
  async getRooms(req, res, next) {
    try {
      const userId = req.user.userId;

      const rooms = await ChatRoom.find({
        participants: userId
      })
        .populate('participants', 'firstName lastName email avatarUrl')
        .populate('createdBy', 'firstName lastName email')
        .sort({ lastMessageAt: -1 });

      res.json({
        success: true,
        data: { rooms }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create chat room
   * POST /api/chat/rooms
   */
  async createRoom(req, res, next) {
    try {
      const { name, type, participants } = req.body;
      const userId = req.user.userId;

      // Add creator to participants if not already included
      const participantIds = [...new Set([...participants, userId])];

      // For private chat, ensure only 2 participants
      if (type === 'private' && participantIds.length !== 2) {
        return res.status(400).json({
          success: false,
          message: 'Private chat must have exactly 2 participants'
        });
      }

      // Check if private chat already exists
      if (type === 'private') {
        const existingRoom = await ChatRoom.findOne({
          type: 'private',
          participants: { $all: participantIds, $size: 2 }
        });

        if (existingRoom) {
          return res.json({
            success: true,
            message: 'Private chat already exists',
            data: { room: existingRoom }
          });
        }
      }

      const room = await ChatRoom.create({
        name,
        type,
        participants: participantIds,
        createdBy: userId
      });

      await room.populate('participants', 'firstName lastName email avatarUrl');

      res.status(201).json({
        success: true,
        message: 'Chat room created successfully',
        data: { room }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get message history
   * GET /api/chat/rooms/:id/messages
   */
  async getMessages(req, res, next) {
    try {
      const { id: roomId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const userId = req.user.userId;

      // Check if user is participant
      const room = await ChatRoom.findById(roomId);
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Chat room not found'
        });
      }

      if (!room.isParticipant(userId)) {
        return res.status(403).json({
          success: false,
          message: 'You are not a participant of this chat room'
        });
      }

      const messages = await Message.find({ roomId })
        .populate('senderId', 'firstName lastName email avatarUrl')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Message.countDocuments({ roomId });

      res.json({
        success: true,
        data: {
          messages: messages.reverse(), // Reverse to show oldest first
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
   * Upload file attachment
   * POST /api/chat/upload
   */
  async uploadFile(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      const fileUrl = `/uploads/${req.file.filename}`;

      res.json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          fileName: req.file.originalname,
          fileUrl,
          fileSize: req.file.size,
          fileType: req.file.mimetype
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ChatController();
