// TO-DO: make in-place context-menu-activated textbox conversions
// To-do: move at least this file into module, and move as much of uresults.js too

var FileUtils = {}, Hangul = {};
Components.utils['import']('resource://charrefunicode/unicode_utils.js');
Components.utils['import']('resource://charrefunicode/file_utils.js', FileUtils);
Components.utils['import']('resource://charrefunicode/Hangul.js', Hangul);


(function () {

var EXT_BASE = 'extensions.charrefunicode.',
    Cc = Components.classes,
    Ci = Components.interfaces;

/**
 * If we move to HTML5 (or JS code module), this might simply obtain a JavaScript file 
 * of property variables based on locale
 */
function _s (str) {
    var strs = document.getElementById('charrefunicode-strings');
    return strs.getString(str);
}

/**
 * If we move to HTML5, this could query localStorage instead
 */
var _getPrefs = (function () {
    var prefs = Cc['@mozilla.org/preferences-service;1'].getService(Ci.nsIPrefService);
    return function _getPrefs (pref) {
        switch(pref) {
            case 'cssWhitespace':
                return prefs.getCharPref(EXT_BASE+pref);
            default:
                return prefs.getBoolPref(EXT_BASE+pref);
        }
    };
}());



/**
 * Ought to try IndexedDB for this for possible future migration to HTML5
 */
var charrefunicodeDb = {
    dbConn : null,
    dbConnUnihan : null,
    connect : function (dbfile, key) {
        if (typeof dbfile === 'string' && key !== 'unihan') {
            var tempfilename = dbfile; // Can have forward slashes for sub-directories
            // The following is what we normally want to use, but here we can put our data within the extension because
            //   it should not be edited by the user anyways (whereby they'd want their data to be retained after an update)
            /*/dbfile = Cc['@mozilla.org/file/directory_service;1']
                                    .getService(Ci.nsIProperties)
                                    .get('ProfD', Ci.nsILocalFile);
            dbfile.append(tempfilename);*/
            var MY_ID = 'charrefunicode@brett.zamir';            
            dbfile = FileUtils.getFile(MY_ID, tempfilename);
        }
        else {
            dbfile = FileUtils.getProfFile(dbfile);
        }
        if( !dbfile.exists() ) {   // if it doesn't exist, create  // || !file.isDirectory()
            throw 'Database '+dbfile.path+' doesn\'t exist';
            // dbfile.create(Ci.nsIFile.NORMAL_FILE_TYPE, 0777); // DIRECTORY_TYPE
        }
        var storageService = Cc['@mozilla.org/storage/service;1'].getService(Ci.mozIStorageService);
        if (key === 'unihan') {
            this.dbConnUnihan = storageService.openDatabase(dbfile);
        }
        else if (key === 'jamo') {
            this.dbJamo = storageService.openDatabase(dbfile);
        }
        else {
            this.dbConn = storageService.openDatabase(dbfile);
        }
    }
};
try {
    charrefunicodeDb.connect('data/Unicode.sqlite');
    charrefunicodeDb.connect('Unihan6.sqlite', 'unihan');
    charrefunicodeDb.connect('data/Jamo.sqlite', 'jamo');
}
catch(e) {
    
}


/**
 * @namespace Converts from one string form to another
 */
var charrefunicodeConverter = {
    charref2unicodeval : function(out) {
        out = out.replace(this.decim, function(match, match1){return fixFromCharCode(match1);});
        out = out.replace(this.hexadec, function(match, match1){return fixFromCharCode(parseInt(match1, 16));});
        return out;
    },
    charref2htmlentsval: function(out) {
        var that = this;
        var xhtmlentmode = _getPrefs('xhtmlentmode'); // If true, should allow conversion to &apos;

        out = out.replace(this.decim,
            function (match, match1) {
                var matched = CharrefunicodeConsts.charrefs.indexOf(parseInt(match1, 10));
                if (matched !== -1 && (matched != (98 + that.shiftcount) || xhtmlentmode)) {
                    return '&'+CharrefunicodeConsts.ents[matched]+';';
                }
                else {
                    return match;
                }
            }
        );
        out = out.replace(this.hexadec, 
            function(match, match1) {
                var matched = CharrefunicodeConsts.charrefs.indexOf(parseInt('0x' + match1, 16));
                if (matched !== -1 && (matched != (98 + that.shiftcount) || xhtmlentmode)) {
                    return '&'+CharrefunicodeConsts.ents[matched]+';';
                }
                else {
                    return match;
                }
            }
        );
        return out;
    },
    unicode2charrefDecval : function (unicodeToConvert, leaveSurrogates) {
        var out = '';
        for (var i=0; i < unicodeToConvert.length; i++) {
            var temp = unicodeToConvert.charCodeAt(i);
            if (!leaveSurrogates && temp >= 0xD800 && temp < 0xF900) { // surrogate
                    temp = ((temp - 0xD800) * 0x400) + (unicodeToConvert.charCodeAt(i+1) - 0xDC00) + 0x10000;
                    // Could do test on temp.isNan()  (e.g., if trying to convert a surrogate by itself in regular (non-surrogate converting) mode)
                    out += '&#' + temp + ';';
                    i += 1; // Skip the next surrogate
                    continue;
            }
            else if (temp >= 128 || _getPrefs('asciiLt128')) { /* replace this 'if' condition and remove the 'else' if also want ascii */
                out += '&#' + temp + ';';
            }
            else {
                out += unicodeToConvert.charAt(i);
            }
        }
        return out;
    },
    unicode2charrefHexval : function (unicodeToConvert, leaveSurrogates, type) {
//alert(unicodeToConvert + '::' + leaveSurrogates + '::' + type);

        var out = '';
        var xstyle, beginEscape, endEscape, cssUnambiguous;
        // Fix: offer a U+.... option (similar to 'php' or 'javascript' depending on if length is desired as 4 or 6)
        if (type === 'javascript' || type === 'php') {
            xstyle = '';
            beginEscape = '\\u';
            endEscape = '';
        }
        else if (type === 'css') {
            cssUnambiguous = _getPrefs('cssUnambiguous');
            xstyle = '';
            beginEscape = '\\';
            endEscape = cssUnambiguous ? '' : _getPrefs('cssWhitespace');
        }
        else {
            xstyle = 'x';
            beginEscape = '&#';
            endEscape = ';';
            /*
            if (!_getPrefs('hexstyleLwr')) {
                xstyle = 'X';
            }
            */
        }

        for (var i=0; i < unicodeToConvert.length; i++) {
            var temp = unicodeToConvert.charCodeAt(i);

            var hexletters;
            if (!leaveSurrogates && temp >= 0xD800 && temp < 0xF900) { // surrogate
                temp = ((temp - 0xD800) * 0x400) + (unicodeToConvert.charCodeAt(i+1) - 0xDC00) + 0x10000;
                hexletters = temp.toString(16);
                i += 1; // Skip the next surrogate
                if (_getPrefs('hexLettersUpper')) {
                    hexletters = hexletters.toUpperCase();
                }
                if ((type === 'php' || cssUnambiguous) && hexletters.length < 6) {
                    hexletters = new Array(7-hexletters.length).join(0) + hexletters; // pad
                }
                out += beginEscape + xstyle + hexletters + endEscape;
                continue;
            }
            else if (temp >= 128 || _getPrefs('asciiLt128')) { /* replace this 'if' condition and remove the 'else' if also want ascii */
                hexletters = temp.toString(16);
                if (_getPrefs('hexLettersUpper')) {
                    hexletters = hexletters.toUpperCase();
                }
                if (type === 'javascript' && hexletters.length < 4) {
                    hexletters = new Array(5-hexletters.length).join(0) + hexletters; // pad
                }
                else if ((type === 'php' || cssUnambiguous) && hexletters.length < 6) {
                    hexletters = new Array(7-hexletters.length).join(0) + hexletters; // pad
                }
                out += beginEscape + xstyle + hexletters + endEscape;
            }
            else {
                out += unicodeToConvert.charAt(i);
            }
        }
        return out;
    },

    unicode2htmlentsval : function (unicodeToConvert) {
        function preg_quote (str) {
            // http://kevin.vanzonneveld.net
            // +   original by: booeyOH
            // +   improved by: Ates Goral (http://magnetiq.com)
            // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // +   bugfixed by: Onno Marsman
            // +   improved by: Brett Zamir (http://brett-zamir.me)
            return str.replace(/[.\\+*?\[\^\]$(){}=!<>|:\-]/g, '\\$&');
        }

        for (var i=0; i < this.newents.length; i++) {
            var regex = new RegExp(preg_quote(this.newcharrefs[i]), 'gm'); // Escaping necessary for custom entities added via the DTD
            unicodeToConvert = unicodeToConvert.replace(regex, '&'+this.newents[i]+';');
        }

        var out = '';
        var xhtmlentmode = _getPrefs('xhtmlentmode'); // If true, should allow conversion to &apos;
        var ampkeep = _getPrefs('ampkeep'); // If true, will not convert '&' to '&amp;'

        for (i=0; i < unicodeToConvert.length; i++) {

            var charcodeati = unicodeToConvert.charCodeAt(i);
            var tempcharref = CharrefunicodeConsts.charrefs.indexOf(charcodeati);

            if (tempcharref !== -1 && (tempcharref != (98 + this.shiftcount) || xhtmlentmode) && (tempcharref != (99  + this.shiftcount) || !ampkeep)) {
                out += '&'+CharrefunicodeConsts.ents[tempcharref]+';';
            }
            else {
                out += unicodeToConvert.charAt(i);
            }
        }
        return out;
    },

    htmlents2charrefDecval : function (out) {
        var that = this;
        var xmlentkeep = _getPrefs('xmlentkeep'); // If true, don't convert &apos;, &quot;, &lt;, &gt;, and &amp;
        out = out.replace(this.htmlent,
            function(match, match1) {
                if (!xmlentkeep ||
                    (match1 !== 'apos' && match1 !== 'quot' && match1 !== 'lt' && 
                        match1 !== 'gt' && match1 !== 'amp')) {
                    if (that.newents.indexOf(match1) !== -1) { // If recognized multiple char ent. (won't convert these to decimal)
                        var ret = that.newcharrefs[that.newents.indexOf(match1)];
                        return ret;
                    }
                    else if (CharrefunicodeConsts.ents.indexOf(match1) !== -1) { // If recognized single char. ent.
                        return '&#'+CharrefunicodeConsts.charrefs[CharrefunicodeConsts.ents.indexOf(match1)]+';';
                    }
                    else { // If unrecognized
                        return '&'+match1+';';
                    }
                }
                else { // If keeping predefined XML entities (and this is one)
                    return '&'+match1+';';
                }
            }
        );
        return out;
    },

    htmlents2charrefHexval : function (out) {
        var that = this;
        var xstyle = 'x';
        /*if (!_getPrefs('hexstyleLwr')) {
            xstyle = 'X';
        }*/
        var xmlentkeep = _getPrefs('xmlentkeep'); // If true, don't convert &apos;, &quot;, &lt;, &gt;, and &amp;
        out = out.replace(this.htmlent,
            function(match, match1) {
                if (!xmlentkeep || (match1 !== 'apos' && match1 !== 'quot' && match1 !== 'lt' && match1 !== 'gt' && match1 !== 'amp')) {
                    var b = CharrefunicodeConsts.charrefs[CharrefunicodeConsts.ents.indexOf(match1)];
                    var c = that.newents.indexOf(match1);

                    if (c !== -1) { // If recognized multiple char. ent. (won't convert these to hexadecimal)
                        var ret = that.newcharrefs[c];
                        return ret;
                    }
                    else if (CharrefunicodeConsts.ents.indexOf(match1) !== -1) { // If recognized single char. ent.
                        var hexletters = b.toString(16);
                        if (_getPrefs('hexLettersUpper')) {
                            hexletters = hexletters.toUpperCase();
                        }
                        return '&#'+xstyle+hexletters+';';
                    }
                    else { // If unrecognized ent.
                        return '&'+match1+';';
                    }
                }
                else { // If keeping predefined XML entities (and this is one)
                    return '&'+match1+';';
                }
            }
        );
        return out;
    },
    htmlents2unicodeval : function (out) {
        var that = this;
        var xmlentkeep = _getPrefs('xmlentkeep'); // If true, don't convert &apos;, &quot;, &lt;, &gt;, and &amp;
        out = out.replace(this.htmlent,
            function(match, match1) {
                if (!xmlentkeep || (match1 !== 'apos' && match1 !== 'quot' && match1 !== 'lt' && match1 !== 'gt' && match1 !== 'amp')) {
                    var b = CharrefunicodeConsts.charrefs[CharrefunicodeConsts.ents.indexOf(match1)];

                    if (that.newents.indexOf(match1) !== -1) { // If recognized multiple char ent.
                        var ret = that.newcharrefs[that.newents.indexOf(match1)];
                        return ret;
                    }
                    else if (CharrefunicodeConsts.ents.indexOf(match1) !== -1) { // If recognized single char. ent.
                        return fixFromCharCode(b);
                    }
                    else { // If unrecognized
                        return '&'+match1+';';
                    }
                }
                else { // If keeping predefined XML entities (and this is one)
                    return '&'+match1+';';
                }
            }
        );
        return out;
    },
    hex2decval : function (out) {
        out = out.replace(this.hexadec, function(match, match1){return '&#'+parseInt(match1, 16)+';';});
        return out;
    },
    dec2hexval : function (out) {
        var xstyle = 'x';
        /*if (!_getPrefs('hexstyleLwr')) {
            xstyle = 'X';
        }*/
        out = out.replace(this.decim,
            function(match, match1){
                var hexletters = Number(match1).toString(16);
                if (_getPrefs('hexLettersUpper')) {
                    hexletters = hexletters.toUpperCase();
                }
                return '&#'+xstyle+hexletters+';';
            }
        );
        return out;
    },

    unicode2CharDescVal : function (toconvert) {
        var val = '', charDesc;
        for (var i=0; i < toconvert.length; i++) {
            var temp = toconvert.charCodeAt(i);
            if (temp >= 0xD800 && temp < 0xF900) { // surrogate
                    temp = ((temp - 0xD800) * 0x400) + (toconvert.charCodeAt(i+1) - 0xDC00) + 0x10000;
                    // Could do test on temp.isNan()  (e.g., if trying to convert a surrogate by itself in regular (non-surrogate converting) mode)
                    charDesc = this.getCharDescForCodePoint(temp);
                    if (!charDesc) {
                        val += toconvert.charAt(i)+toconvert.charAt(i+1);
                        i += 1; // Skip the next (low) surrogate
                        continue;
                    }
                    val += '\\C{'+charDesc+'}';
                    i += 1; // Skip the next (low) surrogate
                    continue;
            }
            // Fix: Can/Will Hangul syllables be expressible this way?
            else if (0xAC00 <=  temp && temp <= 0xD7A3) {
                try {
                    val += '\\C{'+Hangul.getHangulName(temp)+'}';
                }
                catch(e) {
                    val += toconvert.charAt(i);
                }
            }
            else if (temp >= 128 || _getPrefs('asciiLt128')) { /* replace this 'if' condition and remove the 'else' if also want ascii */
                charDesc = this.getCharDescForCodePoint(temp);
                if (!charDesc) { // Skip if no description in database
                    val += toconvert.charAt(i);
                    continue;
                }
                val += '\\C{'+charDesc+'}';
            }
            else {
                val += toconvert.charAt(i);
            }
        }
        return val;
    },
    charDesc2UnicodeVal : function (toconvert) {
        var that = this;
        return toconvert.replace(/\\C\{([^}]*)\}/g, function (n, n1) {
            var unicodeVal = that.lookupUnicodeValueByCharName(n1);
            return unicodeVal ? fixFromCharCode(unicodeVal) : '\uFFFD'; // Replacement character if not found?
        });
    },
    
    cssescape2unicodeval : function (toconvert) {
        // See:
        // http://www.w3.org/TR/CSS21/syndata.html#characters
        // http://www.w3.org/TR/CSS21/grammar.html
        var unicode = '';
        for (var i = 0; i < toconvert.length; i++) {
            var s = toconvert[i];
            if (s !== '\\') {
                unicode += s;
                continue;
            }
            var next = toconvert[i+1];
            switch(next) {
                case '\r':
                    if (toconvert[i+2] === '\n') {
                        unicode += s+next+toconvert[i+2];
                        i++; // Skip the extra newline character here
                        break;
                    }
                    // Fall-through
                case '\n':
                    // Fall-through
                case '\f':
                    // Copy as is:
                    unicode += s+next;
                    break;
                default:
                    var hexEsc = toconvert.slice(i+1).match(/^([A-Fa-f\d]{1,5})(([A-Fa-f\d])|(\r\n|[ \t\r\n\f])?)/); // 1-5 hex and WS, or 6 hex
                    if (hexEsc) {
                        i += hexEsc[0].length-1; // We want to skip the whole structure
                        var hex = hexEsc[1]+(hexEsc[3] || ''); // [3] only if is 6-digit
                        var dec = parseInt(hex, 16);
                        var hexStr = fixFromCharCode(dec);

                        // \u000 is disallowed in CSS 2.1 (behavior undefined) and above 0x10FFFF is
                        //    beyond valid Unicode; fix: disallow non-characters too?
                        if (dec > 0x10FFFF || dec === 0) {
                            unicode += '\uFFFD'; // Replacement character since not valid Unicode
                        }
                        // Too low ASCII to be converted (not a letter, digit, underscore, or hyphen)
                        else if (dec < 0xA1 && (/[^\w\-]/).test(hexStr)) { // Don't convert since won't be valid if unescaped
                            // Although http://www.w3.org/TR/CSS21/grammar.html#scanner (under "nonascii" which is a
                            //  possible (indirect) component of identifiers) seems to permit any non-ASCII equal to or above
                            //  0x80 (decimal 128), per http://www.w3.org/TR/CSS21/syndata.html#characters only non-escaped
                            // characters above 0xA1 are permitted (limitation of Flex scanner based in Latin?); testing in Firefox
                            // also shows values lower than 0xA1 in CSS do not work there unless escaped
                            unicode += s+hexEsc[0];
                        }
                        // If begins with a digit or hyphen and digit, might not be valid if unescaped (if at beginning of
                        //   identifier) so don't convert (if followed by an escaped number, there is no concern it will
                        //   be avoided here, since the escaped number will remain escaped on the next
                        //   iteration (by this same condition)
                        else if ((/^-?\d/).test(hexStr+toconvert[i+2])) {
                            unicode += s+hexEsc[0];
                        }
                        else {
                            unicode += hexStr;
                        }
                    }
                    else {
                        // [^\r\n\f0-9a-f] // May be escaping something that needs to be escaped for CSS grammar, so keep
                        unicode += s+next;
                    }
                    break;
            }
            i++;
        }
        return unicode;
    },

    jsescape2unicodeval : function (toconvert, mode) {
        var unicode = '', hexChrs;
        for (var i = 0; i < toconvert.length; i++) {
            var s = toconvert[i];
            if (s !== '\\') {
                unicode += s;
            }
            else {
                var next = toconvert[i+1];
                if (mode == 'php') {
                    switch (next) {
                        case '\\': // Just add one backslash
                            unicode += s;
                            break;
                        case 'u':
                            hexChrs = (/^[a-fA-F\d]{6}|[a-fA-F\d]{4}/).exec(toconvert.slice(i+2));
                            if (hexChrs) {
                                unicode += fixFromCharCode(parseInt(hexChrs[0], 16));
                                i += hexChrs[0].length; // 4 or 6
                                break;
                            }
                        // Fall-through
                        default:
                            unicode += s+next;
                            break;
                    }
                }
                else {
                    switch (next) {
                        case '\\': // Just add one backslash
                            unicode += s;
                            break;
                        case 'r':
                            unicode += '\u000D';
                            break;
                        case 'n':
                            unicode += '\n';
                            break;
                        case 't':
                            unicode += '\t';
                            break;
                        case 'f':
                            unicode += '\f';
                            break;
                        case 'v':
                            unicode += '\v';
                            break;
                        case 'b':
                            unicode += '\b';
                            break;
                        case 'u':
                            hexChrs = (/^[a-fA-F\d]{4}/).exec(toconvert.slice(i+2));
                            if (hexChrs) {
                                unicode += String.fromCharCode(parseInt(hexChrs[0], 16));
                                i += hexChrs[0].length; // 4
                                break;
                            }
                            // Fall-through
                        default: // Unrecognized escape, so just add both characters
                            unicode += s+next;
                            break;
                    }
                }
                i++;
            }
        }
        return unicode;
    },

    unicode2jsescapeval : function (toconvert) {
        return this.unicode2charrefHexval(toconvert, true, 'javascript');
    },
    unicodeTo6DigitVal : function (toconvert) {
        return this.unicode2charrefHexval(toconvert, false, 'php');
    },
    unicode2cssescapeval : function (toconvert) {
        return this.unicode2charrefHexval(toconvert, false, 'css');
    },
    sixDigit2UnicodeVal : function (toconvert) {
        return this.jsescape2unicodeval(toconvert, 'php');
    },

    /**
     * Obtain a Unicode character description for a given decimal-expressed code point
     * @param {Number} dec The code point of the description to obtain
     * @returns {String} The Unicode character description
     */
    getCharDescForCodePoint : function (dec) {
        // Fix: handle Hangul syllables; CJK?
        var statement;
        try {
            var result;
            var hex = dec.toString(16).toUpperCase();
            hex = hex.length < 4 ? new Array(5-hex.length).join(0)+hex : hex;

            statement = charrefunicodeDb.dbConn.createStatement(
                'SELECT `Name` FROM Unicode WHERE `Code_Point` = "'+hex+'"'
            );
            while (statement.executeStep()) { // put in while in case expand to allow LIKE checks (e.g., to get a list
                // of matching descriptions within a given code point range, etc.)
                result = statement.getUTF8String(0);
                if (result === null) {
                    return false;
                }
            }
            return result;
        }
        catch (e) {
            alert(e);
        }
        finally {
            statement.reset();
        }
    },
    /**
     * Search for a Unicode character value matching a given description
     */
    lookupUnicodeValueByCharName : function (value) {
        // Fix: Character names for Unihan?
        var table = (1) ? 'Unicode' : 'Unihan';
        var id = (1) ? 'searchName' : 'searchkDefinition';
        this.searchUnicode({id:id, value:value} , table, 'noChart=true', 'strict=true');
        if (!this.descripts[0] && value.length <= 7) { // Try Hangul (if possible size for Hangul)
            // Fix: Is Hangul allowed in PHP 6 Unicode escape names?
            var ret = Hangul.getHangulFromName(value);
            return ret ? ret.charCodeAt(0) : false;
        }
        return this.descripts[0];
    },
    // Used for conversions, so included here (also used externally)
    searchUnicode : function (obj, table, nochart, strict) { // Fix: allow Jamo!
        if (!table) {table = 'Unicode';}
        //var table = 'Unihan'; // fix: determine by pull-down
        var name_desc_val = obj.value;
        if (obj.id.match(/^searchk/) && table === 'Unicode' ||  // Don't query the other databases here
            obj.id.match(/^search[^k]/) && table === 'Unihan') {
            return;
        }
        var name_desc = obj.id.replace(/^search/, '');
        
        //var name_desc = (table === 'Unihan') ? 'kDefinition' : 'Name'; // Fix: let Unihan search Mandarin, etc.

        var colindex = (table === 'Unihan') ? 0 : 0;
        var cp_col = (table === 'Unihan') ? 'code_pt' : 'Code_Point';
        var conn = (table === 'Unihan') ? 'dbConnUnihan' : 'dbConn';
        this.descripts = [];

        if (table === 'Unihan' && !nochart && !charrefunicodeDb[conn]) {
            alert(_s('need_download_unihan'));
            return;
        }

        // Couldn't get to work but probably ok now as changed 'test' to 'search'
        var regex = {
            onFunctionCall: function(regex, value) {
                regex = regex.getUTF8String(0);
                return value.search(regex) !== -1;
            }
        };

        var statement;
        try {
            // charrefunicodeDb[conn].createFunction('regx', 2, regex);
            var likeBegin = 'LIKE "%';
            var likeEnd = '%"';
            if (strict) {
                likeBegin = '= "';
                likeEnd = '"';
            }
            
            if (name_desc === 'General_Category' && name_desc_val === 'Cn') {
try {
                statement = charrefunicodeDb[conn].createStatement(
                         'SELECT `'+cp_col+'`, Name FROM ' + table
                );
                for (var i = 0; i < 0x10FFFE; i++) {
                    var res = statement.executeStep();
                    if (!res) {
                        break;
                    }
                    var cp = statement.getUTF8String(colindex);
                    var range = statement.getUTF8String(1).match(/First>$/);
                    if (range) {
                        statement.executeStep();
                        var endRange = statement.getUTF8String(1).match(/Last>$/);
                        if (endRange) {
                            i = parseInt(statement.getUTF8String(colindex), 16);
                            continue;
                        }
                    }
                    var hex = parseInt(cp, 16);
                    for (var endHex = hex; i < endHex; i++, hex++) {
                        this.descripts.push(i);
                    }
                }
}
catch(e) {
alert(e);
}
            }
            else {
                statement = charrefunicodeDb[conn].createStatement(
                         'SELECT `'+cp_col+'` FROM '+table+' WHERE `'+name_desc+'` '+ likeBegin + name_desc_val + likeEnd
                );
                while (statement.executeStep()) {
                    var cp = statement.getUTF8String(colindex);
                    var hex = parseInt(cp, 16);
                    if (table === 'Unicode' && (hex >= 0xF900 && hex < 0xFB00)) { // Don't search for compatibility if searching Unicode
                        continue;
                    }
                    this.descripts.push(hex); // Fix: inefficient, but fits more easily into current pattern
                }
            }
        }
        catch(e) {
            alert(e);
        }
        finally {
            statement.reset();
        }
    },
    decim : /&#([0-9]*);/g ,
    hexadec : /&#[xX]([0-9a-fA-F]*);/g,
    htmlent : /&([_a-zA-Z][\-0-9_a-zA-Z]*);/g, /* Unicode complete version? */
    shiftcount: 0,
    newents: [],
    newcharrefs: []
};


// EXPORTS
this.charrefunicodeConverter = charrefunicodeConverter;
this.charrefunicodeDb = charrefunicodeDb;

}());