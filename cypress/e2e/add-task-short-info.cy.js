// cypress/e2e/add-task-short-info.cy.js

describe('Add Task – Short Additional Info', () => {
  beforeEach(() => {
    // 1) Log in
    cy.visit('/signin');
    cy.get('input[name="email"]').type('rahul@gmail.com');
    cy.get('input[name="password"]').type('lal');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');

    // 2) Stub the scheduling endpoint and timeSlots fetch
    cy.intercept('POST', '/api/scheduling/schedule-task', {
      statusCode: 200, body: {}
    }).as('scheduleTask');
    cy.intercept('GET', '/testingDB/timeSlots-by-userid*', {
      statusCode: 200, body: []
    }).as('getTimeSlots');
  });

  it('submits successfully when additional info is short', () => {
    // 3) Fill in Task Name, Deadline, Duration
    cy.get('.add-task input[type="text"]').type('Short Info Task');
    cy.get('.add-task input[type="datetime-local"]').type('2025-06-01T11:00');
    cy.get('.add-task input[type="number"]').clear().type('2');

    // 4) Fill in a short info (e.g. 10 characters)
    cy.get('.add-task textarea').type('Quick note');

    // 5) Click Add Task
    cy.get('.add-task button.add-btn').click();

    // 6) Wait for the POST and assert payload.info is exactly what we entered
    cy.wait('@scheduleTask').its('request.body').should(body => {
      expect(body.info).to.equal('Quick note');
    });

    // 7) Verify success notification appears
    cy.contains('Task added successfully!')
      .should('be.visible');
  });
});
