// cypress/e2e/mark-hello-task-done.cy.js

describe('Mark a task as Done', () => {
  it('logs in, finds "hello" on the calendar via its title, marks it done, and sees confirmation', () => {
    // 1) Log in
    cy.visit('/signin');
    cy.get('input[name="email"]').type('rahul@gmail.com');
    cy.get('input[name="password"]').type('lal');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');

    // 2) (Assuming "hello" already exists) wait for the calendar to render
    //    we wait for the header toolbar as a proxy that FC has loaded
    cy.get('.fc-header-toolbar').should('exist');

    // 3) Now find the event by its title and click it
    cy.contains('.fc-event-title', 'hello')
      .should('be.visible')
      .click();

    // 4) In the popup, check "Mark as done"
    cy.get('.modal-content')
      .contains('Mark as done')
      .find('input[type="checkbox"]')
      .check();

    // 5) Click Save
    cy.get('.modal-content')
      .contains('button', 'Save')
      .click();

    // 6) Confirm the success notification
    cy.contains('Task status updated!').should('be.visible');
  });
});
