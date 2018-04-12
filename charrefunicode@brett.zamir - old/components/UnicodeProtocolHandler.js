Components.utils['import']('resource://gre/modules/XPCOMUtils.jsm');

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;

// CONFIG
const EXT_ABBR = 'charrefunicode';
const CHROME_CONTENT = 'chrome://'+EXT_ABBR+'/content/';

const SOURCE = CHROME_CONTENT+'service/unicode_protocol_handler.js';
const kPROTOCOL_NAME = 'Javascript XPCOM Custom Unicode Protocol Handler Component';

// PROTOCOL-SPECIFIC CONFIG
// This data now being added to chrome.manifest; see:
// https://developer.mozilla.org/en/chrome.manifest
// https://developer.mozilla.org/en/XPCOM/XPCOM_changes_in_Gecko_2.0#Component_registration
const kSCHEME = 'x-unicode';
const kPROTOCOL_CID = Components.ID('36192904-0101-11DF-BC01-4EC555D89593');
// Must use Mozilla-specific one
const kPROTOCOL_CONTRACTID = '@mozilla.org/network/protocol;1?name=' + kSCHEME;



const loader = Cc['@mozilla.org/moz/jssubscript-loader;1'].getService(Ci.mozIJSSubScriptLoader);

/**
 * Creates an XPCOM singleton Unicode protocol handler which will convert links to character requests
 *    for those items
 * @class Handles Unicode protocol links by converting them into Unicode character requests
 */
function UnicodeProtocolHandler () {
    this.wrappedJSObject = this;
}

UnicodeProtocolHandler.prototype = {
    ////   BEGIN PROTOCOL-HANDLER SPECIFIC //// (ONE MORE BELOW)
    scheme : kSCHEME,
    defaultPort: -1,
    protocolFlags: Ci.nsIProtocolHandler.URI_NORELATIVE | Ci.nsIProtocolHandler.URI_NOAUTH |
                                    Ci.nsIProtocolHandler.URI_LOADABLE_BY_ANYONE, // Just showing characters
    /////  END PROTOCOL-HANDLER SPECIFIC  ///////
  
    classDescription: kPROTOCOL_NAME,
    classID:          kPROTOCOL_CID,
    contractID:       kPROTOCOL_CONTRACTID,
    /**
      * Reload the prototype live (avoid being stuck in the cache)
    */
    reload: function() {
        loader.loadSubScript(SOURCE, this.__proto__);
    },
    QueryInterface: XPCOMUtils.generateQI([Ci.nsIProtocolHandler]) // PROTOCOL-SPECIFIC
};
loader.loadSubScript(SOURCE, UnicodeProtocolHandler.prototype);

  
var components = [UnicodeProtocolHandler];

/**
* XPCOMUtils.generateNSGetFactory was introduced in Mozilla 2 (Firefox 4).
* XPCOMUtils.generateNSGetModule is for Mozilla 1.9.2 (Firefox 3.6).
*/
if (XPCOMUtils.generateNSGetFactory) {
    var NSGetFactory = XPCOMUtils.generateNSGetFactory(components);
}
else {
    var NSGetModule = XPCOMUtils.generateNSGetModule(components);
}
