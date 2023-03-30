/**
 * @param {object} options
 * @param {object} args
 * @returns {void}
 */
export function visitBrowserAction (options, args) {
  cy.visit(
    '/browser_action/index-instrumented.html' +
      (args
        ? `?${new URLSearchParams(args)}`
        : ''),
    options
  );
  // eslint-disable-next-line max-len -- Long
  // eslint-disable-next-line cypress/no-unnecessary-waiting -- Loading events async
  cy.wait(500);

  if (args?.some(([arg]) => {
    return arg === 'characterDescriptions';
  })) {
    // eslint-disable-next-line max-len -- Long
    // eslint-disable-next-line cypress/no-unnecessary-waiting -- Loading database async
    cy.wait(3000);
  }
}
