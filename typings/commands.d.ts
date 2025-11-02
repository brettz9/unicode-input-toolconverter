declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      clearIndexedDB(): Chainable<void>;

      checkAccessibility(): Chainable<void>;

      visitURLAndCheckAccessibility(
        url: string, options?: Partial<Cypress.VisitOptions>
      ): Chainable<void>;

      clearAndType(sel: string, text: string) : Chainable<void>;

      clearTypeAndBlur(sel: string, text: string) : Chainable<void>;
    }
  }
}

export {}
