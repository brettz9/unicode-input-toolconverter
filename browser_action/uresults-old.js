/* eslint-env browser */
/* globals Components, FileUtils, buildChart, getAndSetCodePointInfo, Hangul, getJamo, charrefunicodeDb, charrefunicodeConverter, CharrefunicodeConsts */

// See http://www.unicode.org/Public/UNIDATA/ for data use

/*
// Todo: Handle these for `buildUnicode` `currentStartCharCode` (`setCurrstartset`); see also
//        `setPref('currentStartCharCode'...`
if (k < 0) {
    k = 1114112 + parseInt(k);
} else if (currentStartCharCode.toString().match(decreg) || currentStartCharCode.toString().match(decreg2)) { // Dec
    currentStartCharCode = currentStartCharCode.toString().replace(decreg, '$2');
    currentStartCharCode = parseInt(currentStartCharCode, 10);
} else if (currentStartCharCode.toString().match(hexreg)) { // Hex
    currentStartCharCode = currentStartCharCode.toString().replace(hexreg, '$3');
    currentStartCharCode = parseInt(currentStartCharCode, 16);
} else {
    // Convert toString in case trying to get the ASCII for a single digit number
    const kt = currentStartCharCode.toString().charCodeAt(0);
    if (kt >= 0xD800 && kt < 0xF900) { // surrogate component (higher plane)
        currentStartCharCode = ((kt - 0xD800) * 0x400) + (currentStartCharCode.toString().charCodeAt(1) - 0xDC00) + 0x10000;
    } else {
        currentStartCharCode = kt;
    }
}
resetCurrentStartCharCodeIfOutOfBounds();

//
//
// Ensure 0-9 get treated as char. ref. values rather than Unicode digits
if (prev >= 0 && prev <= 9) {
    prev = `'#${prev}'`;
}
*/
import {$, $$} from '/vendor/jamilih/dist/jml-es.js';
import insertIntoOrOverExisting from '/browser_action/insertIntoOrOverExisting.js';
import {getPref, setPref} from './Preferences.js';

let _;
export const setL10n = (l10n) => {
    _ = l10n;
};

(function () {
const Cc = Components.classes,
    Ci = Components.interfaces;
// const mainDoc = window.opener ? window.opener.document : false; // No opener if typing x-unicode protocol in Awesome Bar, and we don't want options dialog as opener
const wm = Cc['@mozilla.org/appshell/window-mediator;1'].getService(Ci.nsIWindowMediator);
const enumerator = wm.getXULWindowEnumerator('navigator:browser');
let mainDoc;
while (enumerator.hasMoreElements()) {
    mainDoc = enumerator.getNext().QueryInterface(Components.interfaces.nsIXULWindow).docShell.contentViewer.DOMDocument;
    if (mainDoc.documentElement.id === 'main-window') { // Ensure this is the main window, and not the options dialog
        break;
    }
}

const xulns = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul',
    htmlns = 'http://www.w3.org/1999/xhtml';

function createHTMLElement (el) {
    return document.createElementNS(htmlns, el);
}
function createXULElement (el) {
    return document.createElementNS(xulns, el);
}

const Unicodecharref = {
    downloadUnihan () {
        $('#DownloadButtonBox').hidden = true;
        $('#DownloadProgressBox').hidden = false;

        const that = this;
        const aFileURL = 'http://brett-zamir.me/unicode_input_tool/Unihan6.sqlite';

        const ios = Cc['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
        const url = ios.newURI(aFileURL, null, null);
        const file = Cc['@mozilla.org/file/directory_service;1'].getService(Ci.nsIProperties).get('ProfD', Ci.nsILocalFile);
        file.append('Unihan6.sqlite');
        if (file.exists()) {
            file.remove(false); // Shouldn't make it here unless it was a bad file
            // return; // Don't do this: give chance to overwrite
        }
        file.create(Ci.nsIFile.NORMAL_FILE_TYPE, '777'.toString(8)); // DIRECTORY_TYPE

        const {STATE_STOP} = Ci.nsIWebProgressListener;
        // const {STATE_IS_WINDOW} = Ci.nsIWebProgressListener;

        const persist = Cc['@mozilla.org/embedding/browser/nsWebBrowserPersist;1'].createInstance(Ci.nsIWebBrowserPersist);
        persist.progressListener = {
            onProgressChange (aWebProgress, aRequest, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) {
                const percentComplete = ((aCurTotalProgress / aMaxTotalProgress) * 100).toFixed(2);
                // <label id="progress_stat"/>
                // <progressmeter id="progress_element" mode="determined"/>
                const ele = $('#progress_element');
                ele.value = percentComplete;
                const stat = $('#progress_stat');

                stat.value = _('download_progress') + ' ' + percentComplete + _('percentSign');
            },
            onStateChange (aWebProgress, aRequest, aFlag, aStatus) {
                if (aFlag & STATE_STOP) { //  && aFlag & STATE_IS_WINDOW
                    try {
                        charrefunicodeDb.connect('Unihan6.sqlite', 'unihan');
                        /* const statement = */ charrefunicodeDb.dbConnUnihan.createStatement( // Just to test database
                            'SELECT code_pt FROM ' + 'Unihan' + ' WHERE code_pt = "3400"'
                        );
                        alert(_('Finished_download'));
                        that.unihanDb_exists = true;
                        $('#closeDownloadProgressBox').hidden = false;
                        $('#UnihanInstalled').hidden = false;
                    } catch (e) {
                        $('#closeDownloadProgressBox').hidden = true;
                        $('#UnihanInstalled').hidden = true;
                        $('#DownloadProgressBox').hidden = true;
                        $('#DownloadButtonBox').hidden = false;
                        alert(_('Problem_downloading'));
                        console.log(e);
                    }
                }
            }
        };
        persist.saveURI(url, null, null, null, '', file);
    },
    closeDownloadProgressBox () {
        $('#closeDownloadProgressBox').hidden = false;
        $('#DownloadProgressBox').hidden = true;
    },
    makeDropMenuRows (type) {
        /* const prefix = (type === 'Unihan') ? 'searchk' : 'search';
        try {
                for (const i=0; i < this[type].length; i++) {
                        const row = createXULElement('row');
                        const label = createXULElement('label');

                        label.setAttribute('value', _(prefix + this[type][i]));
                        label.setAttribute('control', prefix + this[type][i]);
                        const textbox = createXULElement('textbox');
                        textbox.setAttribute('id', prefix + this[type][i]);
                        textbox.setAttribute('rows', '1');
                        textbox.setAttribute('cols', '2');
                        textbox.addEventListener('change', function (e) {Unicodecharref['search' + type](e);});
                        textbox.addEventListener('input', function (e) {Unicodecharref['search' + type](e);});
                        row.append(label);
                        row.append(textbox);
                        $(type+'Search').append(row);
                }
        }
        catch(e) {
            alert(this[type][i])
        } */
    },
    makeRows (type) {
        const prefix = (type === 'Unihan') ? 'searchk' : 'search';
        let i;
        try {
            for (i = 0; i < this[type].length; i++) {
                const row = createXULElement('row');
                const label = createXULElement('label');
                label.setAttribute('value', _(prefix + this[type][i]));
                label.setAttribute('control', prefix + this[type][i]);
                row.append(label);
                if (type === 'Unicode') { // Fix: make block for Unihan if need that
                    const menuIdx = this.UnicodeMenus.indexOf(this[type][i]);
                    if (menuIdx !== -1) {
                        const match = this.UnicodeMenus[menuIdx];
                        let j, menupopup, menulist, menuitem;
                        switch (match) {
                        case 'Decimal':
                            // Fallthrough
                        case 'Digit':
                            // Fallthrough
                        case 'Canonical_Combining_Class':
                            // Fallthrough
                        case 'General_Category':
                            // Fallthrough
                        case 'Bidi_Mirrored': // 'Y'/'N'
                            // Fallthrough
                        case 'Bidi_Class':
                            menulist = createXULElement('menulist');
                            menulist.className = 'searchMenu';
                            menupopup = createXULElement('menupopup');
                            for (j = 0; j < this['UnicodeMenu' + match].length; j++) {
                                menuitem = createXULElement('menuitem');
                                menuitem.setAttribute('label', _(match + this['UnicodeMenu' + match][j]));
                                menuitem.setAttribute('tooltiptext', _(match + this['UnicodeMenu' + match][j]));
                                menuitem.setAttribute('value', this['UnicodeMenu' + match][j]);
                                menupopup.append(menuitem);
                            }
                            if (match === 'Canonical_Combining_Class') {
                                for (j = 11; j <= 36; j++) { // Other Non-Numeric not listed in UnicodeMenuCCVNumericOnly
                                    menuitem = createXULElement('menuitem');
                                    menuitem.setAttribute('label', j);
                                    menuitem.setAttribute('tooltiptext', j);
                                    menuitem.setAttribute('value', j);
                                    menupopup.append(menuitem);
                                }
                                for (j = 0; j < this['UnicodeMenu' + 'CCVNumericOnly'].length; j++) {
                                    menuitem = createXULElement('menuitem');
                                    menuitem.setAttribute('label', this['UnicodeMenu' + 'CCVNumericOnly'][j]);
                                    menuitem.setAttribute('tooltiptext', this['UnicodeMenu' + 'CCVNumericOnly'][j]);
                                    menuitem.setAttribute('value', this['UnicodeMenu' + 'CCVNumericOnly'][j]);
                                    menupopup.append(menuitem);
                                }
                            }
                            menulist.append(menupopup);
                            menulist.setAttribute('id', prefix + this[type][i]);
                            row.append(menulist);
                            $('#' + type + 'Search').append(row);
                            continue;
                        default:
                            break;
                        }
                    }
                }
                const textbox = createXULElement('textbox');
                textbox.setAttribute('id', prefix + this[type][i]);
                textbox.setAttribute('rows', '1');
                textbox.setAttribute('cols', '2');
                row.append(textbox);
                $('#' + type + 'Search').append(row);
            }
        } catch (e) {
            alert('1:' + type + i + e + this[type][i]);
        }
        // Add handlers for textboxes
        let tabpanel = type === 'Unicode' ? 'regularSearch' : 'cjkSearch';
        tabpanel = 'tabboxSearch';

        $(tabpanel).addEventListener('change', function (e) {
            Unicodecharref['search' + type](e.target);
        });
        $(tabpanel).addEventListener('input', function (e) {
            Unicodecharref['search' + type](e.target);
        });
        $(tabpanel).addEventListener('select', function (e) {
            if (e.target.nodeName !== 'menulist' && e.target.nodeName !== 'textbox') { return; }
            Unicodecharref['search' + type](e.target);
        }); // Triggered initially which sets preference to "Lu"
    },
    testIfComplexWindow () { // Fix: Should also create the detailedView and detailedCJKView's content dynamically (and thus fully conditionally rather than hiding)
        if (getPref('showComplexWindow')) {
            $('#specializedSearch').hidden = false;
            this.makeRows('Unihan');
            this.makeRows('Unicode');
            $('#detailedView').collapsed = false;
            $('#detailedCJKView').collapsed = false;
        } else {
            $('#specializedSearch').hidden = true;
            $('#detailedView').collapsed = true;
            $('#detailedCJKView').collapsed = true;
        }
    },
    setupBoolChecked () {
        const els = arguments;
        for (let i = 0; i < els.length; i++) {
            if (getPref(els[i])) {
                $(els[i]).checked = true;
            }
        }
    },
    initialize (e) {
        const that = this, args = window.arguments;
        // this.refreshToolbarDropdown(); // redundant?

        // charrefunicodeDb.connect('data/Unicode.sqlite');
        this.unihanDb_exists = false;
        try {
            // charrefunicodeDb.connect('Unihan.sqlite', 'unihan');
            /* const statement = */ charrefunicodeDb.dbConnUnihan.createStatement( // Just to test database is not corrupted
                'SELECT code_pt FROM ' + 'Unihan' + ' WHERE code_pt = "3400"'
            );
            this.unihanDb_exists = true;
            $('#DownloadButtonBox').hidden = true;
            $('#UnihanInstalled').hidden = false;
        } catch (e) {
            console.log(e);
            $('#DownloadButtonBox').hidden = false;
            $('#UnihanInstalled').hidden = true;
        }
        try {
            // charrefunicodeDb.connect('data/Jamo.sqlite', 'jamo');
        } catch (e) {
            alert(e);
        }

        // document.documentElement.maxWidth = window.screen.availWidth-(window.screen.availWidth*1/100);
        $('#unicodeTabBox').style.maxWidth = window.screen.availWidth - (window.screen.availWidth * 3 / 100);
        $('#unicodetabs').style.maxWidth = window.screen.availWidth - (window.screen.availWidth * 3 / 100);
        /**
        $('#unicodeTabBox').style.maxHeight = window.screen.availHeight-(window.screen.availHeight*5/100);
        $('#conversionhbox').style.maxHeight = window.screen.availHeight-(window.screen.availHeight*13/100);

        $('#noteDescriptionBox2').height = $('#noteDescriptionBox2').height = window.screen.availHeight-(window.screen.availHeight*25/100);
$('#unicodeTabBox').style.maxWidth = window.screen.availWidth-(window.screen.availWidth*1/100);
$('#unicodetabs').maxWidth = window.screen.availWidth-(window.screen.availWidth*2/100);
$('#unicodeTabBox').style.maxWidth = window.screen.availWidth-(window.screen.availWidth*2/100);
$('#chartcontent').maxWidth = window.screen.availWidth-(window.screen.availWidth*25/100);
$('#chart_selectchar_persist_vbox').maxWidth = window.screen.availWidth-(window.screen.availWidth*25/100);

        // */
        // $('#tableholder').maxWidth = window.screen.availWidth-(window.screen.availWidth*50/100);
        // $('#tableholder').width = window.screen.availWidth-(window.screen.availWidth*50/100);
        //      window.sizeToContent();

        this.testIfComplexWindow();

        // These defaults are necessary for the sake of the options URL (when called from addons menu)
        let toconvert = '';
        let targetid = '';
        // const targetid = 'context-launchunicode';

        // Check first for our custom protocol
        const arg0 = args && args[0] && args[0].wrappedJSObject;
        const customProtocol = arg0 && arg0.constructor.name === 'NsiSupportsWrapper';
        // Fix: the initial portion of this handling really should be inside the protocol handler, but that requires implementing the object to add arguments
        let unicodeQueryObj;
        if (customProtocol) { // Will be passed a query string if a protocol handler has been triggered
            const req = decodeURIComponent(arg0.toString().slice(1)); // We skip over the initial question mark too
            unicodeQueryObj = {};
            const queryTypeEndPos = req.indexOf(';');
            const queryType = req.slice(0, queryTypeEndPos); // Use
            const queries = req.slice(queryTypeEndPos + 1).split(';');
            for (let i = 0, key, val; i < queries.length; i++) {
                [key, val] = queries[i].split('=');
                unicodeQueryObj[key] = val; // Use
            }
            switch (queryType) {
            case 'find':
                toconvert = unicodeQueryObj.char;
                targetid = 'context-unicodechart';
                break;
            case 'searchName':
                targetid = 'searchName';
                break;
            case 'searchkDefinition':
                targetid = 'searchkDefinition';
                break;
                // Could also add 'define', 'convert', etc.
            default:
                throw new Error('Unrecognized query type passed to application for Custom Unicode protocol');
            }
        } else if (!args) { // Do nothing for options dialog
        } else if (!args[2]) {
            toconvert = args[0].toString(); // Need the conversion to string since content.window.getSelection() passed here gives an object, unlike the now deprecated content.document.getSelection() which returns a string. (Discovered deprecated status via Console extension: https://addons.mozilla.org/en-US/firefox/addon/1815 )
            targetid = args[1];
        } else {
            const wm = Cc['@mozilla.org/appshell/window-mediator;1'].getService(Ci.nsIWindowMediator);
            const browserWin = wm.getMostRecentWindow('navigator:browser');
            toconvert = browserWin.content.getSelection().toString();
            targetid = toconvert ? 'context-charrefunicode1' : ''; // Fix: replace with preference
        }

        if (!getPref('multiline')) {
            $('#multiline').checked = false;
            $('#displayUnicodeDesc').setAttribute('multiline', false);
            $('#displayUnicodeDesc').setAttribute('rows', 1);
        } else {
            $('#multiline').checked = true;
            $('#displayUnicodeDesc').setAttribute('multiline', true);
            $('#displayUnicodeDesc').setAttribute('rows', 3);
        }

        this.setupBoolChecked('asciiLt128', 'showImg', 'xhtmlentmode', 'hexLettersUpper', 'xmlentkeep', 'ampkeep',
            'ampspace', 'showComplexWindow', 'showAllDetailedView', 'showAllDetailedCJKView',
            'appendtohtmldtd', 'hexyes', 'onlyentsyes', 'entyes', 'decyes', 'unicodeyes', 'startCharInMiddleOfChart',
            'buttonyes', 'cssUnambiguous');

        switch (getPref('cssWhitespace')) {
        case ' ':
            $('#CSSWhitespace').selectedIndex = 0;
            break;
        case '\r\n':
            $('#CSSWhitespace').selectedIndex = 1;
            break;
        case '\r':
            $('#CSSWhitespace').selectedIndex = 2;
            break;
        case '\n':
            $('#CSSWhitespace').selectedIndex = 3;
            break;
        case '\t':
            $('#CSSWhitespace').selectedIndex = 4;
            break;
        case '\f':
            $('#CSSWhitespace').selectedIndex = 5;
            break;
        }

        /* if (getPref('hexstyleLwr')) {
            $(EXT_BASE + 'hexstyleLwr').selectedIndex = 0;
        }
        else {
            $(EXT_BASE + 'hexstyleLwr').selectedIndex = 1;
        } */
        /* if (getPref('xstyle') === 'x') {
            $(EXT_BASE + 'xstyle').checked = true;
        } */

        this.resizecells(); // Set the size per the prefs (don't increase or decrease the value)

        $('#rowsset').value = getPref('tblrowsset');
        $('#colsset').value = getPref('tblcolsset');

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

        $('lang').value = getPref('lang');
        $('font').value = getPref('font');

        const DTDtxtbxval = getPref('DTDtextbox');

        $('#DTDtextbox').value = DTDtxtbxval;
        this.registerDTD();

        //  toconvert = charreftoconvert.replace(/\n/g, ' ');
        $('#toconvert').value = toconvert;

        if (getPref('ampspace')) {
            toconvert = toconvert.replace(/&([^;\s]*\s)/g, '&amp;$1');
        }

        // Detect which context menu item was selected:
        let out; // converttypeid;

        switch (targetid) {
        case 'context-charrefunicode1':
            out = this.charref2unicodeval(toconvert, $('#b1'));
            break;
        case 'context-charrefunicode2':
            out = this.charref2htmlentsval(toconvert, $('#b2'));
            break;
        case 'context-charrefunicode3':
            out = this.unicode2charrefDecval(toconvert, $('#b3'));
            break;
        case 'context-charrefunicode4':
            out = this.unicode2charrefHexval(toconvert, $('#b4'));
            break;
        case 'context-charrefunicode5':
            out = this.unicode2htmlentsval(toconvert, $('#b5'));
            break;
        case 'context-charrefunicode6':
            out = this.unicode2jsescapeval(toconvert, $('#b6'));
            break;
        case 'context-charrefunicode7':
            out = this.unicodeTo6DigitVal(toconvert, $('#b7'));
            break;
        case 'context-charrefunicode8':
            out = this.unicode2cssescapeval(toconvert, $('#b8'));
            break;
        case 'context-charrefunicode9':
            out = this.htmlents2charrefDecval(toconvert, $('#b9'));
            break;
        case 'context-charrefunicode10':
            out = this.htmlents2charrefHexval(toconvert, $('#b10'));
            break;
        case 'context-charrefunicode11':
            out = this.htmlents2unicodeval(toconvert, $('#b11'));
            break;
        case 'context-charrefunicode12':
            out = this.hex2decval(toconvert, $('#b12'));
            break;
        case 'context-charrefunicode13':
            out = this.dec2hexval(toconvert, $('#b13'));
            break;
        case 'context-charrefunicode14':
            out = this.jsescape2unicodeval(toconvert, $('#b14'));
            break;
        case 'context-charrefunicode15':
            out = this.sixDigit2UnicodeVal(toconvert, $('#b15'));
            break;
        case 'context-charrefunicode16':
            out = this.cssescape2unicodeval(toconvert, $('#b16'));
            break;
        case 'context-charrefunicode17':
            out = this.unicode2CharDescVal(toconvert, $('#b17'));
            break;
        case 'context-charrefunicode18':
            out = this.charDesc2UnicodeVal(toconvert, $('#b18'));
            break;
        case 'context-unicodechart':
            this.disableEnts();
            $('#startset').value = toconvert;
            $('#unicodeTabBox').selectTab($('#charts'));
            if (toconvert !== '') {
                this.setCurrstartset(toconvert);
                buildChart();
            }
            // Fallthrough
        case 'context-launchunicode':
        case 'tools-charrefunicode':
            out = '';
            break;
        case 'searchName':
            $(targetid).value = unicodeQueryObj.string;
            $(targetid).focus();
            this.searchUnicode({id: targetid, value: unicodeQueryObj.string}); // Assume non-CJK
            break;
        case 'searchkDefinition':
            $(targetid).value = unicodeQueryObj.string;
            $(targetid).focus();
            this.searchUnihan({id: targetid, value: unicodeQueryObj.string});
            break;
        default:
            out = ''; // Plain launcher with no values sent
            // const prefstab = true;
            break;
        }

        if (customProtocol) {
        } else if (!args) { // options menu
            $('#unicodeTabBox').selectTab($('#prefs'));
        } else if (args[2] !== undefined) { // Keyboard invocation or button
            // $('#unicodetabs').selectedIndex = 0; // Fix: set by preference
            $('#unicodeTabBox').selectTab($(getPref('initialTab')));
        } else if (targetid !== 'context-unicodechart' && targetid !== 'tools-charrefunicode') {
            $('#unicodeTabBox').selectTab($('#conversion'));
        }

        $('#extensions.charrefunicode.initialTab').selectedItem = $('#mi_' + getPref('initialTab'));

        if (targetid !== 'searchName' && targetid !== 'searchkDefinition') {
            if (toconvert) { // Seemed to become necessarily suddenly
                this.setCurrstartset(toconvert);
            }
            buildChart();
        }
        this.tblfontsize(0); // Draw with the preferences value

        $('#menulists').addEventListener('command',
            function (e) {
                // const tmp = that.branch.getComplexValue('currentStartCharCode', Ci.nsIPrefLocalizedString).data;
                that.disableEnts();
                that.setCurrstartset(e.target.value);
                buildChart();
                // that.setCurrstartset(tmp); // Set it back as it was before the search
            },
            true);

        $('#converted').value = out;
        /*
        if (converttypeid != 0) {
            $(converttypeid).className='buttonactive';
        }
        */
        // Set window size to that set last time hit "ok"
        const outerh = getPref('outerHeight');
        const outerw = getPref('outerWidth');
        if (outerh > 0) {
            window.outerHeight = outerh;
        }
        if (outerw > 0) {
            window.outerWidth = outerw;
        }
    },
    copyToClipboard (id) {
        const text = $(id).value;
        const gClipboardHelper = Cc['@mozilla.org/widget/clipboardhelper;1'].getService(Ci.nsIClipboardHelper);
        gClipboardHelper.copyString(text);
    },
    copyarray (a, b) {
        b.length = 0;
        for (let i = 0; i < a.length; i++) {
            b[i] = a[i];
        }
    },
    setprefs (e) {
        switch (e.target.nodeName) {
        case 'textbox':
            setPref(
                e.target.id,
                e.target.value
            );
            break;
        case 'menuitem':
            setPref(e.target.parentNode.parentNode.id, e.target.value); // Could use @label or position as default value
            break;
        case 'checkbox':
            // Apparently hasn't changed yet, so use the opposite
            setPref(e.target.id, Boolean(!e.target.checked));
            break;
        case 'radio':
            let radioid;
            const result = e.target.id.match(/^_([0-9])+-(.*)$/);
            if (result !== null) {
                radioid = result[2]; // Extract preference name
                setPref(radioid, result[1] === '1');
            }
            break;
        default:
            break;
        }
    },
    resetdefaults () {
        const that = this;
        /* If make changes here, also change the default/preferences charrefunicode.js file */
        this.setBoolChecked(['asciiLt128', 'showImg', 'xhtmlentmode', 'hexLettersUpper', 'multiline'], false);
        this.setBoolChecked(['xmlentkeep', 'ampkeep', 'appendtohtmldtd', 'cssUnambiguous'], true);

        $('#ampspace').checked = false;
        $('#showComplexWindow').checked = false;
        $('#showAllDetailedView').checked = true;
        $('#showAllDetailedCJKView').checked = true;

        function langFont (langOrFont) { // Fix: needs to get default!
            const deflt = that.branchDefault.getComplexValue(langOrFont, Ci.nsIPrefLocalizedString).data;
            $('#' + langOrFont).value = deflt;
            setPref(langOrFont, deflt);
            return deflt;
        }
        $('#chart_table').lang = langFont('lang');
        $('#chart_table').style.fontFamily = langFont('font');

        // setPref('hexstyleLwr', true);
        // $(EXT_BASE + 'hexstyleLwr').selectedIndex = 0;

        setPref('fontsizetextbox', 13);
        this.fontsizetextbox(0);

        /*
        Easy enough to manually remove DTD -- wouldn't want to lose that data
        setPref('DTDtextbox', '');
        $('#DTDtextbox').value = '';
        */

        setPref('startset', 'a'.charCodeAt() - 1); // Don't really need to reset since user can't currently change this (only for blank string entry)

        this.setCurrstartset(getPref('startset'));

        $('#displayUnicodeDesc').setAttribute('multiline', false);
        $('#displayUnicodeDesc').setAttribute('rows', 1);

        // These get activated in buildChart(); below
        setPref('tblrowsset', 4);
        $('#rowsset').value = 4;
        setPref('tblcolsset', 3);
        $('#colsset').value = 3;

        this.setBoolChecked(['entyes', 'hexyes', 'decyes', 'unicodeyes', 'buttonyes'], true);
        this.setBoolChecked(['onlyentsyes', 'startCharInMiddleOfChart'], false);

        // setPref('xstyle', 'x');
        // $('#xstyle').checked = true;

        setPref('initialTab', 'charts');
        $('#extensions.charrefunicode.initialTab').selectedItem = $('#mi_charttab');

        setPref('tblfontsize', 13);
        this.resizecells();

        buildChart();
        setPref('outerHeight', 0);
        setPref('outerWidth', 0);
    },
    /**
     * Set a boolean preference (and its checked state in the interface) to a given boolean value
     * @param {String|String[]} els The element ID string or strings which should have their values set
     * @param {Boolean} value The value for the preference and checked state
     */
    setBoolChecked (els, value) {
        els = typeof els === 'string' ? [els] : els;
        for (let i = 0; i < els.length; i++) {
            setPref(els[i], value);
            $('#' + els[i]).checked = value;
        }
    },
    classChange (el) {
        const activeButton = $("*[class='buttonactive']");
        activeButton.className = 'reconvert';

        el.className = 'buttonactive';
    },

    // UI Bridges
    convertEncoding (out, el) {
        const from = $('#encoding_from').value,
            to = $('#encoding_to').value,
            toconvert = out;
        this.classChange(el);

        if (!from || !to) {
            return;
        }

        try {
            const cnv = Cc['@mozilla.org/intl/scriptableunicodeconverter'].createInstance(Ci.nsIScriptableUnicodeConverter);
            cnv.charset = from; // The charset to use
            const os = cnv.convertToInputStream(toconvert);

            const replacementChar = Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER; // Fix: could customize
            const is = Cc['@mozilla.org/intl/converter-input-stream;1'].createInstance(Ci.nsIConverterInputStream);
            is.init(os, to, 1024, replacementChar);
            const str = {};
            let output = '';
            while (is.readString(4096, str) !== 0) {
                output += str.value;
            }
            os.close();
            $('#converted').value = output;
        } catch (e) {
            alert(_('chars_could_not_be_converted'));
        }
        /*
        const cv = Cc['@mozilla.org/intl/scriptableunicodeconverter'].getService(Ci.nsIScriptableUnicodeConverter);
        cv.charset = to;
        const unicode_str = cv.ConvertToUnicode(toconvert);
        cv.charset = from;
        $('#converted').value = cv.ConvertFromUnicode(unicode_str);
        */
    },
    charref2unicodeval (out, el) {
        this.classChange(el);
        return charrefunicodeConverter.charref2unicodeval(out);
    },
    charref2htmlentsval (out, el) {
        this.classChange(el);
        return charrefunicodeConverter.charref2htmlentsval(out);
    },
    unicode2charrefDecval (unicodeToConvert, el, leaveSurrogates) {
        this.classChange(el);
        return charrefunicodeConverter.unicode2charrefDecval(unicodeToConvert, leaveSurrogates);
    },
    unicode2charrefHexval (unicodeToConvert, el, leaveSurrogates, type) {
        this.classChange(el);
        return charrefunicodeConverter.unicode2charrefHexval(unicodeToConvert, leaveSurrogates, type);
    },
    unicode2htmlentsval (unicodeToConvert, el) {
        this.classChange(el);
        return charrefunicodeConverter.unicode2htmlentsval(unicodeToConvert);
    },
    htmlents2charrefDecval (out, el) {
        this.classChange(el);
        return charrefunicodeConverter.htmlents2charrefDecval(out);
    },
    htmlents2charrefHexval (out, el) {
        this.classChange(el);
        return charrefunicodeConverter.htmlents2charrefHexval(out);
    },
    htmlents2unicodeval (out, el) {
        this.classChange(el);
        return charrefunicodeConverter.htmlents2unicodeval(out);
    },
    hex2decval (out, el) {
        this.classChange(el);
        return charrefunicodeConverter.hex2decval(out);
    },
    dec2hexval (out, el) {
        this.classChange(el);
        return charrefunicodeConverter.dec2hexval(out);
    },

    unicodeTo6Digit (e) {
        const toconvert = $('#toconvert').value;
        this.unicodeTo6DigitVal(toconvert, e.target);
        return false;
    },
    unicodeTo6DigitVal (toconvert, el) {
        this.classChange(el);
        const val = charrefunicodeConverter.unicodeTo6DigitVal(toconvert);
        $('#converted').value = val;
        return val;
    },
    charref2unicode (e) {
        let toconvert = $('#toconvert').value;
        if (getPref('ampspace')) {
            toconvert = toconvert.replace(/&([^;\s]*\s)/g, '&amp;$1');
        }
        $('#converted').value = this.charref2unicodeval(toconvert, e.target);
        return false;
    },
    charref2htmlents (e) {
        let toconvert = $('#toconvert').value;
        if (getPref('ampspace')) {
            toconvert = toconvert.replace(/&([^;\s]*\s)/g, '&amp;$1');
        }
        $('#converted').value = this.charref2htmlentsval(toconvert, e.target);
        return false;
    },
    unicode2charrefDec (e, leaveSurrogates) {
        let toconvert = $('#toconvert').value;
        if (getPref('ampspace')) {
            toconvert = toconvert.replace(/&([^;\s]*\s)/g, '&amp;$1');
        }
        $('#converted').value = this.unicode2charrefDecval(toconvert, e.target, leaveSurrogates);
        return false;
    },
    unicode2charrefDecSurrogate (e) {
        this.unicode2charrefDec(e, true);
    },
    unicode2charrefHex (e, leaveSurrogates) {
        let toconvert = $('#toconvert').value;
        if (getPref('ampspace')) {
            toconvert = toconvert.replace(/&([^;\s]*\s)/g, '&amp;$1');
        }
        $('#converted').value = this.unicode2charrefHexval(toconvert, e.target, leaveSurrogates);
        return false;
    },
    unicode2charrefHexSurrogate (e) {
        this.unicode2charrefHex(e, true);
    },
    unicode2htmlents (e) {
        let toconvert = $('#toconvert').value;
        if (getPref('ampspace')) {
            toconvert = toconvert.replace(/&([^;\s]*\s)/g, '&amp;$1');
        }
        $('#converted').value = this.unicode2htmlentsval(toconvert, e.target);
        return false;
    },
    /**
     * Replace Unicode characters with their escaped description form
     * @param {String} toconvert The text whose Unicode characters will be replaced
     * @param {XULElement} el The (button) element whose class will be changed to reflect that the action has been
     *                                                      activated
     * @returns {String} The passed-in string with Unicode replaced with description escape sequences
     */
    unicode2CharDescVal (toconvert, el) {
        this.classChange(el);
        const val = charrefunicodeConverter.unicode2CharDescVal(toconvert);
        $('#converted').value = val;
        return val;
    },
    /**
     * Converts character description escape sequences within a string to Unicode characters
     * @param {String} toconvert The text to convert
     * @param {XULElement} el The button element whose class should be dynamically changed (and others
     *                                                      deactivated)
     * @returns {String} The converted-to-Unicode value
     */
    charDesc2UnicodeVal (toconvert, el) {
        this.classChange(el);
        const val = charrefunicodeConverter.charDesc2UnicodeVal(toconvert);
        $('#converted').value = val;
        return val;
    },
    charDesc2Unicode (e) {
        const toconvert = $('#toconvert').value;
        this.charDesc2UnicodeVal(toconvert, e.target);
        return false;
    },
    unicode2CharDesc (e) {
        const toconvert = $('#toconvert').value;
        this.unicode2CharDescVal(toconvert, e.target);
        return false;
    },
    unicode2jsescapeval (toconvert, el) {
        this.classChange(el);
        const val = charrefunicodeConverter.unicode2jsescapeval(toconvert);
        $('#converted').value = val;
        return val;
    },
    unicode2jsescape (e) {
        const toconvert = $('#toconvert').value;
        this.unicode2jsescapeval(toconvert, e.target);
        return false;
    },
    cssescape2unicode (e) {
        const toconvert = $('#toconvert').value;
        $('#converted').value = this.cssescape2unicodeval(toconvert, e.target);
        return false;
    },
    sixDigit2UnicodeVal (toconvert, el) {
        this.classChange(el);
        const val = charrefunicodeConverter.sixDigit2UnicodeVal(toconvert);
        $('#converted').value = val;
        return val;
    },
    sixDigit2Unicode (e) {
        const toconvert = $('#toconvert').value;
        this.sixDigit2UnicodeVal(toconvert, e.target);
        return false;
    },
    jsescape2unicode (e) {
        const toconvert = $('#toconvert').value;
        $('#converted').value = this.jsescape2unicodeval(toconvert, e.target);
        return false;
    },
    cssescape2unicodeval (toconvert, el) {
        this.classChange(el);
        const unicode = charrefunicodeConverter.cssescape2unicodeval(toconvert);
        return unicode;
    },
    // Fix: make option to avoid converting \r, etc. for javascript
    jsescape2unicodeval (toconvert, el, mode) {
        this.classChange(el);
        const unicode = charrefunicodeConverter.jsescape2unicodeval(toconvert, mode);
        return unicode;
    },
    unicode2cssescapeval (toconvert, el) {
        this.classChange(el);
        const val = charrefunicodeConverter.unicode2cssescapeval(toconvert);
        $('#converted').value = val;
        return val;
    },
    unicode2cssescape (e) {
        const toconvert = $('#toconvert').value;
        this.unicode2cssescapeval(toconvert, e.target);
        return false;
    },
    // In this method and others like it, boolpref should be moved instead to
    //   converter function since it should be consistent across the app
    htmlents2charrefDec (e) {
        let toconvert = $('#toconvert').value;
        if (getPref('ampspace')) {
            toconvert = toconvert.replace(/&([^;\s]*\s)/g, '&amp;$1');
        }
        $('#converted').value = this.htmlents2charrefDecval(toconvert, e.target);
        return false;
    },
    htmlents2charrefHex (e) {
        let toconvert = $('#toconvert').value;
        if (getPref('ampspace')) {
            toconvert = toconvert.replace(/&([^;\s]*\s)/g, '&amp;$1');
        }
        $('#converted').value = this.htmlents2charrefHexval(toconvert, e.target);
        return false;
    },
    htmlents2unicode (e) {
        let toconvert = $('#toconvert').value;
        if (getPref('ampspace')) {
            toconvert = toconvert.replace(/&([^;\s]*\s)/g, '&amp;$1');
        }
        $('#converted').value = this.htmlents2unicodeval(toconvert, e.target);
        return false;
    },
    hex2dec (e) {
        let toconvert = $('#toconvert').value;
        if (getPref('ampspace')) {
            toconvert = toconvert.replace(/&([^;\s]*\s)/g, '&amp;$1');
        }
        $('#converted').value = this.hex2decval(toconvert, e.target);
        return false;
    },
    dec2hex (e) {
        let toconvert = $('#toconvert').value;
        if (getPref('ampspace')) {
            toconvert = toconvert.replace(/&([^;\s]*\s)/g, '&amp;$1');
        }
        $('#converted').value = this.dec2hexval(toconvert, e.target);
        return false;
    },
    // End UI bridges

    setImagePref (ev) {
        this.setprefs(ev);
        if ($('#unicodeImg').firstChild) {
            $('#unicodeImg').removeChild($('#unicodeImg').firstChild);
        }
        return false;
    },
    getUnicodeDesc (kent, khextemp) {
        const that = this;
        const hideMissing = !getPref('showAllDetailedView');
        const hideMissingUnihan = !getPref('showAllDetailedCJKView');

        const kdectemp = parseInt(khextemp, 16);

        // const alink = createHTMLElement('a');
        const alink = createXULElement('label');

        const [plane, privateuse, surrogate] = getAndSetCodePointInfo(kdectemp, alink, _);

        function placeItem (sel, item) {
            const firstchld = $(sel).firstChild;
            if (firstchld != null) {
                $(sel).replaceChild(item, firstchld);
            } else {
                $(sel).append(item);
            }
        }
        // Handle PDF link
        placeItem('#pdflink', alink);

        // Handle plane #
        const planeText = _('plane_num', {plane}) + '\u00a0';
        placeItem('#plane', planeText);

        if (getPref('showImg')) {
            const img = createXULElement('image');
            // img.width = '80';
            // img.height = '80';
            img.setAttribute('src', 'http://www.unicode.org/cgi-bin/refglyph?1-' + Number(kdectemp).toString(16));
            placeItem('#unicodeImg', img);
        }

        let hangul = false;
        let i; // file;
        // If Unihan
        if ((kdectemp > 0x3400 && kdectemp <= 0x4DB5) || (kdectemp > 0x4E00 && kdectemp <= 0x9FC3) || // 0x9FBB
            (kdectemp > 0xF900 && kdectemp < 0xFB00) ||
            // If not using the 27MB updated file, this range (CJK Ideograph Extension B) will not be valid:
            (kdectemp > 0x20000 && kdectemp <= 0x2A6D6) ||
            (kdectemp >= 0x2F800 && kdectemp < 0x2FA1F)
        ) {
            // pattern = new RegExp('^U\\+(' + khextemp + ')\\t(.*)\\t(.*)$', 'mg');
            // file = 'Unihan.txt';
            this.UnihanType = true;
            // $('#pdflink').append(alink);
        } else if (kdectemp > 0xAC00 && kdectemp <= 0xD7A3) {
            // pattern = new RegExp('^' + khextemp + '\\s*;\\s*(.*)$', 'm');
            // file = 'HangulSyllableType.txt';
            hangul = true;
            if (this.UnihanType) {
                for (i = 0; i < this.Unihan.length; i++) {
                    $('#searchk' + this.Unihan[i]).value = '';
                }
            }
            this.UnihanType = false;
            /* The following are some ranges in UnicodeData.txt which do not have their own description sheets as do the two above */
            /*
            if (0xE000 <= kdectemp && kdectemp <= 0xF8FF) {// Private Use
            }
            else if (0xF0000 <= kdectemp && kdectemp <= 0xFFFFD) {// Plane 15 Private Use
            }
            else if (0x100000 <= kdectemp && kdectemp <= 0x10FFFD) {// Plane 16 Private Use
            }
            */
        } else {
            // pattern = new RegExp('^' + khextemp + ';([^;]*);', 'm');
            // file = 'UnicodeData.txt';
            if (this.UnihanType) {
                for (i = 1; i <= 13; i++) {
                    $('#_detailedCJKView' + i).value = '';
                }
                for (i = 15; i <= 90; i++) {
                    $('#_detailedCJKView' + i).value = '';
                }
            }
            this.UnihanType = false;
        }

        let temp, notfoundval, table, result, statement;

        if (!this.UnihanType && !hangul && $('#viewTabs').selectedTab === $('#detailedCJKView')) {
            $('#viewTabs').selectTab($('#detailedView'));
        }
        table = 'Unicode';
        let search = false;
        let cjkText;

        if (kdectemp >= 0x3400 && kdectemp <= 0x4DB5) {
            search = '3400';
            if (kdectemp !== 0x3400 && kdectemp !== 0x4DB5) {
                cjkText = _('CJK_Ideograph_Extension_A');
            } else if (kdectemp === 0x4DB5) {
                search = '4DB5';
            }
        } else if (kdectemp >= 0x4E00 && kdectemp <= 0x9FC3) {
            search = '4E00';
            if (kdectemp !== 0x4E00 && kdectemp !== 0x9FC3) {
                cjkText = _('CJK_Ideograph');
            } else if (kdectemp === 0x9FC3) {
                search = '9FC3';
            }
        } else if (kdectemp >= 0xF900 && kdectemp < 0xFB00) { // Should have individual code point
            search = true;
        } else if (kdectemp >= 0x20000 && kdectemp <= 0x2A6D6) {
            search = '20000';
            if (kdectemp !== 0x20000 && kdectemp !== 0x2A6D6) {
                cjkText = _('CJK_Ideograph_Extension_B');
            } else if (kdectemp === 0x2A6D6) {
                search = '2A6D6';
            }
        } else if (kdectemp >= 0x2F800 && kdectemp < 0x2FA1F) { // Should have individual code point
            search = true;
        } else if (hangul) {
            // search = 'AC00';
            // if (kdectemp != 0xAC00 && kdectemp != 0xD7A3) {
            cjkText = _('Hangul_Syllable');
            cjkText += ' ';

            cjkText += Hangul.getHangulName(kdectemp);
            /* }
            else if (kdectemp == 0xD7A3) {
                search = 'D7A3';
            } */
        }
        if (search) {
            if (search === true) {
                search = khextemp;
            }
            statement = charrefunicodeDb.dbConn.createStatement(
                'SELECT * FROM ' + table + ' WHERE Code_Point = "' + search + '"'
            );
        } else {
            statement = charrefunicodeDb.dbConn.createStatement(
                'SELECT * FROM ' + table + ' WHERE Code_Point = "' + khextemp + '"'
            );
        }
        try {
            // $('#displayUnicodeDesc').value = _('retrieving_description');
            while (statement.executeStep()) {
                if (!cjkText) {
                    result = statement.getUTF8String(1);
                    if (kdectemp >= 0x1100 && kdectemp < 0x1200) {
                        try {
                            const jamo = getJamo(charrefunicodeDb, kdectemp);
                            result += ' (' + jamo + ')';
                        } catch (e) {
                        }
                    }
                } else {
                    result = cjkText;
                }
                for (i = 2; i <= 14; i++) {
                    temp = statement.getUTF8String(i); // Fix: display data more readably, etc.
                    if (i === 10) {
                        if (temp) {
                            result += ';\u00a0\u00a0\u00a0\u00a0\n' + _('searchUnicode_1_Name') +
                            _('colon') + ' ' + temp;
                        }
                        continue;
                    }
                    if (temp) {
                        if (hideMissing) {
                            $('#_detailedView' + i).parentNode.hidden = false;
                        }
                        switch (i) {
                        case 2:
                            temp = _('General_Category' + temp);
                            break;
                        case 3:
                            if (temp < 11 || temp > 132) {
                                temp = _('Canonical_Combining_Class' + temp); // 199, 200, 204, 208, 210, 212 do not have members yet and others from 11 to 132 do not have name listed
                            }
                            break;
                        case 4:
                            temp = _('Bidi_Class' + temp);
                            break;
                        case 9:
                            temp = (temp === 'Y') ? _('Bidi_MirroredY') : _('Bidi_MirroredN'); // Only two choices
                            break;
                        case 12:
                        case 13:
                        case 14:
                            const a = createHTMLElement('a');
                            a.href = 'javascript:void(0)';

                            a.addEventListener('click', function (e) {
                                that.startset({value: e.target.innerHTML.charCodeAt()});
                                that.noGetDescripts = false; // Probably want to start checking again since move to new page
                            });
                            const tempno = parseInt(temp, 16);
                            a.innerHTML = String.fromCodePoint(tempno);
                            a.className = 'text-link';
                            const view = $('#_detailedView' + i);
                            this.removeViewChildren(i);

                            const box = createXULElement('description'); // necessary to avoid CSS wrapping warning
                            box.append(a);
                            box.append(' (' + temp + ')');
                            view.append(box);

                            // alert(new XMLSerializer().serializeToString(view));
                            break;
                        default:
                            break;
                        }
                        if (i <= 11) {
                            $('#_detailedView' + i).value = temp;
                        }
                    } else if (i <= 11) {
                        $('#_detailedView' + i).parentNode.hidden = hideMissing;
                        $('#_detailedView' + i).value = '';
                    } else {
                        $('#_detailedView' + i).parentNode.hidden = hideMissing;
                        this.removeViewChildren(i);
                    }
                }
                break;
            }
            if (!this.UnihanType && result != null) {
                $('#displayUnicodeDesc').value = kent + 'U+' + khextemp + _('colon') + ' ' + result;
                $('#displayUnicodeDesc2').value = kent + 'U+' + khextemp + _('colon') + ' ' + result;
            // Fix: remove this duplicate also in catch, etc.
            } else if (surrogate) {
                $('#displayUnicodeDesc').value = kent + 'U+' + khextemp + _('colon') + ' ' + surrogate;
                $('#displayUnicodeDesc2').value = kent + 'U+' + khextemp + _('colon') + ' ' + surrogate;
            } else if (privateuse) {
                $('#displayUnicodeDesc').value = kent + 'U+' + khextemp + _('colon') + ' ' + _('Private_use_character');
                $('#displayUnicodeDesc2').value = kent + 'U+' + khextemp + _('colon') + ' ' + _('Private_use_character');
            } else if ( // Catch noncharacters
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
                $('#displayUnicodeDesc').value = kent + 'U+' + khextemp + _('colon') + ' ' + _('Noncharacter');
                $('#displayUnicodeDesc2').value = kent + 'U+' + khextemp + _('colon') + ' ' + _('Noncharacter');
            } else if (!this.UnihanType) {
                notfoundval = 'U+' + khextemp + _('colon') + ' ' + _('Not_found');
                $('#displayUnicodeDesc').value = notfoundval;
                $('#displayUnicodeDesc2').value = notfoundval;
                for (let i = 2; i <= 14; i++) {
                    if (i === 10) { continue; }
                    try {
                        $('#_detailedView' + i).value = '';
                        $('#_detailedView' + i).parentNode.hidden = hideMissing;
                        this.removeViewChildren(i);
                    } catch (e) {
                        alert('2' + e + i);
                    }
                }
            }
        } catch (e) {
            if (surrogate) {
                $('#displayUnicodeDesc').value = kent + 'U+' + khextemp + _('colon') + ' ' + surrogate;
                $('#displayUnicodeDesc2').value = kent + 'U+' + khextemp + _('colon') + ' ' + surrogate;
            } else if (privateuse) {
                $('#displayUnicodeDesc').value = kent + 'U+' + khextemp + _('colon') + ' ' + _('Private_use_character');
                $('#displayUnicodeDesc2').value = kent + 'U+' + khextemp + _('colon') + ' ' + _('Private_use_character');
            } else if ( // Catch noncharacters
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
                $('#displayUnicodeDesc').value = kent + 'U+' + khextemp + _('colon') + ' ' + _('Noncharacter');
                $('#displayUnicodeDesc2').value = kent + 'U+' + khextemp + _('colon') + ' ' + _('Noncharacter');
            } else {
                notfoundval = 'U+' + khextemp + _('colon') + ' ' + _('Not_found');
                $('#displayUnicodeDesc').value = notfoundval;
                $('#displayUnicodeDesc2').value = notfoundval;
                for (let i = 2; i <= 14; i++) {
                    if (i === 10) { continue; }
                    try {
                        $('#_detailedView' + i).value = '';
                        $('#_detailedView' + i).parentNode.hidden = hideMissing;
                        this.removeViewChildren(i);
                    } catch (e) {
                        alert('3' + e + i);
                    }
                }
            }
        } finally {
            statement.reset();
        }
        // const canreturn = true;

        if (this.unihanDb_exists) {
            table = 'Unihan';

            if ((this.UnihanType) && $('#viewTabs').selectedTab === $('#detailedView')) {
                $('#viewTabs').selectTab($('#detailedCJKView'));
            }
            statement = charrefunicodeDb.dbConnUnihan.createStatement(
                'SELECT * FROM ' + table + ' WHERE code_pt = "' + khextemp + '"'
            );
            try {
                // $('#displayUnicodeDesc').value= _('retrieving_description');
                while (statement.executeStep()) {
                    result = statement.getUTF8String(14); // Fix: display data more readably, with heading, etc. (and conditional)
                    if (result === null && !cjkText) {
                        result = _('No_definition');
                    }
                    // Fix: Display meta-data in table (get to be stable by right-clicking)
                    // $('#_detailedCJKView' + 3).value = result ? result : '';
                    for (i = 1; i <= 13; i++) {
                        temp = statement.getUTF8String(i); // Fix: display data more readably, etc.
                        if (temp) {
                            if (hideMissingUnihan) {
                                $('#_detailedCJKView' + i).parentNode.hidden = false;
                            }
                            // result += '; ' + temp;
                            switch (i) {
                            case 1:
                                // Optional code to transform output into something more readable
                                break;
                            case 2:
                                break;
                            default:
                                break;
                            }
                            $('#_detailedCJKView' + i).value = temp;
                        } else {
                            $('#_detailedCJKView' + i).parentNode.hidden = hideMissingUnihan;
                            $('#_detailedCJKView' + i).value = '';
                        }
                    }
                    for (i = 15; i <= 90; i++) {
                        try {
                            temp = statement.getUTF8String(i); // Fix: display data more readably, etc.
                        } catch (e) {
                            alert(i);
                        }
                        if (temp) {
                            if (hideMissingUnihan) {
                                $('#_detailedCJKView' + i).parentNode.hidden = false;
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
                            $('#_detailedCJKView' + i).value = temp;
                        } else {
                            $('#_detailedCJKView' + i).parentNode.hidden = hideMissingUnihan;
                            $('#_detailedCJKView' + i).value = '';
                        }
                    }
                    break;
                }

                if (result !== '' && result !== null && result !== undefined) {
                    // Commenting out to show general category under definition
                    // $('#displayUnicodeDesc2').value = kent + 'U+' + khextemp + _('colon')+' ' + result;
                    $('#displayUnicodeDescUnihan').value = kent + 'U+' + khextemp + _('colon') + ' ' + result;
                    $('#displayUnicodeDesc').value = kent + 'U+' + khextemp + _('colon') + ' ' + result;
                    $('#displayUnicodeDesc2').value = kent + 'U+' + khextemp + _('colon') + ' ' + result;
                } else {
                    notfoundval = 'U+' + khextemp + _('colon') + ' ' + _('Not_found');

                    if (!cjkText || hangul) {
                        for (let i = 2; i <= 14; i++) {
                            if (i === 10) { continue; }
                            try {
                                $('#_detailedView' + i).value = '';
                                $('#_detailedView' + i).parentNode.hidden = hideMissing;
                                this.removeViewChildren(i);
                            } catch (e) {
                                alert('1' + e + i);
                            }
                        }
                        for (i = 1; i <= 13; i++) {
                            $('#_detailedCJKView' + i).parentNode.hidden = hideMissingUnihan;
                            $('#_detailedCJKView' + i).value = '';
                        }
                        for (i = 15; i <= 90; i++) {
                            $('#_detailedCJKView' + i).parentNode.hidden = hideMissingUnihan;
                            $('#_detailedCJKView' + i).value = '';
                        }
                    }

                    if (!cjkText) {
                        $('#displayUnicodeDesc').value = notfoundval;
                        $('#displayUnicodeDescUnihan').value = notfoundval;
                        $('#displayUnicodeDesc2').value = notfoundval;
                    } else {
                        const finalval = kent + 'U+' + khextemp + _('colon') + ' ' + cjkText + ' ' +
                            (hangul ? '' : _('left_parenth') + _('No_definition') + _('right_parenth'));
                        $('#displayUnicodeDesc').value = finalval;
                        $('#displayUnicodeDesc2').value = finalval;
                        $('#displayUnicodeDescUnihan').value = finalval;
                        // $('#displayUnicodeDesc2').value = notfoundval;
                    }
                }
            } catch (e) {
                alert(e);
            } finally {
                statement.reset();
            }
            // return;
        } // Excised Ajax code...
    },
    removeViewChildren (i) {
        const view = $('#_detailedView' + i);
        while (view.firstChild) {
            view.firstChild.remove();
        }
    },
    fontsizetextbox (size) { // Changes font-size
        const txtbxsize = getPref('fontsizetextbox') + size;
        setPref('fontsizetextbox', txtbxsize);

        $('#toconvert').style.fontSize = txtbxsize + 'px';
        $('#converted').style.fontSize = txtbxsize + 'px';
        if (size > 0) {
            // On Mac at least, resizing for reducing font size, causes button to
            // go off screen
            window.sizeToContent();
        }
    },
    tblfontsize (size) { // Changes font-size of chart table cells
        const fsize = getPref('tblfontsize') + size;
        // const tds = createHTMLElement('td');
        setPref('tblfontsize', fsize);
        this.resizecells({sizeToContent: size > 0});
    },
    resizecells ({sizeToContent} = {}) {
        $$(
            "*[name='dec'],*[name='hex'],*[name='unicode']"
        ).forEach((control) => {
            control.style.fontSize =
                getPref('tblfontsize') + 'px';
        });
        $('#insertText').style.fontSize =
            getPref('tblfontsize') + 'px';
        // $('#displayUnicodeDesc').style.fontSize =
        //     getPref('tblfontsize') + 'px';
        if (sizeToContent) {
            // On Mac at least, resizing for reducing font size, causes button to
            // go off screen
            window.sizeToContent();
        }
    },
    flip (e) {
        this.setCurrstartset(this.j);
        this.setprefs(e);
        buildChart();
    },
    onlyentsyesflip (e) {
        this.flip(e);
    },
    hexflip (e) {
        this.flip(e);
    },
    decflip (e) {
        this.flip(e);
    },
    unicodeflip (e) {
        this.flip(e);
    },
    middleflip (e) {
        this.flip(e);
    },
    buttonflip (e) {
        this.flip(e);
    },
    entflip (e) {
        this.flip(e);
    },
    cssWhitespace (e) {
        let {value} = e.target;
        // Escape these since some like \r may be lost?
        switch (value) {
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
        setPref('cssWhitespace', value);
    },
    /* xstyleflip () {
        this.setCurrstartset(this.j);
        const currxstyle = 'x';
        const prevxstyle = getPref('xstyle');
        if (prevxstyle === 'x') {
            currxstyle = 'X';
        }
        setPref('xstyle', currxstyle);
        buildChart();
    }, */
    rowsset (e) {
        this.setCurrstartset(this.j);
        if (e.target.value != null && e.target.value !== '') {
            setPref('tblrowsset', e.target.value);
        }
        buildChart();
    },
    colsset (e) {
        this.setCurrstartset(this.j);
        if (e.target.value != null && e.target.value !== '') {
            setPref('tblcolsset', e.target.value);
        }
        buildChart();
    },
    startset (tbx, descripts) {
        this.disableEnts();
        let data;
        if (tbx.value != null && tbx.value !== '') {
            data = tbx.value;
        } else {
            // Only used when the field is manually changed to blank (default start set)
            data = getPref('startset');
        }
        this.setCurrstartset(data);

        buildChart(descripts);
    },
    searchUnihan (obj) {
        this.searchUnicode(obj, 'Unihan');
    },
    disableEnts () {
        this.setBoolChecked('onlyentsyes', false);
    },
    searchUnicode (obj, table, nochart, strict) { // Fix: allow Jamo!
        charrefunicodeConverter.searchUnicode(obj, table, nochart, strict);
        if (!nochart) {
            const tmp = getPref('currentStartCharCode');
            this.startset(obj, true); // Could remember last description (?)
            this.setCurrstartset(tmp); // Set it back as it was before the search
        }
        /* if (name_desc === 'Name' || name_desc === 'kDefinition') { // Doesn't work since name_desc_val is
        // search value, not first result value (we could remember the last search and whether it were a search,
        // however); we need to be careful, however, since some searches run automatically on start-up
            this.setCurrstartset(name_desc_val);
        } */
    },
    doOK () {
        setPref('outerHeight', window.outerHeight);
        setPref('outerWidth', window.outerWidth);
        return false;
    },
    doCancel () {
        setPref('outerHeight', window.outerHeight);
        setPref('outerWidth', window.outerWidth);
        return true;
    },
    moveoutput (movedid) {
        const insertText = $(movedid);
        $('#unicodetabs').selectedIndex = 1;
        $('#toconvert').value = insertText.value;
    },
    append2htmlflip (e) {
        this.setprefs(e);
        this.registerDTD(); // (in case DTD not also changed, still need to reset)
    },
    registerDTD () {
        // Cannot use back-reference inside char. class, so need to do twice
        const pattern = /<!ENTITY\s+([^'"\s]*)\s+(["'])(.*)\2\s*>/g;

        const text = $('#DTDtextbox').value;
        setPref('DTDtextbox', text);

        let result;

        // Reset in case charrefs or ents array deleted before and now want to go back to their original values.
        if (getPref('appendtohtmldtd')) {
            this.copyarray(this.origents, CharrefunicodeConsts.ents);
            this.copyarray(this.origcharrefs, CharrefunicodeConsts.charrefs);
        } else {
            CharrefunicodeConsts.ents = [];
            CharrefunicodeConsts.charrefs = [];
        }

        this.copyarray(this.orignewents, charrefunicodeConverter.newents); // Start off blank in case items erased
        this.copyarray(this.orignewcharrefs, charrefunicodeConverter.newcharrefs); // Start off blank in case items erased

        const decreg = /^(&#|#)?([0-9][0-9]+);?$/;
        // const decreg2 = /^(&#|#)([0-9]);?$/;
        const hexreg = /^(&#|#|0|U|u)?([xX+])([0-9a-fA-F]+);?$/;

        while ((result = pattern.exec(text)) !== null) {
            let m = result[3];
            let addreg = true;
            if (m.match(decreg)) { // Dec
                m = m.replace(decreg, '$2');
                m = parseInt(m);
            } else if (m.match(hexreg)) { // Hex
                m = m.replace(hexreg, '$2');
                m = parseInt(m, 16);
            } else if (m.length > 1) { // If replacing with Unicode sequence longer than one character, assume only wish to convert from entity (not from Unicode)
                addreg = false;
            } else {
                m = m.charCodeAt();
            }
            if (addreg) {
                charrefunicodeConverter.shiftcount += 1; // Used to ensure apos or amp is detected in same position
                CharrefunicodeConsts.ents.unshift(result[1]);
                CharrefunicodeConsts.charrefs.unshift(m);
            } else { // For translating entities into two-char+ Unicode, or hex or dec
                charrefunicodeConverter.newents.push(result[1]);
                charrefunicodeConverter.newcharrefs.push(m); // Can be a string, etc.
            }
        }
    },
    /**
     * Sets the preference for whether to display the chosen character in the middle of the chart (or beginning)
     * @param {Boolean} bool Whether to set to true or not
     */
    startCharInMiddleOfChart (bool) {
        // Commented this out because while it will always change (unlike now), the value will be misleading
        // $(EXT_BASE + 'startCharInMiddleOfChart').checked = bool;
        setPref('startCharInMiddleOfChart', bool);
    },
    /**
     * Sets a value in preferences at which the Unicode chart view will begin on next start-up
     * @value The value to which to set the current starting value
     */
    setCurrstartset (value) {
        setPref('currentStartCharCode', value);
    },
    // Some of these defaults may become irrelevant due to the /default/preferences/charrefunicode.js file's settings
    k (setval) {
        this.setCurrstartset(setval);
    },
    insertent () {
        insertIntoOrOverExisting({
            textReceptable: $('#DTDtextbox'),
            value: '<!ENTITY  "">\n'
        });
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
    multiline (e) {
        const display = $('#displayUnicodeDesc');
        if (getPref('multiline') === false) {
            setPref('multiline', true);
            display.setAttribute('multiline', true);
            display.setAttribute('rows', 3);
        } else {
            setPref('multiline', false);
            display.setAttribute('multiline', false);
            display.setAttribute('rows', 1);
        }
    },
    addToToolbar () {
        const dropdownArr = getPref('dropdownArr');
        dropdownArr.push($('#insertText').value);
        setPref('dropdownArr', dropdownArr);
        if (this.refreshToolbarDropdown()) {
            alert(_('yourItemAdded'));
        } else {
            alert(_('problemAddingToolbarItem'));
        }
    },
    refreshToolbarDropdown () {
        // SETUP
        const dropdownArr = getPref('dropdownArr');
        const toolbarbuttonPopup = mainDoc.querySelector('#charrefunicode-toolbar-chars');
        if (!toolbarbuttonPopup) {
            return false;
        }

        // EMPTY OLD CONTENTS
        while (toolbarbuttonPopup.firstChild) {
            toolbarbuttonPopup.removeChild(toolbarbuttonPopup.firstChild);
        }

        // ADD NEW CONTENTS
        for (const item of dropdownArr) {
            const menuitem = mainDoc.createElementNS(xulns, 'menuitem');
            menuitem.setAttribute('label', item);
            menuitem.setAttribute('value', item);
            toolbarbuttonPopup.append(menuitem);
        }
        return true;
    },
    insertEntityFile (e) {
        const MY_ID = 'charrefunicode@brett.zamir',
            entFile = FileUtils.getFile(MY_ID, 'data/entities/' + e.target.value + '.ent'),
            fstream = Cc['@mozilla.org/network/file-input-stream;1'].createInstance(Ci.nsIFileInputStream),
            cstream = Cc['@mozilla.org/intl/converter-input-stream;1'].createInstance(Ci.nsIConverterInputStream),
            str = {};
        let read = 0;
        let data = '';
        fstream.init(entFile, -1, 0, 0);
        cstream.init(fstream, 'UTF-8', 0, 0); // you can use another encoding here if you wish
        do {
            read = cstream.readString(0xffffffff, str); // read as much as we can and put it in str.value
            data += str.value;
        } while (read !== 0);
        cstream.close(); // this closes fstream

        $('#DTDtextbox').value += '\n' + data;
        this.registerDTD();
    },
    idgen: 0,
    prefs: null,

    /* Pseudo-constants */
    Unihan: ['AccountingNumeric', 'BigFive', 'CCCII', 'CNS1986', 'CNS1992', 'Cangjie', 'Cantonese', 'CheungBauer', 'CheungBauerIndex', 'CihaiT', 'CompatibilityVariant', 'Cowles', 'DaeJaweon', 'EACC', 'Fenn', 'FennIndex', 'FourCornerCode', 'Frequency', 'GB0', 'GB1', 'GB3', 'GB5', 'GB7', 'GB8', 'GSR', 'GradeLevel', 'HDZRadBreak', 'HKGlyph', 'HKSCS', 'HanYu', 'Hangul', 'HanyuPinlu', 'HanyuPinyin', 'IBMJapan', 'IICore', 'IRGDaeJaweon', 'IRGDaiKanwaZiten', 'IRGHanyuDaZidian', 'IRGKangXi', 'IRG_GSource', 'IRG_HSource', 'IRG_JSource', 'IRG_KPSource', 'IRG_KSource', 'IRG_MSource', 'IRG_TSource', 'IRG_USource', 'IRG_VSource', 'JIS0213', 'JapaneseKun', 'JapaneseOn', 'Jis0', 'Jis1', 'KPS0', 'KPS1', 'KSC0', 'KSC1', 'KangXi', 'Karlgren', 'Korean', 'Lau', 'MainlandTelegraph', 'Mandarin', 'Matthews', 'MeyerWempe', 'Morohashi', 'Nelson', 'OtherNumeric', 'Phonetic', 'PrimaryNumeric', 'PseudoGB1', 'RSAdobe_Japan1_6', 'RSJapanese', 'RSKanWa', 'RSKangXi', 'RSKorean', 'RSUnicode', 'SBGY', 'SemanticVariant', 'SimplifiedVariant', 'SpecializedSemanticVariant', 'TaiwanTelegraph', 'Tang', 'TotalStrokes', 'TraditionalVariant', 'Vietnamese', 'XHC1983', 'Xerox', 'ZVariant'],
    UnihanMenus: [], // Unused
    Unicode: ['General_Category', 'Canonical_Combining_Class', 'Bidi_Class', 'Decomposition_Type_and_Mapping', 'Decimal', 'Digit', 'Numeric', 'Bidi_Mirrored', 'Unicode_1_Name', 'ISO_Comment', 'Simple_Uppercase_Mapping', 'Simple_Lowercase_Mapping', 'Simple_Titlecase_Mapping'],
    UnicodeMenus: ['General_Category', 'Canonical_Combining_Class', 'Bidi_Class', 'Bidi_Mirrored', 'Digit', 'Decimal'],

    UnicodeMenuBidi_Class: ['L', 'LRE', 'LRO', 'R', 'AL', 'RLE', 'RLO', 'PDF', 'EN', 'ES', 'ET', 'AN', 'CS', 'NSM', 'BN', 'B', 'S', 'WS', 'ON'],
    // Also 11-36 are automated above
    UnicodeMenuCanonical_Combining_Class: [0, 1, 7, 8, 9, 10, 199, 200, 202, 204, 208, 210, 212, 214, 216, 218, 220, 222, 224, 226, 228, 230, 232, 233, 234, 240],
    UnicodeMenuCCVNumericOnly: [84, 91, 103, 107, 118, 122, 129, 130, 132],
    UnicodeMenuGeneral_Category: ['Lu', 'Ll', 'Lt', 'Lm', 'Lo', 'Mn', 'Mc', 'Me', 'Nd', 'Nl', 'No', 'Pc', 'Pd', 'Ps', 'Pe', 'Pi', 'Pf', 'Po', 'Sm', 'Sc', 'Sk', 'So', 'Zs', 'Zl', 'Zp', 'Cc', 'Cf', 'Cs', 'Co', 'Cn'],
    UnicodeMenuBidi_Mirrored: ['Y', 'N'],
    UnicodeMenuDigit: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    UnicodeMenuDecimal: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
};

// EVENTS
window.addEventListener('load', function (e) {
    $('#encoding_from').addEventListener('click', function (e) {
        Unicodecharref.convertEncoding($('#toconvert').value, this);
    });
    $('#encoding_to').addEventListener('click', function (e) {
        Unicodecharref.convertEncoding($('#toconvert').value, this);
    });
    $('#insertEntityFile').addEventListener('change', function (e) {
        Unicodecharref.insertEntityFile(e);
    });
    Unicodecharref.initialize(e);
});
/* The following works, but if used will not allow user to cancel to get out of the current window size and
 * will go back to the last window size; if use this, don't need code in "doOk" (besides return true)
window.addEventListener(
                        'resize',
                        function(e) {
                            Unicodecharref.prefs.
                                setIntPref(EXT_BASE + 'outerHeight',
                                    window.outerHeight);
                            Unicodecharref.prefs.
                                setIntPref(EXT_BASE + 'outerWidth',
                                    window.outerWidth);
                        },
                        false);
*/
// EXPORTS
this.Unicodecharref = Unicodecharref;
}());
