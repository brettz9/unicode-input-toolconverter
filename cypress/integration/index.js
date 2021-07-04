describe('Main page', function () {
  it('Main page', function () {
    cy.visit('/browser_action');
  });

  it('Hides hidden page', function () {
    cy.visit('/.git/config', {
      failOnStatusCode: false
    });
    cy.get('b').contains('Bad request');
  });
});
