var EXPORTED_SYMBOLS = [
    'composeHangul',
    'decomposeHangul',
    'getHangulFromName',
    'getHangulName',
    'getJamoForIndex'
];

// Function can also be used standalone
/**
* @namespace This contains methods for translating Korean Hangul/Jamo, since these
*                              are obtained programmatically and not through the Unicode (or Unihan) database
*/

// Private static
var JAMO_L_TABLE = [
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
var sBase = 0xAC00,
    lBase = 0x1100,
    vBase = 0x1161,
    tBase = 0x11A7,
    sCount = 11172,
    lCount = 19, // Not in use for decomposition
    vCount = 21,
    tCount = 28,
    nCount = vCount * tCount;

// We need to fix JavaScript's fromCharCode which does not support non-BMP characters
function _fixedFromCharCode (codePt) {
    if (codePt > 0xFFFF) {
        codePt -= 0x10000;
        return String.fromCharCode(0xD800 + (codePt >> 10), 0xDC00 + (codePt & 0x3FF));
    }
    else {
        return String.fromCharCode(codePt);
    }
}
function _fixedCharCodeAt (str, idx) {
    idx = idx || 0;
    var code = str.charCodeAt(idx);
    var hi, low;
    if (0xD800 <= code && code <= 0xDBFF) { // High surrogate (could change last hex to 0xDB7F to treat high private surrogates as single characters)
        hi = code;
        low = str.charCodeAt(idx+1);
        return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
    }
    if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate
        hi = str.charCodeAt(idx-1);
        low = code;
        return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
    }
    return code;
}

function _getWholeCharAndIncrement (str, i) {
    var code = str.charCodeAt(i);
    if (0xD800 <= code && code <= 0xDBFF) { // High surrogate (could change last hex to 0xDB7F to treat high private surrogates as single characters)
        if (str.length <= (i+1))  {
            throw 'High surrogate without following low surrogate';
        }
        var next = str.charCodeAt(i+1);
        if (0xDC00 > next || next > 0xDFFF) {
            throw 'High surrogate without following low surrogate';
        }
        return [i+1, str.charAt(i)+str.charAt(i+1)];
    }
    else if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate
        if (i === 0) {
            throw 'Low surrogate without preceding high surrogate';
        }
        var prev = str.charCodeAt(i-1);
        if (0xD800 > prev || prev > 0xDBFF) { // (could change last hex to 0xDB7F to treat high private surrogates as single characters)
            throw 'Low surrogate without preceding high surrogate';
        }
        return false; // We can pass over low surrogates now as the second component in a pair which we have already processed
    }
    return [i, str.charAt(i)];
}


/**
 * Break up a Hangul syllable into its Jamo components
 * @param {Number} syllableCode Decimal code point for Hangul syllable to decompose
 * @returns {Number[|String]} An array of the numeric value of each component or string if unchanged
 */
function decomposeHangul (syllableCode) {
    var sIndex = syllableCode - sBase;
    if (sIndex < 0 || sIndex >= sCount) {
        return _fixedFromCharCode(syllableCode); // Return as single-item array instead or change "result" to String?
    }
    var result = [];
    var l = lBase + Math.floor(sIndex / nCount);
    var v = vBase + Math.floor((sIndex % nCount) / tCount);
    var t = tBase + sIndex % tCount;
    result.push(_fixedFromCharCode(l), _fixedFromCharCode(v));
    if (t != tBase) {result.push(_fixedFromCharCode(t));}
    return result;
}
/**
 *
 * @param {String[]} source
 */
function composeHangul (source) {
    var len = source.length;
    if (len === 0) {return '';}
    var result = [];

    var start = 0;
    var startLast = _getWholeCharAndIncrement(source, start);
    start = startLast[0];
    var last = startLast[1];

    // copy first char
    result.push(last);

    for (var i = start+1; i < len; ++i) {
        var iCh = _getWholeCharAndIncrement(source, i);
        i = iCh[0];
        var ch = iCh[1];

        // 1. check to see if two current characters are L and V
        var lIndex = _fixedCharCodeAt(last) - lBase;
        if (0 <= lIndex && lIndex < lCount) {
            var vIndex = _fixedCharCodeAt(ch) - vBase;
            if (0 <= vIndex && vIndex < vCount) {
                // make syllable of form LV
                last = _fixedFromCharCode(sBase + (lIndex * vCount + vIndex) * tCount);
                result[result.length-1] = last; // reset last
                continue; // discard ch
            }
        }

        // 2. check to see if two current characters are LV and T
        var sIndex = _fixedCharCodeAt(last) - sBase;
        if (0 <= sIndex && sIndex < sCount && (sIndex % tCount) === 0) {
            var tIndex = _fixedCharCodeAt(ch) - tBase;
            if (0 < tIndex && tIndex < tCount) {
                // make syllable of form LVT
                last = _fixedFromCharCode(_fixedCharCodeAt(last) + tIndex);
                result[result.length-1] = last; // reset last
                continue; // discard ch
            }
        }
        // if neither case was true, just add the character
        last = ch;
        result.push(ch);
    }
    return result;
}

/**
 * Gets a Unicode character for the passed-in Hangul syllable name
 * @param {String} name The name of the syllable to find
 * @author Brett Zamir (others adapted directly from Unicode)
 * @returns {String|Boolean} False if invalid, or otherwise the Hangul character represented by
 *                                                      the supplied name
 */
function getHangulFromName (name) {

    // Turn indices into individual Jamo characters
    var l, v, t, lIndex, vIndex, tIndex;
    var ptr = 1;

    // L (can be 1-2 in name length)
    if (name.charAt(0) === name.charAt(1)) { // All two-letter names are doubles
        lIndex = JAMO_L_TABLE.indexOf(name.substr(0, 2));
        ptr++;
    }
    else {
        lIndex = JAMO_L_TABLE.indexOf(name.substr(0, 1));
    }

    // V (can be 1-3 in name length)
    vIndex = JAMO_V_TABLE.indexOf(name.substr(ptr, 3));
    if (vIndex !== -1) {
        ptr += 3;
    }
    else {
        vIndex = JAMO_V_TABLE.indexOf(name.substr(ptr, 2));
        if (vIndex !== -1) {
            ptr += 2;
        }
        else {
            vIndex = JAMO_V_TABLE.indexOf(name.substr(ptr, 1));
            ptr += 1;
        }
    }

    // T (can be 1-2 in name length)
    tIndex = JAMO_T_TABLE.indexOf(name.substr(ptr, 2));
    if (tIndex !== -1) {
        ptr += 2;
    }
    else {
        tIndex = JAMO_T_TABLE.indexOf(name.substr(ptr, 1));
        ptr += 1;
    }
    if (lIndex === -1 || vIndex === -1 || (tIndex && ptr < name.length)) { // If an invalid Hangul syllable name was passed in
        return false;
    }

    l = getJamoForIndex(lIndex, 'l');
    v = getJamoForIndex(vIndex, 'v');

    // May only be LV (?)
    t = '';
    if (tIndex) {
        t = getJamoForIndex(tIndex, 't');
    }

    // Join Jamo characters together
    var jamo = l+v+t;
    // Convert Jamo into composite Hangul syllable
    return composeHangul(jamo).join('');
}

/**
 * Utility (could be adapted to accept the letter(s))
 * @param {String} index
 * @param {'l'|'v'|'t'} type
 */
function getJamoForIndex (index, type) {
    switch(type) {
        case 'l':
            return String.fromCharCode(lBase+index);
        case 'v':
            return String.fromCharCode(vBase+index);
        case 't':
            return String.fromCharCode(tBase+index);
        default:
            throw 'Unexpected type passed to getJamoCodePointForName';
    }
}

function getHangulName (syllableCode) {
    // Adapted from Hangul Character Names: http://unicode.org/reports/tr15/#Hangul

    // Following numbered items, with minor changes are from http://www.unicode.org/versions/Unicode5.0.0/ch03.pdf
    // 1. Compute the index of the syllable:
    // SIndex = S - SBase
    var sIndex = syllableCode - sBase;
    // 2. If SIndex is in the range (0 ? SIndex < SCount), then compute the components as follows:
    // The operators “/” and “%” are as defined in Table A-3 in Appendix A, Notational Conventions.
    if (sIndex < 0 && sIndex >= sCount) {
        throw new Error('Not a hangul syllable '+syllableCode);
    }
    /*
    var l = lBase + Math.floor(sIndex / nCount);
    var v = vBase + Math.floor((sIndex % nCount) / tCount);
    var t = tBase + sIndex % tCount;
    */
    var l = Math.floor(sIndex / nCount);
    var v = Math.floor((sIndex % nCount) / tCount);
    var t = sIndex % tCount;
    return  JAMO_L_TABLE[l] + JAMO_V_TABLE[v] + JAMO_T_TABLE[t];

    // 3. If T = TBase, then there is no trailing character, so replace S by the sequence
    // L V. Otherwise, there is a trailing character, so replace S by the sequence L V T.
    // Example. Compute the components:
    // L = LBase + 17
    // V = VBase + 16
    // T = TBase + 15
    // and replace the syllable by the sequence of components:
    // 0xD4DB => 0x1111, 0x1171, 0x11B6
    /*
    var arr = [l, v];
    if (t !== tBase) {
        arr.push(t);
    }
    // The character names for Hangul syllables are derived from the decomposition by starting
    // with the string hangul syllable, and appending the short name of each decomposition
    // component in order.
    for (var c=0; c < arr.length; c++) {
        var jamoComponent = getJamo(arr[c]);
        cjkText += jamoComponent;
    }
    */
}
