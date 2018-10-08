// case 'hexstyleLwr': return true; // Could use but better not to change for XML-compatibility

/**
 * Get parsed default value for a preference
 * @param {string} key Preference key
 * @returns {boolean|number|string}
 */
export default async function (key, _) {
    switch (key) {
    case 'hexLettersUpper': case 'onlyentsyes': case 'asciiLt128':
    case 'startCharInMiddleOfChart': case 'multiline': case 'xhtmlentmode':
    case 'showImg': case 'ampspace': case 'showComplexWindow':
        return false;
    case 'hexyes': case 'decyes': case 'unicodeyes': case 'buttonyes': case 'entyes':
    case 'xmlentkeep': case 'ampkeep': case 'showAllDetailedView':
    case 'showAllDetailedCJKView': case 'cssUnambiguous': case 'appendtohtmldtd':
        return true;
    case 'outerWidth':
        return 0;
    case 'fontsizetextbox':
        return 13;
    case 'tblrowsset':
        return 4;
    case 'tblcolsset':
        return 3;
    case 'tblfontsize':
        return 13;
    case 'DTDtextbox': case 'font':
        return '';
    case 'cssWhitespace':
        return ' ';
    case 'initialTab':
        return 'charttab';
    case 'defaultStartCharCode': case 'currentStartCharCode':
        return _('startCharCode').codePointAt() - 1; // 'a'
    case 'lang':
        return _('langCode'); // 'en'
    case 'dropdownArr':
        return [];
    }
}
