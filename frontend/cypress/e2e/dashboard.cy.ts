describe('Dashboard', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.loginAsUser();
  });

  it('should display dashboard after login', () => {
    cy.url().should('include', '/dashboard');
    cy.contains('Dashboard').should('be.visible');
  });

  it('should display stats cards', () => {
    cy.get('mat-card').should('have.length.at.least', 1);
  });

  it('should navigate to chat', () => {
    cy.contains('Chat').click();
    cy.url().should('include', '/chat');
  });

  it('should not show admin menu for regular users', () => {
    cy.contains('Admin').should('not.exist');
  });
});

describe('Dashboard - Admin', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.loginAsAdmin();
  });

  it('should show admin menu for admin users', () => {
    cy.contains('Admin').should('be.visible');
  });

  it('should navigate to admin panel', () => {
    cy.contains('Admin').click();
    cy.url().should('include', '/admin');
  });
});
