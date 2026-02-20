describe('Authentication Flow', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
    cy.visit('/auth/login');
  });

  describe('Login Page', () => {
    it('should display login form', () => {
      cy.get('form').should('exist');
      cy.get('input[type="email"]').should('exist');
      cy.get('input[type="password"]').should('exist');
      cy.get('button[type="submit"]').should('exist');
    });

    it('should show validation errors for empty fields', () => {
      cy.get('button[type="submit"]').click();
      cy.get('mat-error').should('have.length.at.least', 1);
    });

    it('should show validation error for invalid email', () => {
      cy.get('input[type="email"]').type('invalid-email');
      cy.get('input[type="email"]').blur();
      cy.contains('Please enter a valid email').should('be.visible');
    });

    it('should login successfully with valid credentials', () => {
      cy.intercept('POST', '**/api/auth/login').as('loginRequest');

      cy.get('input[type="email"]').type('john@dashsphere.com');
      cy.get('input[type="password"]').type('user123');
      cy.get('button[type="submit"]').click();

      cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
      cy.url().should('include', '/dashboard');
      cy.contains('Dashboard').should('be.visible');
    });

    it('should show error message for invalid credentials', () => {
      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 401,
        body: {
          success: false,
          message: 'Invalid credentials'
        }
      }).as('loginRequest');

      cy.get('input[type="email"]').type('wrong@example.com');
      cy.get('input[type="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();

      cy.wait('@loginRequest');
      cy.contains('Invalid credentials').should('be.visible');
    });

    it('should persist authentication after page refresh', () => {
      // Login first
      cy.get('input[type="email"]').type('john@dashsphere.com');
      cy.get('input[type="password"]').type('user123');
      cy.get('button[type="submit"]').click();

      cy.url().should('include', '/dashboard');

      // Refresh page
      cy.reload();

      // Should still be on dashboard
      cy.url().should('include', '/dashboard');
      cy.contains('Dashboard').should('be.visible');
    });
  });

  describe('Logout', () => {
    beforeEach(() => {
      // Login before each logout test
      cy.get('input[type="email"]').type('john@dashsphere.com');
      cy.get('input[type="password"]').type('user123');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/dashboard');
    });

    it('should logout successfully', () => {
      cy.intercept('POST', '**/api/auth/logout').as('logoutRequest');

      // Click logout button (adjust selector based on your UI)
      cy.get('[data-testid="logout-button"]').click();

      cy.wait('@logoutRequest');
      cy.url().should('include', '/auth/login');
      cy.get('form').should('exist');
    });

    it('should clear localStorage on logout', () => {
      cy.window().then((win) => {
        expect(win.localStorage.getItem('accessToken')).to.exist;
      });

      cy.get('[data-testid="logout-button"]').click();

      cy.window().then((win) => {
        expect(win.localStorage.getItem('accessToken')).to.be.null;
        expect(win.localStorage.getItem('refreshToken')).to.be.null;
        expect(win.localStorage.getItem('currentUser')).to.be.null;
      });
    });
  });

  describe('Protected Routes', () => {
    it('should redirect to login when accessing protected route without authentication', () => {
      cy.visit('/dashboard');
      cy.url().should('include', '/auth/login');
    });

    it('should allow access to protected route when authenticated', () => {
      // Login
      cy.get('input[type="email"]').type('john@dashsphere.com');
      cy.get('input[type="password"]').type('user123');
      cy.get('button[type="submit"]').click();

      // Navigate to protected route
      cy.visit('/chat');
      cy.url().should('include', '/chat');
    });

    it('should redirect non-admin users from admin routes', () => {
      // Login as regular user
      cy.get('input[type="email"]').type('john@dashsphere.com');
      cy.get('input[type="password"]').type('user123');
      cy.get('button[type="submit"]').click();

      // Try to access admin route
      cy.visit('/admin');
      cy.url().should('not.include', '/admin');
    });

    it('should allow admin users to access admin routes', () => {
      // Login as admin
      cy.get('input[type="email"]').type('admin@dashsphere.com');
      cy.get('input[type="password"]').type('admin123');
      cy.get('button[type="submit"]').click();

      // Access admin route
      cy.visit('/admin');
      cy.url().should('include', '/admin');
      cy.contains('User Management').should('be.visible');
    });
  });

  describe('Token Refresh', () => {
    it('should refresh token when access token expires', () => {
      cy.intercept('POST', '**/api/auth/login').as('loginRequest');
      cy.intercept('GET', '**/api/dashboard/stats', {
        statusCode: 401,
        body: { success: false, message: 'Token expired' }
      }).as('expiredRequest');
      cy.intercept('POST', '**/api/auth/refresh').as('refreshRequest');

      // Login
      cy.get('input[type="email"]').type('john@dashsphere.com');
      cy.get('input[type="password"]').type('user123');
      cy.get('button[type="submit"]').click();

      cy.wait('@loginRequest');
      cy.wait('@expiredRequest');
      cy.wait('@refreshRequest');

      // Should still be authenticated
      cy.url().should('include', '/dashboard');
    });
  });
});
