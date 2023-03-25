import {visitBrowserAction} from './utils.js';

describe('Charts', function () {
  it('Visits character specified by custom protocol', function () {
    visitBrowserAction(undefined, [
      ['customProtocol', 'web+unicode:find?char=g']
    ]);
    cy.get(
      'tr:nth-of-type(1) .unicodetablecell:nth-of-type(1) ' +
      '> div.centered > button'
    ).invoke('html').should('eq', 'g');
  });

  // Problems with database
  it.skip('Performs name search specified by custom protocol', function () {
    visitBrowserAction(undefined, [
      ['characterDescriptions', '1'],
      ['customProtocol', 'web+unicode:searchName?string=Greek']
    ]);
    cy.get(
      'tr:nth-of-type(3) .unicodetablecell:nth-of-type(1) ' +
      '> div.centered > button'
    ).invoke('html').should('eq', 'Ͳ');
  });

  it('Alerts error upon bad custom protocol type', function () {
    cy.on('window:alert', (t) => {
      expect(t).to.contains('Unrecognized query type passed');
    });
    visitBrowserAction(undefined, [
      ['customProtocol', 'web+unicode:badType']
    ]);
  });

  it('Sets multiline description including on load', function () {
    visitBrowserAction();
    cy.get('#displayUnicodeDesc').invoke(
      'prop', 'nodeName'
    ).should('eq', 'INPUT');
    cy.get('#multiline').click();
    cy.get('#displayUnicodeDesc').invoke(
      'prop', 'nodeName'
    ).should('eq', 'TEXTAREA');

    visitBrowserAction();
    cy.get('#displayUnicodeDesc').invoke(
      'prop', 'nodeName'
    ).should('eq', 'TEXTAREA');
  });
});
