import {visitBrowserAction} from './utils.js';

describe('Conversion', function () {
  beforeEach(async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      registration.unregister();
    }
  });

  describe('Basic conversions', function () {
    it('Converts character refs to Unicode', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.clearAndType('#toconvert', '&#xabcd; &#1234;');
      cy.get('#b1').click();
      cy.get('#converted').invoke('val').should('eq', 'ꯍ Ӓ');
    });

    it('Converts character refs to entities', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.clearAndType('#toconvert', '&#xE9; &#233;');
      cy.get('#b2').click();
      cy.get('#converted').invoke('val').should('eq', '&eacute; &eacute;');
    });

    it('Avoids converting unused character refs to entities', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.clearAndType('#toconvert', '&#xABCD; &#12345;');
      cy.get('#b2').click();
      cy.get('#converted').invoke('val').should('eq', '&#xABCD; &#12345;');
    });

    it('Converts Unicode to decimal character references', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.clearAndType('#toconvert', 'é');
      cy.get('#b3').click();
      cy.get('#converted').invoke('val').should('eq', '&#233;');
    });

    it('Converts Unicode to hexadecimal character references', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.clearAndType('#toconvert', 'é 😀');
      cy.get('#b4').click();
      cy.get('#converted').invoke('val').should('eq', '&#xe9; &#x1f600;');
    });

    it('Converts astral Unicode to decimal character references', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.clearAndType('#toconvert', '🔂');
      cy.get('#b3').click();
      cy.get('#converted').invoke('val').should('eq', '&#128258;');
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
        cy.clearAndType('#toconvert', '😀');
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
        cy.clearAndType('#toconvert', '😀');
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
      cy.clearAndType('#toconvert', 'é 😀');
      cy.get('#b5').click();
      cy.get('#converted').invoke('val').should('eq', '&eacute; 😀');
    });

    it('Converts Unicode to JavaScript escape sequences', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.clearAndType('#toconvert', 'é 😀');
      cy.get('#b6').click();
      cy.get('#converted').invoke('val').should(
        'eq', String.raw`\u00e9 \ud83d\ude00`
      );
    });

    it('Converts Unicode to 6-digit sequences (PHP)', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.clearAndType('#toconvert', 'é 😀');
      cy.get('#b7').click();
      cy.get('#converted').invoke('val').should(
        'eq', String.raw`\u0000e9 \u01f600`
      );
    });

    it('Converts Unicode to CSS escapes', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.clearAndType('#toconvert', 'é 😀');
      cy.get('#b8').click();
      cy.get('#converted').invoke('val').should(
        'eq', String.raw`\0000e9 \01f600`
      );
    });

    it('Converts HTML entities to decimal char. references', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.clearAndType('#toconvert', '&eacute;');
      cy.get('#b9').click();
      cy.get('#converted').invoke('val').should('eq', '&#233;');
    });

    it('Converts custom entity to decimal char. references', function () {
      visitBrowserAction();

      cy.get('h1.tab:nth-of-type(4)').contains('DTD').click();
      cy.clearAndType('#DTDtextbox', '<!ENTITY a "aaa">');

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.clearAndType('#toconvert', '&a; &b;');
      cy.get('#b9').click();
      cy.get('#converted').invoke('val').should('eq', 'aaa &b;');
    });

    it('Converts custom entity to hexadecimal char. references', function () {
      visitBrowserAction();

      cy.get('h1.tab:nth-of-type(4)').contains('DTD').click();
      cy.clearAndType('#DTDtextbox', '<!ENTITY a "aaa">');

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.clearAndType('#toconvert', '&a; &b;');
      cy.get('#b10').click();
      cy.get('#converted').invoke('val').should('eq', 'aaa &b;');
    });

    it(
      'Converts custom entity to hexadecimal upper-case char. references',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
        ).contains('Prefs').click();
        cy.get('#hexLettersUpper').check();

        cy.get('h1.tab:nth-of-type(4)').contains('DTD').click();
        cy.clearAndType('#DTDtextbox', '<!ENTITY e "é">');

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', '&e;');
        cy.get('#b10').click();
        cy.get('#converted').invoke('val').should('eq', '&#xE9;');
      }
    );

    it(
      'Converts HTML entities to hexadecimal char. references',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', '&eacute;');
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
      cy.clearAndType('#toconvert', '&eacute;');
      cy.get('#b11').click();
      cy.get('#converted').invoke('val').should('eq', 'é');
    });

    it('Converts custom entities to Unicode', function () {
      visitBrowserAction();

      cy.get('h1.tab:nth-of-type(4)').contains('DTD').click();
      cy.clearAndType('#DTDtextbox', '<!ENTITY e "é">');

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.clearAndType('#toconvert', '&e; &a;');
      cy.get('#b11').click();
      cy.get('#converted').invoke('val').should('eq', 'é &a;');
    });

    it('Converts custom multiple-length entities to Unicode', function () {
      visitBrowserAction();

      cy.get('h1.tab:nth-of-type(4)').contains('DTD').click();
      cy.clearAndType('#DTDtextbox', '<!ENTITY a "aaa">');

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.clearAndType('#toconvert', '&a;');
      cy.get('#b11').click();
      cy.get('#converted').invoke('val').should('eq', 'aaa');
    });

    it(
      'Converts Hexadecimal to decimal character references',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', '&#xe9;');
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
        cy.clearAndType('#toconvert', '&#233;');
        cy.get('#b13').click();
        cy.get('#converted').invoke('val').should('eq', '&#xe9;');
      }
    );

    it(
      'Converts Decimal to upper-case hexadecimal character references',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
        ).contains('Prefs').click();
        cy.get('#hexLettersUpper').check();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', '&#233;');
        cy.get('#b13').click();
        cy.get('#converted').invoke('val').should('eq', '&#xE9;');
      }
    );

    it(
      'Performs a conversion of CSS backslash escapes to Unicode',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', '\\\n \\\f');
        cy.get('#b16').click();
        cy.get('#converted').invoke('val').should('eq', '\\\n \\\f');
      }
    );

    it(
      'Performs a conversion of CSS < 6 digit escapes to Unicode',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', String.raw`\e9 a`);
        cy.get('#b16').click();
        cy.get('#converted').invoke('val').should('eq', 'éa');
      }
    );

    it(
      'Maintains low-ASCII CSS escapes to Unicode',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', String.raw`\a0 \1`);
        cy.get('#b16').click();
        cy.get('#converted').invoke('val').should('eq', String.raw`\a0 \1`);
      }
    );

    it(
      'Maintains non-identifier CSS escapes to Unicode',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', String.raw`\-123`);
        cy.get('#b16').click();
        cy.get('#converted').invoke('val').should('eq', String.raw`\-123`);
      }
    );

    it(
      'Maintains non-hex CSS escapes to Unicode',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', '\\\n');
        cy.get('#b16').click();
        cy.get('#converted').invoke('val').should('eq', '\\\n');
      }
    );

    it('Replaces bad escapes with non-character', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.clearAndType(
        '#toconvert',
        String.raw`\11FFFF \0`
      );
      cy.get('#b16').click();
      cy.get('#converted').invoke('val').should(
        'eq',
        '\uFFFD \uFFFD'
      );
    });

    it(
      'Converts JavaScript escape sequences to Unicode',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', String.raw`\uabcd`);
        cy.get('#b14').click();
        cy.get('#converted').invoke('val').should('eq', 'ꯍ');
      }
    );

    it(
      'Converts JavaScript escapes to Unicode',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', String.raw`\\ a \g \n \t \f \v \b`);
        cy.get('#b14').click();
        cy.get('#converted').invoke('val').should(
          'eq', '\\ a \\g \n \t \f \v \b'
        );

        cy.clearAndType('#toconvert', String.raw`\r`);
        cy.get('#b14').click();
        // \r gets converted
        cy.get('#converted').invoke('val').should('eq', '\n');
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
        cy.clearAndType('#toconvert', String.raw`\uabcd \u00abcd`);
        cy.get('#b15').click();
        cy.get('#converted').invoke('val').should('eq', 'ꯍ ꯍ');
      }
    );

    it(
      'Converts PHP escapes to Unicode',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', String.raw`\\ \a`);
        cy.get('#b15').click();
        cy.get('#converted').invoke('val').should('eq', String.raw`\ \a`);
      }
    );

    it(
      'Converts CSS escape sequences to Unicode',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', String.raw`\00abcd`);
        cy.get('#b16').click();
        cy.get('#converted').invoke('val').should('eq', 'ꯍ');
      }
    );

    describe('Character descriptions', function () {
      it(
        'Converts Unicode to character description escapes',
        function () {
          visitBrowserAction(undefined, [
            ['characterDescriptions', 1]
          ]);

          cy.get(
            '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
          ).contains('Conversion').click();
          cy.get('#converted').clear();
          cy.clearAndType('#toconvert', 'é');
          cy.get('#b17').click();
          cy.get('#converted').invoke('val').should(
            'eq', String.raw`\C{LATIN SMALL LETTER E WITH ACUTE}`
          );
        }
      );

      it(
        'Converts ASCII to character description escapes',
        function () {
          visitBrowserAction(undefined, [
            ['characterDescriptions', 1]
          ]);

          cy.get(
            '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
          ).contains('Prefs').click();
          cy.get('#asciiLt128').uncheck();

          cy.get(
            '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
          ).contains('Conversion').click();

          cy.get('#converted').clear();
          cy.clearAndType('#toconvert', 'a');
          cy.get('#b17').click();
          cy.get('#converted').invoke('val').should(
            'eq', 'a'
          );

          cy.get(
            '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
          ).contains('Prefs').click();
          cy.get('#asciiLt128').check();

          cy.get(
            '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
          ).contains('Conversion').click();

          cy.get('#converted').clear();
          cy.clearAndType('#toconvert', 'a');
          cy.get('#b17').click();
          cy.get('#converted').invoke('val').should(
            'eq', String.raw`\C{LATIN SMALL LETTER A}`
          );
        }
      );

      it(
        'Converts Unicode to character description escapes (Hangul)',
        function () {
          visitBrowserAction(undefined, [
            ['characterDescriptions', 1]
          ]);

          cy.get(
            '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
          ).contains('Conversion').click();
          cy.get('#converted').clear();
          cy.clearAndType('#toconvert', '가');
          cy.get('#b17').click();
          cy.get('#converted').invoke('val').should(
            'eq', String.raw`\C{GA}`
          );
        }
      );

      it(
        'Converts character description escapes to Unicode',
        function () {
          visitBrowserAction(undefined, [
            ['characterDescriptions', 1]
          ]);

          cy.get(
            '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
          ).contains('Conversion').click();
          cy.get('#converted').clear();
          // Split up typing to avoid being interpreted by Cypress
          //  as keystroke
          cy.clearAndType(
            '#toconvert',
            String.raw`\C{`
          );
          cy.get('#toconvert').type('LATIN SMALL LETTER E WITH ACUTE}');
          cy.get('#b18').click();
          cy.get('#converted').invoke('val').should('eq', 'é');
        }
      );
    });
  });

  describe('Hangul conversions', function () {
    it('supports Hangul conversion', function () {
      visitBrowserAction();
      cy.get('h1.tab:nth-of-type(2)').contains('Conversion').click();

      cy.clearAndType('#toconvert', String.raw`\C{`);
      cy.get('#toconvert').type('GAG}');

      cy.get('#b18').click();
      cy.get('#converted').invoke('val').should('eq', 'ᄀ');

      cy.clearAndType('#toconvert', String.raw`\C{`);
      cy.get('#toconvert').type('GGEOGG}');

      cy.get('#b18').click();
      cy.get('#converted').invoke('val').should('eq', '꺾');

      cy.clearAndType('#toconvert', String.raw`\C{`);
      cy.get('#toconvert').type('GGWAEGG}');

      cy.get('#b18').click();
      cy.get('#converted').invoke('val').should('eq', '꽦');
    });

    it('gives non-character with bad Hangul syllable check', function () {
      visitBrowserAction();
      cy.get('h1.tab:nth-of-type(2)').contains('Conversion').click();

      cy.clearAndType('#toconvert', String.raw`\C{`);
      cy.get('#toconvert').type('GAGGGGGG}');

      cy.get('#b18').click();
      cy.get('#converted').invoke('val').should('eq', '�');

      cy.clearAndType('#toconvert', String.raw`\C{`);
      cy.get('#toconvert').type('IIIII}');

      cy.get('#b18').click();
      cy.get('#converted').invoke('val').should('eq', '�');
    });
  });

  describe('Options', function () {
    it('Converts unambiguous CSS escapes', function () {
      visitBrowserAction();
      cy.get('h1.tab:nth-of-type(3)').contains('Prefs').click();
      cy.get('#cssUnambiguous').check();
      cy.get('h1.tab:nth-of-type(2)').contains('Conversion').click();
      cy.get('#converted').clear();
      cy.clearAndType('#toconvert', 'é');
      cy.get('#b8').click();
      cy.get('#converted').invoke('val').should('eq', String.raw`\0000e9`);
    });

    it('Converts whitespace-separated CSS escapes', function () {
      visitBrowserAction();
      cy.get('h1.tab:nth-of-type(3)').contains('Prefs').click();
      cy.get('#cssUnambiguous').uncheck();
      cy.get('#CSSWhitespace').select('t');
      cy.get('h1.tab:nth-of-type(2)').contains('Conversion').click();
      cy.get('#converted').clear();
      cy.clearAndType('#toconvert', 'é');
      cy.get('#b8').click();
      cy.get('#converted').invoke('val').should('eq', '\\e9\t');
    });

    describe('Ampersand followed by space', function () {
      it('Escapes ampersand followed by space (Unicode to dec)', function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
        ).contains('Prefs').click();
        cy.get('#ampspace').uncheck();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', '& test');
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
        cy.clearAndType('#toconvert', '& test');
        cy.get('#b3').click();
        cy.get('#converted').invoke('val').should('eq', '&amp; test');

        visitBrowserAction(undefined, [
          ['targetid', 'context-charrefunicode1'],
          ['convert', 'pb & j']
        ]);
        cy.get(
          '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
        ).should('exist');
        cy.get('#converted').invoke('val').should('eq', 'pb &amp; j');
      });

      it(
        'Escapes ampersand followed by space (Charref to Unicode)',
        function () {
          visitBrowserAction();

          cy.get(
            '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
          ).contains('Prefs').click();
          cy.get('#ampspace').uncheck();

          cy.get(
            '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
          ).contains('Conversion').click();
          cy.get('#converted').clear();
          cy.clearAndType('#toconvert', '& test');
          cy.get('#b1').click();
          cy.get('#converted').invoke('val').should('eq', '& test');

          cy.get(
            '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
          ).contains('Prefs').click();
          cy.get('#ampspace').check();

          cy.get(
            '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
          ).contains('Conversion').click();
          cy.get('#converted').clear();
          cy.clearAndType('#toconvert', '& test');
          cy.get('#b1').click();
          cy.get('#converted').invoke('val').should('eq', '&amp; test');
        }
      );

      it('Escapes ampersand followed by space (Charref to ent)', function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
        ).contains('Prefs').click();
        cy.get('#ampspace').uncheck();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', '& test');
        cy.get('#b2').click();
        cy.get('#converted').invoke('val').should('eq', '& test');

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
        ).contains('Prefs').click();
        cy.get('#ampspace').check();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', '& test');
        cy.get('#b2').click();
        cy.get('#converted').invoke('val').should('eq', '&amp; test');
      });

      it('Escapes ampersand followed by space (Unicode to hex)', function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
        ).contains('Prefs').click();
        cy.get('#ampspace').uncheck();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', '& test');
        cy.get('#b4').click();
        cy.get('#converted').invoke('val').should('eq', '& test');

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
        ).contains('Prefs').click();
        cy.get('#ampspace').check();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', '& test');
        cy.get('#b4').click();
        cy.get('#converted').invoke('val').should('eq', '&amp; test');
      });

      it('Escapes ampersand followed by space (Unicode to ent)', function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
        ).contains('Prefs').click();
        cy.get('#ampspace').uncheck();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', '& test');
        cy.get('#b5').click();
        cy.get('#converted').invoke('val').should('eq', '& test');

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
        ).contains('Prefs').click();
        cy.get('#ampspace').check();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', '& test');
        cy.get('#b5').click();
        cy.get('#converted').invoke('val').should('eq', '&amp; test');
      });

      it('Escapes ampersand followed by space (Entity to dec)', function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
        ).contains('Prefs').click();
        cy.get('#ampspace').uncheck();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', '& test');
        cy.get('#b9').click();
        cy.get('#converted').invoke('val').should('eq', '& test');

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
        ).contains('Prefs').click();
        cy.get('#ampspace').check();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', '& test');
        cy.get('#b9').click();
        cy.get('#converted').invoke('val').should('eq', '&amp; test');
      });

      it('Escapes ampersand followed by space (Entity to hex)', function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
        ).contains('Prefs').click();
        cy.get('#ampspace').uncheck();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', '& test');
        cy.get('#b10').click();
        cy.get('#converted').invoke('val').should('eq', '& test');

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
        ).contains('Prefs').click();
        cy.get('#ampspace').check();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', '& test');
        cy.get('#b10').click();
        cy.get('#converted').invoke('val').should('eq', '&amp; test');
      });

      it(
        'Escapes ampersand followed by space (Entity to Unicode)',
        function () {
          visitBrowserAction();

          cy.get(
            '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
          ).contains('Prefs').click();
          cy.get('#ampspace').uncheck();

          cy.get(
            '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
          ).contains('Conversion').click();
          cy.get('#converted').clear();
          cy.clearAndType('#toconvert', '& test');
          cy.get('#b11').click();
          cy.get('#converted').invoke('val').should('eq', '& test');

          cy.get(
            '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
          ).contains('Prefs').click();
          cy.get('#ampspace').check();

          cy.get(
            '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
          ).contains('Conversion').click();
          cy.get('#converted').clear();
          cy.clearAndType('#toconvert', '& test');
          cy.get('#b11').click();
          cy.get('#converted').invoke('val').should('eq', '&amp; test');
        }
      );

      it('Escapes ampersand followed by space (Hex to dec)', function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
        ).contains('Prefs').click();
        cy.get('#ampspace').uncheck();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', '& test');
        cy.get('#b12').click();
        cy.get('#converted').invoke('val').should('eq', '& test');

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
        ).contains('Prefs').click();
        cy.get('#ampspace').check();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', '& test');
        cy.get('#b12').click();
        cy.get('#converted').invoke('val').should('eq', '&amp; test');
      });

      it('Escapes ampersand followed by space (Dec to hex)', function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
        ).contains('Prefs').click();
        cy.get('#ampspace').uncheck();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', '& test');
        cy.get('#b13').click();
        cy.get('#converted').invoke('val').should('eq', '& test');

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
        ).contains('Prefs').click();
        cy.get('#ampspace').check();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', '& test');
        cy.get('#b13').click();
        cy.get('#converted').invoke('val').should('eq', '&amp; test');
      });
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
      cy.clearAndType('#toconvert', '& test');
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
      cy.clearAndType('#toconvert', '& test');
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
      cy.clearAndType('#toconvert', '&lt; &amp;');
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
      cy.clearAndType('#toconvert', '&lt; &amp;');
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
      cy.clearAndType('#toconvert', "'");
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
      cy.clearAndType('#toconvert', "'");
      cy.get('#b5').click();
      cy.get('#converted').invoke('val').should('eq', '&apos;');
    });

    it('Avoids converting unused character refs to entities', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
      ).contains('Prefs').click();
      cy.get('#xhtmlentmode').check();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.clearAndType('#toconvert', '&#39; &#x27;');
      cy.get('#b2').click();
      cy.get('#converted').invoke('val').should('eq', '&apos; &apos;');
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
      cy.clearAndType('#toconvert', 'abc');
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
      cy.clearAndType('#toconvert', 'abc');
      cy.get('#b3').click();
      cy.get('#converted').invoke('val').should('eq', '&#97;&#98;&#99;');
    });

    it('Converts Unicode to upper-case hex character refs', function () {
      visitBrowserAction();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
      ).contains('Prefs').click();
      cy.get('#hexLettersUpper').uncheck();

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();
      cy.get('#converted').clear();
      cy.clearAndType('#toconvert', 'ꯍ');
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
      cy.clearAndType('#toconvert', 'ꯍ');
      cy.get('#b4').click();
      cy.get('#converted').invoke('val').should('eq', '&#xABCD;');
    });

    it(
      'Converts astral Unicode to upper-case hex character reference',
      function () {
        visitBrowserAction();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(3)'
        ).contains('Prefs').click();
        cy.get('#hexLettersUpper').check();

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();
        cy.get('#converted').clear();
        cy.clearAndType('#toconvert', '🔂');
        cy.get('#b4').click();
        cy.get('#converted').invoke('val').should('eq', '&#x1F502;');
      }
    );
  });

  describe('Context menu API', function () {
    it('Opens conversion window', function () {
      visitBrowserAction(undefined, [
        ['targetid', 'context-charrefunicode1']
      ]);

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
      ).should('exist');
      cy.get('#toconvert').invoke('val').should('eq', '');
      cy.get('#converted').invoke('val').should('eq', '');
    });

    it('Performs a conversion of character refs. to Unicode', function () {
      visitBrowserAction(undefined, [
        ['targetid', 'context-charrefunicode1'],
        ['convert', 'Some text: &#1234;']
      ]);

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
      ).should('exist');
      cy.get('#toconvert').invoke('val').should('eq', 'Some text: &#1234;');
      cy.get('#converted').invoke('val').should('eq', 'Some text: Ӓ');
    });

    it('Performs a conversion of character refs to entities', function () {
      visitBrowserAction(undefined, [
        ['targetid', 'context-charrefunicode2'],
        ['convert', 'Some text: &#233;']
      ]);

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
      ).should('exist');
      cy.get('#toconvert').invoke('val').should('eq', 'Some text: &#233;');
      cy.get('#converted').invoke('val').should('eq', 'Some text: &eacute;');
    });

    it('Performs a conversion of Unicode to dec. character ref', function () {
      visitBrowserAction(undefined, [
        ['targetid', 'context-charrefunicode3'],
        ['convert', 'Some text: Ӓ']
      ]);

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
      ).should('exist');
      cy.get('#toconvert').invoke('val').should('eq', 'Some text: Ӓ');
      cy.get('#converted').invoke('val').should('eq', 'Some text: &#1234;');
    });

    it('Performs a conversion of Unicode to hex character ref', function () {
      visitBrowserAction(undefined, [
        ['targetid', 'context-charrefunicode4'],
        ['convert', 'Some text: Ӓ']
      ]);

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
      ).should('exist');
      cy.get('#toconvert').invoke('val').should('eq', 'Some text: Ӓ');
      cy.get('#converted').invoke('val').should('eq', 'Some text: &#x4d2;');
    });

    it('Performs a conversion of Unicode to entities', function () {
      visitBrowserAction(undefined, [
        ['targetid', 'context-charrefunicode5'],
        ['convert', 'Some text: é']
      ]);

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
      ).should('exist');
      cy.get('#toconvert').invoke('val').should('eq', 'Some text: é');
      cy.get('#converted').invoke('val').should('eq', 'Some text: &eacute;');
    });

    it(
      'Performs a conversion of Unicode entity values to entities',
      function () {
        visitBrowserAction();
        cy.get('h1.tab:nth-of-type(4)').contains('DTD').click();
        cy.clearAndType('#DTDtextbox', '<!ENTITY a "aaa">');

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
        ).contains('Conversion').click();

        cy.clearAndType('#toconvert', 'Some text: aaa');
        cy.get('#b5').click();
        cy.get('#converted').invoke('val').should('eq', 'Some text: &a;');
      }
    );

    it('Performs a conversion of Unicode to JS escapes', function () {
      visitBrowserAction(undefined, [
        ['targetid', 'context-charrefunicode6'],
        ['convert', 'Some text: é']
      ]);

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
      ).should('exist');
      cy.get('#toconvert').invoke('val').should('eq', 'Some text: é');
      cy.get(
        '#converted'
      ).invoke('val').should('eq', String.raw`Some text: \u00e9`);
    });

    it('Performs a conversion of Unicode to 6 digit', function () {
      visitBrowserAction(undefined, [
        ['targetid', 'context-charrefunicode7'],
        ['convert', 'Some text: é']
      ]);

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
      ).should('exist');
      cy.get('#toconvert').invoke('val').should('eq', 'Some text: é');
      cy.get(
        '#converted'
      ).invoke('val').should('eq', String.raw`Some text: \u0000e9`);
    });

    it('Performs a conversion of Unicode to CSS escape', function () {
      visitBrowserAction(undefined, [
        ['targetid', 'context-charrefunicode8'],
        ['convert', 'Some text: é']
      ]);

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
      ).should('exist');
      cy.get('#toconvert').invoke('val').should('eq', 'Some text: é');
      cy.get(
        '#converted'
      ).invoke('val').should('eq', String.raw`Some text: \0000e9`);
    });

    it('Performs a conversion of entities to dec. char. ref.', function () {
      visitBrowserAction(undefined, [
        ['targetid', 'context-charrefunicode9'],
        ['convert', 'Some text: &eacute;']
      ]);

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
      ).should('exist');
      cy.get('#toconvert').invoke('val').should('eq', 'Some text: &eacute;');
      cy.get('#converted').invoke('val').should('eq', 'Some text: &#233;');
    });

    it('Performs a conversion of entities to hex char. ref.', function () {
      visitBrowserAction(undefined, [
        ['targetid', 'context-charrefunicode10'],
        ['convert', 'Some text: &eacute;']
      ]);

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
      ).should('exist');
      cy.get('#toconvert').invoke('val').should('eq', 'Some text: &eacute;');
      cy.get('#converted').invoke('val').should('eq', 'Some text: &#xe9;');
    });

    it('Performs a conversion of entities to Unicode', function () {
      visitBrowserAction(undefined, [
        ['targetid', 'context-charrefunicode11'],
        ['convert', 'Some text: &eacute;']
      ]);

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
      ).should('exist');
      cy.get('#toconvert').invoke('val').should('eq', 'Some text: &eacute;');
      cy.get('#converted').invoke('val').should('eq', 'Some text: é');
    });

    it('Performs a conversion of hex to decimal char. refs', function () {
      visitBrowserAction(undefined, [
        ['targetid', 'context-charrefunicode12'],
        ['convert', 'Some text: &#xe9;']
      ]);

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
      ).should('exist');
      cy.get('#toconvert').invoke('val').should('eq', 'Some text: &#xe9;');
      cy.get('#converted').invoke('val').should('eq', 'Some text: &#233;');
    });

    it('Performs a conversion of dec to hex char. refs', function () {
      visitBrowserAction(undefined, [
        ['targetid', 'context-charrefunicode13'],
        ['convert', 'Some text: &#233;']
      ]);

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
      ).should('exist');
      cy.get('#toconvert').invoke('val').should('eq', 'Some text: &#233;');
      cy.get('#converted').invoke('val').should('eq', 'Some text: &#xe9;');
    });

    it('Performs a conversion of JS escapes to Unicode', function () {
      visitBrowserAction(undefined, [
        ['targetid', 'context-charrefunicode14'],
        ['convert', String.raw`Some text: \u00e9`]
      ]);

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
      ).should('exist');
      cy.get(
        '#toconvert'
      ).invoke('val').should('eq', String.raw`Some text: \u00e9`);
      cy.get('#converted').invoke('val').should('eq', 'Some text: é');
    });

    it('Performs a conversion of 6-digit escapes to Unicode', function () {
      visitBrowserAction(undefined, [
        ['targetid', 'context-charrefunicode15'],
        ['convert', String.raw`Some text: \u0000e9`]
      ]);

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
      ).should('exist');
      cy.get(
        '#toconvert'
      ).invoke('val').should('eq', String.raw`Some text: \u0000e9`);
      cy.get('#converted').invoke('val').should('eq', 'Some text: é');
    });

    it('Performs a conversion of CSS escapes to Unicode', function () {
      visitBrowserAction(undefined, [
        ['targetid', 'context-charrefunicode16'],
        ['convert', String.raw`Some text: \0000e9`]
      ]);

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
      ).should('exist');
      cy.get(
        '#toconvert'
      ).invoke('val').should('eq', String.raw`Some text: \0000e9`);
      cy.get('#converted').invoke('val').should('eq', 'Some text: é');
    });

    it('Performs a conversion of Unicode to char. desc.', function () {
      visitBrowserAction(undefined, [
        ['characterDescriptions', '1'],
        ['targetid', 'context-charrefunicode17'],
        ['convert', 'é']
      ]);

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
      ).should('exist');
      cy.get('#toconvert').invoke('val').should('eq', 'é');
      cy.get('#converted').invoke('val').should(
        'eq',
        // Split up typing to avoid being interpreted by Cypress
        //  as keystroke
        String.raw`\C{` + 'LATIN SMALL LETTER E WITH ACUTE}'
      );
    });

    it(
      'Performs a conversion of Unicode to char. desc. (with special name)',
      function () {
        visitBrowserAction(undefined, [
          ['characterDescriptions', '1'],
          ['targetid', 'context-charrefunicode17'],
          ['convert', '\u009F']
        ]);

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
        ).should('exist');
        cy.get('#toconvert').invoke('val').should('eq', '\u009F');
        cy.get('#converted').invoke('val').should(
          'eq',
          // Split up typing to avoid being interpreted by Cypress
          //  as keystroke
          String.raw`\C{` + 'APPLICATION PROGRAM COMMAND (<control>)}'
        );
      }
    );

    it('Performs a conversion of char. desc. to Unicode', function () {
      visitBrowserAction(undefined, [
        ['characterDescriptions', '1'],
        ['targetid', 'context-charrefunicode18'],
        [
          'convert',
          // Split up typing to avoid being interpreted by Cypress
          //  as keystroke
          String.raw`\C{` + 'LATIN SMALL LETTER E WITH ACUTE}'
        ]
      ]);

      cy.get(
        '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
      ).should('exist');
      cy.get('#toconvert').invoke('val').should(
        'eq',
        // Split up typing to avoid being interpreted by Cypress
        //  as keystroke
        String.raw`\C{` + 'LATIN SMALL LETTER E WITH ACUTE}'
      );
      cy.get('#converted').invoke('val').should(
        'eq',
        'é'
      );
    });

    it(
      'Performs a bad conversion of Hangul char. desc. to Unicode',
      function () {
        visitBrowserAction(undefined, [
          ['characterDescriptions', '1'],
          ['targetid', 'context-charrefunicode18'],
          [
            'convert',
            // Split up typing to avoid being interpreted by Cypress
            //  as keystroke
            String.raw`\C{` + 'G}'
          ]
        ]);

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
        ).should('exist');
        cy.get('#toconvert').invoke('val').should(
          'eq',
          // Split up typing to avoid being interpreted by Cypress
          //  as keystroke
          String.raw`\C{` + 'G}'
        );
        cy.get('#converted').invoke('val').should(
          'eq',
          '�'
        );
      }
    );

    it(
      'Performs a conversion of Unicode to dec. character ref surrogates',
      function () {
        visitBrowserAction(undefined, [
          ['targetid', 'context-charrefunicode3b'],
          ['convert', 'Some text: 😀']
        ]);

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
        ).should('exist');
        cy.get('#toconvert').invoke('val').should('eq', 'Some text: 😀');
        cy.get('#converted').invoke('val').should(
          'eq',
          'Some text: &#55357;&#56832;'
        );
      }
    );

    it(
      'Performs a conversion of Unicode to hex character ref surrogates',
      function () {
        visitBrowserAction(undefined, [
          ['targetid', 'context-charrefunicode4b'],
          ['convert', 'Some text: 😀']
        ]);

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
        ).should('exist');
        cy.get('#toconvert').invoke('val').should('eq', 'Some text: 😀');
        cy.get('#converted').invoke('val').should(
          'eq',
          'Some text: &#xd83d;&#xde00;'
        );
      }
    );

    it(
      'Alerts an error with bad targetid in conversion',
      function () {
        visitBrowserAction(undefined, [
          ['targetid', 'context-badID'],
          ['convert', 'Some text: 😀']
        ]);

        cy.on('window:alert', (t) => {
          expect(t).to.contains('Unexpected target ID type context-badID');
        });

        cy.get(
          '#unicodeTabBox > .tabs > h1.tab[data-selected]:nth-of-type(2)'
        ).should('exist');
        cy.get('#toconvert').invoke('val').should('eq', 'Some text: 😀');
        cy.get('#converted').invoke('val').should(
          'eq',
          ''
        );
      }
    );
  });

  describe('Text manipulation', function () {
    it('Increases font size', function () {
      visitBrowserAction();
      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();

      cy.get('#conversion button.fontsize:nth-of-type(1)').click();

      cy.get('#toconvert').invoke('css', 'font-size').should('eq', '14px');
      cy.get('#converted').invoke('css', 'font-size').should('eq', '14px');

      cy.get('#conversion button.fontsize:nth-of-type(1)').click();

      cy.get('#toconvert').invoke('css', 'font-size').should('eq', '15px');
      cy.get('#converted').invoke('css', 'font-size').should('eq', '15px');

      cy.get('#conversion button.fontsize:nth-of-type(2)').click();

      cy.get('#toconvert').invoke('css', 'font-size').should('eq', '14px');
      cy.get('#converted').invoke('css', 'font-size').should('eq', '14px');
    });

    it('should move converted output up', function () {
      visitBrowserAction();
      cy.get(
        '#unicodeTabBox > .tabs > h1.tab:nth-of-type(2)'
      ).contains('Conversion').click();

      cy.clearAndType('#converted', 'some text');

      cy.get('#moveconvertedup').click();

      cy.get('#toconvert').invoke('val').should('eq', 'some text');
    });
  });
});
