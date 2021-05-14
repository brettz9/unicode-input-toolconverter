function Channel(aURI) {
   this.originalURI = aURI;
   this.URI = aURI;
}
Channel.prototype = {
    QueryInterface: function(iid) {
        if(!iid.equals(Ci.nsIChannel) &&
           !iid.equals(Ci.nsIRequest) &&
           !iid.equals(Ci.nsISupports))
            throw Cr.NS_ERROR_NO_INTERFACE;
        return this;
    },
    /* nsIChannel */
    owner: null,
    notificationCallbacks: null,
    securityInfo: null,
    contentType: 'x-application-' + kSCHEME,
    contentCharset : null,
    contentLength: 0,
    open: function() {
        throw Cr.NS_ERROR_NOT_IMPLEMENTED;
    },
    asyncOpen: function(observer, ctxt) {
    },
    /* nsIRequest (called on this object by asyncOpen) */
    status: Cr.NS_OK,
    isPending: function() {
        return true;
    },
    cancel: function(status) {
        this.status = status;
    },
    suspend: function() {
        throw Cr.NS_ERROR_NOT_IMPLEMENTED;
    },
    resume: function() {
        throw Cr.NS_ERROR_NOT_IMPLEMENTED;
    }
};


/*
Works
function make (str) {
    this.str = str;
}
make.prototype.toString = function () {
    return this.str;
};
make.prototype.QueryInterface = function QueryInterface(aIID) {
    if (aIID.equals(Components.interfaces.nsIObserver) ||
        aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
        aIID.equals(Components.interfaces.nsISupports))
        return this;
    throw Components.results.NS_NOINTERFACE;
};

var args = Components.classes["@mozilla.org/array;1"].createInstance(Components.interfaces.nsIMutableArray);
args.appendElement(new make('aa'), false);
args.appendElement(new make('ab'), false);
args.appendElement(new make('ac'), false);
*/


function NsiArrayWrapper () {
    var args = Components.classes["@mozilla.org/array;1"].createInstance(Components.interfaces.nsIMutableArray);
    for (var i = 0; i < arguments.length; i++) {
        args.appendElement(new NsiSupportsWrapper(arguments[i]), false); // Not a weak reference
    }
    return args;
}

function NsiSupportsWrapper (item) {
    this.item = item;
    this.wrappedJSObject = this; // Seems the only way I could get (easy?) access to our JavaScript content
}
NsiSupportsWrapper.prototype.toString = function () {
    return this.item;
};
NsiSupportsWrapper.prototype.QueryInterface = function QueryInterface(aIID) {
    if (aIID.equals(Components.interfaces.nsIObserver) ||
        aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
        aIID.equals(Components.interfaces.nsISupports))
        return this;
    throw Components.results.NS_NOINTERFACE;
};


// INTERFACE
/**
 * Method of nsIProtocolHandler to Indicate whether or not this protocol handler should allow a port (false)
 * @returns {Boolean} Whether or not to allow a port (false)
 */
function allowPort (port, scheme) {
    return false;
}

/**
 * Method of nsIProtocolHandler to create a new URI (not used?); URI object that is suitable for loading by the protocol
 * @param {String} spec UTF-8-encoded string specifying the URI
 * @param {String} charset The character set of the document from which the URI string originated (default is UTF-8)
 * @param {Components.interfaces.nsIURI|null} baseURI If null, spec must be an absolute URI, or spec to be resolved
 *                                                                                                            by this (unless irrelevant for this protocol)
 * @returns {Components.interfaces.nsIURI} A nsIURI object suitable for loading by this protocol
 */
function newURI (spec, charset, baseURI) {
    var uri = Cc['@mozilla.org/network/simple-uri;1'].createInstance(Ci.nsIURI);
    uri.spec = spec;
    return uri;
}

/**
 * Main method of nsIProtocolHandler to create a new channel; channel that is suitable for creating by the protocol;
 * the data below is incomplete and is based on an example; this is not implemented yet!
 * @param {Components.interfaces.nsIURI} aURI A nsIURI object which will be used to create a new channel
 * @returns {Components.interfaces.nsIChannel} A nsIChannel object (we're actually returning false now)
 */
function newChannel (aURI) {

    // aURI is a nsIUri, so get a string from it using .spec
    var uri = aURI.spec;

    // strip away the kSCHEME: part
    uri = uri.slice(uri.indexOf(':') + 1);
/*    // ADD TO HISTORY
    var historyServ = Cc['@mozilla.org/browser/nav-history-service;1'].getService(Ci.nsINavHistoryService);
    historyServ.QueryInterface(Ci.nsINavHistoryService); // inherits Ci.nsIGlobalHistory2 apparently
    historyServ.addURI(aURI, false, true, null); // nsIURI, bool redirect, bool top-level, nsIURI referrer
*/
// encodeURIComponent? Seems done automatically?
    var params = 'chrome, resizable, scrollbars, centerscreen, minimizable, dialog';
    var wwD = Cc['@mozilla.org/embedcomp/window-watcher;1'].getService(Ci.nsIWindowWatcher);
    var args = NsiArrayWrapper(uri); // Send in as arguments, instead of as URL query string to avoid Firefox treating
                                                                    // this as a unique window as far as persisting of values like XUL splitter positions;
                                                                    // we don't need to make the string bookmarkable, so this works here

    var wwDw = wwD.openWindow(null, CHROME_CONTENT+'uresults.xul', EXT_ABBR, params, args);
    wwDw.focus();

    /* create dummy nsIURI and nsIChannel instances */
    // var ios = Cc['@mozilla.org/network/io-service;1'].getService(Ci.nsIIOService);
    // return ios.newChannel("javascript:document.location.href='" + finalURL + "'", null, null);
    return new Channel(aURI);
}
