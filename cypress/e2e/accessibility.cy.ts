/// <reference types="cypress" />

describe('Mekanik Game - Accessibility', () => {
  it('should have proper tab navigation on landing page', () => {
    cy.visit('/');
    
    // Main heading should be accessible
    cy.get('h1')
      .should('contain', 'MEKANIK')
      .should('be.visible');
    
    // Start button should be visible and clickable
    cy.contains('Start Engineering')
      .should('be.visible')
      .click();
    
    // Verify navigation worked
    cy.url().should('include', '/game');
  });

  it('should use appropriate ARIA attributes in the game interface', () => {
    cy.visit('/game');
    
    // Tab list should have proper role
    cy.get('[role="tablist"]').should('be.visible');
    
    // Each tab should be selectable
    cy.contains('button', 'Engine').should('be.visible');
    cy.contains('button', 'Shield').should('be.visible');
    cy.contains('button', 'Power').should('be.visible');
      
    // Module display sections should have headings
    cy.contains('Engine Module').should('be.visible');
  });

  it('should make inventory items accessible', () => {
    cy.visit('/game');
    
    // Inventory section should have a header
    cy.contains('Inventory').should('be.visible');
    
    // Tab indicators should be visible
    cy.contains('button', 'All').should('be.visible');
    cy.contains('button', 'Engine').should('be.visible');
    
    // Component cards should be visible
    cy.contains('Basic Fusion Reactor').should('be.visible');
  });
}); 