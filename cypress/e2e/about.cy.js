import {visitBrowserAction} from './utils.js';

describe('About page', function () {
  it('Opens donation page', function () {
    visitBrowserAction({
      onBeforeLoad (win) {
        cy.stub(win, 'open').as('winOpen');
      }
    });
    cy.get('h1.tab:nth-of-type(6)').contains('About').click();
    cy.get('#donationbutton').click();
    cy.get('@winOpen').should('be.calledWith', 'https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=brettz9%40yahoo%2ecom&no_shipping=0&no_note=1&tax=0&currency_code=USD&bn=PP%2dDonationsBF&charset=UTF%2d8');
  });
});
