import {visitBrowserAction} from './utils.js';

describe('Main page', function () {
  beforeEach(async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      registration.unregister();
    }
  });

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

  it('Preloads preference-set tab', function () {
    visitBrowserAction();
    cy.get('h1.tab:nth-of-type(3)').contains('Prefs').click();
    cy.get('#initialTab').select(1).blur();
    cy.get('#initialTab').should('have.value', 'conversion');
    cy.get('h1.tab:nth-of-type(1)').contains('Charts').click();
    cy.reload(true);

    // eslint-disable-next-line max-len -- Long
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
    // eslint-disable-next-line promise/prefer-await-to-then -- Cypress
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
  it('Downloads Unihan', function () {
    cy.clearIndexedDB();
    visitBrowserAction();
    cy.get('#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)').click();
    // eslint-disable-next-line promise/prefer-await-to-then -- Cypress
    return cy.get('#UnihanInstalled').then(($el) => {
      return Cypress.dom.isHidden($el);
    // eslint-disable-next-line promise/prefer-await-to-then -- Cypress
    }).then(() => {
      cy.on('window:alert', (t) => {
        expect(t).to.contains('Finished download');
      });
      return cy.get('#DownloadButtonBox button').click();
    // eslint-disable-next-line promise/prefer-await-to-then -- Cypress
    }).then(() => {
      return cy.get('#UnihanInstalled', {
        timeout: 20000
      }).contains('database installed');
    // eslint-disable-next-line promise/prefer-await-to-then -- Cypress
    }).then(() => {
      // eslint-disable-next-line cypress/no-unnecessary-waiting -- Loading
      cy.wait(5000);
      return cy.get('#closeDownloadProgressBox').click();
    // eslint-disable-next-line promise/prefer-await-to-then -- Cypress
    }).then(() => {
      return cy.get('#DownloadProgressBox');
    // eslint-disable-next-line promise/prefer-await-to-then -- Cypress
    }).then(($el) => {
      return Cypress.dom.isHidden($el);
    // eslint-disable-next-line promise/prefer-await-to-then -- Cypress
    }).then(() => {
      visitBrowserAction(undefined, [
        ['customProtocol', 'web+unicode:searchkDefinition?string=woman']
      ]);
      return cy.get(
        'tr:nth-of-type(3) .unicodetablecell:nth-of-type(1) ' +
        '> div.centered > button'
      ).invoke('html').should('eq', '㚫');
    });
  });

  // Not consistently working for some reason
  it('Loads with service worker', function () {
    visitBrowserAction(undefined, [
      ['serviceWorker', 1]
    ]);

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
    visitBrowserAction(undefined, [
      ['fonts', 1]
    ]);

    // eslint-disable-next-line max-len -- Long
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
