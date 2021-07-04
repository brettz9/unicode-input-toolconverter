describe('Main page', function () {
  it('Bad request for hidden files', function () {
    cy.visit('/.git/config', {
      failOnStatusCode: false
    });
    cy.get('b').contains('Bad request');
  });

  it('Redirects main page', function () {
    cy.visit('/browser_action');
    cy.location('pathname', {
      timeout: 10000
    }).should('eq', '/browser_action/');
  });

  it('Loads with service worker', function () {
    cy.visit('/browser_action/?serviceWorker=1');
  });

  it('Loads with custom lang', function () {
    cy.visit('/browser_action/?lang=hu-HU');
    cy.get('#unicodeTabBox > :nth-child(1) > [data-selected="true"]').contains(
      'Diagramok'
    );
  });

  it('Loads fonts conditionally', function () {
    cy.visit('/browser_action/?fonts=1');
    cy.get('select option', {
      timeout: 20000
    }).contains('Helvetica');
  });
});
