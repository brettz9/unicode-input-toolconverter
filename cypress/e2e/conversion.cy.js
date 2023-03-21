import {visitBrowserAction} from './utils.js';

describe('Conversion', function () {
  it('Converts unambiguous CSS escapes', function () {
    visitBrowserAction();
    cy.get('h1.tab:nth-of-type(3)').contains('Prefs').click();
    cy.get('#cssUnambiguous').check();
    cy.get('h1.tab:nth-of-type(2)').contains('Conversion').click();
    cy.get('#converted').clear();
    cy.get('#toconvert').clear().type('é');
    cy.get('#b8').click();
    cy.get('#converted').invoke('val').should('eq', '\\0000e9');
  });

  it('Converts whitespace-separated CSS escapes', function () {
    visitBrowserAction();
    cy.get('h1.tab:nth-of-type(3)').contains('Prefs').click();
    cy.get('#cssUnambiguous').uncheck();
    cy.get('#CSSWhitespace').select('t');
    cy.get('h1.tab:nth-of-type(2)').contains('Conversion').click();
    cy.get('#converted').clear();
    cy.get('#toconvert').clear().type('é');
    cy.get('#b8').click();
    cy.get('#converted').invoke('val').should('eq', '\\e9\t');
  });

  it('Escapes ampersand followed by space', function () {
    visitBrowserAction();

    cy.get(
      '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
    ).contains('Prefs').click();
    cy.get('#ampspace').uncheck();

    cy.get(
      '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
    ).contains('Conversion').click();
    cy.get('#converted').clear();
    cy.get('#toconvert').clear().type('& test');
    cy.get('#b3').click();
    cy.get('#converted').invoke('val').should('eq', '& test');

    cy.get(
      '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
    ).contains('Prefs').click();
    cy.get('#ampspace').check();

    cy.get(
      '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
    ).contains('Conversion').click();
    cy.get('#converted').clear();
    cy.get('#toconvert').clear().type('& test');
    cy.get('#b3').click();
    cy.get('#converted').invoke('val').should('eq', '&amp; test');
  });
});
