// Function can also be used standalone
/**
* @namespace This contains methods for translating Korean Hangul/Jamo, since these
*  are obtained programmatically and not through the Unicode (or Unihan) database
*/

// Private static
const JAMO_L_TABLE = [
        'G', 'GG', 'N', 'D', 'DD', 'R', 'M', 'B', 'BB',
        'S', 'SS', '', 'J', 'JJ', 'C', 'K', 'T', 'P', 'H'
    ],
    JAMO_V_TABLE = [
        'A', 'AE', 'YA', 'YAE', 'EO', 'E', 'YEO', 'YE', 'O',
        'WA', 'WAE', 'OE', 'YO', 'U', 'WEO', 'WE', 'WI',
        'YU', 'EU', 'YI', 'I'
    ],
    JAMO_T_TABLE = [
        '', 'G', 'GG', 'GS', 'N', 'NJ', 'NH', 'D', 'L', 'LG', 'LM',
        'LB', 'LS', 'LT', 'LP', 'LH', 'M', 'B', 'BS',
        'S', 'SS', 'NG', 'J', 'C', 'K', 'T', 'P', 'H'
    ];
const sBase = 0xAC00,
    lBase = 0x1100,
    vBase = 0x1161,
    tBase = 0x11A7,
    sCount = 11172,
    lCount = 19, // Not in use for decomposition
    vCount = 21,
    tCount = 28,
    nCount = vCount * tCount;

/**
 * Break up a Hangul syllable into its Jamo components
 * @param {Number} syllableCode Decimal code point for Hangul syllable to decompose
 * @returns {Number[|String]} An array of the numeric value of each component or string if unchanged
 */
export function decomposeHangul (syllableCode) {
    const sIndex = syllableCode - sBase;
    if (sIndex < 0 || sIndex >= sCount) {
        return String.fromCodePoint(syllableCode); // Return as single-item array instead or change "result" to String?
    }
    const result = [];
    const l = lBase + Math.floor(sIndex / nCount);
    const v = vBase + Math.floor((sIndex % nCount) / tCount);
    const t = tBase + sIndex % tCount;
    result.push(String.fromCodePoint(l), String.fromCodePoint(v));
    if (t !== tBase) { result.push(String.fromCodePoint(t)); }
    return result;
}
/**
 *
 * @param {String[]} source
 */
export function composeHangul (source) {
    const len = source.length;
    if (len === 0) { return ''; }
    const result = [];
    const chars = [...source];

    let last = chars[0];

    // copy first char
    result.push(last);

    chars.slice(1).forEach((ch) => {
        // 1. check to see if two current characters are L and V
        const lIndex = last.codePointAt() - lBase;
        if (lIndex > 0 && lIndex < lCount) {
            const vIndex = ch.codePointAt() - vBase;
            if (vIndex > 0 && vIndex < vCount) {
                // make syllable of form LV
                last = String.fromCodePoint(sBase + (lIndex * vCount + vIndex) * tCount);
                result[result.length - 1] = last; // reset last
                return; // discard ch
            }
        }

        // 2. check to see if two current characters are LV and T
        const sIndex = last.codePointAt() - sBase;
        if (sIndex > 0 && sIndex < sCount && (sIndex % tCount) === 0) {
            const tIndex = ch.codePointAt() - tBase;
            if (tIndex >= 0 && tIndex < tCount) {
                // make syllable of form LVT
                last = String.fromCodePoint(last.codePointAt() + tIndex);
                result[result.length - 1] = last; // reset last
                return; // discard ch
            }
        }
        // if neither case was true, just add the character
        last = ch;
        result.push(ch);
    });
    return result;
}

/**
 * Gets a Unicode character for the passed-in Hangul syllable name
 * @param {String} name The name of the syllable to find
 * @author Brett Zamir (others adapted directly from Unicode)
 * @returns {String|Boolean} False if invalid, or otherwise the Hangul character represented by
 *                                                      the supplied name
 */
export function getHangulFromName (name) {
    // Turn indices into individual Jamo characters
    let t, lIndex, vIndex, tIndex;
    let ptr = 1;

    // L (can be 1-2 in name length)
    if (name.charAt(0) === name.charAt(1)) { // All two-letter names are doubles
        lIndex = JAMO_L_TABLE.indexOf(name.substr(0, 2));
        ptr++;
    } else {
        lIndex = JAMO_L_TABLE.indexOf(name.substr(0, 1));
    }

    // V (can be 1-3 in name length)
    vIndex = JAMO_V_TABLE.indexOf(name.substr(ptr, 3));
    if (vIndex !== -1) {
        ptr += 3;
    } else {
        vIndex = JAMO_V_TABLE.indexOf(name.substr(ptr, 2));
        if (vIndex !== -1) {
            ptr += 2;
        } else {
            vIndex = JAMO_V_TABLE.indexOf(name.substr(ptr, 1));
            ptr += 1;
        }
    }

    // T (can be 1-2 in name length)
    tIndex = JAMO_T_TABLE.indexOf(name.substr(ptr, 2));
    if (tIndex !== -1) {
        ptr += 2;
    } else {
        tIndex = JAMO_T_TABLE.indexOf(name.substr(ptr, 1));
        ptr += 1;
    }
    if (lIndex === -1 || vIndex === -1 || (tIndex && ptr < name.length)) { // If an invalid Hangul syllable name was passed in
        return false;
    }

    const l = getJamoForIndex(lIndex, 'l');
    const v = getJamoForIndex(vIndex, 'v');

    // May only be LV (?)
    t = '';
    if (tIndex) {
        t = getJamoForIndex(tIndex, 't');
    }

    // Join Jamo characters together
    const jamo = l + v + t;
    // Convert Jamo into composite Hangul syllable
    return composeHangul(jamo).join('');
}

/**
 * Utility (could be adapted to accept the letter(s))
 * @param {String} index
 * @param {'l'|'v'|'t'} type
 */
export function getJamoForIndex (index, type) {
    switch (type) {
    case 'l':
        return String.fromCharCode(lBase + index);
    case 'v':
        return String.fromCharCode(vBase + index);
    case 't':
        return String.fromCharCode(tBase + index);
    default:
        throw new TypeError('Unexpected type passed to getJamoCodePointForName');
    }
}

export function getHangulName (syllableCode) {
    // Adapted from Hangul Character Names: http://unicode.org/reports/tr15/#Hangul

    // Following numbered items, with minor changes are from http://www.unicode.org/versions/Unicode5.0.0/ch03.pdf
    // 1. Compute the index of the syllable:
    // SIndex = S - SBase
    const sIndex = syllableCode - sBase;
    // 2. If SIndex is in the range (0 ? SIndex < SCount), then compute the components as follows:
    // The operators �/� and �%� are as defined in Table A-3 in Appendix A, Notational Conventions.
    if (sIndex < 0 && sIndex >= sCount) {
        throw new Error('Not a hangul syllable ' + syllableCode);
    }
    /*
    const l = lBase + Math.floor(sIndex / nCount);
    const v = vBase + Math.floor((sIndex % nCount) / tCount);
    const t = tBase + sIndex % tCount;
    */
    const l = Math.floor(sIndex / nCount);
    const v = Math.floor((sIndex % nCount) / tCount);
    const t = sIndex % tCount;
    return JAMO_L_TABLE[l] + JAMO_V_TABLE[v] + JAMO_T_TABLE[t];

    // 3. If T = TBase, then there is no trailing character, so replace S by the sequence
    // L V. Otherwise, there is a trailing character, so replace S by the sequence L V T.
    // Example. Compute the components:
    // L = LBase + 17
    // V = VBase + 16
    // T = TBase + 15
    // and replace the syllable by the sequence of components:
    // 0xD4DB => 0x1111, 0x1171, 0x11B6
    /*
    const arr = [l, v];
    if (t !== tBase) {
        arr.push(t);
    }
    // The character names for Hangul syllables are derived from the decomposition by starting
    // with the string hangul syllable, and appending the short name of each decomposition
    // component in order.
    for (let c = 0; c < arr.length; c++) {
        const jamoComponent = getJamo(arr[c]);
        cjkText += jamoComponent;
    }
    */
}
