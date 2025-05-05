// cypress/e2e/profile-update.cy.js

describe('Profile XP Update After Completing a Task', () => {
  it('logs in, marks "hello" task as done, navigates to profile, and verifies XP is 80', () => {
    // 1) Log in and land on dashboard
    cy.visit('/signin');
    cy.get('input[name="email"]').type('rahul@gmail.com');
    cy.get('input[name="password"]').type('lal');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');

    // 2) Mark the "hello" task as done
    // Wait for calendar and click the event
    cy.get('.fc-header-toolbar').should('exist');
    cy.contains('.fc-event-title', 'hello').click();
    cy.get('.modal-content input[type="checkbox"]').check();
    cy.get('.modal-content button').contains('Save').click();
    cy.contains('Task status updated!').should('be.visible');

    // 3) Navigate to the profile page
    cy.visit('/profile');
    cy.url().should('include', '/profile');

    // 4) Verify that the XP text shows "XP: 80/100"
    cy.get('.profilePage-xp-text')
      .should('contain.text', 'XP: 80/100');
  });
});
