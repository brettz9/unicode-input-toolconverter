import {visitBrowserAction} from './utils.js';

describe('Prefs', function () {
  beforeEach(async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      registration.unregister();
    }
  });

  it('registers protocol handler', function () {
    visitBrowserAction();
    cy.get('h1.tab:nth-of-type(3)').contains('Prefs').click();

    cy.on('uncaught:exception', (/* err, runnable */) => {
      return true;
    });

    cy.get('#registerProtocolHandler').click();
    // Todo: Request Cypress allow interaction with protocol handlers
    //        to complete testing
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

  it('Sets CSS whitespace on load', function () {
    visitBrowserAction();

    cy.get('h1.tab:nth-of-type(3)').contains('Prefs').click();
    cy.get('#CSSWhitespace').select(0);
    visitBrowserAction();
    cy.get('#CSSWhitespace').invoke('val').should('eq', 'space');

    cy.get('h1.tab:nth-of-type(3)').contains('Prefs').click();
    cy.get('#CSSWhitespace').select(1);
    visitBrowserAction();
    cy.get('#CSSWhitespace').invoke('val').should('eq', 'n');

    cy.get('h1.tab:nth-of-type(3)').contains('Prefs').click();
    cy.get('#CSSWhitespace').select(2);
    visitBrowserAction();
    cy.get('#CSSWhitespace').invoke('val').should('eq', 't');

    cy.get('h1.tab:nth-of-type(3)').contains('Prefs').click();
    cy.get('#CSSWhitespace').select(3);
    visitBrowserAction();
    cy.get('#CSSWhitespace').invoke('val').should('eq', 'f');
  });

  describe('Options API', function () {
    it('Opens to pref page', function () {
      visitBrowserAction(undefined, [
        ['options', 1]
      ]);
      cy.get(
        '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(3)'
      ).should('exist');
    });
  });
});
