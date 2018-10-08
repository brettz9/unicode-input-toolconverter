// Todo: Better i18n (put commas inside formatting string)

export const CharrefunicodeConsts = {
    // If one ever changes this array, one will cause problems for the script, as it is expected to find "apos" in position 98--adjusted for any additions to the front by the user DTD (and the next array also corresponds to this one; if ever change this array (besides adding to the end of it), will need to change the "98" references above as well as adjust the charrefs array to match the correspondence with this one
    /* eslint-disable comma-spacing */
    ents: ['nbsp','iexcl','cent','pound','curren','yen','brvbar','sect','uml','copy','ordf','laquo','not','shy','reg','macr','deg','plusmn','sup2','sup3','acute','micro','para','middot','cedil','sup1','ordm','raquo','frac14','frac12','frac34','iquest','Agrave','Aacute','Acirc','Atilde','Auml','Aring','AElig','Ccedil','Egrave','Eacute','Ecirc','Euml','Igrave','Iacute','Icirc','Iuml','ETH','Ntilde','Ograve','Oacute','Ocirc','Otilde','Ouml','times','Oslash','Ugrave','Uacute','Ucirc','Uuml','Yacute','THORN','szlig','agrave','aacute','acirc','atilde','auml','aring','aelig','ccedil','egrave','eacute','ecirc','euml','igrave','iacute','icirc','iuml','eth','ntilde','ograve','oacute','ocirc','otilde','ouml','divide','oslash','ugrave','uacute','ucirc','uuml','yacute','thorn','yuml','quot','gt','apos','amp','lt','OElig','oelig','Scaron','scaron','Yuml','circ','tilde','ensp','emsp','thinsp','zwnj','zwj','lrm','rlm','ndash','mdash','lsquo','rsquo','sbquo','ldquo','rdquo','bdquo','dagger','Dagger','permil','lsaquo','rsaquo','euro','fnof','Alpha','Beta','Gamma','Delta','Epsilon','Zeta','Eta','Theta','Iota','Kappa','Lambda','Mu','Nu','Xi','Omicron','Pi','Rho','Sigma','Tau','Upsilon','Phi','Chi','Psi','Omega','alpha','beta','gamma','delta','epsilon','zeta','eta','theta','iota','kappa','lambda','mu','nu','xi','omicron','pi','rho','sigmaf','sigma','tau','upsilon','phi','chi','psi','omega','thetasym','upsih','piv','bull','hellip','prime','Prime','oline','frasl','weierp','image','real','trade','alefsym','larr','uarr','rarr','darr','harr','crarr','lArr','uArr','rArr','dArr','hArr','forall','part','exist','empty','nabla','isin','notin','ni','prod','sum','minus','lowast','radic','prop','infin','ang','and','or','cap','cup','int','there4','sim','cong','asymp','ne','equiv','le','ge','sub','sup','nsub','sube','supe','oplus','otimes','perp','sdot','lceil','rceil','lfloor','rfloor','lang','rang','loz','spades','clubs','hearts','diams'],
    charrefs: [160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,34,62,39,38,60,338,339,352,353,376,710,732,8194,8195,8201,8204,8205,8206,8207,8211,8212,8216,8217,8218,8220,8221,8222,8224,8225,8240,8249,8250,8364,402,913,914,915,916,917,918,919,920,921,922,923,924,925,926,927,928,929,931,932,933,934,935,936,937,945,946,947,948,949,950,951,952,953,954,955,956,957,958,959,960,961,962,963,964,965,966,967,968,969,977,978,982,8226,8230,8242,8243,8254,8260,8472,8465,8476,8482,8501,8592,8593,8594,8595,8596,8629,8656,8657,8658,8659,8660,8704,8706,8707,8709,8711,8712,8713,8715,8719,8721,8722,8727,8730,8733,8734,8736,8743,8744,8745,8746,8747,8756,8764,8773,8776,8800,8801,8804,8805,8834,8835,8836,8838,8839,8853,8855,8869,8901,8968,8969,8970,8971,9001,9002,9674,9824,9827,9829,9830]
    /* eslint-enable comma-spacing */
};

class UnicodeDBUtil {
    constructor ({charrefunicodeDb}) {
        this.charrefunicodeDb = charrefunicodeDb;
    }
}
// Todo: Reimplement
export class Jamo extends UnicodeDBUtil {
    getJamo (code) { // expects decimal string or number
        const codePt = typeof code === 'number' ? Math.round(code).toString(16) : code;
        try {
            const stmt = this.charrefunicodeDb.dbJamo.createStatement(
                'SELECT `jamo_short_name` FROM Jamo WHERE `code_pt` = "' + codePt.toUpperCase() + '"'
            );
            stmt.executeStep();
            return stmt.getUTF8String(0);
        } catch (e) {
            throw new Error(codePt.toUpperCase() + e);
        }
    }
}
export function getAndSetCodePointInfo (num, alink, _) {
    let tn, privateuse = false, surrogate = false;
    let plane = num >= 0x10000 && num <= 0x1FFFF ? 1 : 0;

    alink.target = '_blank';
    alink.className = 'text-link';
    alink.href = 'http://www.unicode.org/charts/PDF/U';

    if (num < 0x0080) {
        alink.href += '0000';
        tn = _('Basic_Latin') + _('comma') + ' ' +
            _('Controls-_C0') + _('comma') + ' ' +
            _('ASCII_Punctuation') + _('comma') + ' ' +
            _('ASCII_Digits') + _('comma') + ' ' +
            _('Dollar_Sign');
    // Could just replace with formal name of the category, "Latin" (as did below in other cases)
    } else if (num < 0x0100) {
        alink.href += '0080'; tn = _('Latin-1_Supplement') + _('comma') + ' ' + _('Latin-1_Punctuation') + _('comma') + ' ' + _('Controls-_C1') + _('comma') + ' ' + _('Yen-_Pound_and_Cent');
    } else if (num < 0x0180) {
        alink.href += '0100'; tn = _('Latin_Extended_A');
    } else if (num < 0x0250) {
        alink.href += '0180'; tn = _('Latin_Extended_B');
    } else if (num < 0x02B0) {
        alink.href += '0250'; tn = _('IPA_Extensions');
    } else if (num < 0x0300) {
        alink.href += '02B0'; tn = _('Spacing_Modifier_Letters');
    } else if (num < 0x0370) {
        alink.href += '0300'; tn = _('Combining_Diacritical_Marks');
    } else if (num < 0x0400) {
        alink.href += '0370'; tn = _('Greek') + _('comma') + ' ' + _('Coptic_in_Greek_block');
    } else if (num < 0x0500) {
        alink.href += '0400'; tn = _('Cyrillic');
    } else if (num < 0x0530) {
        alink.href += '0500'; tn = _('Cyrillic_Supplement');
    } else if (num < 0x0590) {
        alink.href += '0530'; tn = _('Armenian');
    } else if (num < 0x0600) {
        alink.href += '0590'; tn = _('Hebrew');
    } else if (num < 0x0700) {
        alink.href += '0600'; tn = _('Arabic');
    } else if (num < 0x0750) {
        alink.href += '0700'; tn = _('Syriac');
    } else if (num < 0x0780) {
        alink.href += '0750'; tn = _('Arabic_Supplement');
    } else if (num < 0x07C0) {
        alink.href += '0780'; tn = _('Thaana');
    } else if (num < 0x0800) {
        alink.href += '07C0'; tn = _('N_Ko');
    } else if (num < 0x0840) {
        alink.href += '0800'; tn = _('Samaritan');
    } else if (num < 0x0900) {
        alink.href += '0840'; tn = _('Mandaic');
    } else if (num < 0x0980) {
        alink.href += '0900'; tn = _('Devanagari');
    } else if (num < 0x0A00) {
        alink.href += '0980'; tn = _('Bengali');
    } else if (num < 0x0A80) {
        alink.href += '0A00'; tn = _('Gurmukhi');
    } else if (num < 0x0B00) {
        alink.href += '0A80'; tn = _('Gujarati');
    } else if (num < 0x0B80) {
        alink.href += '0B00'; tn = _('Oriya');
    } else if (num < 0x0C00) {
        alink.href += '0B80'; tn = _('Tamil');
    } else if (num < 0x0C80) {
        alink.href += '0C00'; tn = _('Telugu');
    } else if (num < 0x0D00) {
        alink.href += '0C80'; tn = _('Kannada');
    } else if (num < 0x0D80) {
        alink.href += '0D00'; tn = _('Malayalam');
    } else if (num < 0x0E00) {
        alink.href += '0D80'; tn = _('Sinhala');
    } else if (num < 0x0E80) {
        alink.href += '0E00'; tn = _('Thai');
    } else if (num < 0x0F00) {
        alink.href += '0E80'; tn = _('Lao');
    } else if (num < 0x1000) {
        alink.href += '0F00'; tn = _('Tibetan');
    } else if (num < 0x10A0) {
        alink.href += '1000'; tn = _('Myanmar');
    } else if (num < 0x1100) {
        alink.href += '10A0'; tn = _('Georgian');
    } else if (num < 0x1200) {
        alink.href += '1100'; tn = _('Hangul_Jamo');
    } else if (num < 0x1380) {
        alink.href += '1200'; tn = _('Ethiopic');
    } else if (num < 0x13A0) {
        alink.href += '1380'; tn = _('Ethiopic_Supplement');
    } else if (num < 0x1400) {
        alink.href += '13A0'; tn = _('Cherokee');
    } else if (num < 0x1680) {
        alink.href += '1400'; tn = _('Unified_Canadian_Aboriginal_Syllabics');
    } else if (num < 0x16A0) {
        alink.href += '1680'; tn = _('Ogham');
    } else if (num < 0x1700) {
        alink.href += '16A0'; tn = _('Runic');
    } else if (num < 0x1720) {
        alink.href += '1700'; tn = _('Tagalog');
    } else if (num < 0x1740) {
        alink.href += '1720'; tn = _('Hanunoo');
    } else if (num < 0x1760) {
        alink.href += '1740'; tn = _('Buhid');
    } else if (num < 0x1780) {
        alink.href += '1760'; tn = _('Tagbanwa');
    } else if (num < 0x1800) {
        alink.href += '1780'; tn = _('Khmer');
    } else if (num < 0x18B0) {
        alink.href += '1800'; tn = _('Mongolian');
    } else if (num < 0x1900) {
        alink.href += '18B0'; tn = _('UCAS_Extended');
    } else if (num < 0x1950) {
        alink.href += '1900'; tn = _('Limbu');
    } else if (num < 0x1980) {
        alink.href += '1950'; tn = _('Tai_Le');
    } else if (num < 0x19E0) {
        alink.href += '1980'; tn = _('New_Tai_Lue');
    } else if (num < 0x1A00) {
        alink.href += '19E0'; tn = _('Khmer_Symbols');
    } else if (num < 0x1A20) {
        alink.href += '1A00'; tn = _('Buginese');
    } else if (num < 0x1B00) {
        alink.href += '1A20'; tn = _('Tai_Tham');
    } else if (num < 0x1B80) {
        alink.href += '1B00'; tn = _('Balinese');
    } else if (num < 0x1BC0) {
        alink.href += '1B80'; tn = _('Sundanese');
    } else if (num < 0x1C00) {
        alink.href += '1BC0'; tn = _('Batak');
    } else if (num < 0x1C50) {
        alink.href += '1C00'; tn = _('Lepcha');
    } else if (num < 0x1CD0) {
        alink.href += '1C50'; tn = _('Ol_Chiki');
    } else if (num < 0x1D00) {
        alink.href += '1CD0'; tn = _('Vedic_Extensions');
    } else if (num < 0x1D80) {
        alink.href += '1D00'; tn = _('Phonetic_Extensions');
    } else if (num < 0x1DC0) {
        alink.href += '1D80'; tn = _('Phonetic_Extensions_Supplement');
    } else if (num < 0x1E00) {
        alink.href += '1DC0'; tn = _('Combining_Diacritical_Marks_Supplement');
    } else if (num < 0x1F00) {
        alink.href += '1E00'; tn = _('Latin_Extended_Additional');
    } else if (num < 0x2000) {
        alink.href += '1F00'; tn = _('Greek_Extended');
    } else if (num < 0x2070) {
        alink.href += '2000'; tn = _('General_Punctuation') + _('comma') + ' ' + _('Layout_Controls') + _('comma') + ' ' + _('Invisible_Operators');
    } else if (num < 0x20A0) {
        alink.href += '2070'; tn = _('Super_and_Subscripts');
    } else if (num < 0x20D0) {
        alink.href += '20A0'; tn = _('Currency_Symbols') + _('comma') + ' ' + _('Euro_Sign') + _('comma') + ' ' + _('Pfennig_-historic--');
    } else if (num < 0x2100) {
        alink.href += '20D0'; tn = _('Combining_Diacritical_Marks_for_Symbols');
    } else if (num < 0x2150) {
        alink.href += '2100'; tn = _('Letterlike_Symbols') + _('comma') + ' ' + _('Mark_-historic--');
    } else if (num < 0x2190) {
        alink.href += '2150'; tn = _('Number_Forms');
    } else if (num < 0x2200) {
        alink.href += '2190'; tn = _('Arrows');
    } else if (num < 0x2300) {
        alink.href += '2200'; tn = _('Mathematical_Operators');
    } else if (num < 0x2400) {
        alink.href += '2300'; tn = _('Miscellaneous_Technical');
    } else if (num < 0x2440) {
        alink.href += '2400'; tn = _('Control_Pictures');
    } else if (num < 0x2460) {
        alink.href += '2440'; tn = _('OCR');
    } else if (num < 0x2500) {
        alink.href += '2460'; tn = _('Enclosed_Alphanumerics');
    } else if (num < 0x2580) {
        alink.href += '2500'; tn = _('Box_Drawing');
    } else if (num < 0x25A0) {
        alink.href += '2580'; tn = _('Block_Elements');
    } else if (num < 0x2600) {
        alink.href += '25A0'; tn = _('Geometric_Shapes');
    } else if (num < 0x2700) {
        alink.href += '2600'; tn = _('Miscellaneous_Symbols');
    } else if (num < 0x27C0) {
        alink.href += '2700'; tn = _('Dingbats');
    } else if (num < 0x27F0) {
        alink.href += '27C0'; tn = _('Misc._Math_Symbols_A');
    } else if (num < 0x2800) {
        alink.href += '27F0'; tn = _('Supplemental_Arrows_A');
    } else if (num < 0x2900) {
        alink.href += '2800'; tn = _('Braille_Patterns');
    } else if (num < 0x2980) {
        alink.href += '2900'; tn = _('Supplemental_Arrows_B');
    } else if (num < 0x2A00) {
        alink.href += '2980'; tn = _('Misc._Math_Symbols_B');
    } else if (num < 0x2B00) {
        alink.href += '2A00'; tn = _('Suppl._Math_Operators');
    } else if (num < 0x2C00) {
        alink.href += '2B00'; tn = _('Misc._Symbols_and_Arrows');
    } else if (num < 0x2C60) {
        alink.href += '2C00'; tn = _('Glagolitic');
    } else if (num < 0x2C80) {
        alink.href += '2C60'; tn = _('Latin_Extended_C');
    } else if (num < 0x2D00) {
        alink.href += '2C80'; tn = _('Coptic');
    } else if (num < 0x2D30) {
        alink.href += '2D00'; tn = _('Georgian_Supplement');
    } else if (num < 0x2D80) {
        alink.href += '2D30'; tn = _('Tifinagh');
    } else if (num < 0x2DE0) {
        alink.href += '2D80'; tn = _('Ethiopic_Extended');
    } else if (num < 0x2E00) {
        alink.href += '2DE0'; tn = _('Cyrillic_Extended-A');
    } else if (num < 0x2E80) {
        alink.href += '2E00'; tn = _('Supplemental_Punctuation');
    } else if (num < 0x2F00) {
        alink.href += '2E80'; tn = _('CJK_Radicals_Supplement');
    } else if (num < 0x2FF0) {
        alink.href += '2F00'; tn = _('CJK_Radicals_-_KangXi_Radicals');
    } else if (num < 0x3000) {
        alink.href += '2FF0'; tn = _('Ideographic_Description_Characters');
    } else if (num < 0x3040) {
        alink.href += '3000'; tn = _('CJK_Symbols_and_Punctuation');
    } else if (num < 0x30A0) {
        alink.href += '3040'; tn = _('Hiragana');
    } else if (num < 0x3100) {
        alink.href += '30A0'; tn = _('Katakana');
    } else if (num < 0x3130) {
        alink.href += '3100'; tn = _('Bopomofo');
    } else if (num < 0x3190) {
        alink.href += '3130'; tn = _('Hangul_Compatibility_Jamo');
    } else if (num < 0x31A0) {
        alink.href += '3190'; tn = _('Kanbun');
    } else if (num < 0x31C0) {
        alink.href += '31A0'; tn = _('Bopomofo_Extended');
    } else if (num < 0x31F0) {
        alink.href += '31C0'; tn = _('CJK_Strokes');
    } else if (num < 0x3200) {
        alink.href += '31F0'; tn = _('Katakana_Phonetic_Ext.');
    } else if (num < 0x3300) {
        alink.href += '3200'; tn = _('Enclosed_Alphanumerics_CJK_Letters_and_Months');
    } else if (num < 0x3400) {
        alink.href += '3300'; tn = _('CJK_Compatibility');
    /* Begin CJK (1) */
    } else if (num < 0x4DC0) {
        alink.href += '3400'; tn = _('CJK_Ideographs_Ext._A');
    /* End CJK (1) */
    /* Begin Interlude between CJK */
    } else if (num < 0x4E00) {
        alink.href += '4DC0'; tn = _('Yijing_Hexagram_Symbols');
    /* End Interlude between CJK */
    /* Begin CJK (2) */
    } else if (num < 0xA000) {
        alink.href += '4E00'; tn = _('CJK_Unified_Ideographs_--Han--');
    /* End CJK (2) */
    /* Begin Interlude (2) between CJK */
    } else if (num < 0xA490) {
        alink.href += 'A000'; tn = _('Yi_Syllables');
    } else if (num < 0xA4D0) {
        alink.href += 'A490'; tn = _('Yi_Radicals');
    } else if (num < 0xA500) {
        alink.href += 'A4D0'; tn = _('Lisu');
    } else if (num < 0xA640) {
        alink.href += 'A500'; tn = _('Vai');
    } else if (num < 0xA6A0) {
        alink.href += 'A640'; tn = _('Cyrillic_Extended-B');
    } else if (num < 0xA700) {
        alink.href += 'A6A0'; tn = _('Bamum');
    } else if (num < 0xA720) {
        alink.href += 'A700'; tn = _('Modifier_Tone_Letters');
    } else if (num < 0xA800) {
        alink.href += 'A720'; tn = _('Latin_Extended_D');
    } else if (num < 0xA830) {
        alink.href += 'A800'; tn = _('Syloti_Nagri');
    } else if (num < 0xA840) {
        alink.href += 'A830'; tn = _('Common_Indic_Number_Forms');
    } else if (num < 0xA880) {
        alink.href += 'A840'; tn = _('Phags-Pa');
    } else if (num < 0xA8E0) {
        alink.href += 'A880'; tn = _('Saurashtra');
    } else if (num < 0xA900) {
        alink.href += 'A8E0'; tn = _('Devanagari_Extended');
    } else if (num < 0xA930) {
        alink.href += 'A900'; tn = _('Kayah_Li');
    } else if (num < 0xA960) {
        alink.href += 'A930'; tn = _('Rejang');
    } else if (num < 0xA980) {
        alink.href += 'A960'; tn = _('Hangul_Jamo_Extended-A');
    } else if (num < 0xAA00) {
        alink.href += 'A980'; tn = _('Javanese');
    } else if (num < 0xAA60) {
        alink.href += 'AA00'; tn = _('Cham');
    } else if (num < 0xAA80) {
        alink.href += 'AA60'; tn = _('Myanmar_Extended-A');
    } else if (num < 0xAB00) {
        alink.href += 'AA80'; tn = _('Tai_Viet');
    } else if (num < 0xABC0) {
        alink.href += 'AB00'; tn = _('Ethiopic_Extended_A');
    } else if (num < 0xAC00) {
        alink.href += 'ABC0'; tn = _('Meetei_Mayek');
    /* End Interlude (2) between CJK */
    /* Begin Hangul Syllable */
    } else if (num < 0xD7B0) {
        alink.href += 'AC00'; tn = _('Hangul_Syllables');
    /* End Hangul Syllable */
    } else if (num < 0xD800) {
        alink.href += 'D7B0'; tn = _('Hangul_Jamo_Extended-B');
    /* Begin Non Private Use High Surrogate */
    } else if (num < 0xDB80) {
        alink.href += 'D800'; tn = _('High_Surrogates'); surrogate = _('High_Surrogate');
    /* End Non Private Use High Surrogate */
    /* Begin Private Use High Surrogate */
    /* **********NOTE:  This one has no PDF   */
    } else if (num < 0xDC00) {
        alink.href += 'DB80'; tn = _('High_Private_Use_Surrogates'); surrogate = _('High_Private_Use_Surrogate');
    /* End Private Use High Surrogate */
    /* Begin Low Surrogate */
    } else if (num < 0xE000) {
        alink.href += 'DC00'; tn = _('Low_Surrogates'); surrogate = _('Low_Surrogate');
    /* End Low Surrogate */
    /* Begin Private Use */
    } else if (num < 0xF900) {
        alink.href += 'E000'; tn = _('Private_Use_Area'); privateuse = true;
    /* End Private Use */
    } else if (num < 0xFB00) {
        alink.href += 'F900'; tn = _('CJK_Compatibility_Ideographs');
    // else if (num < 0xFB50) { alink.href += 'FB00'; tn = _('Latin_Ligatures') + _('comma') + ' ' + _('Armenian_Ligatures') + _('comma') + ' ' + _('Hebrew_Presentation_Forms');
    } else if (num < 0xFB50) {
        alink.href += 'FB00'; tn = _('Alphabetic_Presentation_Forms');
    } else if (num < 0xFE00) {
        alink.href += 'FB50'; tn = _('Arabic_Presentation_Forms_A') + _('comma') + ' ' + _('Rial_Sign') + _('comma') + ' ' + _('Reserved_range');
    } else if (num < 0xFE10) {
        alink.href += 'FE00'; tn = _('Variation_Selectors');
    } else if (num < 0xFE20) {
        alink.href += 'FE10'; tn = _('Vertical_Forms');
    } else if (num < 0xFE30) {
        alink.href += 'FE20'; tn = _('Combining_Half_Marks');
    } else if (num < 0xFE50) {
        alink.href += 'FE30'; tn = _('CJK_Compatibility_Forms');
    } else if (num < 0xFE70) {
        alink.href += 'FE50'; tn = _('Small_Form_Variants');
    } else if (num < 0xFF00) {
        alink.href += 'FE70'; tn = _('Arabic_Presentation_Forms_B');
    // else if (num < 0xFFF0) { alink.href += 'FF00'; tn = _('Fullwidth_ASCII_Punctuation') + _('comma') + ' ' + _('Fullwidth_ASCII_Digits') + _('comma') + ' ' + _('Fullwidth_Currency_Symbols') + _('comma') + ' ' + _('Fullwidth_Latin_Letters') + _('comma') + ' ' + _('Halfwidth_Katakana') + _('comma') + ' ' + _('Halfwidth_Jamo'); }
    } else if (num < 0xFFF0) {
        alink.href += 'FF00'; tn = _('Halfwidth_and_Fullwidth_Forms');
    /*
    // If reenabling, should do more complete i18n (e.g., put comma inside string)
    } else if (num < 0xFFF0) {
        alink.href += 'FF00';
        tn = _('Fullwidth', {
            asciiPunctuation: _('ASCII_Punctuation_(Fullwidth)'),
            asciiDigits: _('ASCII_Digits_(Fullwidth)'),
            currencySymbols: _('Currency_Symbols_(Fullwidth)'),
            latinLetters: _('Latin_Letters_(Fullwidth)')
        }) + _('comma') + ' ' + _('Halfwidth', {
            katakana: _('Katakana_(Halfwidth)'),
            jamo: _('Jamo_(Halfwidth)')
        });
    */
    } else if (num < 0x10000) {
        alink.href += 'FFF0'; tn = _('Specials') + _('comma') + ' ' + _('At_End_of_BMP');
    } else if (num < 0x10080) {
        alink.href += '10000'; tn = _('Linear_B_Syllabary');
    } else if (num < 0x10100) {
        alink.href += '10080'; tn = _('Linear_B_Ideograms');
    } else if (num < 0x10140) {
        alink.href += '10100'; tn = _('Aegean_Numbers');
    } else if (num < 0x10190) {
        alink.href += '10140'; tn = _('Ancient_Greek_Numbers');
    } else if (num < 0x101D0) {
        alink.href += '10190'; tn = _('Ancient_Symbols');
    } else if (num < 0x10280) {
        alink.href += '101D0'; tn = _('Phaistos_Disc');
    } else if (num < 0x102A0) {
        alink.href += '10280'; tn = _('Lycian');
    } else if (num < 0x10300) {
        alink.href += '102A0'; tn = _('Carian');
    } else if (num < 0x10330) {
        alink.href += '10300'; tn = _('Old_Italic');
    } else if (num < 0x10380) {
        alink.href += '10330'; tn = _('Gothic');
    } else if (num < 0x103A0) {
        alink.href += '10380'; tn = _('Ugaritic');
    } else if (num < 0x10400) {
        alink.href += '103A0'; tn = _('Old_Persian');
    } else if (num < 0x10450) {
        alink.href += '10400'; tn = _('Deseret');
    } else if (num < 0x10480) {
        alink.href += '10450'; tn = _('Shavian');
    } else if (num < 0x10800) {
        alink.href += '10480'; tn = _('Osmanya');
    } else if (num < 0x10840) {
        alink.href += '10800'; tn = _('Cypriot_Syllabary');
    } else if (num < 0x10900) {
        alink.href += '10840'; tn = _('Aramaic-_Imperial');
    } else if (num < 0x10920) {
        alink.href += '10900'; tn = _('Phoenician');
    } else if (num < 0x10A00) {
        alink.href += '10920'; tn = _('Lydian');
    } else if (num < 0x10A60) {
        alink.href += '10A00'; tn = _('Kharoshthi');
    } else if (num < 0x10B00) {
        alink.href += '10A60'; tn = _('Old_South_Arabian');
    } else if (num < 0x10B40) {
        alink.href += '10B00'; tn = _('Avestan');
    } else if (num < 0x10B60) {
        alink.href += '10B40'; tn = _('Parthian-_Inscriptional');
    } else if (num < 0x10C00) {
        alink.href += '10B60'; tn = _('Pahlavi-_Inscriptional');
    } else if (num < 0x10E60) {
        alink.href += '10C00'; tn = _('Old_Turkic');
    } else if (num < 0x11000) {
        alink.href += '10E60'; tn = _('Rumi_Numeral_Symbols');
    } else if (num < 0x11080) {
        alink.href += '11000'; tn = _('Brahmi');
    } else if (num < 0x12000) {
        alink.href += '11080'; tn = _('Kaithi');
    } else if (num < 0x12400) {
        alink.href += '12000'; tn = _('Cuneiform');
    } else if (num < 0x13000) {
        alink.href += '12400'; tn = _('Cuneiform_Numbers_and_Punctuation');
    } else if (num < 0x16800) {
        alink.href += '13000'; tn = _('Egyptian_Hieroglyphs');
    } else if (num < 0x1B000) {
        alink.href += '16800'; tn = _('Bamum_Supplement');
    } else if (num < 0x1D000) {
        alink.href += '1B000'; tn = _('Kana_Supplement');
    } else if (num < 0x1D100) {
        alink.href += '1D000'; tn = _('Byzantine_Musical_Symbols');
    } else if (num < 0x1D200) {
        alink.href += '1D100'; tn = _('Musical_Symbols');
    } else if (num < 0x1D300) {
        alink.href += '1D200'; tn = _('Ancient_Greek_Musical_Notation');
    } else if (num < 0x1D360) {
        alink.href += '1D300'; tn = _('Tai_Xuan_Jing_Symbols');
    } else if (num < 0x1D400) {
        alink.href += '1D360'; tn = _('Counting_Rod_Numerals');
    } else if (num < 0x1F000) {
        alink.href += '1D400'; tn = _('Mathematical_Alphanumeric_Symbols');
    } else if (num < 0x1F030) {
        alink.href += '1F000'; tn = _('Mahjong_Tiles');
    } else if (num < 0x1F0A0) {
        alink.href += '1F030'; tn = _('Domino_Tiles');
    } else if (num < 0x1F100) {
        alink.href += '1F0A0'; tn = _('Playing_Cards');
    } else if (num < 0x1F200) {
        alink.href += '1F100'; tn = _('Enclosed_Alphanumeric_Supplement');
    } else if (num < 0x1F300) {
        alink.href += '1F200'; tn = _('Enclosed_Ideographic_Supplement');
    } else if (num < 0x1F600) {
        alink.href += '1F300'; tn = _('Miscellaneous_Symbols_And_Pictographs');
    } else if (num < 0x1F680) {
        alink.href += '1F600'; tn = _('Emoticons');
    } else if (num < 0x1F700) {
        alink.href += '1F680'; tn = _('Transport_and_Map_Symbols');
    } else if (num < 0x1FF80) {
        alink.href += '1F700'; tn = _('Alchemical_Symbols');
    } else if (num < 0x20000) {
        alink.href += '1FF80'; tn = _('At_End_of_Plane_1');
    /* Begin CJK Ideograph Extension B */
    } else if (num < 0x2A700) {
        alink.href += '20000'; tn = _('CJK_Ideographs_Ext._B'); plane = 2;
    /* End CJK Ideograph Extension B */
    /* Begin CJK Ideograph Extension C */
    } else if (num < 0x2B740) {
        alink.href += '2A700'; tn = _('CJK_Ideographs_Ext._C'); plane = 2;
    /* End CJK Ideograph Extension C */
    /* Begin CJK Ideograph Extension D */
    } else if (num < 0x2F800) {
        alink.href += '2B740'; tn = _('CJK_Ideographs_Ext._D'); plane = 2;
    /* End CJK Ideograph Extension D */
    } else if (num < 0x2FA1F) {
        alink.href += '2F800'; tn = _('CJK_Compatibility_Ideographs_Supplement'); plane = 2;
    /* End Compatibility Ideographs Supplement */
    } else if (num < 0x2FF80) {
        alink.href += '2FF80'; tn = _('plane_numNocolon', {number: 2}); plane = 2;
    } else if (num < 0x30000) {
        alink.href += '2FF80'; tn = _('At_End_of_Plane_2'); plane = 2;
    } else if (num < 0x3FF80) {
        alink.href += '3FF80'; tn = _('plane_numNocolon', {number: 3}); plane = 3;
    } else if (num < 0x40000) {
        alink.href += '3FF80'; tn = _('At_End_of_Plane_3'); plane = 3;
    } else if (num < 0x4FF80) {
        alink.href += '4FF80'; tn = _('plane_numNocolon', {number: 4}); plane = 4;
    } else if (num < 0x50000) {
        alink.href += '4FF80'; tn = _('At_End_of_Plane_4'); plane = 4;
    } else if (num < 0x5FF80) {
        alink.href += '5FF80'; tn = _('plane_numNocolon', {number: 5}); plane = 5;
    } else if (num < 0x60000) {
        alink.href += '5FF80'; tn = _('At_End_of_Plane_5'); plane = 5;
    } else if (num < 0x6FF80) {
        alink.href += '6FF80'; tn = _('plane_numNocolon', {number: 6}); plane = 6;
    } else if (num < 0x70000) {
        alink.href += '6FF80'; tn = _('At_End_of_Plane_6'); plane = 6;
    } else if (num < 0x7FF80) {
        alink.href += '7FF80'; tn = _('plane_numNocolon', {number: 7}); plane = 7;
    } else if (num < 0x80000) {
        alink.href += '7FF80'; tn = _('At_End_of_Plane_7'); plane = 7;
    } else if (num < 0x8FF80) {
        alink.href += '8FF80'; tn = _('plane_numNocolon', {number: 8}); plane = 8;
    } else if (num < 0x90000) {
        alink.href += '8FF80'; tn = _('At_End_of_Plane_8'); plane = 8;
    } else if (num < 0x9FF80) {
        alink.href += '9FF80'; tn = _('plane_numNocolon', {number: 9}); plane = 9;
    } else if (num < 0xA0000) {
        alink.href += '9FF80'; tn = _('At_End_of_Plane_9'); plane = 9;
    } else if (num < 0xAFF80) {
        alink.href += 'AFF80'; tn = _('plane_numNocolon', {number: 10}); plane = 10;
    } else if (num < 0xB0000) {
        alink.href += 'AFF80'; tn = _('At_End_of_Plane_10'); plane = 10;
    } else if (num < 0xBFF80) {
        alink.href += 'BFF80'; tn = _('plane_numNocolon', {number: 11}); plane = 11;
    } else if (num < 0xC0000) {
        alink.href += 'BFF80'; tn = _('At_End_of_Plane_11'); plane = 11;
    } else if (num < 0xCFF80) {
        alink.href += 'CFF80'; tn = _('plane_numNocolon', {number: 12}); plane = 12;
    } else if (num < 0xD0000) {
        alink.href += 'CFF80'; tn = _('At_End_of_Plane_12'); plane = 12;
    } else if (num < 0xDFF80) {
        alink.href += 'DFF80'; tn = _('plane_numNocolon', {number: 13}); plane = 13;
    } else if (num < 0xE0000) {
        alink.href += 'DFF80'; tn = _('At_End_of_Plane_13'); plane = 13;
    } else if (num < 0xE0100) {
        alink.href += 'E0000'; tn = _('Tags'); plane = 13;
    } else if (num < 0xEFF80) {
        alink.href += 'E0100'; tn = _('Variation_Selectors_Supplement'); plane = 13;
    // else if (num < 0xEFF80) { alink.href += 'EFF80'; tn = _('plane_numNocolon', {number: 14}); plane=14;}
    } else if (num < 0xF0000) {
        alink.href += 'EFF80'; tn = _('At_End_of_Plane_14'); plane = 14;
    /* Begin Plane 15 Private Use */
    } else if (num < 0xFFF80) {
        alink.href += 'FFF80'; tn = _('plane_numNocolon', {number: 15}) + _('slash') +
                    _('Suppl._Private_Use_Area_A'); plane = 15; privateuse = true;
    } else if (num < 0x100000) {
        alink.href += 'FFF80'; tn = _('At_End_of_Plane_15') + _('slash') +
                    _('Suppl._Private_Use_Area_A'); plane = 15; privateuse = true;
    /* End Plane 15 Private Use */
    /* Begin Plane 16 Private Use */
    } else if (num <= 0x10FF80) {
        alink.href += '10FF80'; tn = _('plane_numNocolon', {number: 16}) + _('slash') +
                    _('Suppl._Private_Use_Area_B'); plane = 16; privateuse = true;
    } else if (num <= 0x10FFFF) {
        alink.href += '10FF80'; tn = _('At_End_of_Plane_16') + _('slash') +
                    _('Suppl._Private_Use_Area_B'); plane = 16; privateuse = true;
    }
    /* End Plane 16 Private Use */

    alink.href += '.pdf';

    tn += ' (PDF)';
    alink.setAttribute('value', tn);

    return [plane, privateuse, surrogate];
}
