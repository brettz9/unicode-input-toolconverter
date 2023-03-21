import {$} from '../vendor/jamilih/dist/jml-es.js';
import {getUnicodeDefaults} from './preferences/prefDefaults.js';

let charrefunicodeConverter, getPref;
export const shareVars = ({_: l10n, charrefunicodeConverter: _uc}) => {
  charrefunicodeConverter = _uc;
  ({getPref} = getUnicodeDefaults());
};

/**
 * @param {HTMLElement} el
 * @returns {void}
 */
function classChange (el) {
  const activeButton = $("*[class='buttonactive']");
  if (activeButton) {
    activeButton.className = 'reconvert';
  }

  el.className = 'buttonactive';
}

const CharrefConverterBridges = {
  charref2unicodeval (out, el) {
    classChange(el);
    return charrefunicodeConverter.charref2unicodeval(out);
  },
  async charref2htmlentsval (out, el) {
    classChange(el);
    return await charrefunicodeConverter.charref2htmlentsval(out);
  },
  async unicode2charrefDecval (unicodeToConvert, el, leaveSurrogates) {
    classChange(el);
    return await charrefunicodeConverter.unicode2charrefDecval(
      unicodeToConvert, leaveSurrogates
    );
  },
  async unicode2charrefHexval (unicodeToConvert, el, leaveSurrogates, type) {
    classChange(el);
    return await charrefunicodeConverter.unicode2charrefHexval(
      unicodeToConvert, leaveSurrogates, type
    );
  },
  async unicode2htmlentsval (unicodeToConvert, el) {
    classChange(el);
    return await charrefunicodeConverter.unicode2htmlentsval(
      unicodeToConvert
    );
  },
  async htmlents2charrefDecval (out, el) {
    classChange(el);
    return await charrefunicodeConverter.htmlents2charrefDecval(out);
  },
  async htmlents2charrefHexval (out, el) {
    classChange(el);
    return await charrefunicodeConverter.htmlents2charrefHexval(out);
  },
  async htmlents2unicodeval (out, el) {
    classChange(el);
    return await charrefunicodeConverter.htmlents2unicodeval(out);
  },
  hex2decval (out, el) {
    classChange(el);
    return charrefunicodeConverter.hex2decval(out);
  },
  async dec2hexval (out, el) {
    classChange(el);
    return await charrefunicodeConverter.dec2hexval(out);
  },
  async unicodeTo6Digit (e) {
    const toconvert = $('#toconvert').value;
    await this.unicodeTo6DigitVal(toconvert, e.target);
    return false;
  },
  async unicodeTo6DigitVal (toconvert, el) {
    classChange(el);
    const val = await charrefunicodeConverter.unicodeTo6DigitVal(
      toconvert
    );
    $('#converted').value = val;
    return val;
  },
  async charref2unicode (e) {
    let toconvert = $('#toconvert').value;
    if (await getPref('ampspace')) {
      toconvert = toconvert.replace(/&([^;\s]*\s)/gu, '&amp;$1');
    }
    $('#converted').value = this.charref2unicodeval(toconvert, e.target);
    return false;
  },
  async charref2htmlents (e) {
    let toconvert = $('#toconvert').value;
    if (await getPref('ampspace')) {
      toconvert = toconvert.replace(/&([^;\s]*\s)/gu, '&amp;$1');
    }
    $('#converted').value = await this.charref2htmlentsval(toconvert, e.target);
    return false;
  },
  async unicode2charrefDec (e, leaveSurrogates) {
    let toconvert = $('#toconvert').value;
    if (await getPref('ampspace')) {
      toconvert = toconvert.replace(/&([^;\s]*\s)/gu, '&amp;$1');
    }
    $('#converted').value = await this.unicode2charrefDecval(
      toconvert, e.target, leaveSurrogates
    );
    return false;
  },
  async unicode2charrefDecSurrogate (e) {
    return await this.unicode2charrefDec(e, true);
  },
  async unicode2charrefHex (e, leaveSurrogates) {
    let toconvert = $('#toconvert').value;
    if (await getPref('ampspace')) {
      toconvert = toconvert.replace(/&([^;\s]*\s)/gu, '&amp;$1');
    }
    $('#converted').value = await this.unicode2charrefHexval(
      toconvert, e.target, leaveSurrogates
    );
    return false;
  },
  async unicode2charrefHexSurrogate (e) {
    return await this.unicode2charrefHex(e, true);
  },
  async unicode2htmlents (e) {
    let toconvert = $('#toconvert').value;
    if (await getPref('ampspace')) {
      toconvert = toconvert.replace(/&([^;\s]*\s)/gu, '&amp;$1');
    }
    $('#converted').value = await this.unicode2htmlentsval(toconvert, e.target);
    return false;
  },
  /**
   * Replace Unicode characters with their escaped description form.
   * @param {string} toconvert The text whose Unicode characters will be
   *   replaced
   * @param {XULElement} el The (button) element whose class will be changed to
   *   reflect that the action has been activated
   * @returns {string} The passed-in string with Unicode replaced with
   *   description escape sequences
   */
  async unicode2CharDescVal (toconvert, el) {
    classChange(el);
    const val = await charrefunicodeConverter.unicode2CharDescVal(toconvert);
    $('#converted').value = val;
    return val;
  },
  /**
   * Converts character description escape sequences within a string to
   * Unicode characters.
   * @param {string} toconvert The text to convert
   * @param {XULElement} el The button element whose class should be
   *   dynamically changed (and others deactivated)
   * @returns {Promise<string>} The converted-to-Unicode value
   */
  async charDesc2UnicodeVal (toconvert, el) {
    classChange(el);
    const val = await charrefunicodeConverter.charDesc2UnicodeVal(toconvert);
    $('#converted').value = val;
    return val;
  },
  async charDesc2Unicode (e) {
    const toconvert = $('#toconvert').value;
    await this.charDesc2UnicodeVal(toconvert, e.target);
    return false;
  },
  async unicode2CharDesc (e) {
    const toconvert = $('#toconvert').value;
    await this.unicode2CharDescVal(toconvert, e.target);
    return false;
  },
  async unicode2jsescapeval (toconvert, el) {
    classChange(el);
    const val = await charrefunicodeConverter.unicode2jsescapeval(toconvert);
    $('#converted').value = val;
    return val;
  },
  async unicode2jsescape (e) {
    const toconvert = $('#toconvert').value;
    await this.unicode2jsescapeval(toconvert, e.target);
    return false;
  },
  cssescape2unicode (e) {
    const toconvert = $('#toconvert').value;
    $('#converted').value = this.cssescape2unicodeval(toconvert, e.target);
    return false;
  },
  sixDigit2UnicodeVal (toconvert, el) {
    classChange(el);
    const val = charrefunicodeConverter.sixDigit2UnicodeVal(toconvert);
    $('#converted').value = val;
    return val;
  },
  sixDigit2Unicode (e) {
    const toconvert = $('#toconvert').value;
    this.sixDigit2UnicodeVal(toconvert, e.target);
    return false;
  },
  jsescape2unicode (e) {
    const toconvert = $('#toconvert').value;
    $('#converted').value = this.jsescape2unicodeval(toconvert, e.target);
    return false;
  },
  cssescape2unicodeval (toconvert, el) {
    classChange(el);
    const unicode = charrefunicodeConverter.cssescape2unicodeval(toconvert);
    return unicode;
  },
  // Fix: make option to avoid converting \r, etc. for javascript
  jsescape2unicodeval (toconvert, el, mode) {
    classChange(el);
    const unicode = charrefunicodeConverter.jsescape2unicodeval(
      toconvert, mode
    );
    return unicode;
  },
  async unicode2cssescapeval (toconvert, el) {
    classChange(el);
    const val = await charrefunicodeConverter.unicode2cssescapeval(
      toconvert
    );
    $('#converted').value = val;
    return val;
  },
  async unicode2cssescape (e) {
    const toconvert = $('#toconvert').value;
    await this.unicode2cssescapeval(toconvert, e.target);
    return false;
  },
  // In this method and others like it, boolpref should be moved instead to
  //   converter function since it should be consistent across the app
  async htmlents2charrefDec (e) {
    let toconvert = $('#toconvert').value;
    if (await getPref('ampspace')) {
      toconvert = toconvert.replace(/&([^;\s]*\s)/gu, '&amp;$1');
    }
    $('#converted').value = await this.htmlents2charrefDecval(
      toconvert, e.target
    );
    return false;
  },
  async htmlents2charrefHex (e) {
    let toconvert = $('#toconvert').value;
    if (await getPref('ampspace')) {
      toconvert = toconvert.replace(/&([^;\s]*\s)/gu, '&amp;$1');
    }
    $('#converted').value = await this.htmlents2charrefHexval(
      toconvert, e.target
    );
    return false;
  },
  async htmlents2unicode (e) {
    let toconvert = $('#toconvert').value;
    if (await getPref('ampspace')) {
      toconvert = toconvert.replace(/&([^;\s]*\s)/gu, '&amp;$1');
    }
    $('#converted').value = await this.htmlents2unicodeval(
      toconvert, e.target
    );
    return false;
  },
  async hex2dec (e) {
    let toconvert = $('#toconvert').value;
    if (await getPref('ampspace')) {
      toconvert = toconvert.replace(/&([^;\s]*\s)/gu, '&amp;$1');
    }
    $('#converted').value = this.hex2decval(toconvert, e.target);
    return false;
  },
  async dec2hex (e) {
    let toconvert = $('#toconvert').value;
    if (await getPref('ampspace')) {
      toconvert = toconvert.replace(/&([^;\s]*\s)/gu, '&amp;$1');
    }
    $('#converted').value = await this.dec2hexval(toconvert, e.target);
    return false;
  }
};

/**
 * @param {PlainObject} cfg
 * @param {string} cfg.toconvert
 * @param {string} cfg.targetid
 * @throws {Error}
 * @returns {Promise<string>}
 */
async function findBridgeForTargetID ({toconvert, targetid}) {
  let out;
  switch (targetid) {
  case 'context-charrefunicode1':
    out = CharrefConverterBridges.charref2unicodeval(toconvert, $('#b1'));
    break;
  case 'context-charrefunicode2':
    out = await CharrefConverterBridges.charref2htmlentsval(
      toconvert, $('#b2')
    );
    break;
  case 'context-charrefunicode3':
    out = await CharrefConverterBridges.unicode2charrefDecval(
      toconvert, $('#b3')
    );
    break;
  case 'context-charrefunicode4':
    out = await CharrefConverterBridges.unicode2charrefHexval(
      toconvert, $('#b4')
    );
    break;
  case 'context-charrefunicode5':
    out = await CharrefConverterBridges.unicode2htmlentsval(
      toconvert, $('#b5')
    );
    break;
  case 'context-charrefunicode6':
    out = CharrefConverterBridges.unicode2jsescapeval(toconvert, $('#b6'));
    break;
  case 'context-charrefunicode7':
    out = await CharrefConverterBridges.unicodeTo6DigitVal(
      toconvert, $('#b7')
    );
    break;
  case 'context-charrefunicode8':
    out = await CharrefConverterBridges.unicode2cssescapeval(
      toconvert, $('#b8')
    );
    break;
  case 'context-charrefunicode9':
    out = await CharrefConverterBridges.htmlents2charrefDecval(
      toconvert, $('#b9')
    );
    break;
  case 'context-charrefunicode10':
    out = await CharrefConverterBridges.htmlents2charrefHexval(
      toconvert, $('#b10')
    );
    break;
  case 'context-charrefunicode11':
    out = await CharrefConverterBridges.htmlents2unicodeval(
      toconvert, $('#b11')
    );
    break;
  case 'context-charrefunicode12':
    out = CharrefConverterBridges.hex2decval(toconvert, $('#b12'));
    break;
  case 'context-charrefunicode13':
    out = CharrefConverterBridges.dec2hexval(toconvert, $('#b13'));
    break;
  case 'context-charrefunicode14':
    out = CharrefConverterBridges.jsescape2unicodeval(toconvert, $('#b14'));
    break;
  case 'context-charrefunicode15':
    out = CharrefConverterBridges.sixDigit2UnicodeVal(toconvert, $('#b15'));
    break;
  case 'context-charrefunicode16':
    out = CharrefConverterBridges.cssescape2unicodeval(toconvert, $('#b16'));
    break;
  case 'context-charrefunicode17':
    out = await CharrefConverterBridges.unicode2CharDescVal(
      toconvert, $('#b17')
    );
    break;
  case 'context-charrefunicode18':
    out = await CharrefConverterBridges.charDesc2UnicodeVal(
      toconvert, $('#b18')
    );
    break;
  default:
    throw new Error('Unexpected target ID type');
  }
  return out;
}

export {findBridgeForTargetID, classChange};
export default CharrefConverterBridges;
