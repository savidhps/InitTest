describe('Chat', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.loginAsUser();
    cy.visit('/chat');
  });

  it('should display chat interface', () => {
    cy.url().should('include', '/chat');
    cy.get('.chat-container').should('exist');
  });

  it('should display chat rooms list', () => {
    cy.get('.room-list').should('exist');
    cy.get('.room-item').should('have.length.at.least', 1);
  });

  it('should select a chat room', () => {
    cy.get('.room-item').first().click();
    cy.get('.message-list').should('exist');
  });

  it('should display message input', () => {
    cy.get('.room-item').first().click();
    cy.get('textarea[placeholder*="message"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('should send a message', () => {
    cy.intercept('POST', '**/api/chat/rooms/*/messages').as('sendMessage');
    
    cy.get('.room-item').first().click();
    cy.wait(1000); // Wait for room to load
    
    cy.get('textarea[placeholder*="message"]').type('Test message from Cypress');
    cy.get('button[type="submit"]').click();
    
    // Message should appear in the list
    cy.contains('Test message from Cypress').should('be.visible');
  });

  it('should display file upload button', () => {
    cy.get('.room-item').first().click();
    cy.get('input[type="file"]').should('exist');
  });
});

describe('Chat - Group vs Private', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.loginAsUser();
    cy.visit('/chat');
  });

  it('should display group chat rooms', () => {
    cy.contains('General Discussion').should('be.visible');
  });

  it('should display private chat rooms', () => {
    cy.get('.room-item[data-type="private"]').should('exist');
  });
});
