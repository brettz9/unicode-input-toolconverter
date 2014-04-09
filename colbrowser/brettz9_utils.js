/*global brettz9 */

/**
 idea from http://weblogs.asp.net/mschwarz/archive/2005/08/26/423699.aspx
(function() {
    // Don't even put this in the global namespace (though advantage might be that one can easily create these anywhere if it is)
    function registerNS(ns) {
        var nsParts = ns.split('.');
        var root = window;
        for (var i=0; i < nsParts.length; i++) {
            if (root[nsParts[i]] === undefined) {
                root[nsParts[i]] = {};
            }
            root = root[nsParts[i]];
        }
    }
    registerNS('brettz9.PHP');
    registerNS('brettz9.DOM');
    registerNS('brettz9.XPath');
//    registerNS('brettz9'); // Don't need ".colbrowser" registered, as it creates an object; we create a function instead
})();
// can register a deeper namespaces (e.g., brettz9.PHP.mystuff) after the following, but not before it (or brettz9.PHP.mystuff will get overwritten with the following)
*/

/**
 * JavaScript equivalents for useful PHP functions
 *
 */
// Declare Namespace classes with their methods (these are not object-dependent, so can be class methods)
brettz9.PHP = function() { // Do anonymous constructor to indicate clearly that this is only a single instance
    // Private vars & methods
    // Trying as private method (but returning an alias to it) so any other methods can refer to it with the short name;
    //     does this have a hit on performance though?
    function _array_reverse (arr) {
        var arr_rev = [];
        for (var i = 0; i < arr.length; i++) {
            arr_rev[i] = arr[i];
        }
        arr_rev.reverse();
        return arr_rev;
    }
    function _array_search( needle, haystack, strict ) {
        // http://kevin.vanzonneveld.net
        // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // *     example 1: array_search('zonneveld', {firstname: 'kevin', middle: 'van', surname: 'zonneveld'});
        // *     returns 1: 'surname'
        var strict2 = !!strict;
        for(var key in haystack){
            if( (strict2 && haystack[key] === needle) || (!strict2 && haystack[key] == needle) ){
                return key;
            }
        }
        return false;
    }

    function _array_shift (array) {
        // http://kevin.vanzonneveld.net
        // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // *     example 1: array_shift(['Kevin', 'van', 'Zonneveld']);
        // *     returns 1: 'Kevin'

        var i=0, first_elm=null, cnt=0, tmp_arr = {};
        // input sanitation
        if( !array || !array.length ){
            return null;
        }

        if( array instanceof Array){
            first_elm = array[0];
            for( i = 0; i < array.length; i++ ){
                array[i] = array[i+1];
            }
            array.length--;
        }
        else {
            first_elm = array[0];
            for( i = 0; i < array.length-1; i++ ){
                tmp_arr[i] = array[i+1];
                //  alert(i+'::'+tmp_arr[i]);
            }
//            alert(array.length);
            array.length--;
        //                    alert(typeof array);
        /*for(var key in array){
        if( cnt == 0 ){
        first_elm = array[key];
        } else{
        tmp_arr[key] = array[key];
        }
        cnt ++;
        }*/
            array = tmp_arr;
        }
        return first_elm;
    }

    function _orig_array_shift (array) {
                // http://kevin.vanzonneveld.net
                // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                // *     example 1: array_shift(['Kevin', 'van', 'Zonneveld']);
                // *     returns 1: 'Kevin'
                
        var i=0, first_elm=null, cnt=0, tmp_arr = {};

        // input sanitation
        if( !array || (array.constructor !== Array && array.constructor !== Object) || !array.length ){
            return null;
        }

        if( array.constructor === Array ){
            first_elm = array[0];
            for( i = 0; i < array.length; i++ ){
                array[i] = array[i+1];
            }
            array.length--;
        }
        else if( array.constructor === Object ){
            for(var key in array){
                if( cnt === 0 ){
                    first_elm = array[key];
                }
                else{
                    tmp_arr[key] = array[key];
                }
                cnt ++;
            }
            array = tmp_arr;
        }
        return first_elm;
    }
    function _in_array(needle, haystack, strict0) {
        // http://kevin.vanzonneveld.net
        // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // *     example 1: in_array('van', ['Kevin', 'van', 'Zonneveld']);
        // *     returns 1: true
        var found = false, key, strict = !!strict0;
        for (key in haystack) {
            if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
                found = true;
                break;
            }
        }
        return found;
    }
    
    // Public vars & methods
    return {
        in_array : _in_array,
        array_reverse : _array_reverse,
        array_search : _array_search,
                array_shift : _array_shift
    };
}();

/**
 * Trace functions and arguments
 */
brettz9.trace = function() {
//        return {
//                calling : function calling() {
    var a = '', max =0, arg = arguments.callee;
    for (var caller = arg['caller']; caller; caller = caller['caller']) {
        var args ='';
        args += (caller.arguments[0])?('(1n): '+caller.arguments[0]):'\n';
        for (var i=1; i < caller.arguments.length; i++) {
            args += '\n\u00a0('+(i+1)+'n): '+caller.arguments[i];
        }
        a += '\nName: '+caller.name+' ; Args: '+caller.arguments.length+'\n '+args+(args.match('\n')?'':'\n'); // +''+caller + '\n';
        a += '\n';
        if (++max > 15) {break;}
    }
    alert(a);
    //window.open('', 'new', "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes");
//                }
//        }
};

// ();

brettz9.UTIL = function () {
    var _MOZ = navigator.userAgent.indexOf('Gecko/') !== -1 &&
                            navigator.vendor.indexOf('Apple') === -1, // Testing only for Firefox will miss Seamonkey, etc.
        _MOZWIN = navigator.appVersion.indexOf('Win') !== -1 && _MOZ,
        _MSIE = navigator.userAgent.indexOf('MSIE') !== -1,
        
        // Adapted a portion of script from http://www.quirksmode.org/js/detect.html used here for OS detection
        _searchString = function (data) {
              for (var i=0;i<data.length;i++)    {
                  var dataString = data[i].string;
                  if (dataString) {
                      if (dataString.indexOf(data[i].subString) !== -1) {
                          return data[i].identity;
                      }
                  }
              }
              return false;
        },
        dataOS = [
              {
                  string: navigator.platform,
                  subString: "Win",
                  identity: "Windows"
              },
              {
                  string: navigator.platform,
                  subString: "Mac",
                  identity: "Mac"
              },
              {
                  string: navigator.platform,
                  subString: "Linux",
                  identity: "Linux"
              }
        ],
        _OS = _searchString(dataOS);
    return {searchString: _searchString, MSIE:_MSIE, MOZ:_MOZ, MOZWIN:_MOZWIN, OS:_OS};
}();

/**
 * Implement interfaces for JavaScript (at least for requiring specific method names)
 * @dependency - brettz9.PHP.in_array
 **/

brettz9.JSClassUtil = function () {
    function _defineInterface (interfaceName /* Indefinite # of arrays representing required methods and # of required args */) {
        brettz9.JSClassUtil.interfaces[interfaceName] = arguments;
    }
    // Adapted from http://java.sun.com/javascript/ajaxinaction/Ajax_in_Action_ApB.html
    function _objHasMethod (obj, funcName) {
        return obj && obj[funcName] && obj[funcName] instanceof Function; // Need to check prototype too?
    }
    function _classHasMethod (className, methodName) {
        return className && 
                    (     (className[methodName] && className[methodName] instanceof Function) ||
                    (className.prototype[methodName] && className.prototype[methodName] instanceof Function)    );
    }
    function _objHasInterface (obj, interfaceName) {
        if (obj === null) {
            return false;
        }
        var theInterfaceArgs = brettz9.JSClassUtil.interfaces[interfaceName];
        for (var i=1; i < theInterfaceArgs.length; i++) { // Skip the first (which is only the interface name)
            var intfCount = theInterfaceArgs[i][1];
            var intfMethod = theInterfaceArgs[i][0];
            var theMethod = obj[intfMethod] || obj.prototype[intfMethod];
            if (!_objHasMethod(obj, intfMethod)) {
                return false;
            }
            else if (intfCount !== theMethod.length) {
                return false;
            }
        }
        return true;
    }
    function _classHasInterface (theClass, interfaceName) {
        if (theClass === null) {
            return false;
        }
        var theInterfaceArgs = brettz9.JSClassUtil.interfaces[interfaceName];
        for (var i=1; i < theInterfaceArgs.length; i++) { // Skip the first (which is only the interface name)
            var intfCount = theInterfaceArgs[i][1];
            var intfMethod = theInterfaceArgs[i][0];
            var theMethod = theClass.prototype[intfMethod] || theClass[intfMethod]; // The prototype should be first (otherwise it could grab 'Function' as the constructor
            if (!_classHasMethod(theClass, intfMethod)) {
                return false;
            }
            else if (intfCount !== theMethod.length) {
                return false;
            }
        }
        return true;
    }
    // Alias of isInterfaceOf
    function _adheresTo (obj, interfaceName) {
        isInterfaceOf (obj, interfaceName);
    }
    
    // Public vars & methods
    return {
        interfaces : [],
        defineInterface : _defineInterface,
        objHasMethod : _objHasMethod,
        classHasMethod : _classHasMethod,
        objHasInterface : _objHasInterface,
        classHasInterface : _classHasInterface,
        adheresTo : _adheresTo
//        brettz9.PHP.in_array();
    };
}();

/**
 * URI HELPER FUNCTION (PARSE URI INTO COMPONENTS)
 */
brettz9.URI = function() {
        /*
          parseUri 1.2.1
          (c) 2007 Steven Levithan <stevenlevithan.com>
          MIT License
          See: http://stevenlevithan.com/demo/parseuri/js/
        */
        function _parseUri (str) {
            var o   = _parseUri.options,
                    m   = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str),
                    uri = {},
                    i   = 14;
            while (i--) {uri[o.key[i]] = m[i] || '';}
            uri[o.q.name] = {};
            uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
                if ($1) {uri[o.q.name][$1] = $2;}
            });
            return uri;
        }
        _parseUri.options = {
            strictMode: true,
            key: ['source','protocol','authority','userInfo','user','password','host','port','relative','path','directory','file','query','anchor'],
            q:   {
                name:   'key', // 'queryKey',
                parser: /(?:^|&)([^&=]*)=?([^&]*)/g
            },
            parser: { 
                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
            }
        };
//        parseUri.options.strictMode = false;
        return {
            parse : _parseUri
        };
}();

/**
 * Get X/Y coordinates
 */
// Not in use at present:
brettz9.STYLE = function () {
    // Private vars & methods
    // Public vars & methods
    return {
        getX : function (element) {
            var x = 0;
                    
            for (var el = element; el; el = el.offsetParent) { // iterate the offsetLefts
                x += el.offsetLeft;
            }
            for (el = element.parentNode; el && el != document.body; el = el.parentNode) {
                if (el.scrollLeft) {
                    x -= el.scrollLeft; // subtract scrollbar values
                }
            }
            
            // This it the X coordinate with document-internal scrolling accounted for.
            return x; // Return the total offsetLeft
        },
        getY : function (element) {
            var y = 0;
            
            for (var el = element; el; el = el.offsetParent) { // iterate the offsetTops
                y += el.offsetTop;
            }
            
            for (el = element.parentNode; el && el != document.body; el = el.parentNode) {
                if (el.scrollTop) {
                    y -= el.scrollTop; // subtract scrollbar values
                }
            }
            
            // This it the Y coordinate with document-internal scrolling accounted for.
            return y; // Return the total offsetTop
        }
    };
}();

/**
 * XML HELPER FUNCTIONS (MAKE STRINGS SAFE FOR XML)
 */
brettz9.XML = function () {
    // Private vars & methods
    // Public vars & methods
    return {
        escapeString : function (str) {
            if (!str) {return '';}
            var str2 = str.replace(new RegExp('&', 'g'), '&amp;').replace(new RegExp('<', 'g'), '&lt;');
            return str2.replace(new RegExp(']]>', 'g'), ']]&gt;');
        }
    };
}();

/**
 * DOM RELATED HELPER FUNCTIONS
 */
brettz9.DOM = function() { // Do anonymous constructor to indicate clearly that this is only a single instance
    // Private vars & methods
    var scheme = /(\w(\w|\d|\+|\- |\ .)*)\:\/\//;
                
    function _replaceNodeWithNodes (par, oldNode, addNodes) {
        for (var i=0; i < addNodes.length ; i++) {
            par.insertBefore(addNodes[i], oldNode);
        }
        par.removeChild(oldNode);
    }
    function _getNodesAsArray(nodes, xpointer) {
        // Apply xpointer (only xpath1() subset is supported)
        var responseNodes;
        if (xpointer) {
            responseNodes = XML.getNodes(nodes, xpointer, null, nodes);
        }
        else { // Otherwise, the response must be a single well-formed document response
            responseNodes = [nodes.documentElement]; // Put in array so can be treated the same way as the above
        }
        return responseNodes;
    }
    function _addEvent (el, ev, handler, capture) {
        if (typeof el === 'string') {
            el = document.getElementById(el);
        }
        if (el.addEventListener) {
            capture = (capture)?capture:false;
            el.addEventListener(ev, handler, capture);
        }
        else if (el.attachEvent) {
            el.attachEvent('on'+ev, handler);
        }
    }
    function _getElementsByTagNameNSWrapper (doc, ns, el, context) {
        if (!doc) {
            doc = document;
        }
        if (!context) {
            context = doc;
        }
        /*alert(XML.serialize(doc));
        alert(XML.serialize(context));
        alert('//*[local-name()="'+el+'" and namespace-uri() = "'+ns+'"]');
        */
       return XML.getNodes(context, '//*[local-name()="'+el+'" and namespace-uri() = "'+ns+'"]', null, doc);
    }
    function _resolveXIncludes(docu) {
        // http://www.w3.org/TR/xinclude/#xml-included-items
        var i, xinclude, href, parse, xpointer, encoding, accept, acceptLanguage, xiFallback,
                j, encName, encodingType, encPattern, encPatternMatch, xincludeParent,
                response, responseNodes, responseType, patternXML, all, file,
                xincludes = _getElementsByTagNameNSWrapper(docu, 'http://www.w3.org/2001/XInclude', 'include');
        if (xincludes) {
            for (i=0; i < xincludes.length; i++) {
                xinclude = xincludes[i];
                href = _getXmlBaseLink (/* XLink sans xml:base */ xinclude.getAttribute('href'), 
                                                                                        /* Element to query from */ xinclude);
                parse = xinclude.getAttribute('parse');
                xpointer = xinclude.getAttribute('xpointer');
                encoding = xinclude.getAttribute('encoding'); // e.g., UTF-8 // "text/xml or application/xml or matches text/*+xml or application/*+xml" before encoding (then UTF-8)
                accept = xinclude.getAttribute('accept'); // header "Accept: "+x
                acceptLanguage = xinclude.getAttribute('accept-language'); // "Accept-Language: "+x 
                xiFallback = _getElementsByTagNameNSWrapper(docu, 'http://www.w3.org/2001/XInclude', 'fallback', xinclude)[0]; // Only one such child is allowed
                if (href === '' || href === null) { // Points to same document if empty (null is equivalent to empty string)
                    href = null; // Set for uniformity in testing below
                    if (parse === 'xml' && xpointer === null) {
                        alert('There must be an XPointer attribute present if "href" is empty an parse is "xml"');
                        return false;
                    }
                }
                else if (href.match(/#$/, '') || href.match(/^#/, '')) {
                    alert('Fragment identifiers are disallowed in an XInclude "href" attribute');
                    return false;
                }
                xincludeParent = xinclude.parentNode;
                try {
                    if (href !== null) {
                        // If file:// URL's don't work with Ajax in IE, when parsed as text, how do we get a 
                        //   returned content type first so we can look inside XML for encoding declarations? 
                        //   We'll just rely on the extension type here.
                        patternXML = /\.(svg|xml|xul|rdf|xhtml)$/;
                        
                        if (brettz9.UTIL.MOZ) {
                            // netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect UniversalBrowserRead'); // Necessary with file:///-located files trying to reach external sites
                        }
                        else if (brettz9.UTIL.MSIE && href.indexOf('file://') === 0) {
                            var fso = new ActiveXObject('Scripting.FileSystemObject');
                            var hrefURL = href.replace(/file\:\/\/\//g, '')
                            if (brettz9.UTIL.OS === 'Windows') {
                                hrefURL = hrefURL.replace(/\//g, '\\');
                            }
                            
                            // Relying on the file system is imperfect as this API in IE doesn't seem to allow encodings besides Unicode, ASCII and "default"
                            if (parse === 'text' && hrefURL.match(patternXML)) { // content type has higher priority than encoding attribute, but we are faking it by relying on file types
                                encName = '([A-Za-z][A-Za-z0-9._-]*)';
                                encPattern = new RegExp('^<\\?xml\\s+.*encoding\\s*=\\s*([\'"])'+encName+'\\1.*\\?>');
                                // Try to find encoding first inside, as that has priority (try as Unicode)
                                file = fso.OpenTextFile(hrefURL, 1, false, -2); // 1 is reading, 2 is writing, 8 is appending  per http://msdn.microsoft.com/en-us/library/314cz14s(VS.85).aspx 
                                                                                                // Fourth argument can be -2 sys default, -1 Unicode, 0 ASCII
                                all = file.ReadAll();
                                file.Close();
                                encPatternMatch = all.match(encPattern)
                                if (encPatternMatch) {
                                    encodingType = encPatternMatch[2];
                                    if (!encodingType) {
                                        encodingType = -2; // Go with system default if no encoding declaration present (since we can't distinguish between UTF-8)'
                                    }
                                }
                                else {
                                    encodingType = -2;
                                }
                                // Prepare for another possible call unless encoding was already Unicode       
                            }
                            else if (parse === 'text' && encoding) {
                                encodingType = encoding;
                                switch (encodingType.toLowerCase()) {
                                    case 'utf16': case 'utf-16':
                                        encodingType = -1; // "Unicode" works with little or big endian utf-16, but not utf-8 with or without BOM
                                        break;
                                    case 'ascii':
                                        encodingType = 0;
                                    case '': case null: case 'utf8': case 'utf-8':
                                        encodingType = -2; // We'll just hope the system default is UTF-8
                                        break;
                                    default: // We'll just hope an alternative encoding is the system default
                                        encodingType = -2;
                                        break;
                                }
                            }
                            else if (parse === 'text') {
                                var noEncoding = true;
                            }
                            else { // If parse XML, we are suppose do treat encoding as if application/xml 
                                    // per http://www.w3.org/TR/xinclude/#xml-included-items
                                    // Since there is no charset in a content type header to retrieve, we'll assume Unicode (is IE "Unicode" UTF-8 or UTF-16?)
                                encodingType = -2;
                            }
                            encodingType = -1;
                            //if forced to -1: 
                            // 16little: -1 // ok 
                            // 16big: -1 // ok
                            // 8BOM: -1 // bad (chin.)
                            //8noBOM: -1 // bad (chin.)
                            // when -2
                            // 16little: -2 // ? bad 
                            // 16big: -2 // ok
                            // 8BOM: -2 // bad (chin.)
                            //8noBOM: -2 // ok
                            
                            if (noEncoding) {
                                file = fso.OpenTextFile(hrefURL, 1, false); // 1 is reading, 2 is writing, 8 is appending  per http://msdn.microsoft.com/en-us/library/314cz14s(VS.85).aspx 
                                                                                                    // Fourth argument can be -2 sys default, -1 Unicode, 0 ASCII
                            }
                            else {
                                file = fso.OpenTextFile(hrefURL, 1, false, encodingType); // 1 is reading, 2 is writing, 8 is appending  per http://msdn.microsoft.com/en-us/library/314cz14s(VS.85).aspx 
                                                                                                    // Fourth argument can be -2 sys default, -1 Unicode, 0 ASCII
                            }
                            
                            all = file.ReadAll();
                            file.Close();

                            switch (parse) {
                                case 'text':
                                     if (xpointer) {
                                          alert('The xpointer attribute must not be present when parse = "text"');
                                          return false;
                                     }
                                     var textNode0 = docu.createTextNode(all);
                                     xincludeParent.replaceChild(textNode0, xinclude);
                                     continue; // return docu;
                                case null: case 'xml':
                                     responseNodes = _getNodesAsArray(XML.parse(all), xpointer);
                                      _replaceNodeWithNodes(xincludeParent, xinclude, responseNodes);
                                      continue; // return docu;
                                default:
                                    alert('XInclude element contains an invalid "parse" attribute value');
                                    return false;
                            }
                        }

                        try {
                            var request = HTTP.newRequest();
                            request.open('GET', href, false);
                        }
                        catch(e) {
                            alert(e.message+' : '+href);
                        }
                        request.setRequestHeader('If-Modified-Since', 'Thu, 1 Jan 1970 00:00:00 GMT');
                        request.setRequestHeader('Cache-Control', 'no-cache');
                        if (accept) {
                            request.setRequestHeader('Accept', accept);
                        }
                        if (acceptLanguage) {
                            request.setRequestHeader('Accept-Language', acceptLanguage);
                        }
                        switch (parse) {
                            case 'text':
                                if (xpointer) {
                                    alert('The xpointer attribute must not be present when parse = "text"');
                                    return false;
                                 }
                                 
                                // Priority should be on media type:
                                var contentType = request.getResponseHeader('Content-Type'); // This doesn't seem to work on local files
                                //text/xml; charset="utf-8" // Send to get headers first?
                                
                                // Fix: We test for file extensions as well in case file:// doesn't return content type (as seems to be the case); can some other tool be used in FF (or IE) to detect encoding of local file? Probably just need BOM test since other encodings must be specified
                                if ((contentType && contentType.match(/[text|application]\/(.*)\+?xml/)) || (href.indexOf('file://') === 0 && href.match(patternXML))) {
                                    /* Grab the response as text (see below for that routine) and then find encoding within*/
                                    encName = '([A-Za-z][A-Za-z0-9._-]*)';
                                    // Let the request be processed below
                                }
                                else {
                                    if (encoding === '' || encoding === null) { // Encoding has no effect on XML
                                        encoding = 'utf-8';
                                    }
                                    request.overrideMimeType('text/plain; charset='+encoding); //'x-user-defined'
                                }
                                responseType = 'responseText';
                                break;
                            case null: case 'xml':
                                responseType = 'responseXML';
                                break;
                            default:
                                alert('XInclude element contains an invalid "parse" attribute value');
                                return false;
                        }
                        request.send(null);
                        if ((request.status === 200 || request.status === 0) && request[responseType] !== null) {
                            response = request[responseType];
                            if (responseType === 'responseXML') {
                                // PREPEND ANY NODE(S) (AS XML) THEN REMOVE XINCLUDE
                                responseNodes = _getNodesAsArray(response, xpointer);
                                _replaceNodeWithNodes(xincludeParent, xinclude, responseNodes);
                            }
                            else if (responseType === 'responseText') {
                                if (encName) {
                                    encPattern = new RegExp('^<\\?xml\\s+.*encoding\\s*=\\s*([\'"])'+encName+'\\1.*\\?>');
                                    encodingType = response.match(encPattern);
                                    if (encodingType) {
                                        encodingType = encodingType[2];
                                    }
                                    else {
                                        encodingType = 'utf-8';
                                    }
                                    // Need to make a whole new request apparently since cannot convert the encoding after receiving it (to know what the encoding was)
                                    var request2 = new HTTP.newRequest();
                                    request2.overrideMimeType('text/plain; charset='+encodingType);
                                    request2.open('GET', href, false);
                                    request2.setRequestHeader('If-Modified-Since', 'Thu, 1 Jan 1970 00:00:00 GMT');
                                    request2.setRequestHeader('Cache-Control', 'no-cache');
                                    if (accept) {
                                        request.setRequestHeader('Accept', accept);
                                    }
                                    if (acceptLanguage) {
                                        request.setRequestHeader('Accept-Language', acceptLanguage);
                                    }
                                    request2.send(null);
                                      
                                    response = request2[responseType]; // Update the response for processing
                                }
                                // REPLACE XINCLUDE WITH THE RESPONSE AS TEXT
                                var textNode = docu.createTextNode(response); // createCDATASection would not be as safe since could get ']]>'
                                xincludeParent.replaceChild(textNode, xinclude);
                            }
                            // replace xinclude in doc with response now (as plain text or XML)
                        }
                    }
                }
                catch (e) { // Use xi:fallback if XInclude retrieval above failed
                        _replaceNodeWithNodes(xincludeParent, xinclude, xiFallback.childNodes);
                }
            }
        }
        return docu;
    }
    // Could simplify and also do the searching for the xlink based on 'thisitem'
    function _getXmlBaseLink (xlink, thisitem) {
        var xmlbase = '';
        if (!xlink.match(scheme)) { // Only check for XML Base if there is no protocol // tests for 'scheme' per http://www.ietf.org/rfc/rfc2396.txt'
            xmlbase = _getXmlBase (thisitem); 
            if (!xmlbase.match(/\/$/) && !xlink.match(/\/$/)) { // If no preceding slash on XLink or trailing slash on xml:base, add one in between
                xmlbase += '/';
            }
            else if (xmlbase.match(/\/$/) && xlink.match(/\/$/)) {
                xmlbase = xmlbase.substring(0, xmlbase.length-2); // Strip off last slash to join with XLink path with slash
            }
//                        alert(xmlbase + '::' + xlink);
        }

        var link = xmlbase + xlink;
        if (!link.match(scheme)) { // If there is no domain, we'll need to use the current domain
            var loc = window.location;
            if (link.indexOf('/') === 0 ) { // If link is an absolute URL, it should be from the host only
                link = loc.protocol + '//' + loc.host + link;
            }
            else { // If link is relative, it should be from full path, minus the file
                var dirpath = loc.pathname.substring(0, loc.pathname.lastIndexOf('/')-1);
                if (link.lastIndexOf('/') !== link.length-1) {
                    link += '/';
                }
                link = loc.protocol + '//' + loc.host + dirpath + link;
            }
        }

        return link;
    }
    function _getXmlBase (thisitem) {
            // Fix: Need to keep going up the chain if still a relative URL!!!!!
            // var ns = 'http://www.w3.org/XML/1998/namespace';
            var att, protocolPos, xmlbase = '', abs = false;
            // Avoid loop if node is not present
            if (!thisitem || !thisitem.nodeName) {
                return xmlbase;
            }
            // CHECK PRESENT ELEMENT AND HIGHER UP FOR XML:BASE
            // Now check for the next matching local name up in the hierarchy (until the document root)
            while (thisitem.nodeName !== '#document' && thisitem.nodeName !== '#document-fragment')  {
                att = thisitem.getAttribute('xml:base'); // xml: namespaces MUST use 'xml' prefix
                if (att) {
                    protocolPos = att.indexOf('//');
                    var protocolMatch = att.match(scheme);
                    if (protocolMatch) { // if has protocol, can stop
                        if (abs) {
                            var skipfile = (att.indexOf('///') === protocolPos) ? 3 : 2; // If the file protocol has an extra slashe, prepare to also skip it in the separator search
                            var att2 = att.indexOf('/', protocolPos + skipfile); // Find first path separator ('/') after protocol
                            if (att2 !== -1) {
                                att = att.substring(0, att2 - 1); // Don't want any trailing slash, as the absolute path to be added already has one
                            }
                        }
                        else if (!att.match(/\/$/)) { // If no trailing slash, add one, since it is being attached to a relative path
                            att += '/';
                        }
                        xmlbase = att + xmlbase; // If previous path was not absolute, resolve against the full URI here'
                        break;
                    }
                    else if (att.indexOf('/') === 0) { // if absolute (/), need to prepare for next time to strip out after slash
                        xmlbase = att + xmlbase;
                        abs = true; // Once the protocol is found on the next round, make sure any extra path is ignored
                    }
                    else { // if relative, just add it
                        xmlbase = att + xmlbase;
                    }
                }
                thisitem = thisitem.parentNode;
            }
            //return (xmlbase === '') ? null : xmlbase;
            return xmlbase;
    }
    function _getAttributeNSWrapper (thisitem, ns, nsatt) {
        var attrs2, result;
        if (thisitem === null) {
            return false;
        }
        else if (thisitem.getAttributeNS) {
            return thisitem.getAttributeNS(ns, nsatt);
        }
        else if (ns === null) {
            return thisitem.getAttribute(nsatt);
        }
        else if (ns === 'http://www.w3.org/XML/1998/namespace') { // This is assumed so don't try to get an xmlns for the 'xml' prefix
            return thisitem.getAttribute('xml:'+nsatt); // Prefix must be 'xml' per the specs
        }
        var attrs = thisitem.attributes;
        var prefixAtt = new RegExp('^(.*):'+nsatt.replace(/\./g, '\\.')+'$'); // e.g., xlink:href  // Find any prefixes with the local-name being searched (escape period since only character (besides colon) allowed in an XML Name which needs escaping)
        for (var j = 0; j < attrs.length; j++) { // thisitem's atts // e.g.,  abc:href, xlink:href
            while (((result = prefixAtt.exec(attrs[j].nodeName)) !== null) && 
                            thisitem.nodeName !== '#document' && thisitem.nodeName !== '#document-fragment') {
                var xmlnsPrefix = new RegExp('^xmlns:'+result[1]+'$'); // e.g., xmnls:xl, xmlns:xlink
                // CHECK HIGHER UP FOR XMLNS:PREFIX
                // Now check for the next matching local name up in the hierarchy (until the document root)
                while (thisitem.nodeName !== '#document' && thisitem.nodeName !== '#document-fragment')  {
                    attrs2 = thisitem.attributes;
                    for (var i = 0; i < attrs2.length; i++) { // Search for any prefixed xmlns declaration on thisitem which match prefixes found above with desired local name
                        if (attrs2[i].nodeName.match(xmlnsPrefix) &&
                            attrs2[i].nodeValue === ns ) { // e.g., 'xmlns:xlink' and 'http://www.w3.org/1999/xlink'
                            return attrs[j].nodeValue;
                        }
                    }
                    thisitem = thisitem.parentNode;
                }
            }
        }
        return ''; // if not found (some implementations return 'null' but this is not standard)
    }
    function _stopEventFully(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        else {
            e.cancelBubble = true;
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        else {
            e.returnValue = false;
        }
     }
     function _importNode (node, allChildren, doc) { // Adapted from http://www.alistapart.com/articles/crossbrowserscripting
        if (doc.importNode) {
            return doc.importNode(node, allChildren);
        }
        switch (node.nodeType) {
            case 1: // ELEMENT_NODE:
                var i, il, newNode = doc.createElement(node.nodeName);
                /* does the node have any attributes to add? */
                if (node.attributes && node.attributes.length > 0) {
                    for (i = 0, il = node.attributes.length; i < il;) {
                        newNode.setAttribute(node.attributes[i].nodeName, node.getAttribute(node.attributes[i++].nodeName));
                    }
                }
                /* are we going after children too, and does the node have any? */
                if (allChildren && node.childNodes && node.childNodes.length > 0) {
                    var importtemp;
                    for (i = 0, il = node.childNodes.length; i < il;) {
                        importtemp = brettz9.DOM.importNode (node.childNodes[i++], allChildren, doc);
                        newNode.appendChild(importtemp);
                    }
                }
                return newNode;
            case 3: // doc.TEXT_NODE:
            case 4: // doc.CDATA_SECTION_NODE:
            case 8: // doc.COMMENT_NODE:
                return doc.createTextNode(node.nodeValue);
/* Brett added but unnecessary?
            case 2: // ATTRIBUTE_NODE
            case 7: // PROCESSING_INSTRUCTION_NODE
            case 10: // DOCUMENT_TYPE_NODE
*/
            default :
                return false;
        }
        return false; // Just for sake of Netbeans' parser!
    }
    // Public vars & methods
    return {
        // Fix: Does this need to be namespace aware?
        stopEventFully : _stopEventFully,
        getNodesAsArray : _getNodesAsArray,
        getElementsByTagNameNSWrapper : _getElementsByTagNameNSWrapper,
        getAttributeNSWrapper : _getAttributeNSWrapper,
        resolveXIncludes : _resolveXIncludes,
        getXmlBaseLink : _getXmlBaseLink,
        getXmlBase : _getXmlBase,
        addEvent : _addEvent,
        importNode : _importNode,
        replaceNodeWithNodes : _replaceNodeWithNodes,
        createElementNSwrapper : function (ns, el, doc) {
            if (!doc) {
                doc = document;
            }
            if (doc.createElementNS) {
                return doc.createElementNS(ns, el);
            }
            else {
                var elnew = doc.createElement(el);
                elnew.setAttribute('xmlns', ns);
                return elnew;
            }
        },
        // From http://www.dustindiaz.com/top-ten-javascript/ (public domain)
        insertAfter : function (parent, node, referenceNode) {
            parent.insertBefore(node, referenceNode.nextSibling);
        },
        addCommandEvent : function (el, handler, capture) {
            _addEvent(el, 'click', handler, capture);
        //    _addEvent(el, 'keypress', handler, capture);
        },
        // These two are not currently being used
        getcompstyle : function (target, style) {
            if (window.getComputedStyle) {
                return window.getComputedStyle(target, null)[style]; // Could grab coordinates if positioned absolutely
            }
            else if (target.currentStyle) {
                return target.currentStyle[style];
            }
            else {
                return false; // Did to avoid warnings, but should address
            }
        },
        getElementsWrapper : function (ns, el, doc) {
            if (!doc) {
                doc = document;
            }
            if (doc.getElementsByTagNameNS && doc.contentType !== 'text/html') {
                return doc.getElementsByTagNameNS(ns, el);
            }
            else {
                return doc.getElementsByTagName(el);
            }
        }
    };
}();
/**
 * XPATH FUNCTION - GET A UNIQUE XPATH LEADING TO A GIVEN ELEMENT
 */
brettz9.XPath = function() { // Do anonymous constructor to indicate clearly that this is only a single instance
    // Private vars & methods
    // Public vars & methods
    return {
        getXPathForElement : function(el, xml) {
            var pos, tempitem2, xpath = '';

            while (el !== xml.documentElement) {
                pos = 0;
                tempitem2 = el;
                while (tempitem2) {
                    if (tempitem2.nodeType === 1 && tempitem2.nodeName === el.nodeName) { // If it is ELEMENT_NODE
                        pos++;
                    }
                    tempitem2 = tempitem2.previousSibling;
                }
            
                xpath = "*[name()='"+el.nodeName+"' and namespace-uri()='"+(el.namespaceURI===null?'':el.namespaceURI)+"']["+pos+']'+'/'+xpath;

                el = el.parentNode;
            }

            // This doesn't work due to the XPath function not being able to handle default namespaces: http://developer.mozilla.org/en/docs/Introduction_to_using_XPath_in_JavaScript#Using_XPath_functions_to_reference_elements_with_its_default_namespace
            //xpath = '/'+xml.documentElement.nodeName+"[namespace-uri()='"+(el.namespaceURI===null?'':el.namespaceURI)+"']"+'/'+xpath;
            
            xpath = '/*'+"[name()='"+xml.documentElement.nodeName+"' and namespace-uri()='"+(el.namespaceURI===null?'':el.namespaceURI)+"']"+'/'+xpath;
            xpath = xpath.replace(/\/$/g, '');
            return xpath;
        }
    };
}();

// SET UP INTERFACES WITH REQUIRED METHODS AND NUMBER OF ARGS
// Could add these to the colbrowser constructor, but it would unnecessarily be attached to each instance of the colbrowser
// Safe here as long as called before column browsers are instantiated (and not really necessary except for error checking)

/**
 * @interface
 */
brettz9.JSClassUtil.defineInterface('InfoStrategy', ['constructor', 1], ['populateMetaInfo', 1], ['populateDocInfo', 1], ['populateAllInfo', 2]);

/**
 * @interface
 * addColumnEntryName should return text for a column entry based on a given element
 * addColumnEntryTitle should get a tooltip (or return null or empty string)
 */
brettz9.JSClassUtil.defineInterface('ColDisplayStrategy', ['constructor', 0], ['addColumnEntryName', 2], ['addColumnEntryTitle', 2]);
