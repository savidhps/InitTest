const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: null
  },
  type: {
    type: String,
    enum: ['group', 'private'],
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for participant count
chatRoomSchema.virtual('participantCount').get(function() {
  return this.participants ? this.participants.length : 0;
});

// Indexes
chatRoomSchema.index({ type: 1 });
chatRoomSchema.index({ participants: 1 });
chatRoomSchema.index({ createdBy: 1 });
chatRoomSchema.index({ lastMessageAt: -1 });

// Method to check if user is participant
chatRoomSchema.methods.isParticipant = function(userId) {
  return this.participants.some(p => p.toString() === userId.toString());
};

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
