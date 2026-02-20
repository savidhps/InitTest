const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');

/**
 * Socket.IO authentication middleware
 */
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    socket.userId = decoded.userId;
    socket.userRole = decoded.role;
    
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
};

/**
 * Initialize Socket.IO handlers
 */
const initializeSocketHandlers = (io) => {
  // Apply authentication middleware
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    /**
     * Join a chat room
     */
    socket.on('join-room', async (data) => {
      try {
        const { roomId } = data;

        // Verify user is participant
        const room = await ChatRoom.findById(roomId);
        if (!room) {
          socket.emit('error', { message: 'Chat room not found' });
          return;
        }

        if (!room.isParticipant(socket.userId)) {
          socket.emit('error', { message: 'You are not a participant of this room' });
          return;
        }

        // Join room
        socket.join(roomId);
        console.log(`User ${socket.userId} joined room ${roomId}`);

        // Notify others
        socket.to(roomId).emit('user-joined', {
          userId: socket.userId,
          roomId
        });

      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    /**
     * Leave a chat room
     */
    socket.on('leave-room', (data) => {
      const { roomId } = data;
      socket.leave(roomId);
      console.log(`User ${socket.userId} left room ${roomId}`);

      socket.to(roomId).emit('user-left', {
        userId: socket.userId,
        roomId
      });
    });

    /**
     * Send message
     */
    socket.on('send-message', async (data) => {
      try {
        const { roomId, content, messageType, attachments } = data;

        // Verify user is participant
        const room = await ChatRoom.findById(roomId);
        if (!room) {
          socket.emit('error', { message: 'Chat room not found' });
          return;
        }

        if (!room.isParticipant(socket.userId)) {
          socket.emit('error', { message: 'You are not a participant of this room' });
          return;
        }

        // Create message
        const message = await Message.create({
          roomId,
          senderId: socket.userId,
          content,
          messageType: messageType || 'text',
          attachments: attachments || []
        });

        // Populate sender info
        await message.populate('senderId', 'firstName lastName email avatarUrl');

        // Update room's last message time
        room.lastMessageAt = new Date();
        await room.save();

        // Broadcast to room
        io.to(roomId).emit('message-received', {
          message
        });

        console.log(`Message sent in room ${roomId} by user ${socket.userId}`);

      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    /**
     * Typing indicator - start
     */
    socket.on('typing-start', (data) => {
      const { roomId } = data;
      socket.to(roomId).emit('typing-indicator', {
        userId: socket.userId,
        roomId,
        isTyping: true
      });
    });

    /**
     * Typing indicator - stop
     */
    socket.on('typing-stop', (data) => {
      const { roomId } = data;
      socket.to(roomId).emit('typing-indicator', {
        userId: socket.userId,
        roomId,
        isTyping: false
      });
    });

    /**
     * Disconnect
     */
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
    });
  });
};

module.exports = {
  initializeSocketHandlers
};
