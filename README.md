# DashSphere - Enterprise Real-Time Dashboard Platform

A production-grade, full-stack web application featuring secure authentication, role-based access control, and real-time chat capabilities.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-20%2B-green.svg)
![Angular](https://img.shields.io/badge/angular-17%2B-red.svg)
![MongoDB](https://img.shields.io/badge/mongodb-7%2B-green.svg)

## 🚀 Features

### Authentication & Authorization
- ✅ JWT-based authentication with refresh tokens
- ✅ Role-based access control (Admin, User)
- ✅ Secure password hashing (bcrypt)
- ✅ Auto token refresh
- ✅ Protected routes

### Real-Time Chat
- ✅ WebSocket-based messaging (Socket.IO)
- ✅ Group chat rooms
- ✅ Private 1-to-1 messaging
- ✅ File attachments (images, documents)
- ✅ Typing indicators
- ✅ Online presence
- ✅ Message history

### Dashboard
- ✅ Role-specific analytics
- ✅ Real-time statistics
- ✅ User management (admin)
- ✅ Activity monitoring
- ✅ Responsive design

### Performance & Security
- ✅ Lazy-loaded modules
- ✅ OnPush change detection
- ✅ Rate limiting
- ✅ Input validation
- ✅ CORS protection
- ✅ Security headers (Helmet)
- ✅ XSS prevention
- ✅ SQL injection prevention

## 🏗️ Architecture

### Backend
- **Framework**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **WebSocket**: Socket.IO
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **File Upload**: Multer

### Frontend
- **Framework**: Angular 17+
- **UI Library**: Angular Material
- **State Management**: RxJS + Services
- **WebSocket Client**: ngx-socket-io
- **Forms**: Reactive Forms
- **Testing**: Jasmine + Karma + Cypress

## 📋 Prerequisites

- Node.js 20+ ([Download](https://nodejs.org/))
- MongoDB 7+ ([Download](https://www.mongodb.com/try/download/community))
- Angular CLI 17+ (`npm install -g @angular/cli@17`)

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/dashsphere.git
cd dashsphere
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed    # Create test accounts
npm run dev     # Start server on port 3000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
ng serve        # Start app on port 4200
```

### 4. Access Application
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api
- Health Check: http://localhost:3000/health

## 🔐 Test Accounts

After running `npm run seed` in backend:

**Admin Account:**
- Email: `admin@dashsphere.com`
- Password: `admin123`

**User Accounts:**
- Email: `john@dashsphere.com`, Password: `user123`
- Email: `jane@dashsphere.com`, Password: `user123`
- Email: `bob@dashsphere.com`, Password: `user123`

## 📁 Project Structure

```
dashsphere/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── sockets/        # Socket.IO handlers
│   │   ├── app.js          # Express app
│   │   └── server.js       # Server entry point
│   ├── uploads/            # File uploads
│   ├── .env                # Environment variables
│   └── package.json
│
├── frontend/               # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/      # Singleton services, guards
│   │   │   ├── shared/    # Reusable components
│   │   │   └── features/  # Feature modules (lazy loaded)
│   │   ├── environments/  # Environment configs
│   │   └── assets/        # Static assets
│   ├── angular.json
│   └── package.json
│
├── docker-compose.yml      # Docker setup
├── SETUP_GUIDE.md         # Detailed setup instructions
└── README.md              # This file
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register   - Register new user
POST   /api/auth/login      - Login user
POST   /api/auth/refresh    - Refresh access token
POST   /api/auth/logout     - Logout user
GET    /api/auth/me         - Get current user
```

### Users
```
GET    /api/users           - List users (admin only)
GET    /api/users/:id       - Get user by ID
PATCH  /api/users/:id       - Update user
DELETE /api/users/:id       - Delete user (admin only)
```

### Chat
```
GET    /api/chat/rooms                  - Get user's chat rooms
POST   /api/chat/rooms                  - Create chat room
GET    /api/chat/rooms/:id/messages     - Get message history
POST   /api/chat/upload                 - Upload file attachment
```

### Dashboard
```
GET    /api/dashboard/stats      - Get dashboard statistics
GET    /api/dashboard/analytics  - Get analytics (admin only)
```

## 🔄 WebSocket Events

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

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test              # Unit tests
npm run e2e           # E2E tests
```

## 🐳 Docker Deployment

```bash
docker-compose up -d
```

Services:
- MongoDB: `localhost:27017`
- Backend: `localhost:3000`
- Frontend: `localhost:4200`

## 📊 Performance Optimization

### Implemented Optimizations
- Lazy loading for feature modules
- OnPush change detection strategy
- trackBy functions for lists
- Virtual scrolling for chat messages
- Image lazy loading
- Debounced inputs
- AOT compilation
- Tree shaking
- Code splitting

### Build for Production
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build:prod
```

## 🔒 Security Features

- Password hashing with bcrypt (cost factor: 12)
- JWT with secure signing
- Refresh token rotation
- Rate limiting (100 req/min general, 5 req/15min auth)
- Input validation and sanitization
- Helmet security headers
- CORS configuration
- File upload restrictions
- MongoDB injection prevention
- XSS protection

## 📈 Monitoring

### Health Check
```bash
curl http://localhost:3000/health
```

### Logs
- Backend: Console output with Morgan
- Frontend: Browser DevTools console

## 🚀 Deployment

### Backend (Heroku)
```bash
cd backend
heroku create dashsphere-backend
heroku addons:create mongolab
git push heroku main
```

### Frontend (Netlify)
```bash
cd frontend
npm run build:prod
netlify deploy --prod --dir=dist/dashsphere
```

### Environment Variables

**Backend (.env):**
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
CORS_ORIGIN=https://your-frontend-url.com
```

**Frontend (environment.prod.ts):**
```typescript
{
  production: true,
  apiUrl: 'https://your-backend-url.com/api',
  wsUrl: 'https://your-backend-url.com'
}
```

## 📚 Documentation

- [Setup Guide](SETUP_GUIDE.md) - Detailed setup instructions
- [Backend README](backend/README.md) - Backend documentation
- [Frontend README](frontend/README.md) - Frontend documentation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Angular Team for the amazing framework
- Express.js community
- Socket.IO team
- MongoDB team
- Angular Material team

## 📞 Support

For support, email support@dashsphere.com or open an issue in the repository.

---

**Built with ❤️ using Angular, Node.js, and MongoDB**
