// hexstyleLwr:  return true; // Could use but better not to
//   change for XML-compatibility

import {SimplePrefs} from '../../vendor/simple-prefs/dist/index.esm.js';

/** @type {import('intl-dom').I18NCallback<string>} */
let _;

/**
 * @param {{_: import('intl-dom').I18NCallback<string>}} cfg
 */
export const setPrefDefaultVars = ({_: __}) => {
  _ = __;
};

export const getUnicodeDefaults = () => {
  return new SimplePrefs({
    namespace: 'unicode-input-toolconverter-',
    defaults: getPrefDefaults()
  }).bind();
};

export const getPrefDefaults = () => ({
  hexLettersUpper: false,
  onlyentsyes: false,
  asciiLt128: false,
  startCharInMiddleOfChart: false,
  multiline: false,
  xhtmlentmode: false,
  showImg: false,
  ampspace: false,
  // showComplexWindow: false,
  hexyes: true,
  decyes: true,
  unicodeyes: true,
  buttonyes: true,
  entyes: true,
  xmlentkeep: true,
  ampkeep: true,
  showAllDetailedView: true,
  showAllDetailedCJKView: true,
  cssUnambiguous: true,
  appendtohtmldtd: true,
  outerWidth: 0,
  fontsizetextbox: 13,
  tblrowsset: 4,
  tblcolsset: 3,
  tblfontsize: 13,
  DTDtextbox: '',
  font: '',
  cssWhitespace: ' ',
  initialTab: 'charts',
  defaultStartCharCode: /** @type {number} */ (
    _('startCharCode').codePointAt(0)
  ) - 1, // 'a'
  currentStartCharCode: /** @type {number} */ (
    _('startCharCode').codePointAt(0)
  ) - 1, // 'a'
  lang: _('langCode'), // 'en-US'
  dropdownArr: []
});
