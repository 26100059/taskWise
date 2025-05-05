// cypress/e2e/toggle-dark-mode.cy.js

describe('Dark Mode Toggle', () => {
  it('logs in, toggles dark mode on and off, and verifies the dashboard class changes', () => {
    // 1) Log in and land on dashboard
    cy.visit('/signin');
    cy.get('input[name="email"]').type('rahul@gmail.com');
    cy.get('input[name="password"]').type('lal');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');

    // 2) Verify initial state is light mode
    cy.get('div.dashboard').should('not.have.class', 'dark-mode');

    // 3) Click the switch input to enable dark mode
    cy.get('input[role="switch"]')
      .should('have.attr', 'aria-checked', 'false')
      .click({ force: true });

    // 4) Dashboard should now have the dark-mode class
    cy.get('div.dashboard').should('have.class', 'dark-mode');

    // 5) Click the switch again to go back to light mode
    cy.get('input[role="switch"]')
      .should('have.attr', 'aria-checked', 'true')
      .click({ force: true });

    // 6) Dashboard should no longer have the dark-mode class
    cy.get('div.dashboard').should('not.have.class', 'dark-mode');
  });
});
