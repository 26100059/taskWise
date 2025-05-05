// cypress/e2e/access-dashboard-without-login.cy.js

describe('Access Dashboard Without Login', () => {
  it('redirects to the sign-in page when visiting /dashboard unauthenticated', () => {
    // 1) Clear any existing session/local storage
    cy.clearCookies();
    cy.clearLocalStorage();

    // 2) Attempt to visit the dashboard directly
    cy.visit('/dashboard');

    // 3) The app should redirect to /signin (or /login)
    cy.url().should('include', '/signin');

    // 4) Optionally, verify that the sign-in form is visible
    cy.get('form').within(() => {
      cy.get('input[name="email"]').should('exist');
      cy.get('input[name="password"]').should('exist');
      cy.get('button[type="submit"]').should('contain', 'SIGN IN');
    });
  });
});
