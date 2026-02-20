describe('Admin Panel', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.loginAsAdmin();
    cy.visit('/admin');
  });

  it('should display admin panel', () => {
    cy.url().should('include', '/admin');
    cy.contains('User Management').should('be.visible');
  });

  it('should display users table', () => {
    cy.get('table').should('exist');
    cy.get('tr').should('have.length.at.least', 2); // Header + at least 1 user
  });

  it('should display user information', () => {
    cy.get('table').within(() => {
      cy.contains('Email').should('be.visible');
      cy.contains('Role').should('be.visible');
      cy.contains('Status').should('be.visible');
    });
  });

  it('should have action buttons', () => {
    cy.get('button[matTooltip="Actions"]').should('exist');
  });
});

describe('Admin Panel - Access Control', () => {
  it('should redirect non-admin users', () => {
    cy.clearLocalStorage();
    cy.loginAsUser();
    cy.visit('/admin');
    
    cy.url().should('not.include', '/admin');
  });

  it('should allow admin access', () => {
    cy.clearLocalStorage();
    cy.loginAsAdmin();
    cy.visit('/admin');
    
    cy.url().should('include', '/admin');
    cy.contains('User Management').should('be.visible');
  });
});
