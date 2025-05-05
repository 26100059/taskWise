// // cypress/e2e/add-task-long-info.cy.js

// describe('Add Task – Long (500-word) Additional Info', () => {
//   const longInfo = Array(500).fill('word').join(' '); // 500 words

//   beforeEach(() => {
//     // 1) Log in
//     cy.visit('/signin');
//     cy.get('input[name="email"]').type('rahul@gmail.com');
//     cy.get('input[name="password"]').type('lal');
//     cy.get('button[type="submit"]').click();
//     cy.url().should('include', '/dashboard');

//     // 2) Stub the scheduling endpoint and initial timeSlots GET
//     cy.intercept('POST', '/api/scheduling/schedule-task', {
//       statusCode: 200, body: {}
//     }).as('scheduleTask');
//     cy.intercept('GET', '/testingDB/timeSlots-by-userid*', {
//       statusCode: 200, body: []
//     }).as('getTimeSlots');
//   });

//   it('submits successfully with 500-word additional info', () => {
//     // 3) Fill in Task Name, Deadline, Duration
//     cy.get('.add-task input[type="text"]').type('Long Info Task');
//     cy.get('.add-task input[type="datetime-local"]').type('2025-06-01T12:00');
//     cy.get('.add-task input[type="number"]').clear().type('4');

//     // 4) Fill in the 500-word info
//     cy.get('.add-task textarea')
//       .invoke('val', longInfo)    // set value directly
//       .trigger('input');          // notify React

//     // 5) Click Add Task
//     cy.get('.add-task button.add-btn').click();

//     // 6) Wait for the POST and assert the payload info matches
//     cy.wait('@scheduleTask').its('request.body').should(body => {
//       expect(body.info.split(' ').length).to.equal(500);
//       expect(body.info).to.equal(longInfo);
//     });

//     // 7) Verify success notification appears
//     cy.contains('Task added successfully!').should('be.visible');
//   });
// });
