import {getHangulName} from './hangul.js';

/**
 * @param {PlainObject} cfg
 * @param {string} cfg.khextemp
 * @param {import('intl-dom').I18NCallback} cfg._
 * @returns {{
 *   unihanType: boolean, hangul: boolean, cjkText: string,
 *   searchValue: string
 * }}
 */
function getCJKTypeFromHexString ({khextemp, _}) {
  let unihanType = false, hangul = false;

  const kdectemp = Number.parseInt(khextemp, 16);

  // \p{UIdeo=y}
  if (
    (kdectemp >= 0x3400 && kdectemp <= 0x4DB5) ||
    (kdectemp >= 0x4E00 && kdectemp <= 0x9FC3) || // 0x9FBB
    (kdectemp >= 0xF900 && kdectemp < 0xFB00) ||
    // Miscategorized unified as compatibility
    [
      0xFA0E,
      0xFA0F,
      0xFA11,
      0xFA13,
      0xFA14,
      0xFA1F,
      0xFA21,
      0xFA23,
      0xFA24,
      0xFA27,
      0xFA29
    ].includes(kdectemp) ||

    // If not using the 39.5MB updated file, these ranges will not be valid:
    // (CJK Ideograph Extension B)
    (kdectemp >= 0x20000 && kdectemp <= 0x2A6D6) ||
    // (CJK Ideograph Extension C)
    (kdectemp >= 0x2A700 && kdectemp <= 0x2B734) ||
    // (CJK Ideograph Extension D)
    (kdectemp >= 0x2B840 && kdectemp <= 0x2B81D) ||

    // Compatibility
    (kdectemp >= 0x2F800 && kdectemp < 0x2FA1F)
  ) {
    // pattern = new RegExp('^U\\+(' + khextemp + ')\\t(.*)\\t(.*)$', 'mg');
    // file = 'Unihan.txt';
    unihanType = true;
    // $('#pdflink').append(alink);
  } else if (kdectemp >= 0xAC00 && kdectemp <= 0xD7A3) {
    // pattern = new RegExp('^' + khextemp + '\\s*;\\s*(.*)$', 'm');
    // file = 'HangulSyllableType.txt';
    hangul = true;
    // The following are some ranges in UnicodeData.txt which do not
    //  have their own description sheets as do the two above
    /*
    if (0xE000 <= kdectemp && kdectemp <= 0xF8FF) {// Private Use
    }
    // Plane 15 Private Use
    else if (0xF0000 <= kdectemp && kdectemp <= 0xFFFFD) {
    }
    // Plane 16 Private Use
    else if (0x100000 <= kdectemp && kdectemp <= 0x10FFFD) {
    }
    */
  }
  // pattern = new RegExp('^' + khextemp + ';([^;]*);', 'm');
  // file = 'UnicodeData.txt';

  let search = false;
  let cjkText;

  if (kdectemp >= 0x3400 && kdectemp <= 0x4DB5) {
    search = '3400';
    if (kdectemp !== 0x3400 && kdectemp !== 0x4DB5) {
      cjkText = _('CJK_Ideograph_Extension_A');
    } else if (kdectemp === 0x4DB5) {
      search = '4DB5';
    }
  } else if (kdectemp >= 0x4E00 && kdectemp <= 0x9FC3) {
    search = '4E00';
    if (kdectemp !== 0x4E00 && kdectemp !== 0x9FC3) {
      cjkText = _('CJK_Ideograph');
    } else if (kdectemp === 0x9FC3) {
      search = '9FC3';
    }
  } else if (
    kdectemp >= 0xF900 && kdectemp < 0xFB00
  ) { // Should have individual code point
    search = true;
  } else if (kdectemp >= 0x20000 && kdectemp <= 0x2A6D6) {
    search = '20000';
    if (kdectemp !== 0x20000 && kdectemp !== 0x2A6D6) {
      cjkText = _('CJK_Ideograph_Extension_B');
    } else if (kdectemp === 0x2A6D6) {
      search = '2A6D6';
    }
  } else if (
    kdectemp >= 0x2F800 && kdectemp < 0x2FA1F
  ) { // Should have individual code point
    search = true;
  } else if (hangul) {
    // search = 'AC00';
    // if (kdectemp != 0xAC00 && kdectemp != 0xD7A3) {
    cjkText = _('Hangul_Syllable');
    cjkText += ' ';

    cjkText += getHangulName(kdectemp);
    /* }
    else if (kdectemp == 0xD7A3) {
      search = 'D7A3';
    } */
  }
  let searchValue;
  if (search) {
    if (search === true) {
      search = khextemp;
    }
    searchValue = search;
  } else {
    searchValue = khextemp;
  }

  return {unihanType, hangul, cjkText, searchValue};
}

export {getCJKTypeFromHexString};
