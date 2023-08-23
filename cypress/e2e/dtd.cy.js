import {visitBrowserAction} from './utils.js';

describe('DTD page', function () {
  beforeEach(async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      registration.unregister();
    }
  });

  it('inserts an entity file', function () {
    visitBrowserAction();
    cy.get('h1.tab:nth-of-type(4)').contains('DTD').click();
    cy.get('#insertEntityFile').select(1);
    cy.get('#DTDtextbox').invoke('val').should('contain', 'Copyright');
    cy.get('#DTDtextbox').invoke('val').should('contain', '<!ENTITY');
  });

  it('supports inserting a single empty entity', function () {
    visitBrowserAction();
    cy.get('h1.tab:nth-of-type(4)').contains('DTD').click();
    cy.get('#DTDtextbox').clear();
    cy.get('button.dtdbutton').click();
    cy.get('#DTDtextbox').invoke('val').should('contain', '<!ENTITY  "">');
  });

  it('supports a 1-length entity', function () {
    visitBrowserAction();
    cy.get('h1.tab:nth-of-type(4)').contains('DTD').click();
    cy.clearAndType('#DTDtextbox', '<!ENTITY a "b">');
    cy.get('h1.tab:nth-of-type(1)').contains('Charts').click();
    cy.get('#startset').type('b');
    cy.get('.entity > a').contains('&a;');
  });

  it('supports a decimal entity', function () {
    visitBrowserAction();
    cy.get('h1.tab:nth-of-type(4)').contains('DTD').click();
    cy.clearAndType('#DTDtextbox', '<!ENTITY a "&#1234;">');
    cy.get('h1.tab:nth-of-type(1)').contains('Charts').click();
    cy.clearAndType('#startset', 'Ӓ');
    cy.get('.entity > a').contains('&a;');
  });

  it('supports appending to existing HTML entities', function () {
    visitBrowserAction();
    cy.get('h1.tab:nth-of-type(4)').contains('DTD').click();
    cy.clearTypeAndBlur('#DTDtextbox', '<!ENTITY a "&#xabcd;">');
    cy.get('h1.tab:nth-of-type(1)').contains('Charts').click();
    cy.clearTypeAndBlur('#startset', 'é');
    cy.get('.entity > a').should('exist');
    cy.clearTypeAndBlur('#startset', 'ꯍ');
    cy.get('.entity > a').contains('&a;');
  });

  it('supports not appending to existing HTML entities', function () {
    visitBrowserAction();
    cy.get('h1.tab:nth-of-type(4)').contains('DTD').click();
    cy.get('#appendtohtmldtd').click();
    cy.clearAndType('#DTDtextbox', '<!ENTITY a "&#xabcd;">');
    cy.get('h1.tab:nth-of-type(1)').contains('Charts').click();
    cy.clearAndType('#startset', 'é');
    cy.get('.entity > a').should('not.exist');
    cy.clearAndType('#startset', 'ꯍ');
    cy.get('.entity > a').contains('&a;');
  });

  it('retains appending/DTD state after reload', function () {
    visitBrowserAction();
    cy.get('h1.tab:nth-of-type(4)').contains('DTD').click();
    cy.get('#appendtohtmldtd').check();
    cy.clearTypeAndBlur('#DTDtextbox', '<!ENTITY a "&#xabcd;">');

    cy.reload(true);
    // eslint-disable-next-line cypress/no-unnecessary-waiting -- Load
    cy.wait(500);

    cy.get('h1.tab:nth-of-type(4)').contains('DTD').click();
    cy.get('#appendtohtmldtd').should('be.checked');
    cy.get('#DTDtextbox').invoke('val').should(
      'contain', '<!ENTITY a "&#xabcd;">'
    );
  });
});
