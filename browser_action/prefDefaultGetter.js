/**
 * Get parsed default value for a preference
 * @param {string} key Preference key
 * @returns {boolean|number|string}
 */
export default async function (key) {
    switch (key) {
    case 'hexLettersUpper': case 'onlyentsyes': case 'startCharInMiddleOfChart':
        return false;
    case 'hexyes': case 'decyes': case 'unicodeyes': case 'buttonyes': case 'entyes':
        return true;
    case 'tblrowsset':
        return 4;
    case 'tblcolsset':
        return 3;
    case 'tblfontsize':
        return 13;
    case 'currentStartCharCode':
        return 'a'.charCodeAt() - 1;
    case 'font':
        return '';
    case 'lang':
        return 'en-US';
    }
}
