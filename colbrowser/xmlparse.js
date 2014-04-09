/*global ActiveXObject, DOMParser, XMLSerializer */
// This code is from the book JavaScript: The Definitive Guide, 5th Edition,
// by David Flanagan. Copyright 2006 O'Reilly Media, Inc. (ISBN #0596101996)
// with any modifications by Brett Zamir noted by "Brett"

/**
 * Parse the XML document contained in the string argument and return
 * a Document object that represents it.
 */
var XML = {};

XML.newDocument = function(rootTagName, namespaceURL) {


    if (!rootTagName) {
        rootTagName = "";
    }
    if (!namespaceURL) {
        namespaceURL = "";
    }

    if (document.implementation && document.implementation.createDocument) {
        // This is the W3C standard way to do it
        return document.implementation.createDocument(namespaceURL, rootTagName, null);
    }
    else { // This is the IE way to do it
        // Create an empty document as an ActiveX object
        // If there is no root element, this is all we have to do
        
        var progIDs = [ 'MSXML2.DOMDocument.6.0', 'MSXML2.DOMDocument.3.0'];
        for (var i = 0; i < progIDs.length; i++) {
            try {
                var doc = new ActiveXObject(progIDs[i]);
                break;
            }
            catch (ex) {
            }
        }
//        var doc = new ActiveXObject("MSXML2.DOMDocument");

        // If there is a root tag, initialize the document
        if (rootTagName) {
            // Look for a namespace prefix
            var prefix = "";
            var tagname = rootTagName;
            var p = rootTagName.indexOf(':');
            if (p != -1) {
                prefix = rootTagName.substring(0, p);
                tagname = rootTagName.substring(p+1);
            }

            // If we have a namespace, we must have a namespace prefix
            // If we don't have a namespace, we discard any prefix
            if (namespaceURL) {
                if (!prefix) {
                    prefix = "a0"; // What Firefox uses
                }
            }
            else {
                prefix = "";
            }

            // Create the root element (with optional namespace) as a
            // string of text
            var text = "<" + (prefix?(prefix+":"):"") +  tagname +
                (namespaceURL ?(" xmlns:" + prefix + '="' + namespaceURL +'"')     :    "") +
                "/>";
            // And parse that text into the empty document
            doc.loadXML(text);
        }
        return doc;
    }
};

XML.serialize = function(node) {
    if (typeof XMLSerializer != 'undefined') {
        return new XMLSerializer().serializeToString(node);
        }
    else if (node.xml) {
            return node.xml;
        }
    else {
            throw 'XML.serialize is not supported or can\'t serialize' + node;
        }
};

XML.parse = function(text) {
    if (typeof DOMParser !== "undefined") {
        // Mozilla, Firefox, and related browsers
        return new DOMParser().parseFromString(text, 'application/xml');
    }
    else if (typeof ActiveXObject !== "undefined") {
        // Internet Explorer.
        var doc = XML.newDocument();   // Create an empty document

        doc.loadXML(text);              //  Parse text into it
        return doc;                     // Return it
    }
    else {
        // As a last resort, try loading the document from a data: URL
        // This is supposed to work in Safari. Thanks to Manos Batsis and
        // his Sarissa library (sarissa.sourceforge.net) for this technique.
        var url = "data:text/xml;charset=utf-8," + encodeURIComponent(text);
        var request = new XMLHttpRequest();
        request.open("GET", url, false);
        request.send(null);
        return request.responseXML;
    }
};