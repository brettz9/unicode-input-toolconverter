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
});
