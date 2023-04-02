import {visitBrowserAction} from './utils.js';

describe('Charts', function () {
  describe('Custom protocol', function () {
    it('Visits character specified by custom protocol', function () {
      visitBrowserAction(undefined, [
        ['customProtocol', 'web+unicode:find?char=g']
      ]);
      cy.get(
        'tr:nth-of-type(1) .unicodetablecell:nth-of-type(1) ' +
        '> div.centered > button'
      ).invoke('html').should('eq', 'g');
    });

    // Problems with database
    it('Performs name search specified by custom protocol', function () {
      visitBrowserAction(undefined, [
        ['characterDescriptions', '1'],
        ['customProtocol', 'web+unicode:searchName?string=Greek']
      ]);
      cy.get(
        'tr:nth-of-type(3) .unicodetablecell:nth-of-type(1) ' +
        '> div.centered > button'
      ).invoke('html').should('eq', 'Ͳ');
    });

    it('Alerts error upon bad custom protocol type', function () {
      cy.on('window:alert', (t) => {
        expect(t).to.contains('Unrecognized query type passed');
      });
      visitBrowserAction(undefined, [
        ['customProtocol', 'web+unicode:badType']
      ]);
    });

    it('Alerts error upon undownloaded Unihan', function () {
      cy.on('window:alert', (t) => {
        expect(t).to.contains('In order to access CJK');
      });
      visitBrowserAction(undefined, [
        ['customProtocol', 'web+unicode:searchkDefinition?string=woman']
      ]);
    });
  });

  describe('Sets options', function () {
    it('Sets multiline description including on load', function () {
      visitBrowserAction();
      cy.get('#displayUnicodeDesc').invoke(
        'prop', 'nodeName'
      ).should('eq', 'INPUT');
      cy.get('#multiline').click();
      cy.get('#displayUnicodeDesc').invoke(
        'prop', 'nodeName'
      ).should('eq', 'TEXTAREA');

      visitBrowserAction();
      cy.get('#displayUnicodeDesc').invoke(
        'prop', 'nodeName'
      ).should('eq', 'TEXTAREA');
    });

    it('Sets "Show image" including on load', function () {
      visitBrowserAction();

      cy.get('#showImg').invoke('prop', 'checked').should('eq', false);

      cy.get('#showImg').click();

      visitBrowserAction();
      cy.get('#showImg').invoke('prop', 'checked').should('eq', true);

      cy.get('#startset').clear().type('é');

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).trigger('mouseover');

      cy.get('#unicodeImg img').should('be.visible');

      // Check that it will be removed
      cy.get('#showImg').click();
      cy.get('#unicodeImg img').should('not.exist');
    });
  });

  describe('Character selection', function () {
    it('shows previously selected character on load', function () {
      visitBrowserAction();

      cy.get('#startset').clear().type('é');

      visitBrowserAction();

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).contains('é');
    });
  });

  describe('Column browser', function () {
    it('should allow character selection by column browser', function () {
      visitBrowserAction();

      cy.get(
        '.miller-columns .miller-column:nth-of-type(1) li:nth-of-type(1)'
      ).click();

      cy.get(
        '.miller-columns .miller-column:nth-of-type(2) li:nth-of-type(1)'
      ).click();

      cy.get(
        '.miller-columns .miller-column:nth-of-type(4) li:nth-of-type(1)'
      ).click();

      cy.get(
        '#chart_table > tr:nth-of-type(2) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).contains('Գ');
    });
  });

  describe('Character metadata', function () {
    describe('Script on character mouseover', function () {
      [
        [0x0100, 'Latin Extended-A'],
        [0x0180, 'Latin Extended-B'],
        [0x0250, 'IPA Extensions'],
        [0x02B0, 'Spacing Modifier Letters'],
        [0x0300, 'Combining Diacritical Marks'],
        [0x0370, 'Greek'],
        [0x0400, 'Cyrillic'],
        [0x0500, 'Cyrillic Supplement'],
        [0x0530, 'Armenian'],
        [0x0590, 'Hebrew'],
        [0x0600, 'Arabic'],
        [0x0700, 'Syriac'],
        [0x0750, 'Arabic Supplement'],
        [0x0780, 'Thaana'],
        [0x07C0, 'N\'Ko'],
        [0x0800, 'Samaritan'],
        [0x0840, 'Mandaic'],
        [0x0900, 'Devanagari'],
        [0x0980, 'Bengali'],
        [0x0A00, 'Gurmukhi'],
        [0x0A80, 'Gujarati'],
        [0x0B00, 'Oriya'],
        [0x0B80, 'Tamil'],
        [0x0C00, 'Telugu'],
        [0x0C80, 'Kannada'],
        [0x0D00, 'Malayalam'],
        [0x0D80, 'Sinhala'],
        [0x0E00, 'Thai'],
        [0x0E80, 'Lao'],
        [0x0F00, 'Tibetan'],
        [0x1000, 'Myanmar'],
        [0x10A0, 'Georgian'],
        [0x1100, 'Hangul Jamo'],
        [0x1200, 'Ethiopic'],
        [0x1380, 'Ethiopic Supplement'],
        [0x13A0, 'Cherokee'],
        [0x1400, 'Unified Canadian Aboriginal Syllabics'],
        [0x1680, 'Ogham'],
        [0x16A0, 'Runic'],
        [0x1700, 'Tagalog'],
        [0x1720, 'Hanunoo'],
        [0x1740, 'Buhid'],
        [0x1760, 'Tagbanwa'],
        [0x1780, 'Khmer'],
        [0x1800, 'Mongolian'],
        [0x18B0, 'UCAS Extended'],
        [0x1900, 'Limbu'],
        [0x1950, 'Tai Le'],
        [0x1980, 'New Tai Lue'],
        [0x19E0, 'Khmer Symbols'],
        [0x1A00, 'Buginese'],
        [0x1A20, 'Tai Tham'],
        [0x1B00, 'Balinese'],
        [0x1B80, 'Sundanese'],
        [0x1BC0, 'Batak'],
        [0x1C00, 'Lepcha'],
        [0x1C50, 'Ol Chiki'],
        [0x1CD0, 'Vedic Extensions'],
        [0x1D00, 'Phonetic Extensions'],
        [0x1D80, 'Phonetic Extensions Supplement'],
        [0x1DC0, 'Combining Diacritical Marks Supplement'],
        [0x1E00, 'Latin Extended Additional'],
        [0x1F00, 'Greek Extended'],
        [0x2000, 'General Punctuation'],
        [0x2070, 'Super and Subscripts'],
        [0x20A0, 'Currency Symbols'],
        [0x20D0, 'Combining Diacritical Marks for Symbols'],
        [0x2100, 'Letterlike Symbols'],
        [0x2150, 'Number Forms'],
        [0x2190, 'Arrows'],
        [0x2200, 'Mathematical Operators'],
        [0x2300, 'Miscellaneous Technical'],
        [0x2400, 'Control Pictures'],
        [0x2440, 'Optical Character Recognition (OCR)'],
        [0x2460, 'Enclosed Alphanumerics'],
        [0x2500, 'Box Drawing'],
        [0x2580, 'Block Elements'],
        [0x25A0, 'Geometric Shapes'],
        [0x2600, 'Miscellaneous Symbols'],
        [0x2700, 'Dingbats'],
        [0x27C0, 'Miscellaneous Math Symbols A'],
        [0x27F0, 'Supplemental Arrows-A'],
        [0x2800, 'Braille Patterns'],
        [0x2900, 'Supplemental Arrows-B'],
        [0x2980, 'Miscellaneous Math Symbols B'],
        [0x2A00, 'Supplemental Math Operators'],
        [0x2B00, 'Miscellaneous Symbols and Arrows'],
        [0x2C00, 'Glagolitic'],
        [0x2C60, 'Latin Extended-C'],
        [0x2C80, 'Coptic'],
        [0x2D00, 'Georgian Supplement'],
        [0x2D30, 'Tifinagh'],
        [0x2D80, 'Ethiopic Extended'],
        [0x2DE0, 'Cyrillic Extended-A'],
        [0x2E00, 'Supplemental Punctuation'],
        [0x2E80, 'CJK Radicals Supplement'],
        [0x2F00, 'CJK Radicals / Kangxi Radicals'],
        [0x2FF0, 'Ideographic Description Characters'],
        [0x3000, 'CJK Symbols and Punctuation'],
        [0x3040, 'Hiragana'],
        [0x30A0, 'Katakana'],
        [0x3100, 'Bopomofo'],
        [0x3130, 'Hangul Compatibility Jamo'],
        [0x3190, 'Kanbun'],
        [0x31A0, 'Bopomofo Extended'],
        [0x31C0, 'CJK Strokes'],
        [0x31F0, 'Katakana Phonetic Extensions'],
        [0x3200, 'Enclosed CJK Letters and Months'],
        [0x3300, 'CJK Compatibility'],
        [0x3400, 'CJK Ideographs Ext. A'],
        [0x4DC0, 'Yijing Hexagram Symbols'],
        [0x4E00, 'CJK Unified Ideographs (Han)'],
        [0xA000, 'Yi Syllables'],
        [0xA490, 'Yi Radicals'],
        [0xA4D0, 'Lisu'],
        [0xA500, 'Vai'],
        [0xA640, 'Cyrillic Extended-B'],
        [0xA6A0, 'Bamum'],
        [0xA700, 'Modifier Tone Letters'],
        [0xA720, 'Latin Extended-D'],
        [0xA800, 'Syloti Nagri'],
        [0xA830, 'Common Indic Number Forms'],
        [0xA840, 'Phags-Pa'],
        [0xA880, 'Saurashtra'],
        [0xA8E0, 'Devanagari Extended'],
        [0xA900, 'Kayah Li'],
        [0xA930, 'Rejang'],
        [0xA960, 'Hangul Jamo Extended-A'],
        [0xA980, 'Javanese'],
        [0xAA00, 'Cham'],
        [0xAA60, 'Myanmar Extended-A'],
        [0xAA80, 'Tai Viet'],
        [0xAB00, 'Ethiopic Extended-A'],
        [0xABC0, 'Meetei Mayek'],
        [0xAC00, 'Hangul Syllables'],
        [0xD7B0, 'Hangul Jamo Extended-B'],
        [0xD800, 'High Surrogates'],
        [0xDB80, 'High Private Use Surrogates'],
        [0xDC00, 'Low Surrogates'],
        [0xE000, 'Private Use Area'],
        [0xF900, 'CJK Compatibility Ideographs'],
        [0xFB00, 'Alphabetic Presentation Forms'],
        [0xFB50, 'Arabic Presentation Forms-A'],
        [0xFE00, 'Variation Selectors'],
        [0xFE10, 'Vertical Forms'],
        [0xFE20, 'Combining Half Marks'],
        [0xFE30, 'CJK Compatibility Forms'],
        [0xFE50, 'Small Form Variants'],
        [0xFE70, 'Arabic Presentation Forms-B'],
        [0xFF00, 'Halfwidth and Fullwidth Forms'],
        [0xFFF0, 'Specials'],
        [0x10000, 'Linear B Syllabary'],
        [0x10080, 'Linear B Ideograms'],
        [0x10100, 'Aegean Numbers'],
        [0x10140, 'Ancient Greek Numbers'],
        [0x10190, 'Ancient Symbols'],
        [0x101D0, 'Phaistos Disc'],
        [0x10280, 'Lycian'],
        [0x102A0, 'Carian'],
        [0x10300, 'Old Italic'],
        [0x10330, 'Gothic'],
        [0x10380, 'Ugaritic'],
        [0x103A0, 'Old Persian'],
        [0x10400, 'Deseret'],
        [0x10450, 'Shavian'],
        [0x10480, 'Osmanya'],
        [0x10800, 'Cypriot Syllabary'],
        [0x10840, 'Aramaic, Imperial'],
        [0x10900, 'Phoenician'],
        [0x10920, 'Lydian'],
        [0x10A00, 'Kharoshthi'],
        [0x10A60, 'Old South Arabian'],
        [0x10B00, 'Avestan'],
        [0x10B40, 'Parthian, Inscriptional'],
        [0x10B60, 'Pahlavi, Inscriptional'],
        [0x10C00, 'Old Turkic'],
        [0x10E60, 'Rumi Numeral Symbols'],
        [0x11000, 'Brahmi'],
        [0x11080, 'Kaithi'],
        [0x12000, 'Cuneiform'],
        [0x12400, 'Cuneiform Numbers and Punctuation'],
        [0x12480, 'Early Dynastic Cuneiform'],
        [0x12550, 'Cypro-Minoan'],
        [0x13000, 'Egyptian Hieroglyphs'],
        [0x16800, 'Bamum Supplement'],
        [0x1B000, 'Kana Supplement'],
        [0x1D000, 'Byzantine Musical Symbols'],
        [0x1D100, 'Musical Symbols'],
        [0x1D200, 'Ancient Greek Musical Notation'],
        [0x1D300, 'Tai Xuan Jing Symbols'],
        [0x1D360, 'Counting Rod Numerals'],
        [0x1D400, 'Mathematical Alphanumeric Symbols'],
        [0x1F000, 'Mahjong Tiles'],
        [0x1F030, 'Domino Tiles'],
        [0x1F0A0, 'Playing Cards'],
        [0x1F100, 'Enclosed Alphanumeric Supplement'],
        [0x1F200, 'Enclosed Ideographic Supplement'],
        [0x1F300, 'Miscellaneous Symbols And Pictographs'],
        [0x1F600, 'Emoticons'],
        [0x1F680, 'Transport and Map Symbols'],
        [0x1F700, 'Alchemical Symbols'],
        [0x1FF80, 'At End of Plane 1'],
        [0x20000, 'CJK Ideographs Ext. B'],
        [0x2A700, 'CJK Ideographs Ext. C'],
        [0x2B740, 'CJK Ideographs Ext. D'],
        [0x2F800, 'CJK Compatibility Ideographs Supplement'],
        [0x2FA1F, 'Plane 2'],
        [0x2FF80, 'At End of Plane 2'],
        [0x30000, 'Plane 3'],
        [0x3FF80, 'At End of Plane 3'],
        [0x40000, 'Plane 4'],
        [0x4FF80, 'At End of Plane 4'],
        [0x50000, 'Plane 5'],
        [0x5FF80, 'At End of Plane 5'],
        [0x60000, 'Plane 6'],
        [0x6FF80, 'At End of Plane 6'],
        [0x70000, 'Plane 7'],
        [0x7FF80, 'At End of Plane 7'],
        [0x80000, 'Plane 8'],
        [0x8FF80, 'At End of Plane 8'],
        [0x90000, 'Plane 9'],
        [0x9FF80, 'At End of Plane 9'],
        [0xA0000, 'Plane 10'],
        [0xAFF80, 'At End of Plane 10'],
        [0xB0000, 'Plane 11'],
        [0xBFF80, 'At End of Plane 11'],
        [0xC0000, 'Plane 12'],
        [0xCFF80, 'At End of Plane 12'],
        [0xD0000, 'Plane 13'],
        [0xDFF80, 'At End of Plane 13'],
        [0xE0000, 'Tags'],
        [0xE0100, 'Variation Selectors Supplement'],
        [0xEFF80, 'At End of Plane 14'],
        [0xF0000, 'Plane 15/Supplementary Private Use Area-A'],
        [0xFFF80, 'At End of Plane 15/Supplementary Private Use Area-A'],
        [0x100000, 'Plane 16/Supplementary Private Use Area-B'],
        // Also test last character
        [0x10FF80, 'Plane 16/Supplementary Private Use Area-B'],
        [0x10FFFF, 'At End of Plane 16/Supplementary Private Use Area-B']
      ].forEach(([chr, script]) => {
        it(chr + ' ' + script, function () {
          visitBrowserAction();

          cy.get('#startset').clear().type(String.fromCodePoint(chr));
          cy.get(
            '#chart_table > tr:nth-of-type(1) > ' +
            'td:nth-of-type(1) > .centered > button'
          ).trigger('mouseover');
          cy.get('#pdflink > a').contains(script);
        });
      });

      // Is the block in unihan.js that this covers necessary, given that
      //  the results appear to be the same?
      [
        // Within range checks
        [0x3401, 'CJK Ideographs Ext. A'],
        [0x4DB5, 'CJK Ideographs Ext. A'],
        [0x4E01, 'CJK Unified Ideographs (Han)'],
        [0x9FC3, 'CJK Unified Ideographs (Han)'],
        [0x20001, 'CJK Ideographs Ext. B'],
        [0x2A6D6, 'CJK Ideographs Ext. B']
      ].forEach(([chr, script]) => {
        it(chr + ' ' + script, function () {
          visitBrowserAction();

          cy.get('#startset').clear().type(String.fromCodePoint(chr));
          cy.get(
            '#chart_table > tr:nth-of-type(1) > ' +
            'td:nth-of-type(1) > .centered > button'
          ).trigger('mouseover');
          cy.get('#pdflink > a').contains(script);
        });
      });
    });

    it('holds character display with alt-click', function () {
      visitBrowserAction(undefined, [
        ['characterDescriptions', '1']
      ]);

      cy.get('#startset').clear().type('a').blur();

      // Shows "e" on mouseover
      cy.get(
        '#chart_table > tr:nth-of-type(2) > ' +
        'td:nth-of-type(2) > .centered > button'
      ).trigger('mouseover');

      // Select "e"
      cy.get(
        '#chart_table > tr:nth-of-type(2) > ' +
        'td:nth-of-type(2) > .centered > button'
      ).trigger('click', {
        altKey: true
      });

      // Shows "e"
      cy.get('#displayUnicodeDesc').invoke('val').should(
        'eq',
        'U+0065: LATIN SMALL LETTER E'
      );

      // Trigger mouseover on "a"
      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).trigger('mouseover');

      // Still shows "e"
      cy.get('#displayUnicodeDesc').invoke('val').should(
        'eq',
        'U+0065: LATIN SMALL LETTER E'
      );
    });

    it('shows plane number on character mouseover', function () {
      visitBrowserAction();

      cy.get('#startset').clear().type('a');
      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).trigger('mouseover');
      cy.get('#plane').contains('Plane 0:');

      cy.get('#startset').clear().type('𓀀');
      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).trigger('mouseover');
      cy.get('#plane').contains('Plane 1:');
    });
    // Todo: Needs to test functionality too
    it('Sets "Show all items" including on load', function () {
      visitBrowserAction();
      cy.get('#viewTabs > .tabs > .tab:nth-of-type(2)').click();

      cy.get('#showAllDetailedView').invoke(
        'prop', 'checked'
      ).should('eq', true);

      cy.get('#showAllDetailedView').click();

      visitBrowserAction();
      cy.get('#viewTabs > .tabs > .tab:nth-of-type(2)').click();

      cy.get('#showAllDetailedView').invoke(
        'prop', 'checked'
      ).should('eq', false);
    });

    // Todo: Needs to test functionality too
    it('Sets "Show all items" (CJK) including on load', function () {
      visitBrowserAction();
      cy.get('#viewTabs > .tabs > .tab:nth-of-type(3)').click();

      cy.get('#showAllDetailedCJKView').invoke(
        'prop', 'checked'
      ).should('eq', true);

      cy.get('#showAllDetailedCJKView').click();

      visitBrowserAction();
      cy.get('#viewTabs > .tabs > .tab:nth-of-type(3)').click();

      cy.get('#showAllDetailedCJKView').invoke(
        'prop', 'checked'
      ).should('eq', false);
    });

    it('returns to relevant metadata tab for non-CJK/non-Hangul', function () {
      visitBrowserAction();
      cy.get('h1[data-label="Detailed view (CJK)"]').click();
      cy.get('#startset').clear().type('b');
      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).trigger('mouseover');
      cy.get('h1[data-selected][data-label="Detailed view"]').should('exist');
    });
  });

  describe('Typed text manipulation', function () {
    it('inputs character on click', function () {
      visitBrowserAction();

      cy.get('#startset').clear().type('é');

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).click();

      cy.get('#insertText').invoke('val').should('eq', 'é');
    });

    it('clears characters', function () {
      visitBrowserAction();

      cy.get('#startset').clear().type('é');

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).click();

      cy.get('#insertText').invoke('val').should('eq', 'é');

      cy.get('#clearoutput').click();

      cy.get('#insertText').invoke('val').should('eq', '');
    });

    it('copies characters to clipboard', function () {
      visitBrowserAction();

      cy.get('#startset').clear().type('é');

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).click();

      cy.get('#insertText').invoke('val').should('eq', 'é');

      cy.get('#outputButtons > button').contains(
        'Copy to clipboard'
      ).click();

      // eslint-disable-next-line promise/prefer-await-to-then -- Cypress
      return cy.window().then(async (win) => {
        const text = await win.navigator.clipboard.readText();
        expect(text).to.eq('é');
        return true;
      });
    });

    it('moves characters to conversion tab', function () {
      visitBrowserAction();

      cy.get('#startset').clear().type('é');

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).click();

      cy.get('#insertText').invoke('val').should('eq', 'é');

      cy.get('.outputcopybutton').click();

      cy.get('#toconvert').invoke('val').should('eq', 'é');
    });

    it('can click to input an entity', function () {
      visitBrowserAction();

      cy.get('#startset').clear().type('é');

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > a'
      ).click();

      cy.get('#insertText').invoke('val').should('eq', '&eacute;');
    });

    it('altKey will prevent inputting an entity', function () {
      visitBrowserAction();

      cy.get('#startset').clear().type('é');

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > a'
      ).click({
        altKey: true
      });

      cy.get('#insertText').invoke('val').should('eq', '');
    });
  });

  describe('Chart table display', function () {
    it(
      'shows display when characters less than specified columns',
      function () {
        visitBrowserAction(undefined, [
          ['characterDescriptions', '1']
        ]);

        // Had to retype part of this to get it to register properly
        cy.get('#searchName').clear().type(
          'latin small letter a with ca'
        ).blur();

        // eslint-disable-next-line cypress/no-unnecessary-waiting -- Cypress
        cy.wait(4000);

        cy.get('#searchName').type('{backspace}').blur();

        cy.get(
          '#chart_table > tr:nth-of-type(1) > ' +
          'td:nth-of-type(1) > .centered > button'
        ).contains('â');

        cy.get(
          '#chart_table > tr:nth-of-type(3) > ' +
          'td:nth-of-type(1) > .centered > button'
        ).should('exist');

        cy.get(
          '#chart_table > tr:nth-of-type(3) > ' +
          'td:nth-of-type(3) > .centered > button'
        ).should('not.exist');

        cy.get(
          '#chart_table > tr:nth-of-type(4) > ' +
          'td:nth-of-type(1) > .centered > button'
        ).should('not.exist');
      }
    );

    it(
      'shows allow cycling back to original character',
      function () {
        visitBrowserAction(undefined, [
          ['characterDescriptions', '1']
        ]);

        // Had to retype part of this to get it to register properly
        cy.get('#searchName').clear().type(
          'latin small letter a with c'
        ).blur();

        // eslint-disable-next-line cypress/no-unnecessary-waiting -- Cypress
        cy.wait(4000);

        cy.get('#searchName').type('{backspace}').blur();

        cy.get(
          '#chart_table > tr:nth-of-type(1) > ' +
          'td:nth-of-type(1) > .centered > button'
        ).contains('à');

        cy.get(
          '#chart_table > tr > ' +
          'td.centered > a:nth-of-type(2)'
        ).click();

        cy.get(
          '#chart_table > tr > ' +
          'td.centered > a:nth-of-type(2)'
        ).click();

        cy.get(
          '#chart_table > tr > ' +
          'td.centered > a:nth-of-type(2)'
        ).click();

        cy.get(
          '#chart_table > tr:nth-of-type(4) > ' +
          'td:nth-of-type(1) > .centered > button'
        ).contains('à');
      }
    );
  });

  describe('Chart navigation', function () {
    it('chooses the next set', function () {
      visitBrowserAction();

      cy.get('#startset').clear().type('a');

      cy.get('#chart_table > tr:last-child a:nth-of-type(2)').contains(
        'Next set'
      ).trigger('click');

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).contains('m');
    });

    it('chooses the prev set', function () {
      visitBrowserAction();

      cy.get('#startset').clear().type('m');

      cy.get('#chart_table > tr:last-child a:nth-of-type(1)').contains(
        'Prev set'
      ).trigger('click');

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).contains('a');
    });
  });

  describe('Chart display options', function () {
    it('shows only entities (including upon reload)', function () {
      visitBrowserAction();
      cy.get('#onlyentsyes').invoke('prop', 'checked').should('eq', false);

      cy.get('#onlyentsyes').click();

      visitBrowserAction();
      cy.get('#onlyentsyes').invoke('prop', 'checked').should('eq', true);
      cy.get(
        // Skip first (nbsp) as can't access as such
        '#chart_table > tr:nth-of-type(2) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).contains('£');
    });

    it('changes the number of rows', function () {
      visitBrowserAction();

      cy.get(
        '#chart_table > tr:nth-of-type(6) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).should('not.exist');

      cy.get('#rowsset').clear().type(6).blur();

      cy.get(
        '#chart_table > tr:nth-of-type(6) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).should('exist');

      visitBrowserAction();
      cy.get('#rowsset').invoke('val').should('eq', '6');
    });

    it('changes the number of columns', function () {
      visitBrowserAction();

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(6) > .centered > button'
      ).should('not.exist');

      cy.get('#colsset').clear().type(6).blur();

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(6) > .centered > button'
      ).should('exist');

      visitBrowserAction();
      cy.get('#colsset').invoke('val').should('eq', '6');
    });

    it('Allows disabling display of entities', function () {
      visitBrowserAction();

      cy.get('#startset').clear().type('é');

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > a'
      ).should('exist');

      cy.get('#entyes').click();

      visitBrowserAction();

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > a'
      ).should('not.exist');
    });

    it('Allows disabling display of decimal char. refs', function () {
      visitBrowserAction();

      cy.get('#startset').clear().type('é');

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > button[name="dec"]'
      ).should('exist');

      cy.get('#decyes').click();

      visitBrowserAction();

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > button[name="dec"]'
      ).should('not.exist');
    });

    it('Allows disabling display of hex char. refs', function () {
      visitBrowserAction();

      cy.get('#startset').clear().type('é');

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > button[name="hex"]'
      ).should('exist');

      cy.get('#hexyes').click();

      visitBrowserAction();

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > button[name="hex"]'
      ).should('not.exist');
    });

    it('Allows disabling display of Unicode', function () {
      visitBrowserAction();

      cy.get('#startset').clear().type('é');

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) button[name="unicode"]'
      ).should('exist');

      cy.get('#unicodeyes').click();

      visitBrowserAction();

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) button[name="unicode"]'
      ).should('not.exist');
    });

    it('allows viewing character in middle of chart', function () {
      visitBrowserAction();

      cy.get('#startset').clear().type('a');
      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) button[name="unicode"]'
      ).contains('a');

      cy.get('#startCharInMiddleOfChart').click();

      visitBrowserAction();

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) button[name="unicode"]'
      ).contains('[');
      cy.get(
        '#chart_table > tr:nth-of-type(3) > ' +
        'td:nth-of-type(1) button[name="unicode"]'
      ).contains('a');
    });

    it('allows disabling of button styling', function () {
      visitBrowserAction();

      cy.get('#startset').clear().type('a');
      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) button[name="unicode"]'
      ).contains('a');

      cy.get('#buttonyes').click();

      visitBrowserAction();

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) button[name="unicode"]'
      ).should('not.exist');

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) div[name="unicode"]'
      ).should('exist');
    });

    it('should allow increase or decrease of font size', function () {
      visitBrowserAction();

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).invoke('css', 'font-size').should('eq', '13px');

      cy.get('.chartLayout button.fontsize:nth-of-type(1)').click();

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).invoke('css', 'font-size').should('eq', '14px');

      visitBrowserAction();

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).invoke('css', 'font-size').should('eq', '14px');

      cy.get('.chartLayout button.fontsize:nth-of-type(2)').click();

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).invoke('css', 'font-size').should('eq', '13px');
    });

    it('should allow changing of font family', function () {
      visitBrowserAction();

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).invoke('css', 'font-family').should('eq', 'Arial');

      cy.get('#font').clear().type('cursive').blur();

      cy.get(
        '#chart_table > tr:nth-of-type(1) > ' +
        'td:nth-of-type(1) > .centered > button'
      ).invoke('css', 'font-family').should('eq', 'cursive');
    });

    it('should allow changing of lang attribute', function () {
      visitBrowserAction();

      cy.get('#chart_table').invoke('prop', 'lang').should('eq', 'en');

      cy.get('#lang').clear().type('zh').blur();

      visitBrowserAction();

      cy.get('#chart_table').invoke('prop', 'lang').should('eq', 'zh');
    });
  });
});
