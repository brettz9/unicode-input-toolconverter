/**
 * @param options
 * @returns {void}
 */
export function visitBrowserAction (options) {
  cy.visit('/browser_action/index-instrumented.html', options);
  // eslint-disable-next-line max-len -- Long
  // eslint-disable-next-line cypress/no-unnecessary-waiting -- Loading events async
  cy.wait(500);
}
