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


(function () {

function _getTextboxSelection (textbox, allIfNone) {
    if (allIfNone && textbox.selectionStart === textbox.selectionEnd) {
        textbox.selectionStart = 0;
        textbox.selectionEnd = textbox.value.length;
        return textbox.value.substring(0, textbox.value.length);
    }
    return textbox.value.substring(textbox.selectionStart, textbox.selectionEnd);
}

function _isTextbox (textbox) {
    if (!textbox || !textbox.nodeName) {
        return false;
    }
    var nodeName = textbox.nodeName.toLowerCase(); // Ensure works for HTML or X/HT/ML
    return nodeName === 'textbox' ||
            nodeName === 'input' ||
            nodeName === 'html:input' ||
            nodeName === 'textarea' ||
            nodeName === 'html:textarea';
}

var charrefunicode = {
    onLoad: function() {
        // initialization code
        var that = this;
        var EXT_BASE = 'extensions.charrefunicode.';
        this.initialized = true;
        var Cc = Components.classes;
        var Ci = Components.interfaces;
        this.prefs = Cc['@mozilla.org/preferences-service;1'].getService(Ci.nsIPrefService);
        // This branch must be set in both the properties file and prefs js file: http://developer.mozilla.org/en/docs/Code_snippets:Preferences#nsIPrefLocalizedString
        this.branch = this.prefs.getBranch(EXT_BASE);
        if (!this.refreshToolbarDropdown()) { // Avoid error if toolbar icon hidden
            return;
        }
        document.getElementById('charrefunicode-toolbar-openWindow').addEventListener('click',
            function (e) {
                if (e.button !== 2) { // Only delete if this is a right click
                    return;
                }
//                if (e.keyCode === 46 || e.keyCode === 8) { // Delete or back-space (Doesn't work with toolbar)
                    var dropdownArr = JSON.parse(that.branch.getComplexValue('dropdownArr', Ci.nsIPrefLocalizedString).data || '[]');
                    var prev = e.target.previousElementSibling;
                    var i = 0;
                    while (prev) {
                        i++;
                        prev = prev.previousElementSibling;
                    }
                    // Remove item to be deleted and save back to preferences
                    dropdownArr.splice(i, 1);
                    var str = Cc['@mozilla.org/pref-localizedstring;1'].createInstance(Ci.nsIPrefLocalizedString);
                    str.data = JSON.stringify(dropdownArr);
                    that.branch.setComplexValue('dropdownArr', Ci.nsIPrefLocalizedString, str);
                    that.refreshToolbarDropdown();
//                }
            }, true);
        document.getElementById('contentAreaContextMenu').
            addEventListener('popupshowing', function(e) { charrefunicode.showContextMenu(e); }, false);
    },
    refreshToolbarDropdown : function () {
        // SETUP
        var dropdownArr = JSON.parse(this.branch.getComplexValue('dropdownArr', Ci.nsIPrefLocalizedString).data || '[]');
        var toolbarbuttonPopup = document.getElementById('charrefunicode-toolbar-chars');
        if (!toolbarbuttonPopup) {
            return false;
        }

        // EMPTY OLD CONTENTS
        while (toolbarbuttonPopup.firstChild) {
            toolbarbuttonPopup.removeChild(toolbarbuttonPopup.firstChild);
        }

        // ADD NEW CONTENTS
        for each (var item in dropdownArr) {
            var menuitem = document.createElementNS(this.xulns, 'menuitem');
            menuitem.setAttribute('label', item);
            menuitem.setAttribute('value', item);
            toolbarbuttonPopup.appendChild(menuitem);
        }
        return true;
    },
    showContextMenu: function(event) {
        // Show or hide the menuitem based on what the context menu is on
        // See http://kb.mozillazine.org/Adding_items_to_menus
        var cm = gContextMenu;
        if (!cm) { // Avoid error console errors (not sure why not available sometimes)
            return;
        }
        for (var i=1; i <= 18; i++) { // Hide all subitems except for the launcher if no text is selected (could get rid of this (always showing the subitems) and just use the clipboard contents)
            document.getElementById('context-charrefunicode'+i).hidden = !cm.isTextSelected && !_isTextbox(gContextMenu.target) && !gContextMenu.onLink;
        }
    },
    checkAndInsert : function (textbox, insert) {
        var insertLength = insert.length;

        if (_isTextbox(textbox)) {
            var start = textbox.value.substring(0, textbox.selectionStart);
            var end =  textbox.value.substring(textbox.selectionEnd);
            textbox.value = start+insert+end;
            textbox.focus(); // This is necessary for setting a range
            textbox.setSelectionRange(start.length+insertLength, start.length+insertLength);
            return true;
        }
        return false;
    },
    openDialog : function (e) { // Just open the dialog (from a key command or button)
        if (e.target.nodeName === 'menuitem') {
            var textbox = content.document.activeElement;
            var insert = e.target.value;

            if (!this.checkAndInsert(document.activeElement, insert)) { // Try main Firefox window first
                this.checkAndInsert(textbox, insert); // Check content document
            }
            return;
        }
        var dialog = window.openDialog('chrome://charrefunicode/content/uresults.xul','unicoderesults',
                    'chrome, resizable, scrollbars, centerscreen, minimizable', null, null, 'chart');
        dialog.focus();
    },
    onMenuItemCommand: function(e) {
        // If no value selected (and not the plain launcher), could (after changing showContextMenu method above), check the clipboard for a value (not currently implemented)
        var toconvert;
        var targetid = e.target.id;

        try {
            if (gContextMenu && _isTextbox(gContextMenu.target)) {
                toconvert = _getTextboxSelection(gContextMenu.target, true);
                var out;
                switch (targetid) {
                    case 'context-charrefunicode1':
                        out = charrefunicodeConverter.charref2unicodeval(toconvert);
                        break;
                    case 'context-charrefunicode2':
                        out = charrefunicodeConverter.charref2htmlentsval(toconvert);
                        break;
                    case 'context-charrefunicode3':
                        out = charrefunicodeConverter.unicode2charrefDecval(toconvert);
                        break;
                    case 'context-charrefunicode4':
                        out = charrefunicodeConverter.unicode2charrefHexval(toconvert);
                        break;
                    case 'context-charrefunicode5':
                        out = charrefunicodeConverter.unicode2htmlentsval(toconvert);
                        break;
                    case 'context-charrefunicode6':
                        out = charrefunicodeConverter.unicode2jsescapeval(toconvert);
                        break;
                    case 'context-charrefunicode7':
                        out = charrefunicodeConverter.unicodeTo6DigitVal(toconvert);
                        break;
                    case 'context-charrefunicode8':
                        out = charrefunicodeConverter.unicode2cssescapeval(toconvert);
                        break;
                    case 'context-charrefunicode9':
                        out = charrefunicodeConverter.htmlents2charrefDecval(toconvert);
                        break;
                    case 'context-charrefunicode10':
                        out = charrefunicodeConverter.htmlents2charrefHexval(toconvert);
                        break;
                    case 'context-charrefunicode11':
                        out = charrefunicodeConverter.htmlents2unicodeval(toconvert);
                        break;
                    case 'context-charrefunicode12':
                        out = charrefunicodeConverter.hex2decval(toconvert);
                        break;
                    case 'context-charrefunicode13':
                        out = charrefunicodeConverter.dec2hexval(toconvert);
                        break;
                    case 'context-charrefunicode14':
                        out = charrefunicodeConverter.jsescape2unicodeval(toconvert);
                        break;
                    case 'context-charrefunicode15':
                        out = charrefunicodeConverter.sixDigit2UnicodeVal(toconvert);
                        break;
                    case 'context-charrefunicode16':
                        out = charrefunicodeConverter.cssescape2unicodeval(toconvert);
                        break;
                    case 'context-charrefunicode17':
                        out = charrefunicodeConverter.unicode2CharDescVal(toconvert);
                        break;
                    case 'context-charrefunicode18':
                        out = charrefunicodeConverter.charDesc2UnicodeVal(toconvert);
                        break;
                    case 'context-unicodechart':
                    case 'context-launchunicode':
                    case 'tools-charrefunicode':
                    default:
                        out = false; // Open dialog instead
                        break;
                }
                if (out !== false) {
                    //alert(toconvert);
                    //alert(out);
                    this.checkAndInsert(gContextMenu.target, out); // Fix: do for contenteditable?
                    return;
                }
            }
            if (!toconvert) {
                try {
                    toconvert = gContextMenu.linkText();
                }
                catch(e) {
                    toconvert = content.window.getSelection();
                }
            }

            var dialog = window.openDialog('chrome://charrefunicode/content/uresults.xul','unicoderesults',
                            'chrome, resizable, scrollbars, centerscreen, minimizable',
                                             /* Scrollbars don't seem to work on a Mac at least */
                                             toconvert, targetid);
            dialog.focus();
        }
        catch (e) {
            alert(e); // Can't figure out why sometimes opens minimized (should be wide enough to hold content)
        }

    },
    xulns : 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul',
};

// EXPORTS
this.charrefunicode = charrefunicode;

}());

window.addEventListener('load', function(e) { charrefunicode.onLoad(e); }, false);
