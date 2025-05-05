// cypress/e2e/profile-pie-legend.cy.js

describe('Profile Pie Chart Legend', () => {
  it('logs in, visits profile, and sees “Completed” in the pie chart legend', () => {
    // 1) Log in
    cy.visit('/signin');
    cy.get('input[name="email"]').type('rahul@gmail.com');
    cy.get('input[name="password"]').type('lal');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');

    // 2) Visit profile
    cy.visit('/profile');
    cy.url().should('include', '/profile');

    // 3) Ensure the right-graph container is present
    cy.get('.profilePage-right-graph').should('be.visible');

    // 4) Assert that the legend contains “Completed”
    cy.get('.profilePage-right-graph')
      .contains('Completed')
      .should('exist');
  });
});
