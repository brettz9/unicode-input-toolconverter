/*
Copyright 2007, 2008, 2009 Brett Zamir
    This file is part of Unicode Input Tool/Converter.

    Unicode Input Tool/Converter is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Unicode Input Tool/Converter is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with Unicode Input Tool/Converter.  If not, see <http://www.gnu.org/licenses/>.
*/

// See http://www.unicode.org/Public/UNIDATA/ for data use

(function () {

var Cc = Components.classes,
    Ci = Components.interfaces,
    EXT_BASE = 'extensions.charrefunicode.';
//var mainDoc = window.opener ? window.opener.document : false; // No opener if typing x-unicode protocol in Awesome Bar, and we don't want options dialog as opener
var wm = Cc['@mozilla.org/appshell/window-mediator;1'].getService(Ci.nsIWindowMediator);
var enumerator = wm.getXULWindowEnumerator('navigator:browser');
var mainDoc;
while (enumerator.hasMoreElements()) {
    mainDoc = enumerator.getNext().QueryInterface(Components.interfaces.nsIXULWindow).docShell.contentViewer.DOMDocument;
    if (mainDoc.documentElement.id === 'main-window') { // Ensure this is the main window, and not the options dialog
        break;
    }
}

var xulns = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul',
    htmlns = 'http://www.w3.org/1999/xhtml';

function createHTMLElement (el) {
    return document.createElementNS(htmlns, el);
}
function createXULElement (el) {
    return document.createElementNS(xulns, el);
}

function $ (id, doc) {
    doc = doc || document;
    return doc.getElementById(id);
}

function log (msg) {
    var console = Cc['@mozilla.org/consoleservice;1'].getService(Ci.nsIConsoleService);
    console.logStringMessage(msg);
}



var Unicodecharref = {
    downloadUnihan : function () {
        $('DownloadButtonBox').hidden = true;
        $('DownloadProgressBox').hidden = false;

        var that = this;
        var aFileURL = 'http://brett-zamir.me/unicode_input_tool/Unihan6.sqlite';

        var ios = Cc['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
        var url = ios.newURI(aFileURL, null, null);
        var file = Cc['@mozilla.org/file/directory_service;1'].getService(Ci.nsIProperties).get('ProfD', Ci.nsILocalFile);
        file.append('Unihan6.sqlite');
        if (file.exists()) {
            file.remove(false); // Shouldn't make it here unless it was a bad file
//                        return; // Don't do this: give chance to overwrite
        }
        file.create(Ci.nsIFile.NORMAL_FILE_TYPE, 0777); // DIRECTORY_TYPE


        const STATE_STOP = Ci.nsIWebProgressListener.STATE_STOP;
        const STATE_IS_WINDOW = Ci.nsIWebProgressListener.STATE_IS_WINDOW;
        var s = that.strs;
        var persist = Cc['@mozilla.org/embedding/browser/nsWebBrowserPersist;1'].createInstance(Ci.nsIWebBrowserPersist);
        persist.progressListener = {
            onProgressChange: function(aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) {
                var percentComplete = ((aCurTotalProgress/aMaxTotalProgress)*100).toFixed(2);
                // <label id="progress_stat"/>
                //<progressmeter id="progress_element" mode="determined"/>
                var ele = document.getElementById('progress_element');
                ele.value = percentComplete;
                var stat = document.getElementById('progress_stat');

                stat.value = s.getString('download_progress')+' '+percentComplete +s.getString('percentSign');
            },
            onStateChange: function(aWebProgress, aRequest, aFlag, aStatus) {
                if (aFlag & STATE_STOP) { //  && aFlag & STATE_IS_WINDOW
                    try {
                        charrefunicodeDb.connect('Unihan6.sqlite', 'unihan');
                        var statement = charrefunicodeDb.dbConnUnihan.createStatement( // Just to test database
                                      'SELECT code_pt FROM '+'Unihan'+' WHERE code_pt = "3400"'
                        );
                        alert(s.getString('Finished_download'));
                        that.unihanDb_exists = true;
                        document.getElementById('closeDownloadProgressBox').hidden = false;
                        document.getElementById('UnihanInstalled').hidden = false;
                    }
                    catch (e) {
                        document.getElementById('closeDownloadProgressBox').hidden = true;
                        document.getElementById('UnihanInstalled').hidden = true;
                        document.getElementById('DownloadProgressBox').hidden = true;
                        document.getElementById('DownloadButtonBox').hidden = false;
                        alert(s.getString('Problem_downloading'));
                        log(e);
                    }
                }
            }
        }
        persist.saveURI(url, null, null, null, '', file);
    },
    closeDownloadProgressBox : function () {
        $('closeDownloadProgressBox').hidden = false;
        $('DownloadProgressBox').hidden = true;
    },
    makeDropMenuRows : function (type) {
        var s = this.strs;
        /*/var prefix = (type === 'Unihan') ? 'searchk' : 'search';
        try {
                for (var i=0; i < this[type].length; i++) {
                        var row = createXULElement('row');
                        var label = createXULElement('label');

                        label.setAttribute('value', s.getString(prefix+this[type][i]));
                        label.setAttribute('control', prefix+this[type][i]);
                        var textbox = createXULElement('textbox');
                        textbox.setAttribute('id', prefix+this[type][i]);
                        textbox.setAttribute('rows', '1');
                        textbox.setAttribute('cols', '2');
                        textbox.addEventListener('change', function (e) {Unicodecharref['search'+type](e);}, false);
                        textbox.addEventListener('input', function (e) {Unicodecharref['search'+type](e);}, false);
                        row.appendChild(label);
                        row.appendChild(textbox);
                        $(type+'Search').appendChild(row);
                }
        }
        catch(e) {
            alert(this[type][i])
        }*/
    },
    makeRows : function (type) {
        var s = this.strs;
        var prefix = (type === 'Unihan') ? 'searchk' : 'search';
        try {
            for (var i=0; i < this[type].length; i++) {
                var row = createXULElement('row');
                var label = createXULElement('label');
                label.setAttribute('value', s.getString(prefix+this[type][i]));
                label.setAttribute('control', prefix+this[type][i]);
                row.appendChild(label);
                if (type === 'Unicode') { // Fix: make block for Unihan if need that
                    var menuIdx = this.UnicodeMenus.indexOf(this[type][i]);
                    if (menuIdx !== -1) {
                        var match = this.UnicodeMenus[menuIdx];
                        var j, menupopup, menulist, menuitem;
                        switch(match) {
                            case 'Decimal':
                                // Fall-through
                            case 'Digit':
                                // Fall-through
                            case 'Canonical_Combining_Class':
                                // Fall-through
                            case 'General_Category':
                                // Fall-through
                            case 'Bidi_Mirrored': // 'Y'/'N'
                                // Fall-through
                            case 'Bidi_Class':
                                menulist = createXULElement('menulist');
                                menulist.className = 'searchMenu';
                                menupopup = createXULElement('menupopup');
                                for (j=0; j < this['UnicodeMenu'+match].length; j++) {
                                    menuitem = createXULElement('menuitem');
                                    menuitem.setAttribute('label', s.getString(match+this['UnicodeMenu'+match][j]));
                                    menuitem.setAttribute('tooltiptext', s.getString(match+this['UnicodeMenu'+match][j]));
                                    menuitem.setAttribute('value', this['UnicodeMenu'+match][j]);
                                    menupopup.appendChild(menuitem);
                                }
                                if (match === 'Canonical_Combining_Class') {
                                    for (j=11; j <= 36; j++) { // Other Non-Numeric not listed in UnicodeMenuCCVNumericOnly
                                        menuitem = createXULElement('menuitem');
                                        menuitem.setAttribute('label', j);
                                        menuitem.setAttribute('tooltiptext', j);
                                        menuitem.setAttribute('value', j);
                                        menupopup.appendChild(menuitem);
                                    }
                                    for (j=0; j < this['UnicodeMenu'+'CCVNumericOnly'].length; j++) {
                                        menuitem = createXULElement('menuitem');
                                        menuitem.setAttribute('label', this['UnicodeMenu'+'CCVNumericOnly'][j]);
                                        menuitem.setAttribute('tooltiptext', this['UnicodeMenu'+'CCVNumericOnly'][j]);
                                        menuitem.setAttribute('value', this['UnicodeMenu'+'CCVNumericOnly'][j]);
                                        menupopup.appendChild(menuitem);
                                    }
                                }
                                menulist.appendChild(menupopup);
                                menulist.setAttribute('id', prefix+this[type][i]);
                                row.appendChild(menulist);
                                document.getElementById(type+'Search').appendChild(row);
                                continue;
                            default:
                                break;
                        }
                    }
                }
                var textbox = createXULElement('textbox');
                textbox.setAttribute('id', prefix+this[type][i]);
                textbox.setAttribute('rows', '1');
                textbox.setAttribute('cols', '2');
                row.appendChild(textbox);
                document.getElementById(type+'Search').appendChild(row);
            }
        }
        catch(e) {
            alert('1:'+type+i+e+this[type][i])
        }
        // Add handlers for textboxes
        var tabpanel = type === 'Unicode' ? 'regularSearch' : 'cjkSearch';
        tabpanel = 'tabboxSearch';

        $(tabpanel).addEventListener('change', function (e) {Unicodecharref['search'+type](e.target);}, false);
        $(tabpanel).addEventListener('input', function (e) {Unicodecharref['search'+type](e.target);}, false);
        $(tabpanel).addEventListener('select',
            function (e) {
                if (e.target.nodeName !== 'menulist' && e.target.nodeName !== 'textbox') {return;}
                Unicodecharref['search'+type](e.target);
            },
            false
        ); // Triggered initially which sets preference to "Lu"
    },
    testIfComplexWindow : function () { // Fix: Should also create the detailedView and detailedCJKView's content dynamically (and thus fully conditionally rather than hiding)
        if (this.prefs.getBoolPref(EXT_BASE+'showComplexWindow')) {
            $('specializedSearch').hidden = false;
            this.makeRows('Unihan');
            this.makeRows('Unicode');
            $('detailedView').collapsed = false;
            $('detailedCJKView').collapsed = false;
        }
        else {
            $('specializedSearch').hidden = true;
            $('detailedView').collapsed = true;
            $('detailedCJKView').collapsed = true;
        }
    },
    setupBoolChecked : function () {
        var els = arguments;
        for (var i = 0; i < els.length; i++) {
            if (this.prefs.getBoolPref(EXT_BASE+els[i])) {
                $(EXT_BASE+els[i]).checked = true;
            }
        }
    },
    initialize: function(e) {
        var that = this, args = window.arguments;
        this.prefs = Cc['@mozilla.org/preferences-service;1'].getService(Ci.nsIPrefService);
        // This branch must be set in both the properties file and prefs js file: http://developer.mozilla.org/en/docs/Code_snippets:Preferences#nsIPrefLocalizedString
        this.branch = this.prefs.getBranch(EXT_BASE);
        this.branchDefault = this.prefs.getDefaultBranch(EXT_BASE);
        // this.refreshToolbarDropdown(); // redundant?
        this.strs = $('charrefunicode-strings');

        $('world_auxiliary_language').appendChild(
            new DOMParser().parseFromString(
                '<div xmlns="http://www.w3.org/1999/xhtml">'+this.strs.getString('official_world_language')+'</div>',
                'application/xml'
            ).documentElement
        );

        //charrefunicodeDb.connect('data/Unicode.sqlite');
        this.unihanDb_exists = false;
        try {
            //charrefunicodeDb.connect('Unihan.sqlite', 'unihan');
            var statement = charrefunicodeDb.dbConnUnihan.createStatement( // Just to test database is not corrupted
                                                  'SELECT code_pt FROM '+'Unihan'+' WHERE code_pt = "3400"'
             );
            this.unihanDb_exists = true;
            $('DownloadButtonBox').hidden = true;
            $('UnihanInstalled').hidden = false;
        }
        catch (e) {
            log(e);
            $('DownloadButtonBox').hidden = false;
            $('UnihanInstalled').hidden = true;
        }
        try {
            //charrefunicodeDb.connect('data/Jamo.sqlite', 'jamo');
        }
        catch(e) {
            alert(e);
        }

//document.documentElement.maxWidth = window.screen.availWidth-(window.screen.availWidth*1/100);
$('tabbox').maxWidth = window.screen.availWidth-(window.screen.availWidth*3/100);
$('unicodetabs').maxWidth = window.screen.availWidth-(window.screen.availWidth*3/100);
/**
        $('tabbox').style.maxHeight = window.screen.availHeight-(window.screen.availHeight*5/100);
        $('conversionhbox').style.maxHeight = window.screen.availHeight-(window.screen.availHeight*13/100);

        $('noteDescriptionBox2').style.height = $('noteDescriptionBox2').height = window.screen.availHeight-(window.screen.availHeight*25/100);
$('tabbox').style.maxWidth = window.screen.availWidth-(window.screen.availWidth*1/100);
$('unicodetabs').style.maxWidth = window.screen.availWidth-(window.screen.availWidth*2/100);
$('unicodetabpanels').style.maxWidth = window.screen.availWidth-(window.screen.availWidth*2/100);
$('chartcontent').style.maxWidth = window.screen.availWidth-(window.screen.availWidth*25/100);
$('chart_selectchar_persist_vbox').style.maxWidth = window.screen.availWidth-(window.screen.availWidth*25/100);

//*/
//        $('tableholder').style.maxWidth = window.screen.availWidth-(window.screen.availWidth*50/100);
//        $('tableholder').style.width = window.screen.availWidth-(window.screen.availWidth*50/100);
//      window.sizeToContent();

        this.testIfComplexWindow();

        // These defaults are necessary for the sake of the options URL (when called from addons menu)
        var toconvert = '';
        var targetid = '';
        //var targetid = 'context-launchunicode';

        // Check first for our custom protocol
        var arg0 = args && args[0] && args[0].wrappedJSObject;
        var customProtocol = arg0 && arg0.constructor.name === 'NsiSupportsWrapper';
        // Fix: the initial portion of this handling really should be inside the protocol handler, but that requires implementing the object to add arguments
        if (customProtocol) { // Will be passed a query string if a protocol handler has been triggered
            var req = decodeURIComponent(arg0.toString().slice(1)); // We skip over the initial question mark too
            var unicodeQueryObj = {};
            var queryTypeEndPos = req.indexOf(';');
            var queryType = req.slice(0, queryTypeEndPos); // Use
            var queries = req.slice(queryTypeEndPos + 1).split(';');
            for (var i = 0, key, val; i < queries.length; i++) {
                [key, val] = queries[i].split('=');
                unicodeQueryObj[key] = val; // Use
            }
            switch (queryType) {
                case 'find':
                    toconvert = unicodeQueryObj['char'];
                    targetid = 'context-unicodechart';
                    break;
                case 'searchName':
                    targetid = 'searchName';
                    break;
                case 'searchkDefinition':
                    targetid = 'searchkDefinition'
                    break;
                    // Could also add 'define', 'convert', etc.
                default:
                    throw new Error('Unrecognized query type passed to application for Custom Unicode protocol');
            }
        }
        else if (!args) { // Do nothing for options dialog
        }
        else if (!args[2]) {
            toconvert = args[0].toString(); // Need the conversion to string since content.window.getSelection() passed here gives an object, unlike the now deprecated content.document.getSelection() which returns a string. (Discovered deprecated status via Console extension: https://addons.mozilla.org/en-US/firefox/addon/1815 )
            targetid = args[1];
        }
        else {
            var wm = Cc['@mozilla.org/appshell/window-mediator;1'].getService(Ci.nsIWindowMediator);
            var browserWin = wm.getMostRecentWindow('navigator:browser');
            toconvert = browserWin.content.getSelection().toString();
            targetid = toconvert ? 'context-charrefunicode1' : ''; // Fix: replace with preference
        }

//  this.prefs = Cc['@mozilla.org/preferences-service;1'].getService(Ci.nsIPrefBranch);


        if (!this.prefs.getBoolPref(EXT_BASE+'multiline')) {
            $(EXT_BASE+'multiline').checked = false;
            $('displayUnicodeDesc').setAttribute('multiline', false);
            $('displayUnicodeDesc').setAttribute('rows', 1);
        }
        else {
            $(EXT_BASE+'multiline').checked = true;
            $('displayUnicodeDesc').setAttribute('multiline', true);
            $('displayUnicodeDesc').setAttribute('rows', 3);
        }

        this.setupBoolChecked('asciiLt128', 'showImg', 'xhtmlentmode', 'hexLettersUpper', 'xmlentkeep', 'ampkeep',
                                                        'ampspace', 'showComplexWindow', 'showAllDetailedView', 'showAllDetailedCJKView',
                                                        'appendtohtmldtd', 'hexyes', 'onlyentsyes', 'entyes', 'decyes', 'unicodeyes', 'middleyes',
                                                        'buttonyes', 'cssUnambiguous');

        switch(this.prefs.getCharPref(EXT_BASE+'cssWhitespace')) {
            case ' ':
                $('CSSWhitespace').selectedIndex = 0;
                break;
            case '\r\n':
                $('CSSWhitespace').selectedIndex = 1;
                break;
            case '\r':
                $('CSSWhitespace').selectedIndex = 2;
                break;
            case '\n':
                $('CSSWhitespace').selectedIndex = 3;
                break;
            case '\t':
                $('CSSWhitespace').selectedIndex = 4;
                break;
            case '\f':
                $('CSSWhitespace').selectedIndex = 5;
                break;
        }


        /*if (this.prefs.getBoolPref(EXT_BASE+'hexstyleLwr')) {
            $(EXT_BASE+'hexstyleLwr').selectedIndex = 0;
        }
        else {
            $(EXT_BASE+'hexstyleLwr').selectedIndex = 1;
        }*/
        /*if (this.prefs.getCharPref(EXT_BASE+'xstyle') === 'x') {
            $(EXT_BASE+'xstyle').checked = true;
        }*/

        this.resizecells(true, 0); // Set the size per the prefs (don't increase or decrease the value)

        $('rowsset').value = this.prefs.getIntPref(EXT_BASE+'tblrowsset');
        $('colsset').value = this.prefs.getIntPref(EXT_BASE+'tblcolsset');

        // Save copies in case decide to reset later (i.e., not append to HTML entities, then wish to append to them again)
        // Do the following since can't copy arrays by value
        // Must define outside of copyarray function
        this.origents = [];
        this.origcharrefs = [];
        this.orignewents = [];
        this.orignewcharrefs = [];

        this.copyarray(CharrefunicodeConsts.ents, this.origents);
        this.copyarray(CharrefunicodeConsts.charrefs, this.origcharrefs);
        this.copyarray(charrefunicodeConverter.newents, this.orignewents);
        this.copyarray(charrefunicodeConverter.newcharrefs, this.orignewcharrefs);

        $(EXT_BASE+'lang').value = this.branch.getComplexValue('lang', Ci.nsIPrefLocalizedString).data;
        $(EXT_BASE+'font').value = this.branch.getComplexValue('font', Ci.nsIPrefLocalizedString).data;

        var DTDtxtbxval = this.branch.getComplexValue('DTDtextbox', Ci.nsIPrefLocalizedString).data;

        $('DTDtextbox').value = DTDtxtbxval;
        this.registerDTD();

        //  toconvert = charreftoconvert.replace(/\n/g, ' ');
        $('toconvert').value = toconvert;

        if (this.prefs.getBoolPref(EXT_BASE+'ampspace')) {
            toconvert = toconvert.replace(/&([^;\s]*\s)/g, '&amp;$1');
        }

        // Detect which context menu item was selected:
        var out, converttypeid;

        switch (targetid) {
            case 'context-charrefunicode1':
                out = this.charref2unicodeval(toconvert, $('b1'));
                break;
            case 'context-charrefunicode2':
                out = this.charref2htmlentsval(toconvert, $('b2'));
                break;
            case 'context-charrefunicode3':
                out = this.unicode2charrefDecval(toconvert, $('b3'));
                break;
            case 'context-charrefunicode4':
                out = this.unicode2charrefHexval(toconvert, $('b4'));
                break;
            case 'context-charrefunicode5':
                out = this.unicode2htmlentsval(toconvert, $('b5'));
                break;
            case 'context-charrefunicode6':
                out = this.unicode2jsescapeval(toconvert, $('b6'));
                break;
            case 'context-charrefunicode7':
                out = this.unicodeTo6DigitVal(toconvert, $('b7'));
                break;
            case 'context-charrefunicode8':
                out = this.unicode2cssescapeval(toconvert, $('b8'));
                break;
            case 'context-charrefunicode9':
                out = this.htmlents2charrefDecval(toconvert, $('b9'));
                break;
            case 'context-charrefunicode10':
                out = this.htmlents2charrefHexval(toconvert, $('b10'));
                break;
            case 'context-charrefunicode11':
                out = this.htmlents2unicodeval(toconvert, $('b11'));
                break;
            case 'context-charrefunicode12':
                out = this.hex2decval(toconvert, $('b12'));
                break;
            case 'context-charrefunicode13':
                out = this.dec2hexval(toconvert, $('b13'));
                break;
            case 'context-charrefunicode14':
                out = this.jsescape2unicodeval(toconvert, $('b14'));
                break;
            case 'context-charrefunicode15':
                out = this.sixDigit2UnicodeVal(toconvert, $('b15'));
                break;
            case 'context-charrefunicode16':
                out = this.cssescape2unicodeval(toconvert, $('b16'));
                break;
            case 'context-charrefunicode17':
                out = this.unicode2CharDescVal(toconvert, $('b17'));
                break;
            case 'context-charrefunicode18':
                out = this.charDesc2UnicodeVal(toconvert, $('b18'));
                break;
            case 'context-unicodechart':
                this.disableEnts();
                $('startset').value = toconvert;
                $('tabbox').selectedTab = $('charttab');
                if (toconvert != '') {
                    this.setCurrstartset(toconvert);
                    this.printunicode();
                }
            case 'context-launchunicode':
            case 'tools-charrefunicode':
                out = '';
                break;
            case 'searchName':
                $(targetid).value = unicodeQueryObj.string;
                $(targetid).focus();
                this.searchUnicode({id:targetid, value:unicodeQueryObj.string}); // Assume non-CJK
                break;
            case 'searchkDefinition':
                $(targetid).value = unicodeQueryObj.string;
                $(targetid).focus();
                this.searchUnihan({id:targetid, value:unicodeQueryObj.string});
                break;
            default:
                out = ''; // Plain launcher with no values sent
                var prefstab = true;
                break;
        }

        if (customProtocol) {
        }
        else if (!args) { // options menu
            $('tabbox').selectedTab = $('prefstab');
        }
        else if (args[2] !== undefined) { // Keyboard invocation or button
            // $('unicodetabs').selectedIndex = 0; // Fix: set by preference
            $('tabbox').selectedTab = $(this.prefs.getCharPref('extensions.charrefunicode.initialTab'));
        }
        else if (targetid != 'context-unicodechart' && targetid != 'tools-charrefunicode') {
            $('tabbox').selectedTab = $('conversiontab');
        }

        $('extensions.charrefunicode.initialTab').selectedItem = $('mi_'+this.prefs.getCharPref('extensions.charrefunicode.initialTab'));

        if (targetid !== 'searchName' && targetid !== 'searchkDefinition') {
            if (toconvert) { // Seemed to become necessarily suddenly
                this.setCurrstartset(toconvert);
            }
            this.printunicode();
        }
        this.tblfontsize(0); // Draw with the preferences value

        $('menulists').addEventListener('command',
            function(e) {
                //var tmp = that.branch.getComplexValue('currstartset', Ci.nsIPrefLocalizedString).data;
                that.disableEnts();
                that.setCurrstartset(e.target.value);
                Unicodecharref.printunicode();
                //that.setCurrstartset(tmp); // Set it back as it was before the search
            },
            true);

        $('converted').value = out;
        /*
        if (converttypeid != 0) {
            $(converttypeid).className='buttonactive';
        }
        */
        // Set window size to that set last time hit "ok"
        var outerh = this.prefs.getIntPref(EXT_BASE+'window.outer.height');
        var outerw = this.prefs.getIntPref(EXT_BASE+'window.outer.width');
        if (outerh > 0) {
            window.outerHeight = outerh;
        }
        if (outerw > 0) {
            window.outerWidth = outerw;
        }
    },
    copyToClipboard : function (id) {
            var text = $(id).value;
            var gClipboardHelper = Cc['@mozilla.org/widget/clipboardhelper;1'].getService(Ci.nsIClipboardHelper);
            gClipboardHelper.copyString(text);
    },
    copyarray: function(a, b) {
        b.length = 0;
        for (var i = 0; i < a.length; i++) {
            b[i] = a[i];
        }
    },
    setprefs: function(e) {
        switch (e.target.nodeName) {
            case 'textbox':
                var temp1 = Cc['@mozilla.org/pref-localizedstring;1'].createInstance(Ci.nsIPrefLocalizedString);
                temp1.data = e.target.value;
                this.prefs.setComplexValue(EXT_BASE+e.target.id.replace(EXT_BASE, ''),
                                                                                Ci.nsIPrefLocalizedString, temp1);
                break;
            case 'menuitem':
                this.prefs.setCharPref(e.target.parentNode.parentNode.id, e.target.value); // Could use @label or position as default value
                break;
            case 'checkbox':
                // Apparently hasn't changed yet, so use the opposite
                this.prefs.setBoolPref(e.target.id, Boolean(!e.target.checked));
                break;
            case 'radio':
                var radioid;
                var result = e.target.id.match(/^_([0-9])+-(.*)$/);
                if (result !== null) {
                    radioid = result[2]; // Extract preference name
                    if (result[1] === '1') {
                        this.prefs.setBoolPref(radioid, true);
                    }
                    else {
                        this.prefs.setBoolPref(radioid, false);
                    }
                }
                break;
            default:
                break;
        }
    },
    resetdefaults: function() {
        var that = this;
        /* If make changes here, also change the default/preferences charrefunicode.js file */
        this.setBoolChecked(['asciiLt128', 'showImg', 'xhtmlentmode', 'hexLettersUpper', 'multiline'], false);
        this.setBoolChecked(['xmlentkeep', 'ampkeep', 'appendtohtmldtd', 'cssUnambiguous'], true);

        $(EXT_BASE+'ampspace').checked = false;
        $(EXT_BASE+'showComplexWindow').checked = false;
        $(EXT_BASE+'showAllDetailedView').checked = true;
        $(EXT_BASE+'showAllDetailedCJKView').checked = true;


        function langFont (langOrFont) { // Fix: needs to get default!
            var deflt = that.branchDefault.getComplexValue(langOrFont, Ci.nsIPrefLocalizedString).data;
            $(EXT_BASE+langOrFont).value = deflt;
            var temp1 = Cc['@mozilla.org/pref-localizedstring;1'].createInstance(Ci.nsIPrefLocalizedString);
            temp1.data = deflt;
            that.prefs.setComplexValue(EXT_BASE+langOrFont, Ci.nsIPrefLocalizedString, temp1);
            return deflt;
        }
        $('chart_table').lang = langFont('lang');
        $('chart_table').style.fontFamily = langFont('font');



        //this.prefs.setBoolPref(EXT_BASE+'hexstyleLwr', true);
        //$(EXT_BASE+'hexstyleLwr').selectedIndex = 0;

        this.prefs.setIntPref(EXT_BASE+'fsizetextbox', 13);
        this.fsizetextbox(0);

        /*
        Easy enough to manually remove DTD -- wouldn't want to lose that data
        var temp0 = Cc['@mozilla.org/pref-localizedstring;1'].createInstance(Ci.nsIPrefLocalizedString);
        temp0.data = '';
        this.prefs.setComplexValue(EXT_BASE+'DTDtextbox',
                      Ci.nsIPrefLocalizedString,
                      temp0);

        $('DTDtextbox').value = '';
        */

        temp1 = Cc['@mozilla.org/pref-localizedstring;1'].createInstance(Ci.nsIPrefLocalizedString);
        temp1.data = '#0';
        this.prefs.setComplexValue(EXT_BASE+'startset',
              Ci.nsIPrefLocalizedString,
              temp1
        ); // Don't really need to reset since user can't currently change this (only for blank string entry)

        this.setCurrstartset(this.branchDefault.getComplexValue('startset', Ci.nsIPrefLocalizedString).data);

        $('displayUnicodeDesc').setAttribute('multiline', false);
        $('displayUnicodeDesc').setAttribute('rows', 1);


        // These get activated in this.printunicode() below
        this.prefs.setIntPref(EXT_BASE+'tblrowsset', 4);
        $('rowsset').value = 4;
        this.prefs.setIntPref(EXT_BASE+'tblcolsset', 3);
        $('colsset').value = 3;

        this.setBoolChecked(['entyes', 'hexyes', 'decyes', 'unicodeyes', 'buttonyes'], true);
        this.setBoolChecked(['onlyentsyes', 'middleyes'], false);

        //this.prefs.setCharPref(EXT_BASE+'xstyle', 'x');
        //$(EXT_BASE+'xstyle').checked = true;

        this.prefs.setCharPref('extensions.charrefunicode.initialTab', 'charttab');
        $('extensions.charrefunicode.initialTab').selectedItem = $('mi_charttab');

        this.prefs.setIntPref(EXT_BASE+'tblfontsize', 13);
        this.resizecells(true, 0);

        this.printunicode();
        this.prefs.setIntPref(EXT_BASE+'window.outer.height', 0);
        this.prefs.setIntPref(EXT_BASE+'window.outer.width', 0);
    },
    /**
     * Set a boolean preference (and its checked state in the interface) to a given boolean value
     * @param {String|String[]} els The element ID string or strings which should have their values set
     * @param {Boolean} value The value for the preference and checked state
     */
    setBoolChecked : function (els, value) {
        els = typeof els === 'string' ? [els] : els;
        for (var i = 0; i < els.length; i++) {
            this.prefs.setBoolPref(EXT_BASE+els[i], value);
            $(EXT_BASE+els[i]).checked = value;
        }
    },
    classChange: function(el) {
        try {
            var xpathresultobj = document.evaluate("//*[@class='buttonactive']", document.documentElement, function() {return null}, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        }
        catch (e) {
            alert(e);
        }

        if (xpathresultobj.singleNodeValue !== null) {
        // This is apparently necessary as the XPath expression does not seem to me to be able to allow manipulation of the original node
            $(xpathresultobj.singleNodeValue.id).className='reconvert';
        }
        el.className='buttonactive';
        /*
        // If want this loop (set type above to ORDERED_NODE_SNAPSHOT_TYPE)
        for (var i = 0; i < xpathresultobj.snapshotLength; i++) {
            xpathresultobj.snapshotitem(i).classname='reconvert';
        }
        */
    },

    // UI Bridges
    convertEncoding : function (out, el) {
        var from = $('encoding_from').value,
            to = $('encoding_to').value,
            toconvert = out;
        this.classChange(el);

        if (!from || !to) {
            return;
        }

        try {
            var cnv = Cc['@mozilla.org/intl/scriptableunicodeconverter'].createInstance(Ci.nsIScriptableUnicodeConverter);
            cnv.charset = from; // The charset to use
            var os = cnv.convertToInputStream(toconvert);

            var replacementChar = Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER; // Fix: could customize
            var is = Cc['@mozilla.org/intl/converter-input-stream;1'].createInstance(Ci.nsIConverterInputStream);
            is.init(os, to, 1024, replacementChar);
            var str = {}, output = '';
            while (is.readString(4096, str) != 0) {
                output += str.value;
            }
            os.close();
            $('converted').value = output;
        }
        catch(e) {
            alert(this.strs.getString('chars_could_not_be_converted'));
        }
        /*
        var cv = Cc['@mozilla.org/intl/scriptableunicodeconverter'].getService(Ci.nsIScriptableUnicodeConverter);
        cv.charset = to;
        var unicode_str = cv.ConvertToUnicode(toconvert);
        cv.charset = from;
        $('converted').value = cv.ConvertFromUnicode(unicode_str);
        */
    },
    charref2unicodeval: function(out, el) {
        this.classChange(el);
        return charrefunicodeConverter.charref2unicodeval(out);
    },
    charref2htmlentsval: function(out, el) {
        this.classChange(el);
        return charrefunicodeConverter.charref2htmlentsval(out);
    },
    unicode2charrefDecval: function(unicodeToConvert, el, leaveSurrogates) {
        this.classChange(el);
        return charrefunicodeConverter.unicode2charrefDecval(unicodeToConvert, leaveSurrogates);
    },
    unicode2charrefHexval: function(unicodeToConvert, el, leaveSurrogates, type) {
        this.classChange(el);
        return charrefunicodeConverter.unicode2charrefHexval(unicodeToConvert, leaveSurrogates, type);
    },
    unicode2htmlentsval: function(unicodeToConvert, el) {
        this.classChange(el);
        return charrefunicodeConverter.unicode2htmlentsval(unicodeToConvert);
    },
    htmlents2charrefDecval: function(out, el) {
        this.classChange(el);
        return charrefunicodeConverter.htmlents2charrefDecval(out);
    },
    htmlents2charrefHexval: function(out, el) {
        this.classChange(el);
        return charrefunicodeConverter.htmlents2charrefHexval(out);
    },
    htmlents2unicodeval: function(out, el) {
        this.classChange(el);
        return charrefunicodeConverter.htmlents2unicodeval(out);
    },
    hex2decval: function(out, el) {
        this.classChange(el);
        return charrefunicodeConverter.hex2decval(out);
    },
    dec2hexval: function(out, el) {
        this.classChange(el);
        return charrefunicodeConverter.dec2hexval(out);
    },

    unicodeTo6Digit : function (e) {
        var toconvert = $('toconvert').value;
        this.unicodeTo6DigitVal(toconvert, e.target);
        return false;
    },
    unicodeTo6DigitVal : function (toconvert, el) {
        this.classChange(el);
        var val = charrefunicodeConverter.unicodeTo6DigitVal(toconvert);
        $('converted').value = val;
        return val;
    },
    charref2unicode: function(e) {
        var toconvert = $('toconvert').value;
        if (this.prefs.getBoolPref(EXT_BASE+'ampspace')) {
            toconvert = toconvert.replace(/&([^;\s]*\s)/g, '&amp;$1');
        }
        $('converted').value = this.charref2unicodeval(toconvert, e.target);
        return false;
    },
    charref2htmlents: function(e) {
        var toconvert = $('toconvert').value;
        if (this.prefs.getBoolPref(EXT_BASE+'ampspace')) {
            toconvert = toconvert.replace(/&([^;\s]*\s)/g, '&amp;$1');
        }
        $('converted').value = this.charref2htmlentsval(toconvert, e.target);
        return false;
    },
    unicode2charrefDec: function(e, leaveSurrogates) {
        var toconvert = $('toconvert').value;
        if (this.prefs.getBoolPref(EXT_BASE+'ampspace')) {
            toconvert = toconvert.replace(/&([^;\s]*\s)/g, '&amp;$1');
        }
        $('converted').value = this.unicode2charrefDecval(toconvert, e.target, leaveSurrogates);
        return false;
    },
    unicode2charrefDecSurrogate : function (e) {
        this.unicode2charrefDec(e, true);
    },
    unicode2charrefHex: function(e, leaveSurrogates) {
        var toconvert = $('toconvert').value;
        if (this.prefs.getBoolPref(EXT_BASE+'ampspace')) {
            toconvert = toconvert.replace(/&([^;\s]*\s)/g, '&amp;$1');
        }
        $('converted').value = this.unicode2charrefHexval(toconvert, e.target, leaveSurrogates);
        return false;
    },
    unicode2charrefHexSurrogate : function (e) {
          this.unicode2charrefHex(e, true);
    },
    unicode2htmlents: function(e) {
        var toconvert = $('toconvert').value;
        if (this.prefs.getBoolPref(EXT_BASE+'ampspace')) {
            toconvert = toconvert.replace(/&([^;\s]*\s)/g, '&amp;$1');
        }
        $('converted').value = this.unicode2htmlentsval(toconvert, e.target);
        return false;
    },
    /**
     * Replace Unicode characters with their escaped description form
     * @param {String} toconvert The text whose Unicode characters will be replaced
     * @param {XULElement} el The (button) element whose class will be changed to reflect that the action has been
     *                                                      activated
     * @returns {String} The passed-in string with Unicode replaced with description escape sequences
     */
    unicode2CharDescVal : function (toconvert, el) {
        this.classChange(el);
        var val = charrefunicodeConverter.unicode2CharDescVal(toconvert);
        $('converted').value = val;
        return val;
    },
    /**
     * Converts character description escape sequences within a string to Unicode characters
     * @param {String} toconvert The text to convert
     * @param {XULElement} el The button element whose class should be dynamically changed (and others
     *                                                      deactivated)
     * @returns {String} The converted-to-Unicode value
     */
    charDesc2UnicodeVal : function (toconvert, el) {
        this.classChange(el);
        var val = charrefunicodeConverter.charDesc2UnicodeVal(toconvert);
        $('converted').value = val;
        return val;
    },
    charDesc2Unicode : function (e) {
        var toconvert = $('toconvert').value;
        this.charDesc2UnicodeVal(toconvert, e.target);
        return false;
    },
    unicode2CharDesc : function (e) {
        var toconvert = $('toconvert').value;
        this.unicode2CharDescVal(toconvert, e.target);
        return false;
    },
    unicode2jsescapeval : function (toconvert, el) {
        this.classChange(el);
        var val = charrefunicodeConverter.unicode2jsescapeval(toconvert);
        $('converted').value = val;
        return val;
    },
    unicode2jsescape: function(e) {
        var toconvert = $('toconvert').value;
        this.unicode2jsescapeval(toconvert, e.target);
        return false;
    },
    cssescape2unicode : function (e) {
        var toconvert = $('toconvert').value;
        $('converted').value = this.cssescape2unicodeval(toconvert, e.target);
        return false;
    },
    sixDigit2UnicodeVal : function (toconvert, el) {
        this.classChange(el);
        var val = charrefunicodeConverter.sixDigit2UnicodeVal(toconvert);
        $('converted').value = val;
        return val;
    },
    sixDigit2Unicode : function (e) {
        var toconvert = $('toconvert').value;
        this.sixDigit2UnicodeVal(toconvert, e.target);
        return false;
    },
    jsescape2unicode: function(e) {
        var toconvert = $('toconvert').value;
        $('converted').value = this.jsescape2unicodeval(toconvert, e.target);
        return false;
    },
    cssescape2unicodeval : function (toconvert, el) {
        this.classChange(el);
        var unicode = charrefunicodeConverter.cssescape2unicodeval(toconvert);
        return unicode;
    },
    // Fix: make option to avoid converting \r, etc. for javascript
    jsescape2unicodeval : function (toconvert, el, mode) {
        this.classChange(el);
        var unicode = charrefunicodeConverter.jsescape2unicodeval(toconvert, mode);
        return unicode;
    },
    unicode2cssescapeval: function(toconvert, el) {
        this.classChange(el);
        var val = charrefunicodeConverter.unicode2cssescapeval(toconvert);
        $('converted').value = val;
        return val;
    },
    unicode2cssescape: function(e) {
        var toconvert = $('toconvert').value;
        this.unicode2cssescapeval(toconvert, e.target);
        return false;
    },
    // In this method and others like it, boolpref should be moved instead to
    //   converter function since it should be consistent across the app
    htmlents2charrefDec: function(e) {
        var toconvert = $('toconvert').value;
        if (this.prefs.getBoolPref(EXT_BASE+'ampspace')) {
            toconvert = toconvert.replace(/&([^;\s]*\s)/g, '&amp;$1');
        }
        $('converted').value = this.htmlents2charrefDecval(toconvert, e.target);
        return false;
    },
    htmlents2charrefHex: function(e) {
        var toconvert = $('toconvert').value;
        if (this.prefs.getBoolPref(EXT_BASE+'ampspace')) {
            toconvert = toconvert.replace(/&([^;\s]*\s)/g, '&amp;$1');
        }
        $('converted').value = this.htmlents2charrefHexval(toconvert, e.target);
        return false;
    },
    htmlents2unicode: function(e) {
        var toconvert = $('toconvert').value;
        if (this.prefs.getBoolPref(EXT_BASE+'ampspace')) {
            toconvert = toconvert.replace(/&([^;\s]*\s)/g, '&amp;$1');
        }
        $('converted').value = this.htmlents2unicodeval(toconvert, e.target);
        return false;
    },
    hex2dec: function(e) {
        var toconvert = $('toconvert').value;
        if (this.prefs.getBoolPref(EXT_BASE+'ampspace')) {
            toconvert = toconvert.replace(/&([^;\s]*\s)/g, '&amp;$1');
        }
        $('converted').value = this.hex2decval(toconvert, e.target);
        return false;
    },
    dec2hex: function(e) {
        var toconvert = $('toconvert').value;
        if (this.prefs.getBoolPref(EXT_BASE+'ampspace')) {
            toconvert = toconvert.replace(/&([^;\s]*\s)/g, '&amp;$1');
        }
        $('converted').value = this.dec2hexval(toconvert, e.target);
        return false;
    },
    // End UI bridges

    noGetDescripts : false,
    printunicode: function (descripts) {
        var i, that = this;

        var decreg = /^(&#|#)?([0-9][0-9]+);?$/;
        var decreg2 = /^(&#|#)([0-9]);?$/;
        var hexreg = /^(&#|#|0|U|u)?([xX+])([0-9a-fA-F]+);?$/;

        /* Will track where the user last left off */
        var k = this.branch.getComplexValue('currstartset', Ci.nsIPrefLocalizedString).data;
        this.j = k;

        if (k < 0) {
            k = 1114112 + parseInt(k);
        }
        else if (k.toString().match(decreg)) { // Dec
            k = k.toString().replace(decreg, '$2');
            k = parseInt(k);
        }
        else if (k.toString().match(decreg2)) { // Dec
            k = k.toString().replace(decreg2, '$2');
            k = parseInt(k);
        }
        else if (k.toString().match(hexreg)) { // Hex
            k = k.toString().replace(hexreg, '$3');
            k = parseInt(k, 16);
        }
        else {
            // Convert toString in case trying to get the ASCII for a single digit number
            var kt = k.toString().charCodeAt(0);
            if (kt >= 0xD800 && kt < 0xF900) { // surrogate component (higher plane)
                    k = ((kt - 0xD800) * 0x400) + (k.toString().charCodeAt(1) - 0xDC00) + 0x10000;
            }
            else {
                    k = kt;
            }
        }

        if (k > 1114111) {
            k = 0;
        }
        else if (k < 0) { // could still be less than 0
            k += 1114112;
        }

        var rows = this.prefs.getIntPref(EXT_BASE+'tblrowsset');
        var cols = this.prefs.getIntPref(EXT_BASE+'tblcolsset');

        var inserttext = $('inserttext');
        inserttext.setAttribute('rows', rows*20-10);
        inserttext.setAttribute('cols', cols*20-10);

        var hexyes = this.prefs.getBoolPref(EXT_BASE+'hexyes');
        var decyes = this.prefs.getBoolPref(EXT_BASE+'decyes');
        var unicodeyes = this.prefs.getBoolPref(EXT_BASE+'unicodeyes');
        var middleyes = this.prefs.getBoolPref(EXT_BASE+'middleyes');
        var entyes = this.prefs.getBoolPref(EXT_BASE+'entyes');

        var xstyle2 = 'x'; // this.prefs.getCharPref(EXT_BASE+'xstyle');

        if (middleyes) {
            k = Math.round(k - ((rows * cols) / 2));
            if (k < 0) { // Could still be less than 0
                k += 1114112;
            }
        }

        var onlyentsyes = this.prefs.getBoolPref(EXT_BASE+'onlyentsyes');
        var prev, chars, obj;
        if (onlyentsyes || descripts) {
            chars = descripts ? 'descripts' : 'charrefs';
            obj = descripts ? charrefunicodeConverter : CharrefunicodeConsts;
            var chrreflgth = obj[chars].length;

            if ((rows*cols) > chrreflgth) {
                var newrows = chrreflgth / cols;
                var newrowceil = Math.ceil(newrows);

                rows = newrowceil;
                var remainder = (rows*cols) - chrreflgth;
            }
            var q = obj[chars].indexOf(k);
            if (q == -1) {
                q = 0;
                k = obj[chars][q];
            }

            var newq = q - (cols*rows);
            if (newq < 0) { // Go backwards in the entity array
                newq = chrreflgth + newq;
            }
            prev = obj[chars][newq];
        }
        else {
            prev = k - (cols*rows);
        }

        // Ensure 0-9 get treated as char. ref. values rather than Unicode digits
        if (prev >= 0 && prev <= 9) {
            prev = "'#"+prev+"'";
        }

        var tablecntnr = $('tablecntnr');
        tablecntnr.textContent = '';

        var table = createHTMLElement('table');
        // Not sure if this will require fixing if xml:lang bug is fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=234485
        table.lang = this.branch.getComplexValue('lang', Ci.nsIPrefLocalizedString).data;
        table.style.fontFamily = this.branch.getComplexValue('font', Ci.nsIPrefLocalizedString).data;

        table.id = 'chart_table';

        var caption = createHTMLElement('caption');
        caption.className = 'dialogheader';
        caption.setAttribute('tooltiptext', this.strs.getString('Unicode_table_caption_title')); // Oddly 'title' doesn't work (nor does tooltiptext on an embedded XUL label)

        table.className = 'unicodetablecell';

        var captioncntnt = [];
        if (unicodeyes) {
            captioncntnt.push(this.strs.getString('unicode_(noun)'));
        }
        if (hexyes) {
            captioncntnt.push(this.strs.getString('hexadecimal_(noun)'));
        }
        if (decyes) {
            captioncntnt.push(this.strs.getString('decimal_(noun)'));
        }
        if (entyes) {
            captioncntnt.push(this.strs.getString('entities_(noun)'));
        }

        var captcnt = captioncntnt[0];

        // Make first letter of first word upper case
        captcnt = captcnt.replace(/^([a-z])(.*)$/,
            function(a, b, c){
                return b.toUpperCase()+c;
            }
        );

        // Build caption further
        for (var l = 1; l < captioncntnt.length-1; l++) {
            captcnt += this.strs.getString('comma')+' '+captioncntnt[l];
        }
        if (captioncntnt.length > 2) {
                        // <SPACE> is needed at beginning in Hungarian and beginning spaces are lost if don't put such a placeholder
            captcnt += this.strs.getString('commaspaceand').replace(/<SPACE>/, ' ')+' '+captioncntnt[captioncntnt.length-1];
        }
        else if (captioncntnt.length === 2) {
            captcnt += ' '+this.strs.getString('and')+' '+captioncntnt[captioncntnt.length-1];
        }


        caption.textContent = captcnt
        table.appendChild(caption);

        var tr, td, br, div, button;
        var buttonyes = this.prefs.getBoolPref(EXT_BASE+'buttonyes');

        var tempcharrefs, tempents;
        tempcharrefs = CharrefunicodeConsts.charrefs;
        tempents = CharrefunicodeConsts.ents;

        for (var j = 0; j < rows; j++) {
            tr = createHTMLElement('tr');

            for (i = 0; i < cols; i++) {
                if ((descripts || onlyentsyes) && j == (newrowceil-1) && remainder > 0 && i == (cols-remainder)) {
                    break;
                }
                td = createHTMLElement('td');
                td.className = 'unicodetablecell';

                if (buttonyes) {
                    button = createHTMLElement('input');
                }
                else {
                    button = createXULElement('label');
                }
                button.setAttribute('type', 'button');
                button.setAttribute('name', 'dec');
                button.setAttribute('id', '_' + this.idgen++);

                button.addEventListener('click', function (e) {if (!e.ctrlKey) {Unicodecharref.insertText('inserttext', e.target.value);}}, false);

                var kent = '', kent0 = '';

                if (tempcharrefs.indexOf(k) !== -1) { // If recognized multiple char ent. (won't convert these to decimal)
                    kent0 = tempents[tempcharrefs.indexOf(k)];
                    kent = '('+'&'+kent0+';'+') ';
                    td.className = 'entity unicodetablecell';

                    if (entyes) {
                        var entlink = createHTMLElement('a');
                        entlink.setAttribute('value', '&'+kent0+';');
                        entlink.setAttribute('onclick', "if (!event.ctrlKey) Unicodecharref.insertText('inserttext', '"+'&'+kent0+';'+"');return false;");

                        var entlinktxt = document.createTextNode('&'+kent0+';'); // 'ent'
                        entlink.appendChild(entlinktxt);
                        td.appendChild(entlink);
                        var entlinkspace = document.createTextNode(' ');
                        td.appendChild(entlinkspace);
                    }
                }
                if (decyes) {
                    button.setAttribute('value', '&#'+k+';');
                    if (!buttonyes) {
                        var txtnd = document.createTextNode('&#'+k+';');
                        button.appendChild(txtnd);
                    }
                    td.appendChild(button);
                }

                if (hexyes) {
                    if (this.decyes) {
                        var tn1 = document.createTextNode(' '+fixFromCharCode(160)+' ');
                        td.appendChild(tn1);
                    }

                    if (buttonyes) {
                        button = createHTMLElement('input');
                    }
                    else {
                        button = createXULElement('label');
                    }
                    button.setAttribute('type', 'button');
                    button.setAttribute('name', 'hex');

                    var kto16;
                    if (this.prefs.getBoolPref(EXT_BASE+'hexLettersUpper')) {
                        kto16 = k.toString(16).toUpperCase();
                    }
                    else {
                        kto16 = k.toString(16);
                    }
                    button.setAttribute('value', '&#'+xstyle2+kto16+';');
                    if (!buttonyes) {
                        var txtnd2 = document.createTextNode('&#'+xstyle2+kto16+';');
                        button.appendChild(txtnd2);
                    }
                    button.setAttribute('id', '_' + this.idgen++);
                    button.setAttribute('onclick', "if (!event.ctrlKey) Unicodecharref.insertText('inserttext', event.target.value);");

                    td.appendChild(button);
                }

                if (unicodeyes) {
                    if (hexyes || decyes) {
                        br = createHTMLElement('br');
                        td.appendChild(br);
                    }
                    div = createHTMLElement('div');
                    div.className = 'centered';
                    if (buttonyes) {
                        button = createHTMLElement('input');
                    }
                    else {
                        button = createHTMLElement('div');
                        //button = createXULElement('label'); // need to use HTML in order to allow display of surrogates, combining diacritics, others? in non-button (Firefox bug?)
                    }
                    button.setAttribute('type', 'button');
                    button.setAttribute('name', 'unicode');

                    button.setAttribute('value', fixFromCharCode(k));
                    if (!buttonyes) {
                        var txtnd3 = document.createTextNode(fixFromCharCode(k));
                        //button.appendChild(txtnd3);
                        //button.setAttribute('value',  fixFromCharCode(k));
                        button.appendChild(txtnd3);
                        //button.innerHTML = fixFromCharCode(k);
                        //alert(fixFromCharCode(k))
                    }
                    button.setAttribute('id', '_' + this.idgen++);
                    button.setAttribute('onclick', "if (!event.ctrlKey) Unicodecharref.insertText('inserttext', event.target.getAttribute('value'));"); // Keep getAttribute here in case switch to HTML

                    div.appendChild(button);
                    td.appendChild(div);
                }

                var khextemp = k.toString(16).toUpperCase();
                var khexlength = khextemp.length
                for (var v = 0; v < (4 - khexlength); v++) { // 0's needed by data file
                    khextemp = '0'+khextemp;
                }
                //td.setAttribute('onmouseover', "Unicodecharref.getUnicodeDesc('"+kent+"', '"+khextemp+"');");
                function defineMouseover (kent, khextemp) {
                    return function () {
                        if (!that.noGetDescripts) {
                                Unicodecharref.getUnicodeDesc(kent, khextemp);
                        }
                    }
                }
                td.addEventListener('mouseover', defineMouseover(kent, khextemp), false);
                td.addEventListener('click',
                    function (e) {
                        if (e.ctrlKey) {
                            that.noGetDescripts = !that.noGetDescripts;
                        }
                    }, false
                ); // trying dblclick worked but might not be obvious to user and single clicks still activated; relying on right button doesn't work

                tr.appendChild(td);
                if (k >= 1114111) {
                    k = 0;
                }
                else if (onlyentsyes || descripts) {
                    q++;
                    if (q >= obj[chars].length) {
                        q = 0;
                    }
                    k = obj[chars][q];
                }
                else {
                    k++;
                }
            }
            table.appendChild(tr);
        }

        td = createHTMLElement('td');
        td.className =  'centered';
        td.setAttribute('colspan', cols);

        var a = createHTMLElement('a');

        a.setAttribute('href',
          "javascript:Unicodecharref.k("+prev+");Unicodecharref.middleyes(false);Unicodecharref.printunicode("+descripts+");"
        );

        a.textContent = this.strs.getString('Prev_set');

        td.appendChild(a);

        var space = document.createTextNode(' '+fixFromCharCode(160)+' ');
        td.appendChild(space);

        var next = k;
        if (next >= 0 && next <= 9) {
            next = "'#"+next+"'";
        }

        a = createHTMLElement('a');
        a.setAttribute('href',
            "javascript:Unicodecharref.k("+next+");Unicodecharref.middleyes(false);Unicodecharref.printunicode("+descripts+");"
        );
        a.textContent = this.strs.getString('Next_set');
        td.appendChild(a);
        /*
        var br = createHTMLElement('br');
        var br2 = createHTMLElement('br');
        td.appendChild(br);
        td.appendChild(br2);
        */
        tr = createHTMLElement('tr');
        tr.appendChild(td);
        table.appendChild(tr);
        tablecntnr.appendChild(table);

/*  This was making the current preferences increment each time the window opened, even if it had not been changed
        this.setCurrstartset(k);
*/

        this.resizecells(false, null);
        window.sizeToContent();
    },
    setImagePref : function (ev) {
        this.setprefs(ev);
        if ($('unicodeImg').firstChild) {
            $('unicodeImg').removeChild($('unicodeImg').firstChild);
        }
        return false;
    },
    getUnicodeDesc : function (kent, khextemp) {
        var that = this;
        var hideMissing = !this.prefs.getBoolPref(EXT_BASE+'showAllDetailedView');
        var hideMissingUnihan = !this.prefs.getBoolPref(EXT_BASE+'showAllDetailedCJKView');

        var kdectemp = parseInt(khextemp, 16);

        //var alink = createHTMLElement('a');
        var alink = createXULElement('label');
        var s = this.strs;
        var [plane, privateuse, surrogate] = getAndSetCodePointInfo(kdectemp, alink, s);

        function placeItem (id, item) {
            var firstchld = document.getElementById(id).firstChild;
            if (firstchld != null) {
                document.getElementById(id).replaceChild(item, firstchld);
            }
            else {
                document.getElementById(id).appendChild(item);
            }
        }
        // Handle PDF link
        placeItem('pdflink', alink);

        // Handle plane #
        var planeText = document.createTextNode(s.getFormattedString('plane_num', [plane])+'\u00a0');
        placeItem('plane', planeText);


        if (this.prefs.getBoolPref(EXT_BASE+'showImg')) {
            var img = createXULElement('image');
            //img.width = '80';
            //img.height = '80';
            img.setAttribute('src', 'http://www.unicode.org/cgi-bin/refglyph?1-'+Number(kdectemp).toString(16))
            placeItem('unicodeImg', img);
        }

        var hangul = false;

        var i, pattern, file;
        // If Unihan
        if ((0x3400 <=  kdectemp && kdectemp <= 0x4DB5) || (0x4E00 <=  kdectemp && kdectemp <= 0x9FC3) ||  // 0x9FBB
                (0xF900 <= kdectemp &&  kdectemp < 0xFB00) ||
                // If not using the 27MB updated file, this range (CJK Ideograph Extension B) will not be valid:
                (0x20000 <= kdectemp && kdectemp <= 0x2A6D6) ||
                (kdectemp >= 0x2F800 && kdectemp < 0x2FA1F)
            ) {
            pattern = new RegExp('^U\\+('+khextemp+')\\t(.*)\\t(.*)$', 'mg');
            file = 'Unihan.txt';
            this.UnihanType = true;
//   $('pdflink').appendChild(alink);
        }
        else if (0xAC00 <=  kdectemp && kdectemp <= 0xD7A3) {
            pattern = new RegExp('^'+khextemp+'\\s*;\\s*(.*)$', 'm');
            file = 'HangulSyllableType.txt';
            hangul = true;
            if (this.UnihanType) {
                for (i=0; i < this.Unihan.length; i++) {
                    $('searchk'+this.Unihan[i]).value = '';
                }
            }
            this.UnihanType = false;
        }

        /* The following are some ranges in UnicodeData.txt which do not have their own description sheets as do the two above */
/*
        if (0xE000 <= kdectemp && kdectemp <= 0xF8FF) {// Private Use
        }
        else if (0xF0000 <= kdectemp && kdectemp <= 0xFFFFD) {// Plane 15 Private Use
        }
        else if (0x100000 <= kdectemp && kdectemp <= 0x10FFFD) {// Plane 16 Private Use
        }
*/
        else {
            pattern = new RegExp('^'+khextemp+';([^;]*);', 'm');
            file = 'UnicodeData.txt';
            if (this.UnihanType) {
                for (i=1; i <= 13; i++) {
                    $('_detailedCJKView'+i).value = '';
                }
                for (i=15; i <= 90; i++) {
                    $('_detailedCJKView'+i).value = '';
                }
            }
            this.UnihanType = false;
        }

        var temp, col, notfoundval, table, result, statement;
        if (1) { // !this.UnihanType && !hangul) {
            if (!this.UnihanType && !hangul && $('viewTabs').selectedTab == $('detailedCJKView')) {
                $('viewTabs').selectedTab = $('detailedView');
            }
             table = 'Unicode';
             var search = false;
             var cjkText;

             if (kdectemp >= 0x3400 && kdectemp <= 0x4DB5) {
                search = '3400';
                if (kdectemp != 0x3400 && kdectemp != 0x4DB5) {
                    cjkText = s.getString('CJK_Ideograph_Extension_A');
                }
                else if (kdectemp == 0x4DB5) {
                    search = '4DB5';
                }
             }
             else if (kdectemp >= 0x4E00 && kdectemp <= 0x9FC3) {
                search = '4E00';
                if (kdectemp != 0x4E00 && kdectemp != 0x9FC3) {
                    cjkText = s.getString('CJK_Ideograph');
                }
                else if (kdectemp == 0x9FC3) {
                    search = '9FC3';
                }
             }
             else if (kdectemp >= 0xF900 && kdectemp < 0xFB00) { // Should have individual code point
                search = true;
             }
             else if (kdectemp >= 0x20000 && kdectemp <= 0x2A6D6) {
                search = '20000';
                if (kdectemp != 0x20000 && kdectemp != 0x2A6D6) {
                    cjkText = s.getString('CJK_Ideograph_Extension_B');
                }
                else if (kdectemp == 0x2A6D6) {
                    search = '2A6D6';
                }
             }
             else if (kdectemp >= 0x2F800 && kdectemp < 0x2FA1F) { // Should have individual code point
                search = true;
             }
             else if (hangul) {
                // search = 'AC00';
                // if (kdectemp != 0xAC00 && kdectemp != 0xD7A3) {
                cjkText = s.getString('Hangul_Syllable');
                cjkText += ' ';

                cjkText += Hangul.getHangulName(kdectemp);
                /*}
                else if (kdectemp == 0xD7A3) {
                    search = 'D7A3';
                }*/
             }
             if (search) {
                  if (search === true) {
                      search = khextemp;
                  }
                  statement = charrefunicodeDb.dbConn.createStatement(
                          'SELECT * FROM '+table+' WHERE Code_Point = "'+search+'"'
                  );
             }
             else {
                 statement = charrefunicodeDb.dbConn.createStatement(
                      'SELECT * FROM '+table+' WHERE Code_Point = "'+khextemp+'"'
                 );
             }
             try {
                //$('displayUnicodeDesc').value= s.getString('retrieving_description');
                 while (statement.executeStep()) {
                     if (!cjkText) {
                        result = statement.getUTF8String(1);
                        if (kdectemp >= 0x1100 && kdectemp < 0x1200) {
                            try {
                                var jamo = getJamo(charrefunicodeDb, kdectemp);
                                result += ' ('+jamo+')';
                            }
                            catch(e) {
                            }
                        }
                     }
                     else {
                        result = cjkText;
                     }
                     for (i=2; i <= 14; i++) {
                         temp = statement.getUTF8String(i); // Fix: display data more readably, etc.
                         if (i === 10) {
                             if (temp) {
                                 result += ';\u00a0\u00a0\u00a0\u00a0\n'+s.getString('searchUnicode_1_Name')+
                                                    s.getString('colon')+' '+temp;
                             }
                             continue;
                         }
                         if (temp) {
                            if (hideMissing) {
                                $('_detailedView'+i).parentNode.hidden = false;
                            }
                            switch (i) {
                                case 2:
                                    temp = s.getString('General_Category'+temp);
                                    break;
                                case 3:
                                    if (temp < 11 || temp > 132) {
                                        temp = s.getString('Canonical_Combining_Class'+temp); // 199, 200, 204, 208, 210, 212 do not have members yet and others from 11 to 132 do not have name listed
                                    }
                                    break;
                                case 4:
                                    temp = s.getString('Bidi_Class'+temp);
                                    break;
                                case 9:
                                    temp = (temp === 'Y') ? s.getString('Bidi_MirroredY') : s.getString('Bidi_MirroredN'); // Only two choices
                                    break;
                                case 12:
                                case 13:
                                case 14:
                                    var a = createHTMLElement('a');
                                    a.href = 'javascript:void(0)';

                                    a.addEventListener('click', function (e) {
                                          that.startset({value:e.target.innerHTML.charCodeAt(0)});
                                          that.noGetDescripts = false; // Probably want to start checking again since move to new page
                                    }, false);
                                    var tempno = parseInt(temp, 16);
                                    a.innerHTML = fixFromCharCode(tempno);
                                    a.className = 'text-link';
                                    var view = $('_detailedView'+i);
                                    this.removeViewChildren(i);

                                    var box = createXULElement('description'); // necessary to avoid CSS wrapping warning
                                    box.appendChild(a);
                                    box.appendChild(document.createTextNode(' ('+temp+')'));
                                    view.appendChild(box);

                                    //alert(new XMLSerializer().serializeToString(view));
                                    break;
                                default:
                                    break;
                            }
                            if (i <= 11) {
                                $('_detailedView'+i).value = temp;
                            }
                         }
                         else if (i <= 11) {
                             $('_detailedView'+i).parentNode.hidden = hideMissing;
                             $('_detailedView'+i).value = '';
                         }
                         else {
                             $('_detailedView'+i).parentNode.hidden = hideMissing;
                             this.removeViewChildren(i);
                         }
                     }
                    break;
                    }
                    if (!this.UnihanType && result != null) {
                        $('displayUnicodeDesc').value = kent+'U+'+khextemp+s.getString('colon')+' '+result;
                        $('displayUnicodeDesc2').value = kent+'U+'+khextemp+s.getString('colon')+' '+result;
                    }
                    // Fix: remove this duplicate also in catch, etc.
                    else if (surrogate) {
                        $('displayUnicodeDesc').value = kent+'U+'+khextemp+s.getString('colon')+' '+surrogate;
                        $('displayUnicodeDesc2').value = kent+'U+'+khextemp+s.getString('colon')+' '+surrogate;
                    }
                    else if (privateuse) {
                        $('displayUnicodeDesc').value = kent+'U+'+khextemp+s.getString('colon')+' '+s.getString('Private_use_character');
                        $('displayUnicodeDesc2').value = kent+'U+'+khextemp+s.getString('colon')+' '+s.getString('Private_use_character');
                    }
                    else if ( // Catch noncharacters
                            (kdectemp >= 0xFDD0 && kdectemp <= 0xFDEF) ||
                            (kdectemp >= 0xFFFE && kdectemp <= 0xFFFF) ||
                            (kdectemp >= 0x1FFFE && kdectemp <= 0x1FFFF) ||
                            (kdectemp >= 0x2FFFE && kdectemp <= 0x2FFFF) ||
                            (kdectemp >= 0x3FFFE && kdectemp <= 0x3FFFF) ||
                            (kdectemp >= 0x4FFFE && kdectemp <= 0x4FFFF) ||
                            (kdectemp >= 0x5FFFE && kdectemp <= 0x5FFFF) ||
                            (kdectemp >= 0x6FFFE && kdectemp <= 0x6FFFF) ||
                            (kdectemp >= 0x7FFFE && kdectemp <= 0x7FFFF) ||
                            (kdectemp >= 0x8FFFE && kdectemp <= 0x8FFFF) ||
                            (kdectemp >= 0x9FFFE && kdectemp <= 0x9FFFF) ||
                            (kdectemp >= 0xAFFFE && kdectemp <= 0xAFFFF) ||
                            (kdectemp >= 0xBFFFE && kdectemp <= 0xBFFFF) ||
                            (kdectemp >= 0xCFFFE && kdectemp <= 0xCFFFF) ||
                            (kdectemp >= 0xDFFFE && kdectemp <= 0xDFFFF) ||
                            (kdectemp >= 0xEFFFE && kdectemp <= 0xEFFFF) ||
                            (kdectemp >= 0xFFFFE && kdectemp <= 0xFFFFF) ||
                            (kdectemp >= 0x10FFFE && kdectemp <= 0x10FFFF)
                            ) {
                          $('displayUnicodeDesc').value = kent+'U+'+khextemp+s.getString('colon')+' '+s.getString('Noncharacter');
                          $('displayUnicodeDesc2').value = kent+'U+'+khextemp+s.getString('colon')+' '+s.getString('Noncharacter');
                      }
                      else if (!this.UnihanType) {
                         notfoundval = 'U+'+khextemp+s.getString('colon')+' '+s.getString('Not_found');
                         $('displayUnicodeDesc').value = notfoundval;
                         $('displayUnicodeDesc2').value = notfoundval;
                         for (var i=2; i <= 14; i++) {
                            if (i === 10) {continue;}
                            try {
                                $('_detailedView'+i).value = '';
                                $('_detailedView'+i).parentNode.hidden = hideMissing;
                                this.removeViewChildren(i);
                            }
                            catch(e) {
                            alert('2'+e+i);
                            }
                         }
                     }
             }
             catch (e) {
                  if (surrogate) {
                      $('displayUnicodeDesc').value = kent+'U+'+khextemp+s.getString('colon')+' '+surrogate;
                      $('displayUnicodeDesc2').value = kent+'U+'+khextemp+s.getString('colon')+' '+surrogate;
                  }
                  else if (privateuse) {
                      $('displayUnicodeDesc').value = kent+'U+'+khextemp+s.getString('colon')+' '+s.getString('Private_use_character');
                      $('displayUnicodeDesc2').value = kent+'U+'+khextemp+s.getString('colon')+' '+s.getString('Private_use_character');
                  }
                  else if ( // Catch noncharacters
                        (kdectemp >= 0xFDD0 && kdectemp <= 0xFDEF) ||
                        (kdectemp >= 0xFFFE && kdectemp <= 0xFFFF) ||
                        (kdectemp >= 0x1FFFE && kdectemp <= 0x1FFFF) ||
                        (kdectemp >= 0x2FFFE && kdectemp <= 0x2FFFF) ||
                        (kdectemp >= 0x3FFFE && kdectemp <= 0x3FFFF) ||
                        (kdectemp >= 0x4FFFE && kdectemp <= 0x4FFFF) ||
                        (kdectemp >= 0x5FFFE && kdectemp <= 0x5FFFF) ||
                        (kdectemp >= 0x6FFFE && kdectemp <= 0x6FFFF) ||
                        (kdectemp >= 0x7FFFE && kdectemp <= 0x7FFFF) ||
                        (kdectemp >= 0x8FFFE && kdectemp <= 0x8FFFF) ||
                        (kdectemp >= 0x9FFFE && kdectemp <= 0x9FFFF) ||
                        (kdectemp >= 0xAFFFE && kdectemp <= 0xAFFFF) ||
                        (kdectemp >= 0xBFFFE && kdectemp <= 0xBFFFF) ||
                        (kdectemp >= 0xCFFFE && kdectemp <= 0xCFFFF) ||
                        (kdectemp >= 0xDFFFE && kdectemp <= 0xDFFFF) ||
                        (kdectemp >= 0xEFFFE && kdectemp <= 0xEFFFF) ||
                        (kdectemp >= 0xFFFFE && kdectemp <= 0xFFFFF) ||
                        (kdectemp >= 0x10FFFE && kdectemp <= 0x10FFFF)
                        ) {
                      $('displayUnicodeDesc').value = kent+'U+'+khextemp+s.getString('colon')+' '+s.getString('Noncharacter');
                      $('displayUnicodeDesc2').value = kent+'U+'+khextemp+s.getString('colon')+' '+s.getString('Noncharacter');
                  }
                  else {
                     notfoundval = 'U+'+khextemp+s.getString('colon')+' '+s.getString('Not_found');
                     $('displayUnicodeDesc').value = notfoundval;
                     $('displayUnicodeDesc2').value = notfoundval;
                     for (var i=2; i <= 14; i++) {
                        if (i === 10) {continue;}
                        try {
                            $('_detailedView'+i).value = '';
                            $('_detailedView'+i).parentNode.hidden = hideMissing;
                            this.removeViewChildren(i);
                        }
                        catch(e) {
                        alert('3'+e+i);
                        }
                    }
                 }
            }
            finally {
                statement.reset();
            }
            var canreturn = true;
        }
        if (this.unihanDb_exists) {
            table = 'Unihan';

            if ((this.UnihanType) && $('viewTabs').selectedTab == $('detailedView')) {
                $('viewTabs').selectedTab = $('detailedCJKView');
            }
            statement = charrefunicodeDb.dbConnUnihan.createStatement(
                'SELECT * FROM '+table+' WHERE code_pt = "'+khextemp+'"'
            );
            try {
                //$('displayUnicodeDesc').value= s.getString('retrieving_description');
                while (statement.executeStep()) {
                    result = statement.getUTF8String(14); // Fix: display data more readably, with heading, etc. (and conditional)
                    if (result === null && !cjkText) {
                        result = s.getString('No_definition');
                    }
                    // Fix: Display meta-data in table (get to be stable by right-clicking)
                    // $('_detailedCJKView'+3).value = result ? result : '';
                    for (i=1; i <= 13; i++) {
                        temp = statement.getUTF8String(i); // Fix: display data more readably, etc.
                        if (temp) {
                            if (hideMissingUnihan) {
                               $('_detailedCJKView'+i).parentNode.hidden = false;
                            }
                            // result += '; '+temp;
                            switch (i) {
                                case 1:
                                    // Optional code to transform output into something more readable
                                    break;
                                case 2:
                                    break;
                                default:
                                    break;
                            }
                            $('_detailedCJKView'+i).value = temp;
                        }
                        else {
                            $('_detailedCJKView'+i).parentNode.hidden = hideMissingUnihan;
                            $('_detailedCJKView'+i).value = '';
                        }
                    }
                    for (i=15; i <= 90; i++) {
                        try {
                            temp = statement.getUTF8String(i); // Fix: display data more readably, etc.
                        }
                        catch(e) {
                            alert(i);
                        }
                        if (temp) {
                            if (hideMissingUnihan) {
                                $('_detailedCJKView'+i).parentNode.hidden = false;
                            }
                            switch (i) {
                                case 4:
                                    // Optional code to transform output into something more readable
                                    break;
                                case 5:
                                    break;
                                default:
                                    break;
                            }
                            $('_detailedCJKView'+i).value = temp;
                        }
                        else {
                            $('_detailedCJKView'+i).parentNode.hidden = hideMissingUnihan;
                            $('_detailedCJKView'+i).value = '';
                        }
                    }
                    break;
                }

                if (result != '' && result != null) {
// Commenting out to show general category under definition
//                                        $('displayUnicodeDesc2').value = kent+'U+'+khextemp+s.getString('colon')+' '+result;
                    $('displayUnicodeDescUnihan').value = kent+'U+'+khextemp+s.getString('colon')+' '+result;
                    $('displayUnicodeDesc').value = kent+'U+'+khextemp+s.getString('colon')+' '+result;
                    $('displayUnicodeDesc2').value = kent+'U+'+khextemp+s.getString('colon')+' '+result;
                }
                else {
                    notfoundval = 'U+'+khextemp+s.getString('colon')+' '+s.getString('Not_found');

                    if (!cjkText || hangul) {
                        for (var i=2; i <= 14; i++) {
                            if (i === 10) {continue;}
                            try {
                                $('_detailedView'+i).value = '';
                                $('_detailedView'+i).parentNode.hidden = hideMissing;
                                this.removeViewChildren(i);
                            }
                            catch(e) {
                                alert('1'+e+i);
                            }
                        }
                        for (i=1; i <= 13; i++) {
                            $('_detailedCJKView'+i).parentNode.hidden = hideMissingUnihan;
                            $('_detailedCJKView'+i).value = '';
                        }
                        for (i=15; i <= 90; i++) {
                            $('_detailedCJKView'+i).parentNode.hidden = hideMissingUnihan;
                            $('_detailedCJKView'+i).value = '';
                        }
                    }

                    if (!cjkText) {
                        $('displayUnicodeDesc').value = notfoundval;
                        $('displayUnicodeDescUnihan').value = notfoundval;
                        $('displayUnicodeDesc2').value = notfoundval;
                     }
                    else {
                        var finalval = kent+'U+'+khextemp+s.getString('colon')+' '+cjkText+' '+
                                                    (hangul ? '' : s.getString('left_parenth')+s.getString('No_definition')+s.getString('right_parenth'));
                        $('displayUnicodeDesc').value = finalval;
                        $('displayUnicodeDesc2').value = finalval;
                        $('displayUnicodeDescUnihan').value = finalval;
//                                         $('displayUnicodeDesc2').value = notfoundval;
                     }
                 }
            }
            catch (e) {
                alert(e);
            }
            finally {
                statement.reset();
            }
            return;
        } // Excised Ajax code...
    },
    removeViewChildren : function (i) {
        var view = $('_detailedView'+i);
        while (view.firstChild) {
            view.removeChild(view.firstChild);
        }
    },
    insertText : function (id, evval) {
        var textarea = $(id);
        var length = textarea.value.length;
        var start = textarea.selectionStart;
        var end = textarea.selectionEnd;

        //if (end > 0 || 1) {
            textarea.focus();
            var pre = textarea.value.substring(0, start);
    //  var selected = textarea.value.substring(start, end);
            var post = textarea.value.substring(end, length);

            textarea.value = pre + evval + post;

            textarea.selectionStart = length - post.length;
            textarea.selectionEnd = length - post.length;
        /*}
        else {
// Although textarea.focus(); should be here (above the "if" actually), it seems to put the cursor at the beginning instead of end
// textarea.focus();
            textarea.value = textarea.value + evval;
            textarea.selectionStart = length;
            textarea.selectionEnd = length;
        }
        */
        // Save values for manipulation by entity addition function, 'insertent'
        this.selst = textarea.selectionStart;
        this.selend = textarea.selectionEnd;
    },
    fsizetextbox: function(size) { // Changes font-size
        var txtbxsize = this.prefs.getIntPref(EXT_BASE+'fsizetextbox');
        txtbxsize += size;
        this.prefs.setIntPref(EXT_BASE+'fsizetextbox', txtbxsize);

        $('toconvert').style.fontSize = txtbxsize + 'px';
        $('converted').style.fontSize = txtbxsize + 'px';
        if (size > 0) { // On Mac at least, resizing for reducing font size, causes button to
                // go off screen
            window.sizeToContent();
        }
    },
    tblfontsize: function(size) { // Changes font-size of chart table cells
        var fsize = this.prefs.getIntPref(EXT_BASE+'tblfontsize') + size;
//      var tds = createHTMLElement('td');
        this.prefs.setIntPref(EXT_BASE+'tblfontsize', fsize);
        this.resizecells(true, size);
    },
    resizecells: function(windowrsz, size) {

        try {
            var xpathresultobj = document.evaluate(
                "//*[@name='dec' or @name='hex' or @name='unicode']",
                /* contextNode */ document.documentElement,
                /* Namespace URL mapping */ function() {return null},
                XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                /* Same XPathResult object */ null
            );
        }
        catch (e) {
            alert(e);
        }

        for (var i = 0; i < xpathresultobj.snapshotLength; i++) {
            var tempid = xpathresultobj.snapshotItem(i);
        // This is apparently necessary as the XPath expression does not seem to me to be able to allow manipulation of the original node
            $(tempid.id).style.fontSize =
                            this.prefs.getIntPref(EXT_BASE+'tblfontsize') + 'px';
        }
        $('inserttext').style.fontSize =
                            this.prefs.getIntPref(EXT_BASE+'tblfontsize') + 'px';
                //$('displayUnicodeDesc').style.fontSize =
        //       this.prefs.getIntPref(EXT_BASE+'tblfontsize') + 'px';
        if (size > 0 && windowrsz) { // On Mac at least, resizing for reducing font size, causes button to
                // go off screen
            window.sizeToContent();
        }
    },
    flip: function(e) {
        this.setCurrstartset(this.j);
        this.setprefs(e);
        this.printunicode();
    },
    onlyentsyesflip: function(e) {
        this.flip(e);
    },
    hexflip: function(e) {
        this.flip(e);
    },
    decflip: function(e) {
        this.flip(e);
    },
    unicodeflip: function(e) {
        this.flip(e);
    },
    middleflip: function(e) {
        this.flip(e);
    },
    buttonflip: function(e) {
        this.flip(e);
    },
    entflip: function(e) {
        this.flip(e);
    },
    cssWhitespace : function (e) {
        var value = e.target.value;
        // Escape these since some like \r may be lost?
        switch(value) {
            case 'space':
                value = ' ';
                break;
            case 'rn':
                value = '\r\n';
                break;
            case 'r':
                value = '\r';
                break;
            case 'n':
                value = '\n';
                break;
            case 't':
                value = '\t';
                break;
            case 'f':
                value = '\f';
                break;
        }
        this.prefs.setCharPref(EXT_BASE+'cssWhitespace', value);
    },
/*    xstyleflip: function() {
        this.setCurrstartset(this.j);
        var currxstyle = 'x';
        var prevxstyle = this.prefs.getCharPref(EXT_BASE+'xstyle');
        if (prevxstyle === 'x') {
            currxstyle = 'X';
        }
        this.prefs.setCharPref(EXT_BASE+'xstyle', currxstyle);
        this.printunicode();
    },*/
    rowsset: function(e) {
        this.setCurrstartset(this.j);
        if (e.target.value != null && e.target.value != '') {
            this.prefs.setIntPref(EXT_BASE+'tblrowsset', e.target.value);
        }
        this.printunicode();
    },
    colsset: function(e) {
        this.setCurrstartset(this.j);
        if (e.target.value != null && e.target.value != '') {
            this.prefs.setIntPref(EXT_BASE+'tblcolsset', e.target.value);
        }
        this.printunicode();
    },
    startset: function(tbx, descripts) {
        this.disableEnts();
        var data;
        if (tbx.value != null && tbx.value != '') {
            data = tbx.value;
        }
        else {
            // Only used when the field is manually changed to blank (default start set)
            data = this.branch.getComplexValue('startset', Ci.nsIPrefLocalizedString).data;
        }
        this.setCurrstartset(data);

        this.printunicode(descripts);
    },
    searchUnihan : function (obj) {
        this.searchUnicode(obj, 'Unihan');
    },
    disableEnts : function () {
        this.setBoolChecked('onlyentsyes', false);
    },
    searchUnicode : function (obj, table, nochart, strict) { // Fix: allow Jamo!
        charrefunicodeConverter.searchUnicode(obj, table, nochart, strict);
        if (!nochart) {
            var tmp = this.branch.getComplexValue('currstartset', Ci.nsIPrefLocalizedString).data;
            this.startset(obj, true); // Could remember last description (?)
            this.setCurrstartset(tmp); // Set it back as it was before the search
        }
        /*if (name_desc === 'Name' || name_desc === 'kDefinition') { // Doesn't work since name_desc_val is
        // search value, not first result value (we could remember the last search and whether it were a search,
        // however); we need to be careful, however, since some searches run automatically on start-up
            this.setCurrstartset(name_desc_val);
        }*/
    },
    doOK: function () {
        this.prefs.setIntPref(EXT_BASE+'window.outer.height', window.outerHeight);
        this.prefs.setIntPref(EXT_BASE+'window.outer.width', window.outerWidth);
        return false;
    },
    doCancel: function (){
        this.prefs.setIntPref(EXT_BASE+'window.outer.height', window.outerHeight);
        this.prefs.setIntPref(EXT_BASE+'window.outer.width', window.outerWidth);
        return true;
    },
    moveoutput: function(movedid){
        var inserttext = $(movedid);
        $('unicodetabs').selectedIndex = 1;
        $('toconvert').value = inserttext.value;
    },
    append2htmlflip: function(e) {
        this.setprefs(e);
        this.registerDTD(); // (in case DTD not also changed, still need to reset)
    },
    registerDTD: function() {
        // Cannot use back-reference inside char. class, so need to do twice
        var pattern = /<!ENTITY\s+([^'"\s]*)\s+(["'])(.*)\2\s*>/g;

        var text = $('DTDtextbox').value;

        var temp0 = Cc['@mozilla.org/pref-localizedstring;1'].createInstance(Ci.nsIPrefLocalizedString);
        temp0.data = text;
        this.prefs.setComplexValue(EXT_BASE+'DTDtextbox',
            Ci.nsIPrefLocalizedString,
            temp0
        );

        var result;

        // Reset in case charrefs or ents array deleted before and now want to go back to their original values.
        if (this.prefs.getBoolPref(EXT_BASE+'appendtohtmldtd')) {
            this.copyarray(this.origents, CharrefunicodeConsts.ents);
            this.copyarray(this.origcharrefs, CharrefunicodeConsts.charrefs);
        }
        else {
            CharrefunicodeConsts.ents = [];
            CharrefunicodeConsts.charrefs = [];
        }

        this.copyarray(this.orignewents, charrefunicodeConverter.newents); // Start off blank in case items erased
        this.copyarray(this.orignewcharrefs, charrefunicodeConverter.newcharrefs); // Start off blank in case items erased

        while((result = pattern.exec(text)) != null) {

            var decreg = /^(&#)([0-9]+);$/;
            var hexreg = /^(&#[xX])([0-9a-fA-F]+);$/;
            var m = result[3];

            var addreg = true;
            if (m.match(decreg)) { // Dec
                m = m.replace(decreg, '$2');
                m = parseInt(m);
            }
            else if (m.match(hexreg)) { // Hex
                m = m.replace(hexreg, '$2');
                m = parseInt(m, 16);
            }
            else if (m.length > 1) { // If replacing with Unicode sequence longer than one character, assume only wish to convert from entity (not from Unicode)
                addreg = false;
            }
            else {
                m = m.charCodeAt(0);
            }
            if (addreg) {
                charrefunicodeConverter.shiftcount += 1; // Used to ensure apos or amp is detected in same position
                CharrefunicodeConsts.ents.unshift(result[1]);
                CharrefunicodeConsts.charrefs.unshift(m);
            }
            else { // For translating entities into two-char+ Unicode, or hex or dec
                charrefunicodeConverter.newents.push(result[1]);
                charrefunicodeConverter.newcharrefs.push(m); // Can be a string, etc.
            }
        }
    },
    /**
     * Sets the preference for whether to display the chosen character in the middle of the chart (or beginning)
     * @param {Boolean} bool Whether to set to true or not
     */
    middleyes : function(bool) {
        // Commented this out because while it will always change (unlike now), the value will be misleading
        // $(EXT_BASE+'middleyes').checked = bool;
        this.prefs.setBoolPref(EXT_BASE+'middleyes', bool);
    },
    /**
     * Sets a value in preferences at which the Unicode chart view will begin on next start-up
     * @value The value to which to set the current starting value
     */
    setCurrstartset : function (value) {
        var temp1 = Cc['@mozilla.org/pref-localizedstring;1'].createInstance(Ci.nsIPrefLocalizedString);
        temp1.data = value;
        this.prefs.setComplexValue(EXT_BASE+'currstartset',
            Ci.nsIPrefLocalizedString,
            temp1
        );
    },
    // Some of these defaults may become irrelevant due to the /default/preferences/charrefunicode.js file's settings
    k: function(setval) {
        this.setCurrstartset(setval);
    },
    insertent: function(id) {
        this.insertText(id, '<!ENTITY  "">\n');
        /* The following works but may be annoying if trying to insert multiple entities at a time (thus the addition of the newline)
        // Bring cursor back a little
        textarea.selectionStart = this.selst - 5;
        textarea.selectionEnd = this.selend - 5;
        */
    },
    /**
     * Display the Unicode description box size (multline or not) according to user preferences
     * @param {Event} e The event (not in use)
     */
    multiline: function(e) {
        var display = $('displayUnicodeDesc');
        if (this.prefs.getBoolPref(EXT_BASE+'multiline') == false) {
            this.prefs.setBoolPref(EXT_BASE+'multiline', true);
            display.setAttribute('multiline', true);
            display.setAttribute('rows', 3);
        }
        else {
            this.prefs.setBoolPref(EXT_BASE+'multiline', false);
            display.setAttribute('multiline', false);
            display.setAttribute('rows', 1);
        }
    },
    addToToolbar : function () {
        var dropdownArr = JSON.parse(this.branch.getComplexValue('dropdownArr', Ci.nsIPrefLocalizedString).data || '[]');
        dropdownArr.push($('inserttext').value);
        var str = Cc['@mozilla.org/pref-localizedstring;1'].createInstance(Ci.nsIPrefLocalizedString);
        str.data = JSON.stringify(dropdownArr);
        this.branch.setComplexValue('dropdownArr', Ci.nsIPrefLocalizedString, str);
        if (this.refreshToolbarDropdown()) {
            alert(this.strs.getString('yourItemAdded'));
        }
        else {
            alert(this.strs.getString('problemAddingToolbarItem'));
        }
    },
    refreshToolbarDropdown : function () {
        // SETUP
        var dropdownArr = JSON.parse(this.branch.getComplexValue('dropdownArr', Ci.nsIPrefLocalizedString).data || '[]');
        var toolbarbuttonPopup = $('charrefunicode-toolbar-chars', mainDoc);
        if (!toolbarbuttonPopup) {
            return false;
        }

        // EMPTY OLD CONTENTS
        while (toolbarbuttonPopup.firstChild) {
            toolbarbuttonPopup.removeChild(toolbarbuttonPopup.firstChild);
        }

        // ADD NEW CONTENTS
        for each (var item in dropdownArr) {
            var menuitem = mainDoc.createElementNS(xulns, 'menuitem');
            menuitem.setAttribute('label', item);
            menuitem.setAttribute('value', item);
            toolbarbuttonPopup.appendChild(menuitem);
        }
        return true;
    },
    insertEntityFile : function (e) {
        var MY_ID = 'charrefunicode@brett.zamir',
            entFile = FileUtils.getFile(MY_ID, 'data/entities/' + e.target.value + '.ent'),
            data = '',
            fstream = Cc['@mozilla.org/network/file-input-stream;1'].createInstance(Ci.nsIFileInputStream),
            cstream = Cc['@mozilla.org/intl/converter-input-stream;1'].createInstance(Ci.nsIConverterInputStream),
            str = {}, read = 0;
        fstream.init(entFile, -1, 0, 0);
        cstream.init(fstream, 'UTF-8', 0, 0); // you can use another encoding here if you wish
        do {
            read = cstream.readString(0xffffffff, str); // read as much as we can and put it in str.value
            data += str.value;
        } while (read != 0);
        cstream.close(); // this closes fstream

        $('DTDtextbox').value += '\n' + data;
        this.registerDTD();
    },
    idgen: 0,
    prefs: null,

    /* Pseudo-constants */
    Unihan: ['AccountingNumeric','BigFive','CCCII','CNS1986','CNS1992','Cangjie','Cantonese','CheungBauer','CheungBauerIndex','CihaiT','CompatibilityVariant','Cowles','DaeJaweon','EACC','Fenn','FennIndex','FourCornerCode','Frequency','GB0','GB1','GB3','GB5','GB7','GB8','GSR','GradeLevel','HDZRadBreak','HKGlyph','HKSCS','HanYu','Hangul','HanyuPinlu','HanyuPinyin','IBMJapan','IICore','IRGDaeJaweon','IRGDaiKanwaZiten','IRGHanyuDaZidian','IRGKangXi','IRG_GSource','IRG_HSource','IRG_JSource','IRG_KPSource','IRG_KSource','IRG_MSource','IRG_TSource','IRG_USource','IRG_VSource','JIS0213','JapaneseKun','JapaneseOn','Jis0','Jis1','KPS0','KPS1','KSC0','KSC1','KangXi','Karlgren','Korean','Lau','MainlandTelegraph','Mandarin','Matthews','MeyerWempe','Morohashi','Nelson','OtherNumeric','Phonetic','PrimaryNumeric','PseudoGB1','RSAdobe_Japan1_6','RSJapanese','RSKanWa','RSKangXi','RSKorean','RSUnicode','SBGY','SemanticVariant','SimplifiedVariant','SpecializedSemanticVariant','TaiwanTelegraph','Tang','TotalStrokes','TraditionalVariant','Vietnamese','XHC1983','Xerox','ZVariant'],
    UnihanMenus: [], // Unused
    Unicode: ['General_Category', 'Canonical_Combining_Class','Bidi_Class','Decomposition_Type_and_Mapping','Decimal','Digit','Numeric','Bidi_Mirrored','Unicode_1_Name','ISO_Comment','Simple_Uppercase_Mapping','Simple_Lowercase_Mapping','Simple_Titlecase_Mapping'],
    UnicodeMenus: ['General_Category', 'Canonical_Combining_Class', 'Bidi_Class', 'Bidi_Mirrored', 'Digit', 'Decimal'],


    UnicodeMenuBidi_Class: ['L', 'LRE', 'LRO', 'R', 'AL', 'RLE', 'RLO', 'PDF', 'EN', 'ES', 'ET', 'AN', 'CS', 'NSM', 'BN', 'B', 'S', 'WS', 'ON'],
    // Also 11-36 are automated above
    UnicodeMenuCanonical_Combining_Class: [0,1,7,8,9,10,199,200,202,204,208,210,212,214,216,218,220,222,224,226,228,230,232,233,234,240],
    UnicodeMenuCCVNumericOnly: [84, 91, 103, 107, 118, 122, 129, 130, 132],
    UnicodeMenuGeneral_Category: ['Lu', 'Ll', 'Lt', 'Lm', 'Lo', 'Mn', 'Mc', 'Me', 'Nd', 'Nl', 'No', 'Pc', 'Pd', 'Ps', 'Pe', 'Pi', 'Pf', 'Po', 'Sm', 'Sc', 'Sk', 'So', 'Zs', 'Zl', 'Zp', 'Cc', 'Cf', 'Cs', 'Co', 'Cn'],
    UnicodeMenuBidi_Mirrored: ['Y', 'N'],
    UnicodeMenuDigit: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    UnicodeMenuDecimal: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
};

// EVENTS
window.addEventListener('load', function(e) {
    $('encoding_from').addEventListener('click', function (e) {
        Unicodecharref.convertEncoding($('toconvert').value, this);
    }, false);
    $('encoding_to').addEventListener('click', function (e) {
        Unicodecharref.convertEncoding($('toconvert').value, this);
    }, false);
    $('insertEntityFile').addEventListener('change', function (e) {
        Unicodecharref.insertEntityFile(e);
    }, false);
    Unicodecharref.initialize(e);
}, false);
/* The following works, but if used will not allow user to cancel to get out of the current window size and
 * will go back to the last window size; if use this, don't need code in "doOk" (besides return true)
window.addEventListener(
                        'resize',
                        function(e) {
                            Unicodecharref.prefs.
                                setIntPref(EXT_BASE+'window.outer.height',
                                    window.outerHeight);
                            Unicodecharref.prefs.
                                setIntPref(EXT_BASE+'window.outer.width',
                                    window.outerWidth);
                        },
                        false);
*/
    // EXPORTS
    this.Unicodecharref = Unicodecharref;
}());
