// Todo: Auto-generate this function
export default function getScriptInfoForCodePoint (num, _) {
    let privateuse = false, surrogate = false;
    let plane = num >= 0x10000 && num <= 0x1FFFF ? 1 : 0;
    let script = '', codePointStart = '';
    if (num < 0x0080) {
        codePointStart = '0000';
        script = _('Basic_Latin'); // + _ ('comma') + ' ' +
        // _('Controls__C0') + _ ('comma') + ' ' +
        // _('ASCII_Punctuation') + _ ('comma') + ' ' +
        // _('ASCII_Digits') + _ ('comma') + ' ' +
        // _ ('Dollar_Sign');
    // Could just replace with formal name of the category, "Latin" (as did below in other cases)
    } else if (num < 0x0100) {
        codePointStart = '0080'; script = _('Latin_1_Supplement'); // + _ ('comma') + ' ' + _('Latin_1_Punctuation') + _ ('comma') + ' ' + _('Controls__C1') + _ ('comma') + ' ' + _('Yen__Pound_and_Cent');
    } else if (num < 0x0180) {
        codePointStart = '0100'; script = _('Latin_Extended_A');
    } else if (num < 0x0250) {
        codePointStart = '0180'; script = _('Latin_Extended_B');
    } else if (num < 0x02B0) {
        codePointStart = '0250'; script = _('IPA_Extensions');
    } else if (num < 0x0300) {
        codePointStart = '02B0'; script = _('Spacing_Modifier_Letters');
    } else if (num < 0x0370) {
        codePointStart = '0300'; script = _('Combining_Diacritical_Marks');
    } else if (num < 0x0400) {
        codePointStart = '0370'; script = _('Greek'); // + _ ('comma') + ' ' + _('Coptic_in_Greek_block');
    } else if (num < 0x0500) {
        codePointStart = '0400'; script = _('Cyrillic');
    } else if (num < 0x0530) {
        codePointStart = '0500'; script = _('Cyrillic_Supplement');
    } else if (num < 0x0590) {
        codePointStart = '0530'; script = _('Armenian');
    } else if (num < 0x0600) {
        codePointStart = '0590'; script = _('Hebrew');
    } else if (num < 0x0700) {
        codePointStart = '0600'; script = _('Arabic');
    } else if (num < 0x0750) {
        codePointStart = '0700'; script = _('Syriac');
    } else if (num < 0x0780) {
        codePointStart = '0750'; script = _('Arabic_Supplement');
    } else if (num < 0x07C0) {
        codePointStart = '0780'; script = _('Thaana');
    } else if (num < 0x0800) {
        codePointStart = '07C0'; script = _('N_Ko');
    } else if (num < 0x0840) {
        codePointStart = '0800'; script = _('Samaritan');
    } else if (num < 0x0900) {
        codePointStart = '0840'; script = _('Mandaic');
    } else if (num < 0x0980) {
        codePointStart = '0900'; script = _('Devanagari');
    } else if (num < 0x0A00) {
        codePointStart = '0980'; script = _('Bengali');
    } else if (num < 0x0A80) {
        codePointStart = '0A00'; script = _('Gurmukhi');
    } else if (num < 0x0B00) {
        codePointStart = '0A80'; script = _('Gujarati');
    } else if (num < 0x0B80) {
        codePointStart = '0B00'; script = _('Oriya');
    } else if (num < 0x0C00) {
        codePointStart = '0B80'; script = _('Tamil');
    } else if (num < 0x0C80) {
        codePointStart = '0C00'; script = _('Telugu');
    } else if (num < 0x0D00) {
        codePointStart = '0C80'; script = _('Kannada');
    } else if (num < 0x0D80) {
        codePointStart = '0D00'; script = _('Malayalam');
    } else if (num < 0x0E00) {
        codePointStart = '0D80'; script = _('Sinhala');
    } else if (num < 0x0E80) {
        codePointStart = '0E00'; script = _('Thai');
    } else if (num < 0x0F00) {
        codePointStart = '0E80'; script = _('Lao');
    } else if (num < 0x1000) {
        codePointStart = '0F00'; script = _('Tibetan');
    } else if (num < 0x10A0) {
        codePointStart = '1000'; script = _('Myanmar');
    } else if (num < 0x1100) {
        codePointStart = '10A0'; script = _('Georgian');
    } else if (num < 0x1200) {
        codePointStart = '1100'; script = _('Hangul_Jamo');
    } else if (num < 0x1380) {
        codePointStart = '1200'; script = _('Ethiopic');
    } else if (num < 0x13A0) {
        codePointStart = '1380'; script = _('Ethiopic_Supplement');
    } else if (num < 0x1400) {
        codePointStart = '13A0'; script = _('Cherokee');
    } else if (num < 0x1680) {
        codePointStart = '1400'; script = _('Unified_Canadian_Aboriginal_Syllabics');
    } else if (num < 0x16A0) {
        codePointStart = '1680'; script = _('Ogham');
    } else if (num < 0x1700) {
        codePointStart = '16A0'; script = _('Runic');
    } else if (num < 0x1720) {
        codePointStart = '1700'; script = _('Tagalog');
    } else if (num < 0x1740) {
        codePointStart = '1720'; script = _('Hanunoo');
    } else if (num < 0x1760) {
        codePointStart = '1740'; script = _('Buhid');
    } else if (num < 0x1780) {
        codePointStart = '1760'; script = _('Tagbanwa');
    } else if (num < 0x1800) {
        codePointStart = '1780'; script = _('Khmer');
    } else if (num < 0x18B0) {
        codePointStart = '1800'; script = _('Mongolian');
    } else if (num < 0x1900) {
        codePointStart = '18B0'; script = _('UCAS_Extended');
    } else if (num < 0x1950) {
        codePointStart = '1900'; script = _('Limbu');
    } else if (num < 0x1980) {
        codePointStart = '1950'; script = _('Tai_Le');
    } else if (num < 0x19E0) {
        codePointStart = '1980'; script = _('New_Tai_Lue');
    } else if (num < 0x1A00) {
        codePointStart = '19E0'; script = _('Khmer_Symbols');
    } else if (num < 0x1A20) {
        codePointStart = '1A00'; script = _('Buginese');
    } else if (num < 0x1B00) {
        codePointStart = '1A20'; script = _('Tai_Tham');
    } else if (num < 0x1B80) {
        codePointStart = '1B00'; script = _('Balinese');
    } else if (num < 0x1BC0) {
        codePointStart = '1B80'; script = _('Sundanese');
    } else if (num < 0x1C00) {
        codePointStart = '1BC0'; script = _('Batak');
    } else if (num < 0x1C50) {
        codePointStart = '1C00'; script = _('Lepcha');
    } else if (num < 0x1CD0) {
        codePointStart = '1C50'; script = _('Ol_Chiki');
    } else if (num < 0x1D00) {
        codePointStart = '1CD0'; script = _('Vedic_Extensions');
    } else if (num < 0x1D80) {
        codePointStart = '1D00'; script = _('Phonetic_Extensions');
    } else if (num < 0x1DC0) {
        codePointStart = '1D80'; script = _('Phonetic_Extensions_Supplement');
    } else if (num < 0x1E00) {
        codePointStart = '1DC0'; script = _('Combining_Diacritical_Marks_Supplement');
    } else if (num < 0x1F00) {
        codePointStart = '1E00'; script = _('Latin_Extended_Additional');
    } else if (num < 0x2000) {
        codePointStart = '1F00'; script = _('Greek_Extended');
    } else if (num < 0x2070) {
        codePointStart = '2000'; script = _('General_Punctuation'); // + _ ('comma') + ' ' + _('Layout_Controls') + _ ('comma') + ' ' + _('Invisible_Operators');
    } else if (num < 0x20A0) {
        codePointStart = '2070'; script = _('Super_and_Subscripts');
    } else if (num < 0x20D0) {
        codePointStart = '20A0'; script = _('Currency_Symbols'); // + _ ('comma') + ' ' + _ ('Euro_Sign') + _ ('comma') + ' ';
    } else if (num < 0x2100) {
        codePointStart = '20D0'; script = _('Combining_Diacritical_Marks_for_Symbols');
    } else if (num < 0x2150) {
        codePointStart = '2100'; script = _('Letterlike_Symbols'); // + _ ('comma') + ' ' + _ ('Mark_-historic--');
    } else if (num < 0x2190) {
        codePointStart = '2150'; script = _('Number_Forms');
    } else if (num < 0x2200) {
        codePointStart = '2190'; script = _('Arrows');
    } else if (num < 0x2300) {
        codePointStart = '2200'; script = _('Mathematical_Operators');
    } else if (num < 0x2400) {
        codePointStart = '2300'; script = _('Miscellaneous_Technical');
    } else if (num < 0x2440) {
        codePointStart = '2400'; script = _('Control_Pictures');
    } else if (num < 0x2460) {
        codePointStart = '2440'; script = _('Optical_Character_Recognition__OCR_');
    } else if (num < 0x2500) {
        codePointStart = '2460'; script = _('Enclosed_Alphanumerics');
    } else if (num < 0x2580) {
        codePointStart = '2500'; script = _('Box_Drawing');
    } else if (num < 0x25A0) {
        codePointStart = '2580'; script = _('Block_Elements');
    } else if (num < 0x2600) {
        codePointStart = '25A0'; script = _('Geometric_Shapes');
    } else if (num < 0x2700) {
        codePointStart = '2600'; script = _('Miscellaneous_Symbols');
    } else if (num < 0x27C0) {
        codePointStart = '2700'; script = _('Dingbats');
    } else if (num < 0x27F0) {
        codePointStart = '27C0'; script = _('Misc__Math_Symbols_A');
    } else if (num < 0x2800) {
        codePointStart = '27F0'; script = _('Supplemental_Arrows_A');
    } else if (num < 0x2900) {
        codePointStart = '2800'; script = _('Braille_Patterns');
    } else if (num < 0x2980) {
        codePointStart = '2900'; script = _('Supplemental_Arrows_B');
    } else if (num < 0x2A00) {
        codePointStart = '2980'; script = _('Misc__Math_Symbols_B');
    } else if (num < 0x2B00) {
        codePointStart = '2A00'; script = _('Suppl__Math_Operators');
    } else if (num < 0x2C00) {
        codePointStart = '2B00'; script = _('Miscellaneous_Symbols_and_Arrows');
    } else if (num < 0x2C60) {
        codePointStart = '2C00'; script = _('Glagolitic');
    } else if (num < 0x2C80) {
        codePointStart = '2C60'; script = _('Latin_Extended_C');
    } else if (num < 0x2D00) {
        codePointStart = '2C80'; script = _('Coptic');
    } else if (num < 0x2D30) {
        codePointStart = '2D00'; script = _('Georgian_Supplement');
    } else if (num < 0x2D80) {
        codePointStart = '2D30'; script = _('Tifinagh');
    } else if (num < 0x2DE0) {
        codePointStart = '2D80'; script = _('Ethiopic_Extended');
    } else if (num < 0x2E00) {
        codePointStart = '2DE0'; script = _('Cyrillic_Extended_A');
    } else if (num < 0x2E80) {
        codePointStart = '2E00'; script = _('Supplemental_Punctuation');
    } else if (num < 0x2F00) {
        codePointStart = '2E80'; script = _('CJK_Radicals_Supplement');
    } else if (num < 0x2FF0) {
        codePointStart = '2F00'; script = _('CJK_Radicals___KangXi_Radicals');
    } else if (num < 0x3000) {
        codePointStart = '2FF0'; script = _('Ideographic_Description_Characters');
    } else if (num < 0x3040) {
        codePointStart = '3000'; script = _('CJK_Symbols_and_Punctuation');
    } else if (num < 0x30A0) {
        codePointStart = '3040'; script = _('Hiragana');
    } else if (num < 0x3100) {
        codePointStart = '30A0'; script = _('Katakana');
    } else if (num < 0x3130) {
        codePointStart = '3100'; script = _('Bopomofo');
    } else if (num < 0x3190) {
        codePointStart = '3130'; script = _('Hangul_Compatibility_Jamo');
    } else if (num < 0x31A0) {
        codePointStart = '3190'; script = _('Kanbun');
    } else if (num < 0x31C0) {
        codePointStart = '31A0'; script = _('Bopomofo_Extended');
    } else if (num < 0x31F0) {
        codePointStart = '31C0'; script = _('CJK_Strokes');
    } else if (num < 0x3200) {
        codePointStart = '31F0'; script = _('Katakana_Phonetic_Extensions');
    } else if (num < 0x3300) {
        codePointStart = '3200'; script = _('Enclosed_CJK_Letters_and_Months');
    } else if (num < 0x3400) {
        codePointStart = '3300'; script = _('CJK_Compatibility');
    /* Begin CJK (1) */
    } else if (num < 0x4DC0) {
        codePointStart = '3400'; script = _('CJK_Ideographs_Ext__A');
    /* End CJK (1) */
    /* Begin Interlude between CJK */
    } else if (num < 0x4E00) {
        codePointStart = '4DC0'; script = _('Yijing_Hexagram_Symbols');
    /* End Interlude between CJK */
    /* Begin CJK (2) */
    } else if (num < 0xA000) {
        codePointStart = '4E00'; script = _('CJK_Unified_Ideographs__Han_');
    /* End CJK (2) */
    /* Begin Interlude (2) between CJK */
    } else if (num < 0xA490) {
        codePointStart = 'A000'; script = _('Yi_Syllables');
    } else if (num < 0xA4D0) {
        codePointStart = 'A490'; script = _('Yi_Radicals');
    } else if (num < 0xA500) {
        codePointStart = 'A4D0'; script = _('Lisu');
    } else if (num < 0xA640) {
        codePointStart = 'A500'; script = _('Vai');
    } else if (num < 0xA6A0) {
        codePointStart = 'A640'; script = _('Cyrillic_Extended_B');
    } else if (num < 0xA700) {
        codePointStart = 'A6A0'; script = _('Bamum');
    } else if (num < 0xA720) {
        codePointStart = 'A700'; script = _('Modifier_Tone_Letters');
    } else if (num < 0xA800) {
        codePointStart = 'A720'; script = _('Latin_Extended_D');
    } else if (num < 0xA830) {
        codePointStart = 'A800'; script = _('Syloti_Nagri');
    } else if (num < 0xA840) {
        codePointStart = 'A830'; script = _('Common_Indic_Number_Forms');
    } else if (num < 0xA880) {
        codePointStart = 'A840'; script = _('Phags_Pa');
    } else if (num < 0xA8E0) {
        codePointStart = 'A880'; script = _('Saurashtra');
    } else if (num < 0xA900) {
        codePointStart = 'A8E0'; script = _('Devanagari_Extended');
    } else if (num < 0xA930) {
        codePointStart = 'A900'; script = _('Kayah_Li');
    } else if (num < 0xA960) {
        codePointStart = 'A930'; script = _('Rejang');
    } else if (num < 0xA980) {
        codePointStart = 'A960'; script = _('Hangul_Jamo_Extended_A');
    } else if (num < 0xAA00) {
        codePointStart = 'A980'; script = _('Javanese');
    } else if (num < 0xAA60) {
        codePointStart = 'AA00'; script = _('Cham');
    } else if (num < 0xAA80) {
        codePointStart = 'AA60'; script = _('Myanmar_Extended_A');
    } else if (num < 0xAB00) {
        codePointStart = 'AA80'; script = _('Tai_Viet');
    } else if (num < 0xABC0) {
        codePointStart = 'AB00'; script = _('Ethiopic_Extended_A');
    } else if (num < 0xAC00) {
        codePointStart = 'ABC0'; script = _('Meetei_Mayek');
    /* End Interlude (2) between CJK */
    /* Begin Hangul Syllable */
    } else if (num < 0xD7B0) {
        codePointStart = 'AC00'; script = _('Hangul_Syllables');
    /* End Hangul Syllable */
    } else if (num < 0xD800) {
        codePointStart = 'D7B0'; script = _('Hangul_Jamo_Extended_B');
    /* Begin Non Private Use High Surrogate */
    } else if (num < 0xDB80) {
        codePointStart = 'D800'; script = _('High_Surrogates'); surrogate = _('High_Surrogate');
    /* End Non Private Use High Surrogate */
    /* Begin Private Use High Surrogate */
    /* **********NOTE:  This one has no PDF   */
    } else if (num < 0xDC00) {
        codePointStart = 'DB80'; script = _('High_Private_Use_Surrogates'); surrogate = _('High_Private_Use_Surrogate');
    /* End Private Use High Surrogate */
    /* Begin Low Surrogate */
    } else if (num < 0xE000) {
        codePointStart = 'DC00'; script = _('Low_Surrogates'); surrogate = _('Low_Surrogate');
    /* End Low Surrogate */
    /* Begin Private Use */
    } else if (num < 0xF900) {
        codePointStart = 'E000'; script = _('Private_Use_Area'); privateuse = true;
    /* End Private Use */
    } else if (num < 0xFB00) {
        codePointStart = 'F900'; script = _('CJK_Compatibility_Ideographs');
    // else if (num < 0xFB50) { codePointStart = 'FB00'; script = _('Latin_Ligatures') + _ ('comma') + ' ' + _('Armenian_Ligatures') + _ ('comma') + ' ' + _('Hebrew_Presentation_Forms');
    } else if (num < 0xFB50) {
        codePointStart = 'FB00'; script = _('Alphabetic_Presentation_Forms');
    } else if (num < 0xFE00) {
        codePointStart = 'FB50'; script = _('Arabic_Presentation_Forms_A'); // + _ ('comma') + ' ' + _('Rial_Sign') + _ ('comma') + ' ' + _('Reserved_range');
    } else if (num < 0xFE10) {
        codePointStart = 'FE00'; script = _('Variation_Selectors');
    } else if (num < 0xFE20) {
        codePointStart = 'FE10'; script = _('Vertical_Forms');
    } else if (num < 0xFE30) {
        codePointStart = 'FE20'; script = _('Combining_Half_Marks');
    } else if (num < 0xFE50) {
        codePointStart = 'FE30'; script = _('CJK_Compatibility_Forms');
    } else if (num < 0xFE70) {
        codePointStart = 'FE50'; script = _('Small_Form_Variants');
    } else if (num < 0xFF00) {
        codePointStart = 'FE70'; script = _('Arabic_Presentation_Forms_B');
    // else if (num < 0xFFF0) { codePointStart = 'FF00'; script = _('Fullwidth_ASCII_Punctuation') + _ ('comma') + ' ' + _('Fullwidth_ASCII_Digits') + _ ('comma') + ' ' + _('Fullwidth_Currency_Symbols') + _ ('comma') + ' ' + _('Fullwidth_Latin_Letters') + _ ('comma') + ' ' + _('Halfwidth_Katakana') + _ ('comma') + ' ' + _('Halfwidth_Jamo'); }
    } else if (num < 0xFFF0) {
        codePointStart = 'FF00'; script = _('Halfwidth_and_Fullwidth_Forms');
    /*
    // If reenabling, should do more complete i18n (e.g., put comma inside string)
    } else if (num < 0xFFF0) {
        codePointStart = 'FF00';
        script = _('shortened_Fullwidth', {
            asciiPunctuation: _('shortened_ASCII_Punctuation__Fullwidth_'),
            asciiDigits: _('shortened_ASCII_Digits__Fullwidth_'),
            currencySymbols: _('shortened_Currency_Symbols__Fullwidth_'),
            latinLetters: _('shortened_Latin_Letters__Fullwidth_')
        }) + _ ('comma') + ' ' + _('shortened_Halfwidth', {
            katakana: _('shortened_Katakana__Halfwidth_'),
            jamo: _('shortened_Jamo__Halfwidth_')
        });
    */
    } else if (num < 0x10000) {
        codePointStart = 'FFF0'; script = _('Specials'); // + _ ('comma') + ' ' + _('At_End_of_BMP');
    } else if (num < 0x10080) {
        codePointStart = '10000'; script = _('Linear_B_Syllabary');
    } else if (num < 0x10100) {
        codePointStart = '10080'; script = _('Linear_B_Ideograms');
    } else if (num < 0x10140) {
        codePointStart = '10100'; script = _('Aegean_Numbers');
    } else if (num < 0x10190) {
        codePointStart = '10140'; script = _('Ancient_Greek_Numbers');
    } else if (num < 0x101D0) {
        codePointStart = '10190'; script = _('Ancient_Symbols');
    } else if (num < 0x10280) {
        codePointStart = '101D0'; script = _('Phaistos_Disc');
    } else if (num < 0x102A0) {
        codePointStart = '10280'; script = _('Lycian');
    } else if (num < 0x10300) {
        codePointStart = '102A0'; script = _('Carian');
    } else if (num < 0x10330) {
        codePointStart = '10300'; script = _('Old_Italic');
    } else if (num < 0x10380) {
        codePointStart = '10330'; script = _('Gothic');
    } else if (num < 0x103A0) {
        codePointStart = '10380'; script = _('Ugaritic');
    } else if (num < 0x10400) {
        codePointStart = '103A0'; script = _('Old_Persian');
    } else if (num < 0x10450) {
        codePointStart = '10400'; script = _('Deseret');
    } else if (num < 0x10480) {
        codePointStart = '10450'; script = _('Shavian');
    } else if (num < 0x10800) {
        codePointStart = '10480'; script = _('Osmanya');
    } else if (num < 0x10840) {
        codePointStart = '10800'; script = _('Cypriot_Syllabary');
    } else if (num < 0x10900) {
        codePointStart = '10840'; script = _('Aramaic__Imperial');
    } else if (num < 0x10920) {
        codePointStart = '10900'; script = _('Phoenician');
    } else if (num < 0x10A00) {
        codePointStart = '10920'; script = _('Lydian');
    } else if (num < 0x10A60) {
        codePointStart = '10A00'; script = _('Kharoshthi');
    } else if (num < 0x10B00) {
        codePointStart = '10A60'; script = _('Old_South_Arabian');
    } else if (num < 0x10B40) {
        codePointStart = '10B00'; script = _('Avestan');
    } else if (num < 0x10B60) {
        codePointStart = '10B40'; script = _('Parthian__Inscriptional');
    } else if (num < 0x10C00) {
        codePointStart = '10B60'; script = _('Pahlavi__Inscriptional');
    } else if (num < 0x10E60) {
        codePointStart = '10C00'; script = _('Old_Turkic');
    } else if (num < 0x11000) {
        codePointStart = '10E60'; script = _('Rumi_Numeral_Symbols');
    } else if (num < 0x11080) {
        codePointStart = '11000'; script = _('Brahmi');
    } else if (num < 0x12000) {
        codePointStart = '11080'; script = _('Kaithi');
    } else if (num < 0x12400) {
        codePointStart = '12000'; script = _('Cuneiform');
    } else if (num < 0x13000) {
        codePointStart = '12400'; script = _('Cuneiform_Numbers_and_Punctuation');
    } else if (num < 0x16800) {
        codePointStart = '13000'; script = _('Egyptian_Hieroglyphs');
    } else if (num < 0x1B000) {
        codePointStart = '16800'; script = _('Bamum_Supplement');
    } else if (num < 0x1D000) {
        codePointStart = '1B000'; script = _('Kana_Supplement');
    } else if (num < 0x1D100) {
        codePointStart = '1D000'; script = _('Byzantine_Musical_Symbols');
    } else if (num < 0x1D200) {
        codePointStart = '1D100'; script = _('Musical_Symbols');
    } else if (num < 0x1D300) {
        codePointStart = '1D200'; script = _('Ancient_Greek_Musical_Notation');
    } else if (num < 0x1D360) {
        codePointStart = '1D300'; script = _('Tai_Xuan_Jing_Symbols');
    } else if (num < 0x1D400) {
        codePointStart = '1D360'; script = _('Counting_Rod_Numerals');
    } else if (num < 0x1F000) {
        codePointStart = '1D400'; script = _('Mathematical_Alphanumeric_Symbols');
    } else if (num < 0x1F030) {
        codePointStart = '1F000'; script = _('Mahjong_Tiles');
    } else if (num < 0x1F0A0) {
        codePointStart = '1F030'; script = _('Domino_Tiles');
    } else if (num < 0x1F100) {
        codePointStart = '1F0A0'; script = _('Playing_Cards');
    } else if (num < 0x1F200) {
        codePointStart = '1F100'; script = _('Enclosed_Alphanumeric_Supplement');
    } else if (num < 0x1F300) {
        codePointStart = '1F200'; script = _('Enclosed_Ideographic_Supplement');
    } else if (num < 0x1F600) {
        codePointStart = '1F300'; script = _('Miscellaneous_Symbols_And_Pictographs');
    } else if (num < 0x1F680) {
        codePointStart = '1F600'; script = _('Emoticons');
    } else if (num < 0x1F700) {
        codePointStart = '1F680'; script = _('Transport_and_Map_Symbols');
    } else if (num < 0x1FF80) {
        codePointStart = '1F700'; script = _('Alchemical_Symbols');
    } else if (num < 0x20000) {
        codePointStart = '1FF80'; script = _('At_End_of_Plane_1');
    /* Begin CJK Ideograph Extension B */
    } else if (num < 0x2A700) {
        codePointStart = '20000'; script = _('CJK_Ideographs_Ext__B'); plane = 2;
    /* End CJK Ideograph Extension B */
    /* Begin CJK Ideograph Extension C */
    } else if (num < 0x2B740) {
        codePointStart = '2A700'; script = _('CJK_Ideographs_Ext__C'); plane = 2;
    /* End CJK Ideograph Extension C */
    /* Begin CJK Ideograph Extension D */
    } else if (num < 0x2F800) {
        codePointStart = '2B740'; script = _('CJK_Ideographs_Ext__D'); plane = 2;
    /* End CJK Ideograph Extension D */
    } else if (num < 0x2FA1F) {
        codePointStart = '2F800'; script = _('CJK_Compatibility_Ideographs_Supplement'); plane = 2;
    /* End Compatibility Ideographs Supplement */
    } else if (num < 0x2FF80) {
        codePointStart = '2FF80'; script = _('plane_numNocolon', {number: 2}); plane = 2;
    } else if (num < 0x30000) {
        codePointStart = '2FF80'; script = _('At_End_of_Plane_2'); plane = 2;
    } else if (num < 0x3FF80) {
        codePointStart = '3FF80'; script = _('plane_numNocolon', {number: 3}); plane = 3;
    } else if (num < 0x40000) {
        codePointStart = '3FF80'; script = _('At_End_of_Plane_3'); plane = 3;
    } else if (num < 0x4FF80) {
        codePointStart = '4FF80'; script = _('plane_numNocolon', {number: 4}); plane = 4;
    } else if (num < 0x50000) {
        codePointStart = '4FF80'; script = _('At_End_of_Plane_4'); plane = 4;
    } else if (num < 0x5FF80) {
        codePointStart = '5FF80'; script = _('plane_numNocolon', {number: 5}); plane = 5;
    } else if (num < 0x60000) {
        codePointStart = '5FF80'; script = _('At_End_of_Plane_5'); plane = 5;
    } else if (num < 0x6FF80) {
        codePointStart = '6FF80'; script = _('plane_numNocolon', {number: 6}); plane = 6;
    } else if (num < 0x70000) {
        codePointStart = '6FF80'; script = _('At_End_of_Plane_6'); plane = 6;
    } else if (num < 0x7FF80) {
        codePointStart = '7FF80'; script = _('plane_numNocolon', {number: 7}); plane = 7;
    } else if (num < 0x80000) {
        codePointStart = '7FF80'; script = _('At_End_of_Plane_7'); plane = 7;
    } else if (num < 0x8FF80) {
        codePointStart = '8FF80'; script = _('plane_numNocolon', {number: 8}); plane = 8;
    } else if (num < 0x90000) {
        codePointStart = '8FF80'; script = _('At_End_of_Plane_8'); plane = 8;
    } else if (num < 0x9FF80) {
        codePointStart = '9FF80'; script = _('plane_numNocolon', {number: 9}); plane = 9;
    } else if (num < 0xA0000) {
        codePointStart = '9FF80'; script = _('At_End_of_Plane_9'); plane = 9;
    } else if (num < 0xAFF80) {
        codePointStart = 'AFF80'; script = _('plane_numNocolon', {number: 10}); plane = 10;
    } else if (num < 0xB0000) {
        codePointStart = 'AFF80'; script = _('At_End_of_Plane_10'); plane = 10;
    } else if (num < 0xBFF80) {
        codePointStart = 'BFF80'; script = _('plane_numNocolon', {number: 11}); plane = 11;
    } else if (num < 0xC0000) {
        codePointStart = 'BFF80'; script = _('At_End_of_Plane_11'); plane = 11;
    } else if (num < 0xCFF80) {
        codePointStart = 'CFF80'; script = _('plane_numNocolon', {number: 12}); plane = 12;
    } else if (num < 0xD0000) {
        codePointStart = 'CFF80'; script = _('At_End_of_Plane_12'); plane = 12;
    } else if (num < 0xDFF80) {
        codePointStart = 'DFF80'; script = _('plane_numNocolon', {number: 13}); plane = 13;
    } else if (num < 0xE0000) {
        codePointStart = 'DFF80'; script = _('At_End_of_Plane_13'); plane = 13;
    } else if (num < 0xE0100) {
        codePointStart = 'E0000'; script = _('Tags'); plane = 13;
    } else if (num < 0xEFF80) {
        codePointStart = 'E0100'; script = _('Variation_Selectors_Supplement'); plane = 13;
    // else if (num < 0xEFF80) { codePointStart = 'EFF80'; script = _('plane_numNocolon', {number: 14}); plane=14;}
    } else if (num < 0xF0000) {
        codePointStart = 'EFF80'; script = _('At_End_of_Plane_14'); plane = 14;
    /* Begin Plane 15 Private Use */
    } else if (num < 0xFFF80) {
        codePointStart = 'FFF80'; script = _('plane_numNocolon', {number: 15}) + _('slash') +
                    _('Supplementary_Private_Use_Area_A'); plane = 15; privateuse = true;
    } else if (num < 0x100000) {
        codePointStart = 'FFF80'; script = _('At_End_of_Plane_15') + _('slash') +
                    _('Supplementary_Private_Use_Area_A'); plane = 15; privateuse = true;
    /* End Plane 15 Private Use */
    /* Begin Plane 16 Private Use */
    } else if (num <= 0x10FF80) {
        codePointStart = '10FF80'; script = _('plane_numNocolon', {number: 16}) + _('slash') +
                    _('Supplementary_Private_Use_Area_B'); plane = 16; privateuse = true;
    } else if (num <= 0x10FFFF) {
        codePointStart = '10FF80'; script = _('At_End_of_Plane_16') + _('slash') +
                    _('Supplementary_Private_Use_Area_B'); plane = 16; privateuse = true;
    }
    /* End Plane 16 Private Use */
    return [codePointStart, script, plane, privateuse, surrogate];
}
