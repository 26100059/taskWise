// cypress/e2e/manual-rescheduling-by-day-number.cy.js

describe('Manual Rescheduling – Drag “hello” from Day 4 to Day 5', () => {
  it('drags the first .fc-event-draggable from day 4 into day 5 cell', () => {
    // 1) Log in
    cy.visit('/signin');
    cy.get('input[name="email"]').type('rahul@gmail.com');
    cy.get('input[name="password"]').type('lal');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');

    // 2) Wait for calendar to render
    cy.get('.fc-header-toolbar').should('exist');
    cy.get('.fc-event-draggable').should('exist');

    // 3) Alias the source event inside Day 4 cell
    cy.contains('.fc-daygrid-day-number', '4')
      .parents('.fc-daygrid-day')
      .find('a.fc-event-draggable')
      .first()
      .as('sourceEvent');

    // 4) Compute center of Day 5 cell
    cy.contains('.fc-daygrid-day-number', '5')
      .parents('.fc-daygrid-day')
      .then($cell => {
        const rect = $cell[0].getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top  + rect.height / 2;

        // 5) Perform the native drag sequence with button:0 and accurate coords
        cy.get('@sourceEvent')
          .trigger('mousedown', { button: 0, force: true });

        cy.get('@sourceEvent')  // you can trigger mousemove on the event
          .trigger('mousemove', { button: 0, pageX: x, pageY: y, force: true })
          .trigger('mouseup', { force: true });

        // 6) Wait for FullCalendar to update
        cy.wait(500);

        // 7) Assert the event now lives in Day 5 cell
        cy.contains('.fc-daygrid-day-number', '5')
          .parents('.fc-daygrid-day')
          .find('a.fc-event-draggable')
          .should('contain.text', 'hello')
          .and('be.visible');
      });
  });
});
