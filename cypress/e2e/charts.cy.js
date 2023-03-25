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

  it('shows previously selected character on load', function () {
    visitBrowserAction();

    cy.get('#startset').clear().type('é');

    visitBrowserAction();

    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) > .centered > button'
    ).contains('é');
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

  it('inputs character on click', function () {
    visitBrowserAction();

    cy.get('#startset').clear().type('é');

    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) > .centered > button'
    ).click();

    cy.get('#insertText').invoke('val').should('eq', 'é');
  });

  it('clears characters', function () {
    visitBrowserAction();

    cy.get('#startset').clear().type('é');

    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) > .centered > button'
    ).click();

    cy.get('#insertText').invoke('val').should('eq', 'é');

    cy.get('#clearoutput').click();

    cy.get('#insertText').invoke('val').should('eq', '');
  });

  it('copies characters to clipboard', function () {
    visitBrowserAction();

    cy.get('#startset').clear().type('é');

    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) > .centered > button'
    ).click();

    cy.get('#insertText').invoke('val').should('eq', 'é');

    cy.get('#outputButtons > button').contains(
      'Copy to clipboard'
    ).click();

    // eslint-disable-next-line promise/prefer-await-to-then -- Cypress
    return cy.window().then(async (win) => {
      const text = await win.navigator.clipboard.readText();
      expect(text).to.eq('é');
      return true;
    });
  });

  it('moves characters to conversion tab', function () {
    visitBrowserAction();

    cy.get('#startset').clear().type('é');

    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) > .centered > button'
    ).click();

    cy.get('#insertText').invoke('val').should('eq', 'é');

    cy.get('.outputcopybutton').click();

    cy.get('#toconvert').invoke('val').should('eq', 'é');
  });

  it('chooses the next set', function () {
    visitBrowserAction();

    cy.get('#startset').clear().type('a');

    cy.get('#chart_table > tr:last-child a:nth-of-type(2)').contains(
      'Next set'
    ).trigger('click');

    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) > .centered > button'
    ).contains('m');
  });

  it('chooses the prev set', function () {
    visitBrowserAction();

    cy.get('#startset').clear().type('m');

    cy.get('#chart_table > tr:last-child a:nth-of-type(1)').contains(
      'Prev set'
    ).trigger('click');

    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) > .centered > button'
    ).contains('a');
  });

  it('shows only entities (including upon reload)', function () {
    visitBrowserAction();
    cy.get('#onlyentsyes').invoke('prop', 'checked').should('eq', false);

    cy.get('#onlyentsyes').click();

    visitBrowserAction();
    cy.get('#onlyentsyes').invoke('prop', 'checked').should('eq', true);
    cy.get(
      // Skip first (nbsp) as can't access as such
      '#chart_table > tr:nth-of-type(2) > ' +
      'td:nth-of-type(1) > .centered > button'
    ).contains('£');
  });

  it('changes the number of rows', function () {
    visitBrowserAction();

    cy.get(
      '#chart_table > tr:nth-of-type(6) > ' +
      'td:nth-of-type(1) > .centered > button'
    ).should('not.exist');

    cy.get('#rowsset').clear().type(6).blur();

    cy.get(
      '#chart_table > tr:nth-of-type(6) > ' +
      'td:nth-of-type(1) > .centered > button'
    ).should('exist');
  });

  it('changes the number of columns', function () {
    visitBrowserAction();

    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(6) > .centered > button'
    ).should('not.exist');

    cy.get('#colsset').clear().type(6).blur();

    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(6) > .centered > button'
    ).should('exist');
  });

  it('Allows disabling display of entities', function () {
    visitBrowserAction();

    cy.get('#startset').clear().type('é');

    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) > a'
    ).should('exist');

    cy.get('#entyes').click();

    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) > a'
    ).should('not.exist');
  });

  it('Allows disabling display of decimal char. refs', function () {
    visitBrowserAction();

    cy.get('#startset').clear().type('é');

    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) > button[name="dec"]'
    ).should('exist');

    cy.get('#decyes').click();

    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) > button[name="dec"]'
    ).should('not.exist');
  });

  it('Allows disabling display of hex char. refs', function () {
    visitBrowserAction();

    cy.get('#startset').clear().type('é');

    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) > button[name="hex"]'
    ).should('exist');

    cy.get('#hexyes').click();

    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) > button[name="hex"]'
    ).should('not.exist');
  });

  it('Allows disabling display of Unicode', function () {
    visitBrowserAction();

    cy.get('#startset').clear().type('é');

    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) button[name="unicode"]'
    ).should('exist');

    cy.get('#unicodeyes').click();

    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) button[name="unicode"]'
    ).should('not.exist');
  });

  it('allows viewing character in middle of chart', function () {
    visitBrowserAction();

    cy.get('#startset').clear().type('a');
    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) button[name="unicode"]'
    ).contains('a');

    cy.get('#startCharInMiddleOfChart').click();

    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) button[name="unicode"]'
    ).contains('[');
    cy.get(
      '#chart_table > tr:nth-of-type(3) > ' +
      'td:nth-of-type(1) button[name="unicode"]'
    ).contains('a');
  });

  it('allows disabling of button styling', function () {
    visitBrowserAction();

    cy.get('#startset').clear().type('a');
    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) button[name="unicode"]'
    ).contains('a');

    cy.get('#buttonyes').click();

    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) button[name="unicode"]'
    ).should('not.exist');

    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) div[name="unicode"]'
    ).should('exist');
  });
});
