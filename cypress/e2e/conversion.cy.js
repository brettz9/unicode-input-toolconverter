import {visitBrowserAction} from './utils.js';

describe('Conversion', function () {
  describe('Basic conversions', function () {
    it('Converts character refs to Unicode', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type('&#xabcd; &#1234;');
      cy.get('#b1').click();
      cy.get('#converted').invoke('val').should('eq', 'ꯍ Ӓ');
    });

    it('Converts character refs to entities', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type('&#xE9; &#233;');
      cy.get('#b2').click();
      cy.get('#converted').invoke('val').should('eq', '&eacute; &eacute;');
    });
  });

  describe('Options', function () {
    it('Converts unambiguous CSS escapes', function () {
      visitBrowserAction();
      cy.get('h1.tab:nth-of-type(3)').contains('Prefs').click();
      cy.get('#cssUnambiguous').check();
      cy.get('h1.tab:nth-of-type(2)').contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type('é');
      cy.get('#b8').click();
      cy.get('#converted').invoke('val').should('eq', '\\0000e9');
    });

    it('Converts whitespace-separated CSS escapes', function () {
      visitBrowserAction();
      cy.get('h1.tab:nth-of-type(3)').contains('Prefs').click();
      cy.get('#cssUnambiguous').uncheck();
      cy.get('#CSSWhitespace').select('t');
      cy.get('h1.tab:nth-of-type(2)').contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type('é');
      cy.get('#b8').click();
      cy.get('#converted').invoke('val').should('eq', '\\e9\t');
    });

    it('Escapes ampersand followed by space', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
      ).contains('Prefs').click();
      cy.get('#ampspace').uncheck();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type('& test');
      cy.get('#b3').click();
      cy.get('#converted').invoke('val').should('eq', '& test');

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
      ).contains('Prefs').click();
      cy.get('#ampspace').check();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type('& test');
      cy.get('#b3').click();
      cy.get('#converted').invoke('val').should('eq', '&amp; test');
    });

    it('Keeps ampersand when converting to entities', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
      ).contains('Prefs').click();
      cy.get('#ampkeep').uncheck();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type('& test');
      cy.get('#b5').click();
      cy.get('#converted').invoke('val').should('eq', '&amp; test');

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
      ).contains('Prefs').click();
      cy.get('#ampkeep').check();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type('& test');
      cy.get('#b5').click();
      cy.get('#converted').invoke('val').should('eq', '& test');
    });

    it('Keeps XML entities whole when converting to entities', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
      ).contains('Prefs').click();
      cy.get('#ampkeep').uncheck();
      cy.get('#xmlentkeep').uncheck();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type('&lt; &amp;');
      cy.get('#b5').click();
      cy.get('#converted').invoke('val').should('eq', '&amp;lt; &amp;amp;');

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
      ).contains('Prefs').click();
      cy.get('#ampkeep').check();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type('&lt; &amp;');
      cy.get('#b5').click();
      cy.get('#converted').invoke('val').should('eq', '&lt; &amp;');
    });

    it('Converts apostrophe to XML entity', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
      ).contains('Prefs').click();
      cy.get('#xhtmlentmode').uncheck();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type("'");
      cy.get('#b5').click();
      cy.get('#converted').invoke('val').should('eq', "'");

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
      ).contains('Prefs').click();
      cy.get('#xhtmlentmode').check();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type("'");
      cy.get('#b5').click();
      cy.get('#converted').invoke('val').should('eq', '&apos;');
    });

    it('Converts ASCII < 128 to character refs', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
      ).contains('Prefs').click();
      cy.get('#asciiLt128').uncheck();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type('abc');
      cy.get('#b3').click();
      cy.get('#converted').invoke('val').should('eq', 'abc');

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
      ).contains('Prefs').click();
      cy.get('#asciiLt128').check();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type('abc');
      cy.get('#b3').click();
      cy.get('#converted').invoke('val').should('eq', '&#97;&#98;&#99;');
    });

    it('Converts ASCII < 128 to character refs', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
      ).contains('Prefs').click();
      cy.get('#hexLettersUpper').uncheck();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type('ꯍ');
      cy.get('#b4').click();
      cy.get('#converted').invoke('val').should('eq', '&#xabcd;');

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
      ).contains('Prefs').click();
      cy.get('#hexLettersUpper').check();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type('ꯍ');
      cy.get('#b4').click();
      cy.get('#converted').invoke('val').should('eq', '&#xABCD;');
    });
  });
});
