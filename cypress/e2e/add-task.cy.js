// cypress/e2e/add-task.cy.js

describe('Add Task – Valid Details', () => {
  beforeEach(() => {
    // 1) Visit the sign-in page
    cy.visit('/signin');

    // 2) Fill credentials and submit
    cy.get('input[name="email"]').type('rahul@gmail.com');       // or use the actual email/username field
    cy.get('input[name="password"]').type('lal');
    cy.get('button[type="submit"]').click();

    // 3) Wait for redirect to dashboard
    cy.url().should('include', '/dashboard');

    // 4) Stub your scheduling API so tests don’t rely on the real backend
    cy.intercept('POST', '/api/scheduling/schedule-task', {
      statusCode: 200, body: {}
    }).as('scheduleTask');
    cy.intercept('GET', '/testingDB/timeSlots-by-userid*', {
      statusCode: 200, body: []
    }).as('getTimeSlots');
  });

  it('fills the form and shows a success notification', () => {
    // Fill in the Add Task form
    cy.get('.add-task input[type="text"]')
      .type('My Cypress Task');
    cy.get('.add-task input[type="datetime-local"]')
      .type('2025-06-01T10:30');
    cy.get('.add-task input[type="number"]')
      .clear()
      .type('3');
    cy.get('.add-task textarea')
      .type('This is a valid additional info.');

    // Submit the form
    cy.get('.add-task button.add-btn').click();

    // Assert the POST was made with correct payload
    cy.wait('@scheduleTask').its('request.body').should(body => {
      expect(body).to.include({
        name: 'My Cypress Task',
        duration: '3',
        deadline: '2025-06-01T10:30'
      });
      expect(body.info).to.equal('This is a valid additional info.');
    });

    // And that you see the success notification
    cy.contains('Task added successfully!')
      .should('be.visible');
  });
});
