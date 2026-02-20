require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');
const config = require('../config/config');

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await ChatRoom.deleteMany({});
    await Message.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const admin = await User.create({
      email: 'admin@dashsphere.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      status: 'active'
    });

    const user1 = await User.create({
      email: 'john@dashsphere.com',
      password: 'user123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      status: 'active'
    });

    const user2 = await User.create({
      email: 'jane@dashsphere.com',
      password: 'user123',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'user',
      status: 'active'
    });

    const user3 = await User.create({
      email: 'bob@dashsphere.com',
      password: 'user123',
      firstName: 'Bob',
      lastName: 'Johnson',
      role: 'user',
      status: 'active'
    });

    console.log('✅ Created users');

    // Create group chat room
    const groupRoom = await ChatRoom.create({
      name: 'General Discussion',
      type: 'group',
      participants: [admin._id, user1._id, user2._id, user3._id],
      createdBy: admin._id
    });

    // Create private chat rooms
    const privateRoom1 = await ChatRoom.create({
      type: 'private',
      participants: [user1._id, user2._id],
      createdBy: user1._id
    });

    const privateRoom2 = await ChatRoom.create({
      type: 'private',
      participants: [admin._id, user1._id],
      createdBy: admin._id
    });

    console.log('✅ Created chat rooms');

    // Create messages in group chat
    const groupMessages = [
      { senderId: admin._id, content: 'Welcome to DashSphere! 🎉' },
      { senderId: user1._id, content: 'Thanks! Excited to be here!' },
      { senderId: user2._id, content: 'Hello everyone! 👋' },
      { senderId: user3._id, content: 'Great to meet you all!' },
      { senderId: admin._id, content: 'Feel free to ask any questions.' },
      { senderId: user1._id, content: 'How do I upload files?' },
      { senderId: admin._id, content: 'You can use the attachment button in the chat input.' },
      { senderId: user2._id, content: 'This platform is amazing!' },
      { senderId: user3._id, content: 'Agreed! Very intuitive interface.' },
      { senderId: user1._id, content: 'Looking forward to using this more!' }
    ];

    for (const msg of groupMessages) {
      await Message.create({
        roomId: groupRoom._id,
        senderId: msg.senderId,
        content: msg.content,
        messageType: 'text'
      });
    }

    // Create messages in private chat
    await Message.create({
      roomId: privateRoom1._id,
      senderId: user1._id,
      content: 'Hey Jane, how are you?',
      messageType: 'text'
    });

    await Message.create({
      roomId: privateRoom1._id,
      senderId: user2._id,
      content: 'Hi John! I\'m doing great, thanks!',
      messageType: 'text'
    });

    await Message.create({
      roomId: privateRoom2._id,
      senderId: admin._id,
      content: 'Hi John, welcome aboard!',
      messageType: 'text'
    });

    console.log('✅ Created messages');

    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   ✅ Database seeded successfully!                        ║
║                                                            ║
║   Test Accounts:                                          ║
║   ─────────────────────────────────────────────────────   ║
║   Admin:                                                  ║
║     Email:    admin@dashsphere.com                        ║
║     Password: admin123                                    ║
║                                                            ║
║   Users:                                                  ║
║     Email:    john@dashsphere.com                         ║
║     Password: user123                                     ║
║                                                            ║
║     Email:    jane@dashsphere.com                         ║
║     Password: user123                                     ║
║                                                            ║
║     Email:    bob@dashsphere.com                          ║
║     Password: user123                                     ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedData();
