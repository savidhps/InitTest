# DashSphere Backend

Enterprise-grade Node.js/Express backend with real-time chat capabilities.

## Features

- ✅ JWT Authentication with refresh tokens
- ✅ Role-based access control (Admin, User)
- ✅ Real-time chat (Socket.IO)
- ✅ File upload support
- ✅ MongoDB with Mongoose ODM
- ✅ Input validation
- ✅ Rate limiting
- ✅ Security headers (Helmet)
- ✅ Error handling
- ✅ API documentation

## Tech Stack

- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js 4.x
- **Database**: MongoDB 7+
- **ODM**: Mongoose 8+
- **WebSocket**: Socket.IO 4.x
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Security**: helmet, bcryptjs, cors

## Prerequisites

- Node.js 20+ installed
- MongoDB 7+ running locally or MongoDB Atlas account
- npm or yarn package manager

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start MongoDB (if running locally):
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Seed Database
```bash
npm run seed
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - List users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Chat
- `GET /api/chat/rooms` - Get user's chat rooms
- `POST /api/chat/rooms` - Create chat room
- `GET /api/chat/rooms/:id/messages` - Get message history
- `POST /api/chat/upload` - Upload file attachment

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/analytics` - Get analytics (admin only)

## WebSocket Events

### Client → Server
- `join-room` - Join a chat room
- `leave-room` - Leave a chat room
- `send-message` - Send a message
- `typing-start` - Start typing indicator
- `typing-stop` - Stop typing indicator

### Server → Client
- `message-received` - New message received
- `user-joined` - User joined room
- `user-left` - User left room
- `typing-indicator` - Typing indicator
- `error` - Error occurred

## Test Accounts

After running `npm run seed`:

**Admin:**
- Email: admin@dashsphere.com
- Password: admin123

**Users:**
- Email: john@dashsphere.com, Password: user123
- Email: jane@dashsphere.com, Password: user123
- Email: bob@dashsphere.com, Password: user123

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── scripts/         # Utility scripts
│   ├── services/        # Business logic
│   ├── sockets/         # Socket.IO handlers
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── uploads/             # File uploads directory
├── .env                 # Environment variables
├── .env.example         # Environment template
├── package.json         # Dependencies
└── README.md            # This file
```

## Environment Variables

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/dashsphere
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:4200
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

## Security Features

- Password hashing with bcrypt (cost factor: 12)
- JWT with RS256 signing
- Refresh token rotation
- Rate limiting (100 req/min general, 5 req/15min auth)
- Input validation and sanitization
- Helmet security headers
- CORS configuration
- File upload restrictions
- MongoDB injection prevention

## Error Handling

All errors return consistent JSON format:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Optional validation errors
}
```

## Testing

```bash
npm test
```

## Deployment

### Using Docker
```bash
docker build -t dashsphere-backend .
docker run -p 3000:3000 dashsphere-backend
```

### Using PM2
```bash
npm install -g pm2
pm2 start src/server.js --name dashsphere-backend
```

## License

MIT
