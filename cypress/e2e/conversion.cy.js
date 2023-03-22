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

    it('Converts Unicode to decimal character references', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type('é');
      cy.get('#b3').click();
      cy.get('#converted').invoke('val').should('eq', '&#233;');
    });

    it('Converts Unicode to hexadecimal character references', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type('é 😀');
      cy.get('#b4').click();
      cy.get('#converted').invoke('val').should('eq', '&#xe9; &#x1f600;');
    });

    it(
      'Converts Unicode to hexadecimal character references ' +
      '(decimal surrogate pairs)',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.get('#toconvert').clear().type('😀');
        cy.get('#b3b').click();
        cy.get('#converted').invoke('val').should('eq', '&#55357;&#56832;');
      }
    );

    it(
      'Converts Unicode to hexadecimal character references ' +
      '(hexadecimal surrogate pairs)',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.get('#toconvert').clear().type('😀');
        cy.get('#b4b').click();
        cy.get('#converted').invoke('val').should('eq', '&#xd83d;&#xde00;');
      }
    );

    it('Converts Unicode to HTML entities', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type('é 😀');
      cy.get('#b5').click();
      cy.get('#converted').invoke('val').should('eq', '&eacute; 😀');
    });

    it('Converts Unicode to JavaScript escape sequences', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type('é 😀');
      cy.get('#b6').click();
      cy.get('#converted').invoke('val').should('eq', '\\u00e9 \\ud83d\\ude00');
    });

    it('Converts Unicode to 6-digit sequences (PHP)', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type('é 😀');
      cy.get('#b7').click();
      cy.get('#converted').invoke('val').should('eq', '\\u0000e9 \\u01f600');
    });

    it('Converts Unicode to CSS escapes', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type('é 😀');
      cy.get('#b8').click();
      cy.get('#converted').invoke('val').should('eq', '\\0000e9 \\01f600');
    });

    it('Converts HTML entities to decimal char. references', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type('&eacute;');
      cy.get('#b9').click();
      cy.get('#converted').invoke('val').should('eq', '&#233;');
    });

    it(
      'Converts HTML entities to hexadecimal char. references',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.get('#toconvert').clear().type('&eacute;');
        cy.get('#b10').click();
        cy.get('#converted').invoke('val').should('eq', '&#xe9;');
      }
    );

    it('Converts HTML entities to Unicode', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.get('#toconvert').clear().type('&eacute;');
      cy.get('#b11').click();
      cy.get('#converted').invoke('val').should('eq', 'é');
    });

    it(
      'Converts Hexadecimal to decimal character references',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.get('#toconvert').clear().type('&#xe9;');
        cy.get('#b12').click();
        cy.get('#converted').invoke('val').should('eq', '&#233;');
      }
    );

    it(
      'Converts Decimal to hexadecimal character references',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.get('#toconvert').clear().type('&#233;');
        cy.get('#b13').click();
        cy.get('#converted').invoke('val').should('eq', '&#xe9;');
      }
    );

    it(
      'Converts JavaScript escape sequences to Unicode',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.get('#toconvert').clear().type('\\uabcd');
        cy.get('#b14').click();
        cy.get('#converted').invoke('val').should('eq', 'ꯍ');
      }
    );

    it(
      'Converts PHP escape sequences to Unicode',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.get('#toconvert').clear().type('\\uabcd \\u00abcd');
        cy.get('#b15').click();
        cy.get('#converted').invoke('val').should('eq', 'ꯍ ꯍ');
      }
    );

    it(
      'Converts PHP escape sequences to Unicode',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.get('#toconvert').clear().type('\\00abcd');
        cy.get('#b16').click();
        cy.get('#converted').invoke('val').should('eq', 'ꯍ');
      }
    );

    it.skip(
      'Converts Unicode to character description escapes',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.get('#toconvert').clear().type('\\00abcd');
        cy.get('#b17').click();
        cy.get('#converted').invoke('val').should('eq', 'ꯍ');
      }
    );

    it.skip(
      'Converts character description escapes to Unicode',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.get('#toconvert').clear().type('\\00abcd');
        cy.get('#b18').click();
        cy.get('#converted').invoke('val').should('eq', 'ꯍ');
      }
    );
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
