/// <reference types="cypress" />

describe('Mekanik Game - Component Installation', () => {
  beforeEach(() => {
    // Go directly to the game page before each test
    cy.visit('/game');
  });

  it('should display component slots', () => {
    // Check that slots are displayed
    cy.contains('Slot: 1').should('be.visible');
    cy.contains('Slot: 2').should('be.visible');
    cy.contains('Slot: 3').should('be.visible');
    
    // Empty slots should have appropriate text
    cy.contains('Empty Slot').should('be.visible');
  });

  it('should have components in the inventory', () => {
    // Check that inventory contains components
    cy.contains('Basic Fusion Reactor').should('be.visible');
    cy.contains('Basic Thrust Vectoring Vanes').should('be.visible');
  });

  it('should filter components by module type', () => {
    // First check Engine tab (already selected)
    cy.contains('Engine Module').should('be.visible');
    
    // Switch to Shield tab
    cy.contains('button', 'Shield').click();
    cy.contains('Shield Module').should('be.visible');
    
    // Switch to Power tab
    cy.contains('button', 'Power').click();
    cy.contains('Power Module').should('be.visible');
  });

  it('should have a responsive layout', () => {
    // Check that the layout has multiple columns
    cy.get('.grid-cols-1').should('exist');
    
    // Check that ship performance metrics are shown
    cy.contains('Speed').should('be.visible');
    cy.contains('Shield Strength').should('be.visible');
    cy.contains('Power Output').should('be.visible');
  });
}); 