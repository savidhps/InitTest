const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const config = require('./config/config');
const connectDB = require('./config/database');
const { initializeSocketHandlers } = require('./sockets/chat.socket');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: config.cors.origin,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize socket handlers
initializeSocketHandlers(io);

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start server
    server.listen(config.port, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 DashSphere Backend Server                            ║
║                                                            ║
║   Environment: ${config.env.padEnd(43)}║
║   Port:        ${config.port.toString().padEnd(43)}║
║   API:         http://localhost:${config.port}/api${' '.repeat(22)}║
║   Health:      http://localhost:${config.port}/health${' '.repeat(18)}║
║   Socket.IO:   ws://localhost:${config.port}${' '.repeat(26)}║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
startServer();
