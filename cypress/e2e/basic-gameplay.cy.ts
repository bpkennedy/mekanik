/// <reference types="cypress" />

describe('Mekanik Game - Basic Gameplay', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/');
  });

  it('should display the landing page and allow starting the game', () => {
    // Check that the landing page shows the game title
    cy.contains('h1', 'MEKANIK').should('be.visible');
    
    // Verify that the game description is present
    cy.contains('Component-Based Starship Engineering Simulator').should('be.visible');
    
    // Verify module descriptions are present
    cy.contains('Engine Modules').should('be.visible');
    cy.contains('Shield Modules').should('be.visible');
    cy.contains('Power Modules').should('be.visible');
    
    // Click the "Start Engineering" button
    cy.contains('Start Engineering').click();
    
    // Verify we're on the game page
    cy.url().should('include', '/game');
    
    // Header should show game title
    cy.contains('Mekanik').should('be.visible');
    cy.contains('Ship Engineering Simulator').should('be.visible');
  });

  it('should display the ship status and components', () => {
    // Go directly to the game page
    cy.visit('/game');
    
    // Check that the ship name is displayed
    cy.contains('The Nebula Voyager').should('be.visible');
    
    // Check that ship performance metrics are shown
    cy.contains('Speed').should('be.visible');
    cy.contains('Shield Strength').should('be.visible');
    cy.contains('Power Output').should('be.visible');
    
    // Verify module tabs exist
    cy.contains('Engine').should('be.visible');
    cy.contains('Shield').should('be.visible');
    cy.contains('Power').should('be.visible');
    
    // Verify inventory is shown
    cy.contains('Inventory').should('be.visible');
  });

  it('should allow switching between module tabs', () => {
    cy.visit('/game');
    
    // Should start with Engine tab selected
    cy.contains('Engine Module').should('be.visible');
    
    // Switch to Shield tab
    cy.contains('button', 'Shield').click();
    cy.contains('Shield Module').should('be.visible');
    
    // Switch to Power tab
    cy.contains('button', 'Power').click();
    cy.contains('Power Module').should('be.visible');
    
    // Switch back to Engine tab
    cy.contains('button', 'Engine').click();
    cy.contains('Engine Module').should('be.visible');
  });

  it('should display empty slots in a module', () => {
    cy.visit('/game');
    
    // Check that slots are displayed in the engine module
    cy.contains('Slot: 1').should('be.visible');
    cy.contains('Slot: 2').should('be.visible');
    cy.contains('Slot: 3').should('be.visible');
    
    // Verify that empty slots have appropriate text
    cy.contains('Empty Slot').should('be.visible');
    cy.contains('Click to install a component').should('be.visible');
  });

  it('should display components in the inventory', () => {
    cy.visit('/game');
    
    // Check that inventory contains components
    cy.contains('Basic Fusion Reactor').should('be.visible');
    
    // Verify filtering works
    cy.contains('button', 'Shield').click();
    cy.contains('Electromagnetic Deflector').should('be.visible');
    
    // Verify we can go back to all components
    cy.contains('button', 'All').click();
    cy.contains('Basic Fusion Reactor').should('be.visible');
  });
}); 