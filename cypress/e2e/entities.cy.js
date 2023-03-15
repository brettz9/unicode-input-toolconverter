describe('Entities page', function () {
  beforeEach(() => {
    return cy.clearIndexedDB();
  });
  it('inserts an entity file', function () {
    cy.visit('/browser_action/');
    cy.get('h1.tab:nth-of-type(4)').contains('DTD').click();
    cy.get('#insertEntityFile').select(1);
    cy.get('#DTDtextbox').invoke('val').should('contain', 'Copyright');
    cy.get('#DTDtextbox').invoke('val').should('contain', '<!ENTITY');
  });
});
