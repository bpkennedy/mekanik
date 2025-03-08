/// <reference types="cypress" />

describe('Mekanik Game - Enhanced Accessibility', () => {
  it('should have proper heading structure', () => {
    cy.visit('/');
    
    // Check that headings exist
    cy.get('h1').should('exist');
    cy.get('h1').first().invoke('text').should('not.be.empty');
    
    // Landing page heading content
    cy.get('h1').contains('MEKANIK').should('be.visible');
  });

  it('should have accessible buttons with proper attributes', () => {
    cy.visit('/game');
    
    // Check that buttons are properly labeled
    cy.get('button').each(($button) => {
      // Either button should have visible text content or an aria-label
      const hasText = $button.text().trim().length > 0;
      const hasAriaLabel = $button.attr('aria-label') !== undefined;
      const hasAriaLabelledBy = $button.attr('aria-labelledby') !== undefined;
      
      // Use cy.wrap to assert on the jQuery element
      cy.wrap(hasText || hasAriaLabel || hasAriaLabelledBy).should('be.true');
    });
    
    // Check that interactive elements have proper focus styles
    cy.get('button').first().focus().should('have.css', 'outline').and('not.equal', 'none');
  });

  it('should have proper color contrast for text elements', () => {
    cy.visit('/game');
    
    // This is a simple visual check - a true color contrast test would require a specialized tool
    // But we can check if the app uses the dark theme classes correctly
    cy.get('html').should('have.class', 'dark');
    
    // Check that text elements exist on dark backgrounds with light text
    cy.get('.text-slate-50, .text-slate-100, .text-slate-200, .text-slate-300, .text-white').should('exist');
  });

  it('should have responsive design that works on different viewports', () => {
    // Test on mobile viewport
    cy.viewport('iphone-8');
    cy.visit('/game');
    
    // Important content should still be visible
    cy.contains('Mekanik').should('be.visible');
    cy.contains('Inventory').should('be.visible');
    
    // Test on tablet viewport
    cy.viewport('ipad-2');
    cy.visit('/game');
    
    // Important content should still be visible
    cy.contains('Mekanik').should('be.visible');
    cy.contains('Inventory').should('be.visible');
    
    // Test on desktop viewport
    cy.viewport('macbook-15');
    cy.visit('/game');
    
    // Important content should still be visible
    cy.contains('Mekanik').should('be.visible');
    cy.contains('Inventory').should('be.visible');
  });
}); 