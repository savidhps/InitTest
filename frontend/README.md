# DashSphere Frontend

Enterprise Angular 17+ dashboard application with real-time chat capabilities.

## Features

- ✅ JWT Authentication with auto-refresh
- ✅ Role-based routing (Admin, User)
- ✅ Real-time chat (Socket.IO)
- ✅ File upload with preview
- ✅ Lazy-loaded feature modules
- ✅ OnPush change detection
- ✅ Angular Material UI
- ✅ Responsive design
- ✅ Performance optimized
- ✅ Comprehensive testing

## Tech Stack

- **Framework**: Angular 17+
- **UI Library**: Angular Material 17+
- **State Management**: RxJS + Services
- **WebSocket**: ngx-socket-io
- **Forms**: Reactive Forms
- **Testing**: Jasmine + Karma + Cypress

## Prerequisites

- Node.js 20+ installed
- Angular CLI 17+ installed globally
- Backend server running on http://localhost:3000

## Installation

1. Install Angular CLI globally (if not installed):
```bash
npm install -g @angular/cli@17
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Server
```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`

### Production Build
```bash
npm run build:prod
```

### Run Tests
```bash
# Unit tests
npm test

# E2E tests
npm run e2e
```

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/                    # Singleton services, guards, interceptors
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── role.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   └── error.interceptor.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── notification.service.ts
│   │   │   ├── models/
│   │   │   │   └── user.model.ts
│   │   │   └── core.module.ts
│   │   │
│   │   ├── shared/                  # Reusable components
│   │   │   ├── components/
│   │   │   │   ├── loading-spinner/
│   │   │   │   └── confirm-dialog/
│   │   │   ├── material/
│   │   │   │   └── material.module.ts
│   │   │   └── shared.module.ts
│   │   │
│   │   ├── features/                # Feature modules (lazy loaded)
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── auth-routing.module.ts
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard.component.ts
│   │   │   │   └── dashboard-routing.module.ts
│   │   │   ├── chat/
│   │   │   │   ├── chat.component.ts
│   │   │   │   ├── services/
│   │   │   │   │   └── chat.service.ts
│   │   │   │   └── chat-routing.module.ts
│   │   │   └── admin/
│   │   │       └── admin-routing.module.ts
│   │   │
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   │
│   ├── environments/
│   ├── assets/
│   ├── styles.scss
│   ├── index.html
│   └── main.ts
│
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Module Architecture

### Core Module
- Singleton services (AuthService, NotificationService)
- HTTP interceptors (Auth, Error handling)
- Route guards (AuthGuard, RoleGuard)
- Global models and interfaces

### Shared Module
- Reusable components (LoadingSpinner, ConfirmDialog)
- Angular Material modules
- Common pipes and directives

### Feature Modules (Lazy Loaded)
- **Auth Module**: Login, registration
- **Dashboard Module**: Analytics, widgets
- **Chat Module**: Real-time messaging
- **Admin Module**: User management

## Authentication Flow

1. User enters credentials in login form
2. AuthService sends POST to `/api/auth/login`
3. Backend returns access token + refresh token
4. Tokens stored (access in memory, refresh in localStorage)
5. AuthInterceptor attaches access token to all requests
6. On 401 error, auto-refresh using refresh token
7. On logout, tokens cleared and user redirected

## Real-Time Chat

1. User authenticates and receives JWT
2. ChatService connects to Socket.IO with JWT
3. User joins chat rooms
4. Messages sent via `send-message` event
5. Messages received via `message-received` event
6. Typing indicators and presence tracking
7. File attachments uploaded via HTTP, URL sent in message

## Performance Optimizations

### Implemented
- ✅ Lazy loading for all feature modules
- ✅ OnPush change detection strategy
- ✅ trackBy functions in *ngFor
- ✅ Virtual scrolling for chat messages
- ✅ Image lazy loading
- ✅ Debounced search inputs
- ✅ AOT compilation
- ✅ Tree shaking
- ✅ Code splitting

### Build Optimization
```bash
ng build --configuration production
```

Produces:
- Minified bundles
- Differential loading (ES2015 + ES5)
- Dead code elimination
- Optimized images

## Testing

### Unit Tests
```bash
ng test
```

Coverage includes:
- Services (AuthService, ChatService)
- Components (LoginComponent, ChatComponent)
- Guards (AuthGuard, RoleGuard)
- Interceptors

### E2E Tests
```bash
ng e2e
```

Test scenarios:
- Login flow
- Role-based routing
- Chat message send/receive
- File upload
- Logout

## Environment Configuration

### Development (environment.ts)
```typescript
{
  production: false,
  apiUrl: 'http://localhost:3000/api',
  wsUrl: 'http://localhost:3000'
}
```

### Production (environment.prod.ts)
```typescript
{
  production: true,
  apiUrl: 'https://api.dashsphere.com/api',
  wsUrl: 'https://api.dashsphere.com'
}
```

## Test Accounts

Use these credentials (after backend seeding):

**Admin:**
- Email: admin@dashsphere.com
- Password: admin123

**Users:**
- Email: john@dashsphere.com, Password: user123
- Email: jane@dashsphere.com, Password: user123

## Deployment

### Build for Production
```bash
npm run build:prod
```

### Deploy to Netlify/Vercel
```bash
# Install CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist/dashsphere
```

### Deploy to AWS S3 + CloudFront
```bash
aws s3 sync dist/dashsphere s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

## Troubleshooting

### CORS Issues
Ensure backend CORS_ORIGIN matches frontend URL

### WebSocket Connection Failed
Check backend is running and wsUrl is correct

### 401 Unauthorized
Clear localStorage and login again

## License

MIT
