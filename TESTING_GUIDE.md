# DashSphere Testing Guide

## Overview

This guide covers all testing aspects of the DashSphere application, including unit tests, integration tests, and end-to-end (E2E) tests.

## Testing Stack

- **Unit Testing**: Jasmine + Karma
- **E2E Testing**: Cypress
- **Code Coverage**: Istanbul (via Karma)
- **Test Runner**: Angular CLI

## Prerequisites

Ensure all dependencies are installed:

```bash
cd frontend
npm install
```

---

## Unit Testing

### Running Unit Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm test -- --watch=false

# Run tests with code coverage
npm run test:coverage

# Run tests in headless mode (CI)
npm test -- --browsers=ChromeHeadlessCI --watch=false
```

### Test Configuration

Unit tests are configured in `karma.conf.js`:
- **Framework**: Jasmine
- **Browser**: Chrome (ChromeHeadless for CI)
- **Coverage**: 80% threshold for statements, branches, functions, and lines
- **Reports**: HTML, text-summary, lcovonly

### Writing Unit Tests

#### Service Tests

Example: `auth.service.spec.ts`

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should login successfully', (done) => {
    // Test implementation
  });
});
```

#### Component Tests

Example: `login.component.spec.ts`

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Test Files to Create

#### Priority 1: Core Services
- ✅ `auth.service.spec.ts` - Created
- ⏳ `chat.service.spec.ts` - TODO
- ⏳ `notification.service.spec.ts` - TODO

#### Priority 2: Guards
- ⏳ `auth.guard.spec.ts` - TODO
- ⏳ `role.guard.spec.ts` - TODO

#### Priority 3: Interceptors
- ⏳ `auth.interceptor.spec.ts` - TODO
- ⏳ `error.interceptor.spec.ts` - TODO

#### Priority 4: Components
- ⏳ `login.component.spec.ts` - TODO
- ⏳ `dashboard.component.spec.ts` - TODO
- ⏳ `chat.component.spec.ts` - TODO
- ⏳ `admin.component.spec.ts` - TODO

### Code Coverage Goals

- **Statements**: 80%
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%

View coverage report:
```bash
npm run test:coverage
# Open coverage/dashsphere/index.html in browser
```

---

## E2E Testing

### Running E2E Tests

```bash
# Open Cypress Test Runner (interactive)
npm run e2e

# Run Cypress tests headlessly
npx cypress run

# Run specific test file
npx cypress run --spec "cypress/e2e/auth.cy.ts"

# Run tests in specific browser
npx cypress run --browser chrome
```

### Test Configuration

E2E tests are configured in `cypress.config.ts`:
- **Base URL**: http://localhost:4200
- **API URL**: http://localhost:3000/api
- **WebSocket URL**: http://localhost:3000
- **Viewport**: 1280x720
- **Timeout**: 10 seconds

### Prerequisites for E2E Tests

1. **Backend server must be running**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Frontend dev server must be running**:
   ```bash
   cd frontend
   npm start
   ```

3. **Database must be seeded**:
   ```bash
   cd backend
   node src/scripts/seed.js
   ```

### Writing E2E Tests

#### Test Structure

```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/path');
  });

  it('should do something', () => {
    cy.get('selector').should('exist');
    cy.get('button').click();
    cy.url().should('include', '/expected-path');
  });
});
```

#### Using Custom Commands

```typescript
// Login as admin
cy.loginAsAdmin();

// Login as regular user
cy.loginAsUser();

// Login with custom credentials
cy.login('user@example.com', 'password123');
```

### Test Files to Create

#### Priority 1: Authentication
- ✅ `auth.cy.ts` - Created
  - Login flow
  - Logout flow
  - Protected routes
  - Token refresh

#### Priority 2: Core Features
- ⏳ `dashboard.cy.ts` - TODO
  - Dashboard navigation
  - Stats display
  - Data loading

- ⏳ `chat.cy.ts` - TODO
  - Send messages
  - Receive messages
  - Group chat
  - Private chat
  - File uploads
  - Typing indicators

#### Priority 3: Admin Features
- ⏳ `admin.cy.ts` - TODO
  - User management
  - Create user
  - Edit user
  - Delete user
  - Role-based access

### E2E Test Best Practices

1. **Use data-testid attributes** for stable selectors:
   ```html
   <button data-testid="logout-button">Logout</button>
   ```

2. **Intercept API calls** for better control:
   ```typescript
   cy.intercept('POST', '**/api/auth/login').as('loginRequest');
   cy.wait('@loginRequest');
   ```

3. **Clear state between tests**:
   ```typescript
   beforeEach(() => {
     cy.clearLocalStorage();
     cy.clearCookies();
   });
   ```

4. **Use custom commands** for common actions:
   ```typescript
   cy.loginAsUser();
   ```

---

## Performance Testing

### Lighthouse Analysis

1. **Build production version**:
   ```bash
   npm run build:prod
   ```

2. **Serve production build**:
   ```bash
   npx http-server dist/dashsphere -p 4200
   ```

3. **Run Lighthouse**:
   - Open Chrome DevTools (F12)
   - Go to Lighthouse tab
   - Select categories: Performance, Accessibility, Best Practices, SEO
   - Click "Generate report"

4. **Document results**:
   - Save report as HTML
   - Note scores for each category
   - Identify optimization opportunities

### Performance Metrics to Track

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Total Blocking Time (TBT)**: < 200ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Angular Performance Profiling

```bash
# Build with source maps
ng build --source-map

# Analyze bundle size
npx webpack-bundle-analyzer dist/dashsphere/stats.json
```

---

## Continuous Integration

### GitHub Actions Example

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Run unit tests
        run: |
          cd frontend
          npm test -- --browsers=ChromeHeadlessCI --watch=false --code-coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/lcov.info
```

---

## Test Data

### Test Accounts

After running the seed script, use these accounts:

**Admin Account**:
- Email: admin@dashsphere.com
- Password: admin123
- Role: admin

**Regular Users**:
- Email: john@dashsphere.com
- Password: user123
- Role: user

- Email: jane@dashsphere.com
- Password: user123
- Role: user

- Email: bob@dashsphere.com
- Password: user123
- Role: user

### Resetting Test Data

```bash
cd backend
node src/scripts/seed.js
```

---

## Troubleshooting

### Unit Tests

**Issue**: Tests fail with "Cannot find module"
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Karma server doesn't start
```bash
# Solution: Kill existing processes
npx kill-port 9876
npm test
```

### E2E Tests

**Issue**: Cypress can't connect to application
```bash
# Solution: Ensure servers are running
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm start

# Terminal 3: Cypress
cd frontend && npm run e2e
```

**Issue**: Tests fail due to timing issues
```typescript
// Solution: Increase timeout or add explicit waits
cy.get('selector', { timeout: 10000 }).should('exist');
cy.wait(1000); // Use sparingly
```

---

## Next Steps

1. **Complete unit tests** for all services and components
2. **Complete E2E tests** for all user flows
3. **Achieve 80%+ code coverage**
4. **Run Lighthouse analysis** and document results
5. **Set up CI/CD pipeline** with automated testing
6. **Document performance improvements**

---

## Resources

- [Jasmine Documentation](https://jasmine.github.io/)
- [Karma Documentation](https://karma-runner.github.io/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Angular Testing Guide](https://angular.io/guide/testing)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
