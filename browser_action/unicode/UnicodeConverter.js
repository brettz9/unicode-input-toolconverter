/* eslint-disable class-methods-use-this -- Todo: fix later */
import {getUnicodeDefaults} from '../preferences/prefDefaults.js';
import {getHangulName, getHangulFromName} from './Hangul.js';
import CharrefunicodeConsts from './CharrefunicodeConsts.js';
import charrefunicodeDb from './charrefunicodeDb.js';

/**
 * @namespace Converts from one string form to another
 */
const decim = /&#(\d*);/gu;
const hexadec = /&#[xX]([\da-fA-F]*);/gu;
const htmlent = /&([_a-zA-Z][-\w]*);/gu; /* Unicode complete version? */

export const getUnicodeConverter = () => {
  const {getPref} = getUnicodeDefaults();

  return class UnicodeConverter {
    constructor ({_}) {
      this._ = _;
      this.shiftcount = 0;
      this.newents = [];
      this.newcharrefs = [];
    }

    charref2unicodeval (out) {
      out = out.replace(decim, function (match, match1) {
        return String.fromCodePoint(match1);
      }).replace(hexadec, function (match, match1) {
        return String.fromCodePoint(Number.parseInt(match1, 16));
      });
      return out;
    }

    charref2htmlentsval (out) {
      const xhtmlentmode = getPref('xhtmlentmode'); // If true, should allow conversion to &apos;

      out = out.replace(decim, (match, match1) => {
        const matched = CharrefunicodeConsts.NumericCharacterReferences.indexOf(Number.parseInt(match1));
        if (matched !== -1 && (matched !== (98 + this.shiftcount) || xhtmlentmode)) {
          return '&' + CharrefunicodeConsts.Entities[matched] + ';';
        }
        return match;
      }).replace(hexadec, (match, match1) => {
        const matched = CharrefunicodeConsts.NumericCharacterReferences.indexOf(Number.parseInt('0x' + match1, 16));
        if (matched !== -1 && (matched !== (98 + this.shiftcount) || xhtmlentmode)) {
          return '&' + CharrefunicodeConsts.Entities[matched] + ';';
        }
        return match;
      });
      return out;
    }

    unicode2charrefDecval (unicodeToConvert, leaveSurrogates) {
      let out = '';
      for (let i = 0; i < unicodeToConvert.length; i++) {
        let temp = unicodeToConvert.charCodeAt(i);
        if (!leaveSurrogates && temp >= 0xD800 && temp < 0xF900) { // surrogate
          temp = ((temp - 0xD800) * 0x400) + (unicodeToConvert.charCodeAt(i + 1) - 0xDC00) + 0x10000;
          // Could do test on temp.isNan()  (e.g., if trying to convert a surrogate by itself in regular (non-surrogate converting) mode)
          out += '&#' + temp + ';';
          i += 1; // Skip the next surrogate
        } else if (temp >= 128 || getPref('asciiLt128')) { /* replace this 'if' condition and remove the 'else' if also want ascii */
          out += '&#' + temp + ';';
        } else {
          out += unicodeToConvert.charAt(i);
        }
      }
      return out;
    }

    unicode2charrefHexval (unicodeToConvert, leaveSurrogates, type) {
      // alert(unicodeToConvert + '::' + leaveSurrogates + '::' + type);
      let out = '';
      let xstyle, beginEscape, endEscape, cssUnambiguous;
      // Fix: offer a U+.... option (similar to 'php' or 'javascript' depending on if length is desired as 4 or 6)
      if (type === 'javascript' || type === 'php') {
        xstyle = '';
        beginEscape = '\\u';
        endEscape = '';
      } else if (type === 'css') {
        cssUnambiguous = getPref('cssUnambiguous');
        xstyle = '';
        beginEscape = '\\';
        endEscape = cssUnambiguous ? '' : getPref('cssWhitespace');
      } else {
        xstyle = 'x';
        beginEscape = '&#';
        endEscape = ';';
        /*
        if (!getPref('hexstyleLwr')) {
          xstyle = 'X';
        }
        */
      }

      for (let i = 0; i < unicodeToConvert.length; i++) {
        let hexletters;
        let temp = unicodeToConvert.charCodeAt(i);
        if (!leaveSurrogates && temp >= 0xD800 && temp < 0xF900) { // surrogate
          temp = ((temp - 0xD800) * 0x400) + (unicodeToConvert.charCodeAt(i + 1) - 0xDC00) + 0x10000;
          hexletters = temp.toString(16);
          i += 1; // Skip the next surrogate
          if (getPref('hexLettersUpper')) {
            hexletters = hexletters.toUpperCase();
          }
          if ((type === 'php' || cssUnambiguous) && hexletters.length < 6) {
            hexletters = hexletters.padStart(6, '0');
          }
          out += beginEscape + xstyle + hexletters + endEscape;
        } else if (temp >= 128 || getPref('asciiLt128')) { /* replace this 'if' condition and remove the 'else' if also want ascii */
          hexletters = temp.toString(16);
          if (getPref('hexLettersUpper')) {
            hexletters = hexletters.toUpperCase();
          }
          if (type === 'javascript' && hexletters.length < 4) {
            hexletters = hexletters.padStart(4, '0');
          } else if ((type === 'php' || cssUnambiguous) && hexletters.length < 6) {
            hexletters = hexletters.padStart(6, '0');
          }
          out += beginEscape + xstyle + hexletters + endEscape;
        } else {
          out += unicodeToConvert.charAt(i);
        }
      }
      return out;
    }

    unicode2htmlentsval (unicodeToConvert) {
      function pregQuote (str) {
        // http://kevin.vanzonneveld.net
        // +   original by: booeyOH
        // +   improved by: Ates Goral (http://magnetiq.com)
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   bugfixed by: Onno Marsman
        // +   improved by: Brett Zamir (http://brett-zamir.me)
        return str.replace(/[.\\+*?[^\]$(){}=!<>|:-]/gu, '\\$&');
      }

      for (let i = 0; i < this.newents.length; i++) {
        const regex = new RegExp(pregQuote(this.newcharrefs[i]), 'gum'); // Escaping necessary for custom entities added via the DTD
        unicodeToConvert = unicodeToConvert.replace(regex, '&' + this.newents[i] + ';');
      }

      let out = '';
      const xhtmlentmode = getPref('xhtmlentmode'); // If true, should allow conversion to &apos;
      const ampkeep = getPref('ampkeep'); // If true, will not convert '&' to '&amp;'

      for (let i = 0; i < unicodeToConvert.length; i++) {
        const charcodeati = unicodeToConvert.charCodeAt(i);
        const tempcharref = CharrefunicodeConsts.NumericCharacterReferences.indexOf(charcodeati);

        out += tempcharref !== -1 && (tempcharref !== (98 + this.shiftcount) || xhtmlentmode) && (tempcharref !== (99 + this.shiftcount) || !ampkeep) ? '&' + CharrefunicodeConsts.Entities[tempcharref] + ';' : unicodeToConvert.charAt(i);
      }
      return out;
    }

    htmlents2charrefDecval (out) {
      const xmlentkeep = getPref('xmlentkeep'); // If true, don't convert &apos;, &quot;, &lt;, &gt;, and &amp;
      return out.replace(htmlent, (match, match1) => {
        if (!xmlentkeep ||
          (match1 !== 'apos' && match1 !== 'quot' && match1 !== 'lt' &&
            match1 !== 'gt' && match1 !== 'amp')) {
          if (this.newents.includes(match1)) { // If recognized multiple char ent. (won't convert these to decimal)
            return this.newcharrefs[this.newents.indexOf(match1)];
          }
          if (CharrefunicodeConsts.Entities.includes(match1)) { // If recognized single char. ent.
            return '&#' + CharrefunicodeConsts.NumericCharacterReferences[CharrefunicodeConsts.Entities.indexOf(match1)] + ';';
          }
          // If unrecognized
          return '&' + match1 + ';';
        }
        // If keeping predefined XML entities (and this is one)
        return '&' + match1 + ';';
      });
    }

    htmlents2charrefHexval (out) {
      const xstyle = 'x';
      /* if (!getPref('hexstyleLwr')) {
        xstyle = 'X';
      } */
      const xmlentkeep = getPref('xmlentkeep'); // If true, don't convert &apos;, &quot;, &lt;, &gt;, and &amp;
      return out.replace(htmlent, (match, match1) => {
        if (!xmlentkeep || (match1 !== 'apos' && match1 !== 'quot' && match1 !== 'lt' && match1 !== 'gt' && match1 !== 'amp')) {
          const b = CharrefunicodeConsts.NumericCharacterReferences[CharrefunicodeConsts.Entities.indexOf(match1)];
          const c = this.newents.indexOf(match1);

          if (c !== -1) { // If recognized multiple char. ent. (won't convert these to hexadecimal)
            return this.newcharrefs[c];
          }
          if (CharrefunicodeConsts.Entities.includes(match1)) { // If recognized single char. ent.
            let hexletters = b.toString(16);
            if (getPref('hexLettersUpper')) {
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

    htmlents2unicodeval (out) {
      const xmlentkeep = getPref('xmlentkeep'); // If true, don't convert &apos;, &quot;, &lt;, &gt;, and &amp;
      return out.replace(htmlent, (match, match1) => {
        if (!xmlentkeep || (match1 !== 'apos' && match1 !== 'quot' && match1 !== 'lt' && match1 !== 'gt' && match1 !== 'amp')) {
          const b = CharrefunicodeConsts.NumericCharacterReferences[CharrefunicodeConsts.Entities.indexOf(match1)];

          if (this.newents.includes(match1)) { // If recognized multiple char ent.
            return this.newcharrefs[this.newents.indexOf(match1)];
          }
          if (CharrefunicodeConsts.Entities.includes(match1)) { // If recognized single char. ent.
            return String.fromCodePoint(b);
          }
          // If unrecognized
          return '&' + match1 + ';';
        }
        // If keeping predefined XML entities (and this is one)
        return '&' + match1 + ';';
      });
    }

    hex2decval (out) {
      return out.replace(hexadec, function (match, match1) {
        return '&#' + Number.parseInt(match1, 16) + ';';
      });
    }

    dec2hexval (out) {
      const xstyle = 'x';
      /* if (!getPref('hexstyleLwr')) {
        xstyle = 'X';
      } */
      return out.replace(decim, function (match, match1) {
        let hexletters = Number(match1).toString(16);
        if (getPref('hexLettersUpper')) {
          hexletters = hexletters.toUpperCase();
        }
        return '&#' + xstyle + hexletters + ';';
      });
    }

    unicode2CharDescVal (toconvert) {
      let val = '', charDesc;
      // Todo: Redo with `codePointAt`
      for (let i = 0; i < toconvert.length; i++) {
        let temp = toconvert.charCodeAt(i);
        if (temp >= 0xD800 && temp < 0xF900) { // surrogate
          temp = ((temp - 0xD800) * 0x400) + (toconvert.charCodeAt(i + 1) - 0xDC00) + 0x10000;
          // Could do test on temp.isNan()  (e.g., if trying to convert a surrogate by itself in regular (non-surrogate converting) mode)
          charDesc = this.getCharDescForCodePoint(temp);
          if (!charDesc) {
            val += toconvert.charAt(i) + toconvert.charAt(i + 1);
            i += 1; // Skip the next (low) surrogate
            continue;
          }
          val += '\\C{' + charDesc + '}';
          i += 1; // Skip the next (low) surrogate
        // Fix: Can/Will Hangul syllables be expressible this way?
        } else if (temp > 0xAC00 && temp <= 0xD7A3) {
          try {
            val += '\\C{' + getHangulName(temp) + '}';
          } catch (e) {
            val += toconvert.charAt(i);
          }
        } else if (temp >= 128 || getPref('asciiLt128')) { /* replace this 'if' condition and remove the 'else' if also want ascii */
          charDesc = this.getCharDescForCodePoint(temp);
          if (!charDesc) { // Skip if no description in database
            val += toconvert.charAt(i);
            continue;
          }
          val += '\\C{' + charDesc + '}';
        } else {
          val += toconvert.charAt(i);
        }
      }
      return val;
    }

    charDesc2UnicodeVal (toconvert) {
      return toconvert.replace(/\\C\{([^}]*)\}/gu, (n, n1) => {
        const unicodeVal = this.lookupUnicodeValueByCharName(n1);
        return unicodeVal ? String.fromCodePoint(unicodeVal) : '\uFFFD'; // Replacement character if not found?
      });
    }

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
        case '\r':
          if (toconvert[i + 2] === '\n') {
            unicode += s + next + toconvert[i + 2];
            i++; // Skip the extra newline character here
            break;
          }
          // Fallthrough
        case '\n':
          // Fallthrough
        case '\f':
          // Copy as is:
          unicode += s + next;
          break;
        default: {
          const hexEsc = toconvert.slice(i + 1).match(/^([A-Fa-f\d]{1,5})(([A-Fa-f\d])|(\r\n|[ \t\r\n\f])?)/u); // 1-5 hex and WS, or 6 hex
          if (hexEsc) {
            i += hexEsc[0].length - 1; // We want to skip the whole structure
            const hex = hexEsc[1] + (hexEsc[3] || ''); // [3] only if is 6-digit
            const dec = Number.parseInt(hex, 16);
            const hexStr = String.fromCodePoint(dec);

            // \u000 is disallowed in CSS 2.1 (behavior undefined) and above 0x10FFFF is
            //  beyond valid Unicode; fix: disallow non-characters too?
            if (dec > 0x10FFFF || dec === 0) {
              unicode += '\uFFFD'; // Replacement character since not valid Unicode
            // Too low ASCII to be converted (not a letter, digit, underscore, or hyphen)
            } else if (dec < 0xA1 && (/[^\w-]/u).test(hexStr)) { // Don't convert since won't be valid if unescaped
              // Although https://www.w3.org/TR/CSS21/grammar.html#scanner (under "nonascii" which is a
              //  possible (indirect) component of identifiers) seems to permit any non-ASCII equal to or above
              //  0x80 (decimal 128), per https://www.w3.org/TR/CSS21/syndata.html#characters only non-escaped
              // characters above 0xA1 are permitted (limitation of Flex scanner based in Latin?); testing in Firefox
              // also shows values lower than 0xA1 in CSS do not work there unless escaped
              unicode += s + hexEsc[0];
            // If begins with a digit or hyphen and digit, might not be valid if unescaped (if at beginning of
            //   identifier) so don't convert (if followed by an escaped number, there is no concern it will
            //   be avoided here, since the escaped number will remain escaped on the next
            //   iteration (by this same condition)
            } else if ((/^-?\d/u).test(hexStr + toconvert[i + 2])) {
              unicode += s + hexEsc[0];
            } else {
              unicode += hexStr;
            }
          } else {
            // [^\r\n\f0-9a-f] // May be escaping something that needs to be escaped for CSS grammar, so keep
            unicode += s + next;
          }
          break;
        }
        }
        i++;
      }
      return unicode;
    }

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
                unicode += String.fromCodePoint(Number.parseInt(hexChrs[0], 16));
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

    unicode2jsescapeval (toconvert) {
      return this.unicode2charrefHexval(toconvert, true, 'javascript');
    }

    unicodeTo6DigitVal (toconvert) {
      return this.unicode2charrefHexval(toconvert, false, 'php');
    }

    unicode2cssescapeval (toconvert) {
      return this.unicode2charrefHexval(toconvert, false, 'css');
    }

    sixDigit2UnicodeVal (toconvert) {
      return this.jsescape2unicodeval(toconvert, 'php');
    }

    /**
     * Obtain a Unicode character description for a given decimal-expressed code point.
     * @param {Integer} dec The code point of the description to obtain
     * @returns {string} The Unicode character description
     */
    getCharDescForCodePoint (dec) {
      // Fix: handle Hangul syllables; CJK?
      let statement;
      try {
        let result;
        const hex = dec.toString(16).toUpperCase().padStart(4, '0');

        statement = charrefunicodeDb.dbConn.createStatement(
          'SELECT `Name` FROM Unicode WHERE `Code_Point` = "' + hex + '"'
        );
        while (statement.executeStep()) { // put in while in case expand to allow LIKE checks (e.g., to get a list
          // of matching descriptions within a given code point range, etc.)
          result = statement.getUTF8String(0);
          if (result === null) {
            return false;
          }
        }
        return result;
      } catch (e) {
        alert(e);
      } finally {
        statement.reset();
      }
      return undefined;
    }

    /**
     * Search for a Unicode character value matching a given description.
     * @param {string} value
     * @returns {Integer}
     */
    lookupUnicodeValueByCharName (value) {
      // Fix: Character names for Unihan?
      const forceUnicode = true; // Todo: Need to make changeable? If not, remove
      const table = forceUnicode ? 'Unicode' : 'Unihan';
      const id = forceUnicode ? 'searchName' : 'searchkDefinition';
      this.searchUnicode({id, value}, table, 'noChart=true', 'strict=true');
      if (!this.descripts[0] && value.length <= 7) { // Try Hangul (if possible size for Hangul)
        // Fix: Is Hangul allowed in PHP 6 Unicode escape names?
        const ret = getHangulFromName(value);
        return ret ? ret.charCodeAt(0) : false;
      }
      return this.descripts[0];
    }

    // Used for conversions, so included here (also used externally)
    searchUnicode (obj, table, nochart, strict) { // Fix: allow Jamo!
      if (!table) {
        table = 'Unicode';
      }
      // const table = 'Unihan'; // fix: determine by pull-down
      const nameDescVal = obj.value;
      if ((obj.id.startsWith('searchk') && table === 'Unicode') || // Don't query the other databases here
        ((/^search[^k]/u).test(obj.id) && table === 'Unihan')
      ) {
        return;
      }
      const nameDesc = obj.id.replace(/^search/u, '');

      // const nameDesc = (table === 'Unihan') ? 'kDefinition' : 'Name'; // Fix: let Unihan search Mandarin, etc.

      const colindex = 0; // (table === 'Unihan') ? 0 : 0;
      const cpCol = (table === 'Unihan') ? 'code_pt' : 'Code_Point';
      const conn = (table === 'Unihan') ? 'dbConnUnihan' : 'dbConn';
      this.descripts = [];

      if (table === 'Unihan' && !nochart && !charrefunicodeDb[conn]) {
        alert(this._('need_download_unihan'));
        return;
      }

      /*
      // Couldn't get to work but probably ok now as changed 'test' to 'search'
      const regex = {
        onFunctionCall (regex, value) {
          regex = regex.getUTF8String(0);
          return value.search(regex) !== -1;
        }
      };
      */

      let statement;
      try {
        // charrefunicodeDb[conn].createFunction('regx', 2, regex);
        let likeBegin = 'LIKE "%';
        let likeEnd = '%"';
        if (strict) {
          likeBegin = '= "';
          likeEnd = '"';
        }

        if (nameDesc === 'General_Category' && nameDescVal === 'Cn') {
          try {
            statement = charrefunicodeDb[conn].createStatement(
              'SELECT `' + cpCol + '`, Name FROM ' + table
            );
            for (let i = 0; i < 0x10FFFE; i++) {
              const res = statement.executeStep();
              if (!res) {
                break;
              }
              const cp = statement.getUTF8String(colindex);
              const range = statement.getUTF8String(1).endsWith('First>');
              if (range) {
                statement.executeStep();
                const endRange = statement.getUTF8String(1).endsWith('Last>');
                if (endRange) {
                  i = Number.parseInt(statement.getUTF8String(colindex), 16);
                  continue;
                }
              }
              let hex = Number.parseInt(cp, 16);
              for (let endHex = hex; i < endHex; i++, hex++) {
                this.descripts.push(i);
              }
            }
          } catch (e) {
            alert(e);
          }
        } else {
          statement = charrefunicodeDb[conn].createStatement(
            'SELECT `' + cpCol + '` FROM ' + table + ' WHERE `' + nameDesc +
            '` ' + likeBegin + nameDescVal + likeEnd
          );
          while (statement.executeStep()) {
            const cp = statement.getUTF8String(colindex);
            const hex = Number.parseInt(cp, 16);
            if (table === 'Unicode' && (hex >= 0xF900 && hex < 0xFB00)) { // Don't search for compatibility if searching Unicode
              continue;
            }
            this.descripts.push(hex); // Fix: inefficient, but fits more easily into current pattern
          }
        }
      } catch (e) {
        alert(e);
      } finally {
        statement.reset();
      }
    }
  };
};
