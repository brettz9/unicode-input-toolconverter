import {visitBrowserAction} from './utils.js';

describe('Conversion', function () {
  it.skip('Converts CSS escapes', function () {
    visitBrowserAction();
    cy.get('h1.tab:nth-of-type(2)').contains('Conversion').click();
  });
});
