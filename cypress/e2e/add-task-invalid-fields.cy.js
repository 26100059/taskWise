// cypress/e2e/add-task-invalid-duration.cy.js

describe('Add Task – Invalid Duration', () => {
  beforeEach(() => {
    // 1) Log in
    cy.visit('/signin');
    cy.get('input[name="email"]').type('rahul@gmail.com');
    cy.get('input[name="password"]').type('lal');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');

    // 2) Spy on scheduling endpoint
    cy.intercept('POST', '/api/scheduling/schedule-task').as('scheduleTask');
  });

  it('clicking Add Task shows validation error for negative duration', () => {
    // 3) Fill in valid task name
    cy.get('.add-task input[type="text"]').type('Negative Duration Task');

    // 4) Fill in valid deadline
    cy.get('.add-task input[type="datetime-local"]').type('2025-06-01T10:30');

    // 5) Enter negative duration
    cy.get('.add-task input[type="number"]')
      .clear()
      .type('-5');

    // 6) Click the Add Task button
    cy.get('.add-task button.add-btn').click();

    // 7) Assert the HTML5 validation pop-up message
    cy.get('.add-task input[type="number"]').then($input => {
      expect($input[0].validationMessage)
        .to.eq('Value must be greater than or equal to 1.');
    });

    // 8) Ensure scheduling API was never called
    cy.get('@scheduleTask.all').should('have.length', 0);

    // 9) Confirm no success notification appears
    cy.contains('Task added successfully!').should('not.exist');
  });
});
