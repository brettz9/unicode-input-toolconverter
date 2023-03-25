import {visitBrowserAction} from './utils.js';

describe('Charts', function () {
  describe('Custom protocol', function () {
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

  it('Sets "Show image" including on load', function () {
    visitBrowserAction();

    cy.get('#showImg').invoke('prop', 'checked').should('eq', false);

    cy.get('#showImg').click();

    visitBrowserAction();
    cy.get('#showImg').invoke('prop', 'checked').should('eq', true);

    cy.get('#startset').clear().type('é');

    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) > .centered > button'
    ).trigger('mouseover');

    cy.get('#unicodeImg img').should('be.visible');
  });

  it('shows plane number on character mouseover', function () {
    visitBrowserAction();

    cy.get('#startset').clear().type('a');
    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) > .centered > button'
    ).trigger('mouseover');
    cy.get('#plane').contains('Plane 0:');

    cy.get('#startset').clear().type('𓀀');
    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) > .centered > button'
    ).trigger('mouseover');
    cy.get('#plane').contains('Plane 1:');
  });

  // Broken?
  it.skip('shows PDF link', function () {
    //
  });

  // Needs to test functionality too
  it.skip('Sets "Show all items" including on load', function () {
    visitBrowserAction();
    cy.get('#viewTabs > .tabs > .tab:nth-of-type(2)').click();

    cy.get('#showAllDetailedView').invoke(
      'prop', 'checked'
    ).should('eq', true);

    cy.get('#showAllDetailedView').click();

    visitBrowserAction();
    cy.get('#viewTabs > .tabs > .tab:nth-of-type(2)').click();

    cy.get('#showAllDetailedView').invoke(
      'prop', 'checked'
    ).should('eq', false);
  });

  // Needs to test functionality too
  it.skip('Sets "Show all items" (CJK) including on load', function () {
    visitBrowserAction();
    cy.get('#viewTabs > .tabs > .tab:nth-of-type(3)').click();

    cy.get('#showAllDetailedCJKView').invoke(
      'prop', 'checked'
    ).should('eq', true);

    cy.get('#showAllDetailedCJKView').click();

    visitBrowserAction();
    cy.get('#viewTabs > .tabs > .tab:nth-of-type(3)').click();

    cy.get('#showAllDetailedCJKView').invoke(
      'prop', 'checked'
    ).should('eq', false);
  });
});
