describe('Entities page', function () {
  it('inserts an entity file', function () {
    cy.visit('/browser_action/');
    cy.get('h1.tab:nth-of-type(4)').contains('DTD').click();
    cy.get('#insertEntityFile').select(1);
    cy.get('#DTDtextbox').invoke('val').should('contain', 'Copyright');
    cy.get('#DTDtextbox').invoke('val').should('contain', '<!ENTITY');
  });

  it('supports inserting a single empty entity', function () {
    cy.visit('/browser_action/');
    cy.get('h1.tab:nth-of-type(4)').contains('DTD').click();
    cy.get('#DTDtextbox').clear();
    cy.get('button.dtdbutton').click();
    cy.get('#DTDtextbox').invoke('val').should('contain', '<!ENTITY  "">');
  });

  it('supports a 1-length entity', function () {
    cy.visit('/browser_action/');
    cy.get('h1.tab:nth-of-type(4)').contains('DTD').click();
    cy.get('#DTDtextbox').clear().type('<!ENTITY a "b">');
    cy.get('h1.tab:nth-of-type(1)').contains('Charts').click();
    cy.get('#startset').type('b');
    cy.get('.entity > a').contains('&a;');
  });

  it('supports a decimal entity', function () {
    cy.visit('/browser_action/');
    cy.get('h1.tab:nth-of-type(4)').contains('DTD').click();
    cy.get('#DTDtextbox').clear().type('<!ENTITY a "&#1234;">');
    cy.get('h1.tab:nth-of-type(1)').contains('Charts').click();
    cy.get('#startset').type('Ӓ');
    cy.get('.entity > a').contains('&a;');
  });

  it('supports appending to existing HTML entities', function () {
    cy.visit('/browser_action/');
    cy.get('h1.tab:nth-of-type(4)').contains('DTD').click();
    cy.get('#DTDtextbox').clear().type('<!ENTITY a "&#xabcd;">');
    cy.get('h1.tab:nth-of-type(1)').contains('Charts').click();
    cy.get('#startset').type('é');
    cy.get('.entity > a').should('exist');
    cy.get('#startset').type('ꯍ');
    cy.get('.entity > a').contains('&a;');
  });

  it('supports not appending to existing HTML entities', function () {
    cy.visit('/browser_action/');
    cy.get('h1.tab:nth-of-type(4)').contains('DTD').click();
    cy.get('#appendtohtmldtd').click();
    cy.get('#DTDtextbox').clear().type('<!ENTITY a "&#xabcd;">');
    cy.get('h1.tab:nth-of-type(1)').contains('Charts').click();
    cy.get('#startset').clear().type('é');
    cy.get('.entity > a').should('not.exist');
    cy.get('#startset').clear().type('ꯍ');
    cy.get('.entity > a').contains('&a;');
  });
});
