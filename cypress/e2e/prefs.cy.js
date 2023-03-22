import {visitBrowserAction} from './utils.js';

describe('Prefs', function () {
  beforeEach(async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      registration.unregister();
    }
  });

  it('Resets to defaults', function () {
    visitBrowserAction();
    cy.get('h1.tab:nth-of-type(3)').contains('Prefs').click();
    cy.get('#asciiLt128').should('not.be.checked');
    cy.get('#asciiLt128').check();
    cy.get('#asciiLt128').should('be.checked');

    cy.get('#initialTab').should('have.value', 'charts');
    cy.get('#initialTab').select(1);
    cy.get('#initialTab').should('have.value', 'conversion');

    cy.get('#resetdefaultbutton').click();
    cy.get('#asciiLt128').should('not.be.checked');
    cy.get('#initialTab').should('have.value', 'charts');
  });
});
