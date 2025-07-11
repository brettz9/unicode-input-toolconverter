import {visitBrowserAction} from './utils.js';

describe('Main page', function () {
  beforeEach(async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      registration.unregister();
    }
  });

  // eslint-disable-next-line mocha/no-sibling-hooks -- One is Cypress-based
  beforeEach(() => {
    return cy.clearIndexedDB();
  });

  it('Downloads Unihan', function () {
    cy.clearIndexedDB();
    visitBrowserAction(undefined, [
      ['characterDescriptions', '1']
    ]);
    cy.get('#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)').click();
    return cy.get('#UnihanInstalled').then(($el) => {
      return Cypress.dom.isHidden($el);
    }).then(() => {
      cy.on('window:alert', (t) => {
        expect(t).to.contains('Finished download');
      });
      return cy.get('#DownloadButtonBox button').click();
    }).then(() => {
      return cy.get('#UnihanInstalled', {
        timeout: 20000
      }).contains('database installed');
    }).then(() => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting -- Loading
      cy.wait(8000);
      return cy.get('#closeDownloadProgressBox').click();
    }).then(() => {
      return cy.get('#DownloadProgressBox');
    }).then(($el) => {
      return Cypress.dom.isHidden($el);
    }).then(() => {
      visitBrowserAction(undefined, [
        ['customProtocol', 'web+unicode:searchkDefinition?string=woman']
      ]);
      return cy.get(
        'tr:nth-of-type(3) .unicodetablecell:nth-of-type(1) ' +
        '> div.centered > button'
      ).invoke('html').should('eq', '㚫');
    }).then(() => {
      visitBrowserAction();

      // Had to retype part of this to get it to register properly
      cy.clearTypeAndBlur('#searchkDefinition', 'woman1');
      // eslint-disable-next-line cypress/no-unnecessary-waiting -- Cypress
      cy.wait(4000);

      cy.get('#searchkDefinition').type('{backspace}');
      cy.get('#searchkDefinition').blur();

      return cy.get(
        'tr:nth-of-type(3) .unicodetablecell:nth-of-type(1) ' +
        '> div.centered > button'
      ).invoke('html').should('eq', '㚫');
    }).then(() => {
      cy.get('#viewTabs > .tabs > .tab:nth-of-type(3)').click();

      cy.get('#showAllDetailedCJKView').check();

      // A character with a definition
      cy.clearAndType('#startset', '㐀');
      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).trigger('mouseover');

      cy.get('#_detailedCJKView2').invoke('val').should('eq', '');
      cy.get('#_detailedCJKView6').invoke('val').should('eq', 'TM');

      cy.get('#showAllDetailedCJKView').uncheck();
      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).trigger('mouseover');

      cy.get('#_detailedCJKView2').should('not.be.visible');
      cy.get('#_detailedCJKView6').invoke('val').should('eq', 'TM');

      return undefined;
    }).then(() => {
      [
        [0x3400, 'hillock or mound'],
        [0x3408, '(No definition)'],
        [0xD78B, 'Hangul Syllable HIGS'],
        [0x61, 'LATIN SMALL LETTER A'],
        [0xE005, 'Undefined or not found']
      ].forEach(([chr, desc]) => {
        cy.clearAndType('#startset', String.fromCodePoint(chr));
        cy.get(
          '#chart_table > tr:nth-of-type(1) > ' +
          'td:nth-of-type(1) > .centered > button'
        ).trigger('mouseover');
        cy.get('#displayUnicodeDesc').invoke('val').should('contain', desc);
      });
      return undefined;
    }).then(() => {
      cy.get('h1[data-label="Detailed view"]').click();
      cy.clearAndType('#startset', '㐀');
      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).trigger('mouseover');
      cy.get(
        'h1[data-selected][data-label="Detailed view (CJK)"]'
      ).should('exist');
      return undefined;
    });
  });

  it('Gets error when attempting to download Unihan', function () {
    cy.wrap(Cypress.automation('remote:debugger:protocol', {
      command: 'Network.clearBrowserCache'
    }));

    visitBrowserAction();
    cy.get('h1.tab:nth-of-type(3)').contains('Prefs').click();

    cy.intercept(
      'GET', '/download/unihan/unihan.json', {forceNetworkError: true}
    );

    cy.on('window:alert', (t) => {
      expect(t).to.contains('There was a problem downloading');
    });
    cy.get('#DownloadButtonBox button').click();
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

  it('Preloads preference-set tab', function () {
    visitBrowserAction();
    cy.get('h1.tab:nth-of-type(3)').contains('Prefs').click();
    cy.get('#initialTab').select(1);
    cy.get('#initialTab').blur();
    cy.get('#initialTab').should('have.value', 'conversion');
    cy.get('h1.tab:nth-of-type(1)').contains('Charts').click();
    cy.reload(true);

    // eslint-disable-next-line @stylistic/max-len -- Long
    // eslint-disable-next-line cypress/no-unnecessary-waiting -- Wait until loads
    cy.wait(500);
    cy.get('#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)').contains(
      'Conversion'
    ).invoke('data', 'selected').should('eq', true);
  });

  /*
  // Doesn't work to get at outerHeight/outerWidth; may need
  //   to implement through `outerWidth=` params passed to
  //  `window.open` instead, but support appears poor:
  //  https://developer.mozilla.org/en-US/docs/Web/API/Window/open
  it.skip('Remembers window sizing if opened in dialog', function () {
    return cy.window().then((win) => {
      // eslint-disable-next-line promise/avoid-new -- No API
      return new Promise((resolve, reject) => {
        const w = win.open(
          '/browser_action/index-instrumented.html',
          'unicode-input-toolconverter',
          'popup'
        );
        w.addEventListener('load', () => {
          w.resizeTo(350, 350);
          w.close();

          const w2 = win.open(
            '/browser_action/index-instrumented.html',
            'unicode-input-toolconverter',
            'popup'
          );

          w2.addEventListener('load', () => {
            expect(w2.outerWidth).to.equal(350);
            expect(w2.outerHeight).to.equal(350);
            w2.close();
            resolve();
          });
        });
      });
    });
  });
  */

  // Not consistently working for some reason
  it('Loads with service worker', function () {
    visitBrowserAction(undefined, [
      ['serviceWorker', 1]
    ]);

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
    visitBrowserAction(undefined, [
      ['fonts', 1]
    ]);

    // eslint-disable-next-line @stylistic/max-len -- Long
    // eslint-disable-next-line cypress/no-unnecessary-waiting -- Needs longer with fonts
    cy.wait(4000);

    cy.get('#font-list', {
      timeout: 20000
    }).select('Helvetica');

    cy.get(
      '#chart_table > tr:nth-of-type(1) > ' +
      'td:nth-of-type(1) > .centered > button'
    ).invoke('css', 'font-family').should('eq', 'Helvetica');
  });
});
