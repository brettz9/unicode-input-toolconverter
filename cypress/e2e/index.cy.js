describe('Main page', function () {
  beforeEach(() => {
    return cy.clearIndexedDB();
  });
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

  it('Checks accessibility', function () {
    cy.visitURLAndCheckAccessibility('/browser_action/index-instrumented.html');
  });

  it.skip('Downloads Unihan', function () {
    cy.visit('/browser_action/index-instrumented.html');
    cy.get('#unicodeTabBox > .tabs > .tab:nth-child(3)').click();
    // eslint-disable-next-line promise/prefer-await-to-then -- Cypress
    return cy.get('#UnihanInstalled').then(($el) => {
      return Cypress.dom.isHidden($el);
    // eslint-disable-next-line promise/prefer-await-to-then -- Cypress
    }).then(() => {
      return cy.get('#DownloadButtonBox button').click();
    // eslint-disable-next-line promise/prefer-await-to-then -- Cypress
    }).then(() => {
      return cy.get('#UnihanInstalled', {
        timeout: 20000
      }).contains('database installed');
    // eslint-disable-next-line promise/prefer-await-to-then -- Cypress
    }).then(() => {
      return cy.get('#closeDownloadProgressBox').click();
    // eslint-disable-next-line promise/prefer-await-to-then -- Cypress
    }).then(() => {
      return cy.get('#DownloadProgressBox');
    // eslint-disable-next-line promise/prefer-await-to-then -- Cypress
    }).then(($el) => {
      return Cypress.dom.isHidden($el);
    });
  });

  it('Loads with service worker', function () {
    cy.visit('/browser_action/index-instrumented.html?serviceWorker=1');

    // eslint-disable-next-line promise/prefer-await-to-then -- Cypress
    return cy.window().then((win) => {
      return expect(win.navigator.serviceWorker.controller).to.not.be.null;
    });
  });

  it('Loads with custom lang', function () {
    cy.visit('/browser_action/index-instrumented.html?lang=hu-HU');
    cy.get('#unicodeTabBox > :nth-child(1) > [data-selected="true"]').contains(
      'Diagramok'
    );
  });

  it('Loads fonts conditionally', function () {
    cy.visit('/browser_action/index-instrumented.html?fonts=1');
    cy.get('select option', {
      timeout: 20000
    }).contains('Helvetica');
  });
});
