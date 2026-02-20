/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login
       * @example cy.login('user@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * Custom command to login as admin
       * @example cy.loginAsAdmin()
       */
      loginAsAdmin(): Chainable<void>;

      /**
       * Custom command to login as regular user
       * @example cy.loginAsUser()
       */
      loginAsUser(): Chainable<void>;
    }
  }
}

// Custom login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('not.include', '/auth/login');
});

// Login as admin
Cypress.Commands.add('loginAsAdmin', () => {
  cy.login('admin@dashsphere.com', 'admin123');
});

// Login as regular user
Cypress.Commands.add('loginAsUser', () => {
  cy.login('john@dashsphere.com', 'user123');
});

export {};
