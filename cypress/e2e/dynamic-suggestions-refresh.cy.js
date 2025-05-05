// cypress/e2e/dynamic-suggestions-refresh.cy.js

describe('Dynamic Productivity Suggestions Refresh', () => {
  it('logs in, captures one suggestion, reloads, and verifies the suggestion changes', () => {
    // 1) Log in and land on dashboard
    cy.visit('/signin');
    cy.get('input[name="email"]').type('rahul@gmail.com');
    cy.get('input[name="password"]').type('lal');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');

    cy.wait(3000)
    // 2) Wait for the first suggestion to appear and capture it
    cy.get('.suggestion-box', { timeout: 10000 })
      .should('be.visible')
      .invoke('text')
      .as('firstSuggestion');

    // 3) Reload the page
    cy.reload();

    cy.wait(3000)

    // 4) Wait again for the suggestion to appear and capture the new text
    cy.get('.suggestion-box', { timeout: 10000 })
      .should('be.visible')
      .invoke('text')
      .then((secondSuggestion) => {
        // 5) Compare to the first suggestion
        cy.get('@firstSuggestion').then((first) => {
          expect(secondSuggestion).to.not.equal(first);
        });
      });
  });
});
