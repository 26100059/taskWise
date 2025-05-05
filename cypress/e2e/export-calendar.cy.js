// cypress/e2e/export-calendar.cy.js

describe('Calendar Export', () => {
  it('downloads events.ics file', () => {
    // 1) Log in
    cy.visit('/signin');
    cy.get('input[name="email"]').type('rahul@gmail.com');
    cy.get('input[name="password"]').type('lal');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');

    // 2) Clean previous downloads
    cy.task('deleteFolder', Cypress.config('downloadsFolder'));

    // 3) Click Export Calendar
    cy.get('button.export-btn[title="Export Calendar"]').click();

    // 4) Read the downloaded file and assert it exists and is not empty
    const filename = `${Cypress.config('downloadsFolder')}/events.ics`;
    cy.readFile(filename, { timeout: 10000 })
      .should('exist')
      .and(content => {
        expect(content.length).to.be.gt(0);
      });
  });
});
