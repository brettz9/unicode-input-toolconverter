/* eslint-disable class-methods-use-this -- Todo: fix later */
import {getUnicodeDefaults} from '../preferences/prefDefaults.js';
import {getHangulName, getHangulFromName} from './hangul.js';
import charrefunicodeDb from './charrefunicodeDb.js';
import unicodecharref from '../unicodecharref.js';
import camelCase from '../../vendor/camelcase/index.js';

/**
* @typedef {"php"|"css"|"javascript"} UnicodeEscapeMode
*/

/**
 * @namespace Converts from one string form to another
 */
const decim = /&#(\d*);/gu;
const hexadec = /&#[xX]([\da-fA-F]*);/gu;

const builtinEntities = new Set(['apos', 'quot', 'lt', 'gt', 'amp']);

// Per https://www.w3.org/TR/xml/#sec-suggested-names
// Continue also needs: "Characters for Natural Language Identifiers" in
//   https://unicode.org/reports/tr31/ ;
// Currently appears to be Tables 3, 3a, and 3b
//   (besides \u0027 and \u2019 per XML)
const xmlName = /[\p{ID_Start}_][\p{ID_Continue}\u0024\u005F\u002D\u002E\u003A\u00B7\u058A\u05F4\u0F0B\u200C\u2010\u2027\u30A0\u30FB\u05F3\u200D]*/gui;
// const htmlOrXmlEnt = /&([a-z\d]+);/gui; // Works for basic HTML entitites
const htmlOrXmlEnt = new RegExp('&(' + xmlName.source + ');', 'gui');

export const getUnicodeConverter = () => {
  const {getPref} = getUnicodeDefaults();

  /**
   *
   */
  return class UnicodeConverter {
    /**
     * @param {IntlDom} _
     */
    constructor ({_}) {
      this._ = _;
      this.newents = [];
      this.newcharrefs = [];

      this.entities = [];
      this.numericCharacterReferences = [];
    }

    /**
     * Ensure dynamic as array may change.
     * @returns {Integer}
     */
    getAposPos () {
      return this.numericCharacterReferences.indexOf(39);
    }
    /**
     * Ensure dynamic as array may change.
     * @returns {Integer}
     */
    getAmpPos () {
      return this.numericCharacterReferences.indexOf(38);
    }

    /**
     * @param {string} out
     * @returns {string}
     */
    charref2unicodeval (out) {
      out = out.replaceAll(decim, function (match, match1) {
        return String.fromCodePoint(match1);
      }).replaceAll(hexadec, function (match, match1) {
        return String.fromCodePoint(Number.parseInt(match1, 16));
      });
      return out;
    }

    /**
     * @param {string} out
     * @returns {string}
     */
    async charref2htmlentsval (out) {
      // If true, should allow conversion to &apos;
      const xhtmlentmode = await getPref('xhtmlentmode');

      out = out.replaceAll(decim, (match, match1) => {
        const matched = this.numericCharacterReferences.indexOf(
          Number.parseInt(match1)
        );
        if (
          matched !== -1 &&
          (matched !== this.getAposPos() || xhtmlentmode)
        ) {
          return '&' + this.entities[matched] + ';';
        }
        return match;
      }).replaceAll(hexadec, (match, match1) => {
        const matched = this.numericCharacterReferences.indexOf(
          Number.parseInt('0x' + match1, 16)
        );
        if (
          matched !== -1 && (
            matched !== this.getAposPos() || xhtmlentmode
          )
        ) {
          return '&' + this.entities[matched] + ';';
        }
        return match;
      });
      return out;
    }

    /**
     * @param {string} unicodeToConvert
     * @param {boolean} leaveSurrogates
     * @returns {string}
     */
    async unicode2charrefDecval (unicodeToConvert, leaveSurrogates) {
      let out = '';
      const asciiLt128 = await getPref('asciiLt128');
      for (let i = 0; i < unicodeToConvert.length; i++) {
        let temp = unicodeToConvert.charCodeAt(i);
        // Todo: Redo with `codePointAt`?
        if (!leaveSurrogates && temp >= 0xD800 && temp < 0xF900) { // surrogate
          temp = ((temp - 0xD800) * 0x400) +
            (unicodeToConvert.charCodeAt(i + 1) - 0xDC00) + 0x10000;
          // Could do test on temp.isNan()  (e.g., if trying to convert
          //  a surrogate by itself in regular (non-surrogate converting) mode)
          out += '&#' + temp + ';';
          i++; // Skip the next surrogate

        // Replace this 'if' condition and remove the 'else' if also
        //  want ascii
        } else if (temp >= 128 || asciiLt128) {
          out += '&#' + temp + ';';
        } else {
          out += unicodeToConvert.charAt(i);
        }
      }
      return out;
    }

    /**
     * @param {string} unicodeToConvert
     * @param {boolean} leaveSurrogates
     * @param {UnicodeEscapeMode} type
     * @returns {string}
     */
    async unicode2charrefHexval (unicodeToConvert, leaveSurrogates, type) {
      // alert(unicodeToConvert + '::' + leaveSurrogates + '::' + type);
      let out = '';
      let xstyle, beginEscape, endEscape, cssUnambiguous;
      // Fix: offer a U+.... option (similar to 'php' or 'javascript'
      //   depending on if length is desired as 4 or 6)
      if (type === 'javascript' || type === 'php') {
        xstyle = '';
        beginEscape = String.raw`\u`;
        endEscape = '';
      } else if (type === 'css') {
        cssUnambiguous = await getPref('cssUnambiguous');
        xstyle = '';
        beginEscape = '\\';
        endEscape = cssUnambiguous ? '' : await getPref('cssWhitespace');
      } else {
        xstyle = 'x';
        beginEscape = '&#';
        endEscape = ';';
        /*
        if (!(await getPref('hexstyleLwr'))) {
          xstyle = 'X';
        }
        */
      }

      const [hexLettersUpper, asciiLt128] = await Promise.all([
        getPref('hexLettersUpper'),
        getPref('asciiLt128')
      ]);

      for (let i = 0; i < unicodeToConvert.length; i++) {
        let hexletters;
        let temp = unicodeToConvert.charCodeAt(i);
        // Todo: Redo with `codePointAt`?
        if (!leaveSurrogates && temp >= 0xD800 && temp < 0xF900) { // surrogate
          temp = ((temp - 0xD800) * 0x400) +
            (unicodeToConvert.charCodeAt(i + 1) - 0xDC00) + 0x10000;
          hexletters = temp.toString(16);
          i++; // Skip the next surrogate
          if (hexLettersUpper) {
            hexletters = hexletters.toUpperCase();
          }
          if ((type === 'php' || cssUnambiguous) && hexletters.length < 6) {
            hexletters = hexletters.padStart(6, '0');
          }
          out += beginEscape + xstyle + hexletters + endEscape;
        // Replace this 'if' condition and remove the 'else' if also want ascii
        } else if (temp >= 128 || asciiLt128) {
          hexletters = temp.toString(16);
          if (hexLettersUpper) {
            hexletters = hexletters.toUpperCase();
          }
          if (type === 'javascript' && hexletters.length < 4) {
            hexletters = hexletters.padStart(4, '0');
          } else if (
            (type === 'php' || cssUnambiguous) &&
            hexletters.length < 6
          ) {
            hexletters = hexletters.padStart(6, '0');
          }
          out += beginEscape + xstyle + hexletters + endEscape;
        } else {
          out += unicodeToConvert.charAt(i);
        }
      }
      return out;
    }

    /**
     * @param {string} unicodeToConvert
     * @returns {string}
     */
    async unicode2htmlentsval (unicodeToConvert) {
      for (let i = 0; i < this.newents.length; i++) {
        unicodeToConvert = unicodeToConvert.replaceAll(
          this.newcharrefs[i], '&' + this.newents[i] + ';'
        );
      }

      let out = '';
      // If true, should allow conversion to &apos;
      const xhtmlentmode = await getPref('xhtmlentmode');
      // If true, will not convert '&' to '&amp;'
      const ampkeep = await getPref('ampkeep');

      for (const ch of unicodeToConvert) {
        const codePoint = ch.codePointAt();
        const tempcharref = this.numericCharacterReferences.indexOf(
          codePoint
        );

        out += tempcharref !== -1 &&
          (xhtmlentmode || tempcharref !== this.getAposPos()) &&
          (!ampkeep || tempcharref !== this.getAmpPos())
          ? '&' + this.entities[tempcharref] + ';'
          : ch;
      }
      return out;
    }

    /**
     * @param {string} out
     * @returns {string}
     */
    async htmlents2charrefDecval (out) {
      // If true, don't convert &apos;, &quot;, &lt;, &gt;, and &amp;
      const xmlentkeep = await getPref('xmlentkeep');
      return out.replaceAll(htmlOrXmlEnt, (match, match1) => {
        if (!xmlentkeep || !builtinEntities.has(match1)) {
          // If recognized multiple char ent. (won't convert these to decimal)
          if (this.newents.includes(match1)) {
            return this.newcharrefs[this.newents.indexOf(match1)];
          }
          // If recognized single char. ent.
          if (this.entities.includes(match1)) {
            return '&#' + this.numericCharacterReferences[
              this.entities.indexOf(match1)
            ] + ';';
          }
          // If unrecognized
          return '&' + match1 + ';';
        }
        // If keeping predefined XML entities (and this is one)
        return '&' + match1 + ';';
      });
    }

    /**
     * @param {string} out
     * @returns {string}
     */
    async htmlents2charrefHexval (out) {
      const xstyle = 'x';
      /* if (!(await getPref('hexstyleLwr'))) {
        xstyle = 'X';
      } */
      // If true, don't convert &apos;, &quot;, &lt;, &gt;, and &amp;
      const [xmlentkeep, hexLettersUpper] = await Promise.all([
        getPref('xmlentkeep'),
        getPref('hexLettersUpper')
      ]);
      return out.replaceAll(htmlOrXmlEnt, (match, match1) => {
        if (!xmlentkeep || !builtinEntities.has(match1)) {
          const b = this.numericCharacterReferences[
            this.entities.indexOf(match1)
          ];
          const c = this.newents.indexOf(match1);

          // If recognized multiple char. ent. (won't convert these to
          //   hexadecimal)
          if (c !== -1) {
            return this.newcharrefs[c];
          }

          // If recognized single char. ent.
          if (this.entities.includes(match1)) {
            let hexletters = b.toString(16);
            if (hexLettersUpper) {
              hexletters = hexletters.toUpperCase();
            }
            return '&#' + xstyle + hexletters + ';';
          } // If unrecognized ent.
          return '&' + match1 + ';';
        }
        // If keeping predefined XML entities (and this is one)
        return '&' + match1 + ';';
      });
    }

    /**
     * @param {string} out
     * @returns {string}
     */
    async htmlents2unicodeval (out) {
      // If true, don't convert &apos;, &quot;, &lt;, &gt;, and &amp;
      const xmlentkeep = await getPref('xmlentkeep');
      return out.replaceAll(htmlOrXmlEnt, (match, match1) => {
        if (!xmlentkeep || !builtinEntities.has(match1)) {
          const b = this.numericCharacterReferences[
            this.entities.indexOf(match1)
          ];

          // If recognized multiple char ent.
          if (this.newents.includes(match1)) {
            return this.newcharrefs[this.newents.indexOf(match1)];
          }
          // If recognized single char. ent.
          if (this.entities.includes(match1)) {
            return String.fromCodePoint(b);
          }
          // If unrecognized
          return '&' + match1 + ';';
        }
        // If keeping predefined XML entities (and this is one)
        return '&' + match1 + ';';
      });
    }

    /**
     * @param {string} out
     * @returns {string}
     */
    hex2decval (out) {
      return out.replaceAll(hexadec, function (match, match1) {
        return '&#' + Number.parseInt(match1, 16) + ';';
      });
    }

    /**
     * @param {string} out
     * @returns {string}
     */
    async dec2hexval (out) {
      const xstyle = 'x';
      /* if (!(await getPref('hexstyleLwr'))) {
        xstyle = 'X';
      } */
      const hexLettersUpper = await getPref('hexLettersUpper');
      return out.replaceAll(decim, function (match, match1) {
        let hexletters = Number(match1).toString(16);
        if (hexLettersUpper) {
          hexletters = hexletters.toUpperCase();
        }
        return '&#' + xstyle + hexletters + ';';
      });
    }

    /**
     * @param {string} toconvert
     * @returns {string}
     */
    cssescape2unicodeval (toconvert) {
      // See:
      // https://www.w3.org/TR/CSS21/syndata.html#characters
      // https://www.w3.org/TR/CSS21/grammar.html
      let unicode = '';
      for (let i = 0; i < toconvert.length; i++) {
        const s = toconvert[i];
        if (s !== '\\') {
          unicode += s;
          continue;
        }
        const next = toconvert[i + 1];
        switch (next) {
        /*
        case '\r':
          if (toconvert[i + 2] === '\n') {
            unicode += s + next + toconvert[i + 2];
            i++; // Skip the extra newline character here
            break;
          }
          // Fallthrough
        */
        case '\n':
          // Fallthrough
        case '\f':
          // Copy as is:
          unicode += s + next;
          break;
        default: {
          const hexEsc = toconvert.slice(i + 1).match(/^([A-Fa-f\d]{1,5})(?:([A-Fa-f\d])|(\r\n|[ \t\r\n\f])?)/u); // 1-5 hex and WS, or 6 hex
          if (hexEsc) {
            i += hexEsc[0].length - 1; // We want to skip the whole structure
            const hex = hexEsc[1] + (hexEsc[2] || ''); // [2] only if is 6-digit
            const dec = Number.parseInt(hex, 16);

            // \u000 is disallowed in CSS 2.1 (behavior undefined) and above
            //  0x10FFFF is beyond valid Unicode; fix: disallow non-characters
            //  too?
            if (dec > 0x10FFFF || dec === 0) {
              // Replacement character since not valid Unicode
              unicode += '\uFFFD';
              break;
            }

            const hexStr = String.fromCodePoint(dec);

            // Too low ASCII to be converted (not a letter, digit,
            //  underscore, or hyphen)
            // eslint-disable-next-line unicorn/prefer-ternary -- Structure
            if (dec < 0xA1 && (/[^\w-]/u).test(hexStr)) {
              // Don't convert since won't be valid if unescaped
              // Although https://www.w3.org/TR/CSS21/grammar.html#scanner
              //  (under "nonascii" which is a possible (indirect) component
              //  of identifiers) seems to permit any non-ASCII equal to or
              //  above 0x80 (decimal 128), per https://www.w3.org/TR/CSS21/syndata.html#characters
              //  only non-escaped characters above 0xA1 are permitted
              //  (limitation of Flex scanner based in Latin?); testing in
              //  Firefox also shows values lower than 0xA1 in CSS do not work
              //  there unless escaped
              unicode += s + hexEsc[0];
            // If begins with a digit or hyphen and digit, might not be valid
            //   if unescaped (if at beginning of identifier) so don't
            //   convert (if followed by an escaped number, there is no concern
            //   it will be avoided here, since the escaped number will remain
            //   escaped on the next iteration (by this same condition)
            // Reenable if know what this is supposed to be!
            /* } else if ((/^-?\d/u).test(hexStr + toconvert[i + 2])) {
              unicode += s + hexEsc[0]; */
            } else {
              unicode += hexStr;
            }
          } else {
            // [^\r\n\f0-9a-f] // May be escaping something that needs
            //   to be escaped for CSS grammar, so keep
            unicode += s + next;
          }
          break;
        }
        }
        i++;
      }
      return unicode;
    }

    /**
     * @param {string} toconvert
     * @param {UnicodeEscapeMode} mode
     * @returns {string}
     */
    jsescape2unicodeval (toconvert, mode) {
      let unicode = '', hexChrs;
      for (let i = 0; i < toconvert.length; i++) {
        const s = toconvert[i];
        if (s !== '\\') {
          unicode += s;
        } else {
          const next = toconvert[i + 1];
          if (mode === 'php') {
            switch (next) {
            case '\\': // Just add one backslash
              unicode += s;
              break;
            case 'u':
              hexChrs = (/^[a-fA-F\d]{6}|[a-fA-F\d]{4}/u).exec(toconvert.slice(i + 2));
              if (hexChrs) {
                unicode += String.fromCodePoint(
                  Number.parseInt(hexChrs[0], 16)
                );
                i += hexChrs[0].length; // 4 or 6
                break;
              }
            // Fallthrough
            default:
              unicode += s + next;
              break;
            }
          } else {
            switch (next) {
            case '\\': // Just add one backslash
              unicode += s;
              break;
            case 'r':
              unicode += '\u000D';
              break;
            case 'n':
              unicode += '\n';
              break;
            case 't':
              unicode += '\t';
              break;
            case 'f':
              unicode += '\f';
              break;
            case 'v':
              unicode += '\v';
              break;
            case 'b':
              unicode += '\b';
              break;
            case 'u':
              hexChrs = (/^[a-fA-F\d]{4}/u).exec(toconvert.slice(i + 2));
              if (hexChrs) {
                unicode += String.fromCharCode(Number.parseInt(hexChrs[0], 16));
                i += hexChrs[0].length; // 4
                break;
              }
              // Fallthrough
            default: // Unrecognized escape, so just add both characters
              unicode += s + next;
              break;
            }
          }
          i++;
        }
      }
      return unicode;
    }

    /**
     * @param {string} toconvert
     * @returns {string}
     */
    async unicode2jsescapeval (toconvert) {
      return await this.unicode2charrefHexval(toconvert, true, 'javascript');
    }

    /**
     * @param {string} toconvert
     * @returns {string}
     */
    async unicodeTo6DigitVal (toconvert) {
      return await this.unicode2charrefHexval(toconvert, false, 'php');
    }

    /**
     * @param {string} toconvert
     * @returns {string}
     */
    async unicode2cssescapeval (toconvert) {
      return await this.unicode2charrefHexval(toconvert, false, 'css');
    }

    /**
     * @param {string} toconvert
     * @returns {string}
     */
    sixDigit2UnicodeVal (toconvert) {
      return this.jsescape2unicodeval(toconvert, 'php');
    }

    // Todo: Move these to their own database-driven file?

    /**
     * @param {string} toconvert
     * @returns {string}
     */
    async unicode2CharDescVal (toconvert) {
      const asciiLt128 = await getPref('asciiLt128');
      return (await Promise.all([...toconvert].map(async (ch) => {
        const codePoint = ch.codePointAt();
        if (codePoint >= 128 || asciiLt128) {
          const charDesc = await this.getCharDescForCodePoint(codePoint);
          if (charDesc) { // Skip if no description in database
            return String.raw`\C{` + charDesc + '}';
          }
        }
        return ch;
      }))).join('');
    }

    /**
     * @param {string} toconvert
     * @returns {Promise<string>}
     */
    async charDesc2UnicodeVal (toconvert) {
      const promises = [];
      toconvert.replaceAll(/\\C\{([^}]*)\}/gu, (n, n1) => {
        promises.push(this.lookupUnicodeValueByCharName(n1));
      });

      const unicodeVals = await Promise.all(promises);

      let i = -1;
      return toconvert.replaceAll(/\\C\{([^}]*)\}/gu, () => {
        ++i;
        return unicodeVals[i]
          ? String.fromCodePoint(unicodeVals[i])
          : '\uFFFD'; // Replacement character if not found?
      });
    }

    /**
     * Obtain a Unicode character description for a given decimal-expressed
     * code point.
     * @param {Integer} dec The code point of the description to obtain
     * @returns {string} The Unicode character description
     */
    async getCharDescForCodePoint (dec) {
      // Todo: This should support CJK and those which are only marked by
      //   ranges (e.g., surrogates, though for these, see calling code)
      try {
        if (dec >= 0xAC00 && dec <= 0xD7A3) {
          return getHangulName(dec);
        }

        const hexStr = dec.toString(16).toUpperCase().padStart(4, '0');

        await charrefunicodeDb.connect();
        const {
          name, unicode1Name
        } = await charrefunicodeDb.getUnicodeFields(hexStr);

        // Todo: Unihan
        /*
        if (!name) {
        }
        */

        if (unicode1Name && name.includes('<')) {
          return `${unicode1Name} (${name})`;
        }

        return name;
      /* istanbul ignore next -- Debugging */
      } catch (e) {
        /* istanbul ignore next -- Debugging */
        alert(e);
      }
      /* istanbul ignore next -- Debugging */
      return undefined;
    }

    /**
     * Search for a Unicode character value matching a given description.
     * @param {string} value
     * @returns {Integer}
     */
    async lookupUnicodeValueByCharName (value) {
      // todo: Character names for Unihan
      const forceUnicode = true;
      const table = forceUnicode
        ? 'UnicodeData'
        /* istanbul ignore next -- Known todo */
        : 'Unihan';
      const id = forceUnicode
        ? 'searchName'
        /* istanbul ignore next -- Known todo */
        : 'searchkDefinition';
      await this.searchUnicode(
        {id, value}, table, 'noChart=true', 'strict=true'
      );
      if (!this.descripts[0] && value.length <= 7) {
        // Try Hangul (if possible size for Hangul)
        // Fix: Is Hangul allowed in PHP 6 Unicode escape names?
        const ret = getHangulFromName(value);
        return ret ? ret.charCodeAt(0) : false;
      }
      return this.descripts[0];
    }

    // Used for conversions, so included here (also used externally)
    /**
     * @param {{id: string, value: string}} obj E.g., an input element
     * @param {string} table
     * @param {boolean} nochart
     * @param {boolean} strict
     * @returns {Promise<void>}
     */
    async searchUnicode (obj, table, nochart, strict) { // Fix: allow Jamo!
      if (!table) {
        table = 'UnicodeData';
      }
      // const table = 'Unihan'; // fix: determine by pull-down
      const nameDescVal = obj.value;

      /* istanbul ignore next -- Just a guard */
      if (
        // Don't query the other databases here
        (obj.id.startsWith('searchk') && table === 'UnicodeData') ||
        ((/^search[^k]/u).test(obj.id) && table === 'Unihan')
      ) {
        return;
      }
      const nameDesc = obj.id.replace(/^search/u, '');

      // const nameDesc = (table === 'Unihan') ? 'kDefinition'
      // : 'Name'; // Fix: let Unihan search Mandarin, etc.

      const conn = table === 'Unihan'
        ? unicodecharref.unihanDatabase
        : charrefunicodeDb;

      if (table === 'Unihan' && !nochart && !unicodecharref.unihanDb_exists) {
        alert(this._('need_download_unihan'));
        return;
      }

      await conn.connect();
      this.descripts = [];

      try {
        /*
        if (nameDesc === 'General_Category' && nameDescVal === 'Cn') {
          try {
            const chars = await conn.getAll();
            let j = 0;
            for (let i = 0; i < 0x10FFFE; i++) {
              let {name, codePoint} = chars[j++];
              const range = name.endsWith('First>');
              if (range) {
                ({name, codePoint} = chars[j++]);
                const endRange = name.endsWith('Last>');
                if (endRange) {
                  i = Number.parseInt(codePoint, 16);
                  continue;
                }
              }
              let hex = Number.parseInt(codePoint, 16);
              for (let endHex = hex; i < endHex; i++, hex++) {
                this.descripts.push(i);
              }
            }
          } catch (e) {
            alert(e);
          }
        } else { */
        const field = nameDesc;
        const camelizedField = camelCase(nameDesc);

        // Todo: Add indexes for each instead and then query with
        //       `nameDescVal`, at least for `strict`
        const chars = await conn.getAll();

        const filteredChars = strict
          ? chars.filter((chr) => {
            const cell = table === 'Unihan'
              /* istanbul ignore next -- Not yet using strict checking */
              ? chr.columns[
                unicodecharref.Unihan.indexOf(field)
              ]
              : chr[camelizedField];
            return cell.toLowerCase() === nameDescVal.toLowerCase();
          })
          : chars.filter((chr) => {
            const cell = table === 'Unihan'
              ? chr.columns[
                unicodecharref.Unihan.indexOf(field)
              ]
              : chr[camelizedField];
            return cell.toLowerCase().includes(
              nameDescVal.toLowerCase()
            );
          });

        filteredChars.forEach((filteredChar) => {
          const {codePoint} = filteredChar;
          const hex = Number.parseInt(codePoint, 16);
          if (table === 'UnicodeData' &&
            (hex >= 0xF900 && hex < 0xFB00)
          ) { // Don't search for compatibility if searching Unicode
            return;
          }
          // Fix: inefficient, but fits more easily into current pattern
          this.descripts.push(hex);
        });
      /* istanbul ignore next -- Debugging */
      } catch (e) {
        /* istanbul ignore next -- Debugging */
        alert(e);
      } finally {
        // conn.close();
      }
    }
  };
};
