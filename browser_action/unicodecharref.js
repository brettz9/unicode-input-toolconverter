/* eslint-disable unicorn/no-this-assignment -- Easier here */

// See https://unicode.org/Public/UNIDATA/ for data use

/*
// Todo: Handle these for `buildUnicode` `currentStartCharCode`
//    (`setCurrstartset`); see also
//    `setPref('currentStartCharCode'...`
if (k < 0) {
  k = 1114112 + parseInt(k);
} else if (currentStartCharCode.toString().match(decreg) ||
  currentStartCharCode.toString().match(decreg2)) { // Dec
  currentStartCharCode = currentStartCharCode.toString().replace(decreg, '$2');
  currentStartCharCode = parseInt(currentStartCharCode, 10);
} else if (currentStartCharCode.toString().match(hexreg)) { // Hex
  currentStartCharCode = currentStartCharCode.toString().replace(hexreg, '$3');
  currentStartCharCode = parseInt(currentStartCharCode, 16);
} else {
  // Convert toString in case trying to get the ASCII for a single digit number
  // Todo: Review `charCodeAt` on whether need modern substitutions
  const kt = currentStartCharCode.toString().charCodeAt(0);
  if (kt >= 0xD800 && kt < 0xF900) { // surrogate component (higher plane)
    currentStartCharCode = ((kt - 0xD800) * 0x400) +
      (currentStartCharCode.toString().charCodeAt(1) - 0xDC00) + 0x10000;
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
import {$, $$} from '../vendor/jamilih/dist/jml-es.js';
// Todo: Filed the following to avoid both sync and callbacks:
//  https://github.com/101arrowz/fflate/issues/70
import {unzipSync, strFromU8} from '../vendor/fflate/esm/browser.js';
import {
  getUnicodeDefaults, getPrefDefaults
} from './preferences/prefDefaults.js';
import {chartBuild} from './chartBuild.js';
import {insertIntoOrOverExisting} from './utils/TextUtils.js';
import {
  placeItem, removeViewChildren, createHTMLElement, createXULElement, xulns
} from './utils/DOMUtils.js';
import getScriptInfoForCodePoint from './unicode/getScriptInfoForCodePoint.js';
import charrefunicodeDb, {
  UnihanDatabase, Jamo
} from './unicode/charrefunicodeDb.js';
import {getCJKTypeFromHexString} from './unicode/unihan.js';
import parseUnihanFromTextFileStrings from
  './unicode/parseUnihanFromTextFileStrings.js';
import {registerDTD} from './entityBehaviors.js';
import {entities, numericCharacterReferences} from './entities.js';
import {findBridgeForTargetID} from './charrefConverters.js';

let _, charrefunicodeConverter, jmo, getPref, setPref;
export const shareVars = ({_: l10n, charrefunicodeConverter: _uc}) => {
  _ = l10n;
  charrefunicodeConverter = _uc;
  jmo = new Jamo();
  ({getPref, setPref} = getUnicodeDefaults());
};

const unihanDatabase = new UnihanDatabase();

/**
 * @returns {Promise<Object<string,string[]>>}
 */
async function getDownloadResults () {
  const response = await fetch('/download/unihan/Unihan.zip');
  const reader = response.body.getReader();
  // 6747669; // 39.5 MB unzipped;
  const totalBytes = response.headers.get('content-length');
  const progressElement = $('#progress_element');
  progressElement.max = totalBytes;

  const chunks = [];
  let receivedLength = 0;
  while (true) {
    // eslint-disable-next-line no-await-in-loop -- Stream reading
    const {done, value} = await reader.read();
    if (done) {
      break;
    }

    chunks.push(value);
    receivedLength += value.length;

    const percentComplete = ((
      receivedLength / totalBytes
    ) * 100);

    progressElement.value = percentComplete;
    progressElement.textContent = _('download_progress') + ' ' +
      percentComplete.toFixed(2) + _('percentSign');
  }

  // Combine into single `Uint8Array`
  const compressed = new Uint8Array(receivedLength);
  let pos = 0;
  for (const chunk of chunks) {
    compressed.set(chunk, pos);
    pos += chunk.length;
  }

  const decompressedObj = unzipSync(compressed);
  const scriptFileAsStrings = Object.values(decompressedObj).map(
    (decompressed) => {
      return strFromU8(decompressed);
    }
  );

  return parseUnihanFromTextFileStrings(scriptFileAsStrings);
}

const unicodecharref = {
  async downloadUnihan () {
    $('#DownloadButtonBox').hidden = true;
    $('#DownloadProgressBox').hidden = false;

    const parsed = await getDownloadResults();

    // Todo: Save to indexedDB
    console.log('parsed', parsed[3400]);

    try {
      // Todo: Change to indexedDB
      charrefunicodeDb.dbConnUnihan.createStatement(
        // Just to test database
        'SELECT code_pt FROM ' + 'Unihan' + ' WHERE code_pt = "3400"'
      );
      alert(_('Finished_download'));
      this.unihanDb_exists = true;
      $('#closeDownloadProgressBox').hidden = false;
      $('#UnihanInstalled').hidden = false;
    } catch (e) {
      $('#closeDownloadProgressBox').hidden = true;
      $('#UnihanInstalled').hidden = true;
      $('#DownloadProgressBox').hidden = true;
      $('#DownloadButtonBox').hidden = false;
      alert(_('Problem_downloading'));

      // eslint-disable-next-line no-console -- Debug
      console.error(e);
    }
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
        textbox.addEventListener(
          'change', function (e) {unicodecharref['search' + type](e);}
        );
        textbox.addEventListener(
          'input', function (e) {unicodecharref['search' + type](e);}
        );
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
                menuitem.setAttribute(
                  'label', _(match + this['UnicodeMenu' + match][j])
                );
                menuitem.setAttribute(
                  'tooltiptext', _(match + this['UnicodeMenu' + match][j])
                );
                menuitem.setAttribute(
                  'value', this['UnicodeMenu' + match][j]
                );
                menupopup.append(menuitem);
              }
              if (match === 'Canonical_Combining_Class') {
                for (j = 11; j <= 36; j++) {
                  // Other Non-Numeric not listed in UnicodeMenuCCVNumericOnly
                  menuitem = createXULElement('menuitem');
                  menuitem.setAttribute('label', j);
                  menuitem.setAttribute('tooltiptext', j);
                  menuitem.setAttribute('value', j);
                  menupopup.append(menuitem);
                }
                for (
                  j = 0;
                  j < this['UnicodeMenu' + 'CCVNumericOnly'].length;
                  j++
                ) {
                  menuitem = createXULElement('menuitem');
                  menuitem.setAttribute(
                    'label', this['UnicodeMenu' + 'CCVNumericOnly'][j]
                  );
                  menuitem.setAttribute(
                    'tooltiptext', this['UnicodeMenu' + 'CCVNumericOnly'][j]
                  );
                  menuitem.setAttribute(
                    'value', this['UnicodeMenu' + 'CCVNumericOnly'][j]
                  );
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
    // let tabpanel = type === 'Unicode' ? '#regularSearch' : '#cjkSearch';
    const tabpanel = '#tabboxSearch';

    $(tabpanel).addEventListener('change', function (e) {
      unicodecharref['search' + type](e.target);
    });
    $(tabpanel).addEventListener('input', function (e) {
      unicodecharref['search' + type](e.target);
    });
    $(tabpanel).addEventListener('select', function (e) {
      if (
        e.target.nodeName !== 'menulist' &&
        e.target.nodeName !== 'textbox'
      ) { return; }
      unicodecharref['search' + type](e.target);
    }); // Triggered initially which sets preference to "Lu"
  },

  // Fix: Should also create the detailedView and detailedCJKView's
  //  content dynamically (and thus fully conditionally rather than hiding)
  async testIfComplexWindow () {
    if (await getPref('showComplexWindow')) {
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
  setupBoolChecked (...els) {
    els.forEach(async (el) => {
      $('#' + el).checked = await getPref(el);
    });
  },
  async initialize (...args) {
    const that = this;
    // this.refreshToolbarDropdown(); // redundant?

    // charrefunicodeDb.connect('download/Unicode.sqlite');
    this.unihanDb_exists = false;
    try {
      // Todo: Fix
      charrefunicodeDb('Unihan.sqlite', 'unihan');

      // Test Unihan value
      unihanDatabase.getUnicodeFields('3400');

      this.unihanDb_exists = true;
      $('#DownloadButtonBox').hidden = true;
      $('#UnihanInstalled').hidden = false;
    } catch (e) {
      // eslint-disable-next-line no-console -- Debug
      console.error(e);
      $('#DownloadButtonBox').hidden = false;
      $('#UnihanInstalled').hidden = true;
    }
    try {
      // charrefunicodeDb.connect('download/Jamo.sqlite', 'jamo');
    } catch (e) {
      alert(e);
    }

    // document.documentElement.maxWidth =
    //  window.screen.availWidth-(window.screen.availWidth*1/100);
    $('#unicodeTabBox').style.maxWidth = window.screen.availWidth -
      (window.screen.availWidth * 3 / 100);
    $('#unicodeTabBox > .tabs').style.maxWidth =
      window.screen.availWidth - (window.screen.availWidth * 3 / 100);
    /*
    $('#unicodeTabBox').style.maxHeight =
      window.screen.availHeight-(window.screen.availHeight*5/100);
    $('#conversionhbox').style.maxHeight =
      window.screen.availHeight-(window.screen.availHeight*13/100);

    $('#noteDescriptionBox2').height =
      $('#noteDescriptionBox2').height =
        window.screen.availHeight-(window.screen.availHeight*25/100);
    $('#unicodeTabBox').style.maxWidth =
      window.screen.availWidth-(window.screen.availWidth*1/100);
    $('#unicodetabs').style.maxWidth =
      window.screen.availWidth-(window.screen.availWidth*2/100);
    $('#unicodeTabBox').style.maxWidth =
      window.screen.availWidth-(window.screen.availWidth*2/100);
    $('#chartcontent').style.maxWidth =
      window.screen.availWidth-(window.screen.availWidth*25/100);
    $('#chart_selectchar_persist_vbox').maxWidth =
      window.screen.availWidth-(window.screen.availWidth*25/100);
    */
    // $('#tableholder').maxWidth =
    //  window.screen.availWidth-(window.screen.availWidth*50/100);
    // $('#tableholder').width = window.screen.availWidth -
    //   (window.screen.availWidth*50/100);
    // window.sizeToContent();

    this.testIfComplexWindow();

    // These defaults are necessary for the sake of the options URL
    //  (when called from addons menu)
    let toconvert = '';
    let targetid = '';
    // const targetid = 'context-launchunicode';

    // Check first for our custom protocol
    const arg0 = args && args[0] && args[0].wrappedJSObject;
    const customProtocol = arg0 &&
      arg0.constructor.name === 'NsiSupportsWrapper';
    // Fix: the initial portion of this handling really should be inside
    //  the protocol handler, but that requires implementing the object to
    //  add arguments
    let unicodeQueryObj;
    // Will be passed a query string if a protocol handler has been triggered
    if (customProtocol) {
      // We skip over the initial question mark too
      const req = decodeURIComponent(arg0.toString().slice(1));
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
        throw new Error(
          'Unrecognized query type passed to application ' +
            'for Custom Unicode protocol'
        );
      }
    } else if (!args) { // Do nothing for options dialog
    } else if (!args[2]) {
      toconvert = args[0].toString(); // Need the conversion to string since content.window.getSelection() passed here gives an object, unlike the now deprecated content.document.getSelection() which returns a string. (Discovered deprecated status via Console extension: https://addons.mozilla.org/en-US/firefox/addon/1815 )
      targetid = args[1];
    } else {
      const Components = 'todo';
      const Cc = Components.classes,
        Ci = Components.interfaces;
      const wm = Cc[
        '@mozilla.org/appshell/window-mediator;1'
      ].getService(Ci.nsIWindowMediator);
      const browserWin = wm.getMostRecentWindow('navigator:browser');
      toconvert = browserWin.content.getSelection().toString();
      targetid = toconvert
        ? 'context-charrefunicode1'
        : ''; // Fix: replace with preference
    }

    if (!(await getPref('multiline'))) {
      $('#displayUnicodeDesc').setAttribute('multiline', false);
      $('#displayUnicodeDesc').setAttribute('rows', 1);
    } else {
      $('#displayUnicodeDesc').setAttribute('multiline', true);
      $('#displayUnicodeDesc').setAttribute('rows', 3);
    }

    this.setupBoolChecked(...Object.entries(getPrefDefaults()).filter((
      [key, value]
    ) => {
      return typeof value === 'boolean';
    }).map(([key]) => key));

    switch (await getPref('cssWhitespace')) {
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
    default:
      throw new Error('Unexpected whitespace preference value');
    }

    /* if (await getPref('hexstyleLwr')) {
      $(EXT_BASE + 'hexstyleLwr').selectedIndex = 0;
    }
    else {
      $(EXT_BASE + 'hexstyleLwr').selectedIndex = 1;
    } */
    /* if ((await getPref('xstyle')) === 'x') {
      $(EXT_BASE + 'xstyle').checked = true;
    } */

    // Set the size per the prefs (don't increase or decrease the value)
    this.resizecells();

    $('#rowsset').value = await getPref('tblrowsset');
    $('#colsset').value = await getPref('tblcolsset');

    // Save copies in case decide to reset later (i.e., not append to
    //  HTML entities, then wish to append to them again)
    this.origents = [];
    this.origcharrefs = [];
    this.orignewents = [];
    this.orignewcharrefs = [];

    this.origents = [...entities];
    this.origcharrefs = [...numericCharacterReferences];
    this.orignewents = [...charrefunicodeConverter.newents];
    this.orignewcharrefs = [...charrefunicodeConverter.newcharrefs];

    $('#lang').value = await getPref('lang');
    $('#font').value = await getPref('font');

    const DTDtxtbxval = await getPref('DTDtextbox');

    $('#DTDtextbox').value = DTDtxtbxval;
    registerDTD();

    //  toconvert = charreftoconvert.replace(/\n/g, ' ');
    $('#toconvert').value = toconvert;

    if (await getPref('ampspace')) {
      toconvert = toconvert.replace(/&([^;\s]*\s)/gu, '&amp;$1');
    }

    // Detect which context menu item was selected:
    let out; // converttypeid;

    const bridgeResult = findBridgeForTargetID({toconvert, targetid});

    if (bridgeResult !== false) {
      out = bridgeResult;
    } else {
      switch (targetid) {
      case 'context-unicodechart':
        this.disableEnts();
        $('#startset').value = toconvert;
        $('#unicodeTabBox').$selectTab($('#charts'));
        if (toconvert !== '') {
          this.setCurrstartset(toconvert);
          chartBuild();
        }
        // Fallthrough
      case 'context-launchunicode':
      case 'tools-charrefunicode':
        out = '';
        break;
      case 'searchName':
        $(targetid).value = unicodeQueryObj.string;
        $(targetid).focus();
        this.searchUnicode({
          id: targetid, value: unicodeQueryObj.string
        }); // Assume non-CJK
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
    }

    if (!customProtocol) {
      if (!args) { // options menu
        $('#unicodeTabBox').$selectTab($('#prefs'));
      } else if (args[2] !== undefined) { // Keyboard invocation or button
        // $('#unicodetabs').selectedIndex = 0; // Fix: set by preference
        $('#unicodeTabBox').$selectTab($(await getPref('initialTab')));
      } else if (
        targetid !== 'context-unicodechart' &&
        targetid !== 'tools-charrefunicode'
      ) {
        $('#unicodeTabBox').$selectTab($('#conversion'));
      }
    }

    $('#initialTab').selectedItem = $('#mi_' + await getPref('initialTab'));

    if (targetid !== 'searchName' && targetid !== 'searchkDefinition') {
      if (toconvert) { // Seemed to become necessarily suddenly
        this.setCurrstartset(toconvert);
      }
      chartBuild();
    }
    this.tblfontsize(0); // Draw with the preferences value

    $('#menulists').addEventListener('command',
      function (e) {
        // const tmp = that.branch.getComplexValue(
        //   'currentStartCharCode', Ci.nsIPrefLocalizedString
        // ).data;
        that.disableEnts();
        that.setCurrstartset(e.target.value);
        chartBuild();
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
    const outerh = await getPref('outerHeight');
    const outerw = await getPref('outerWidth');
    if (outerh > 0) {
      window.outerHeight = outerh;
    }
    if (outerw > 0) {
      window.outerWidth = outerw;
    }
  },
  copyToClipboard (id) {
    const text = $(id).value;
    const Components = 'todo';
    const Cc = Components.classes,
      Ci = Components.interfaces;
    const gClipboardHelper = Cc[
      '@mozilla.org/widget/clipboardhelper;1'
    ].getService(Ci.nsIClipboardHelper);
    gClipboardHelper.copyString(text);
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
      setPref(
        e.target.parentNode.parentNode.id, e.target.value
      ); // Could use @label or position as default value
      break;
    case 'checkbox':
      // Apparently hasn't changed yet, so use the opposite
      setPref(e.target.id, Boolean(!e.target.checked));
      break;
    case 'radio': {
      let radioid;
      const result = e.target.id.match(/^_(\d)+-(.*)$/u);
      if (result !== null) {
        radioid = result[2]; // Extract preference name
        setPref(radioid, result[1] === '1');
      }
      break;
    } default:
      break;
    }
  },
  async resetdefaults () {
    const that = this;
    // Todo: Change to programmatic setting
    // If make changes here, also change the default/preferences
    //  charrefunicode.js file
    this.setBoolChecked([
      'asciiLt128', 'showImg', 'xhtmlentmode', 'hexLettersUpper', 'multiline'
    ], false);
    this.setBoolChecked([
      'xmlentkeep', 'ampkeep', 'appendtohtmldtd', 'cssUnambiguous'
    ], true);

    $('#ampspace').checked = false;
    $('#showComplexWindow').checked = false;
    $('#showAllDetailedView').checked = true;
    $('#showAllDetailedCJKView').checked = true;

    /**
    * @param {string} langOrFont
    * @returns {string}
    */
    function langFont (langOrFont) { // Fix: needs to get default!
      const Components = 'todo';
      const Ci = Components.interfaces;
      const deflt = that.branchDefault.getComplexValue(
        langOrFont, Ci.nsIPrefLocalizedString
      ).data;
      $('#' + langOrFont).value = deflt;
      setPref(langOrFont, deflt);
      return deflt;
    }
    $('#chart_table').lang = langFont('lang');

    $('#insertText').style.fontFamily = langFont('font');
    // Form elements don't inherit, so find these manually
    $$('#chart_table button[name="unicode"]').forEach((button) => {
      button.style.fontFamily = langFont('font');
    });

    // setPref('hexstyleLwr', true);
    // $(EXT_BASE + 'hexstyleLwr').selectedIndex = 0;

    setPref('fontsizetextbox', 13);
    this.fontsizetextbox(0);

    /*
    Easy enough to manually remove DTD -- wouldn't want to lose that data
    setPref('DTDtextbox', '');
    $('#DTDtextbox').value = '';
    */

    // Don't really need to reset since user can't currently change
    //  this (only for blank string entry)
    setPref(
      'startset', 'a'.codePointAt() - 1
    );

    this.setCurrstartset(await getPref('startset'));

    $('#displayUnicodeDesc').setAttribute('multiline', false);
    $('#displayUnicodeDesc').setAttribute('rows', 1);

    // These get activated in chartBuild(); below
    setPref('tblrowsset', 4);
    $('#rowsset').value = 4;
    setPref('tblcolsset', 3);
    $('#colsset').value = 3;

    this.setBoolChecked([
      'entyes', 'hexyes', 'decyes', 'unicodeyes', 'buttonyes'
    ], true);
    this.setBoolChecked([
      'onlyentsyes', 'startCharInMiddleOfChart'
    ], false);

    // setPref('xstyle', 'x');
    // $('#xstyle').checked = true;

    setPref('initialTab', 'charts');
    $('#extensions.charrefunicode.initialTab').selectedItem = $('#mi_charttab');

    setPref('tblfontsize', 13);
    this.resizecells();

    chartBuild();
    setPref('outerHeight', 0);
    setPref('outerWidth', 0);
  },

  /**
   * Set a boolean preference (and its checked state in the interface) to
   * a given boolean value.
   * @param {string|string[]} els The element ID string or strings which
   *   should have their values set
   * @param {boolean} value The value for the preference and checked state
   */
  setBoolChecked (els, value) {
    els = typeof els === 'string' ? [els] : els;
    for (const el of els) {
      setPref(el, value);
      $('#' + el).checked = value;
    }
  },

  // End UI bridges

  setImagePref (ev) {
    this.setprefs(ev);
    if ($('#unicodeImg').firstChild) {
      $('#unicodeImg').firstChild.remove();
    }
    return false;
  },

  async getUnicodeDescription (kent, khextemp) {
    const hideMissing = !(await getPref('showAllDetailedView'));
    const hideMissingUnihan = !(await getPref('showAllDetailedCJKView'));

    const {
      unihanType, hangul, cjkText, searchValue
    } = getCJKTypeFromHexString({khextemp, _});

    const kdectemp = Number.parseInt(khextemp, 16);
    const {
      codePointStart, script, plane, privateuse, surrogate
    } = getScriptInfoForCodePoint(kdectemp, _);

    // Todo: Make reactive!
    if (!unihanType) {
      for (let i = 1; i <= 13; i++) {
        $('#_detailedCJKView' + i).value = '';
      }
      for (let i = 15; i <= 90; i++) {
        $('#_detailedCJKView' + i).value = '';
      }
      for (let i = 0; i < this.unihanProperties.length; i++) {
        $('#searchk' + this.unihanProperties[i]).value = '';
      }
    }

    let result;
    try {
      const results = charrefunicodeDb.getUnicodeFields(searchValue);
      if (results) {
        if (!cjkText) {
          result = results[1];
          if (kdectemp >= 0x1100 && kdectemp < 0x1200) {
            try {
              const jamo = jmo.getJamo(kdectemp);
              result += ' (' + jamo + ')';
            } catch (e) {
            }
          }
        } else {
          result = cjkText;
        }
        for (let i = 2; i <= 14; i++) {
          // Fix: display data more readably, etc.
          let temp = results[i];
          if (i === 10) {
            if (temp) {
              result += ';\u00A0\u00A0\u00A0\u00A0\n' +
                _('searchUnicode_1_Name') + _('colon') + ' ' + temp;
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
                // 199, 200, 204, 208, 210, 212 do not have members yet and
                //  others from 11 to 132 do not have name listed
                temp = _('Canonical_Combining_Class' + temp);
              }
              break;
            case 4:
              temp = _('Bidi_Class' + temp);
              break;
            case 9:
              temp = (temp === 'Y')
                ? _('Bidi_MirroredY')
                : _('Bidi_MirroredN'); // Only two choices
              break;
            case 12:
            case 13:
            case 14: {
              const a = createHTMLElement('a');
              // eslint-disable-next-line no-script-url -- This is controlled
              a.href = 'javascript:void(0)';

              a.addEventListener('click', function (e) {
                unicodecharref.startset({
                  value: e.target.innerHTML.codePointAt()
                });
                // Probably want to start checking again since move to new page
                // that.noGetDescripts = false;
              });
              const tempno = Number.parseInt(temp, 16);
              a.textContent = String.fromCodePoint(tempno);
              a.className = 'text-link';
              const view = $('#_detailedView' + i);
              removeViewChildren(i);

              // Necessary to avoid CSS wrapping warning
              const box = createXULElement('description');
              box.append(a);
              box.append(' (' + temp + ')');
              view.append(box);

              // alert(new XMLSerializer().serializeToString(view));
              break;
            } default:
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
            removeViewChildren(i);
          }
        }
      }
      if (!unihanType && result !== null && result !== undefined) {
        $('#displayUnicodeDesc').value = kent +
          'U+' + khextemp + _('colon') + ' ' + result;
        $('#displayUnicodeDesc2').value = kent +
          'U+' + khextemp + _('colon') + ' ' + result;
      // Fix: remove this duplicate also in catch, etc.
      } else if (surrogate) {
        $('#displayUnicodeDesc').value = kent +
          'U+' + khextemp + _('colon') + ' ' + surrogate;
        $('#displayUnicodeDesc2').value = kent +
          'U+' + khextemp + _('colon') + ' ' + surrogate;
      } else if (privateuse) {
        $('#displayUnicodeDesc').value = kent +
          'U+' + khextemp + _('colon') + ' ' + _('Private_use_character');
        $('#displayUnicodeDesc2').value = kent +
          'U+' + khextemp + _('colon') + ' ' + _('Private_use_character');
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
        $('#displayUnicodeDesc').value = kent +
          'U+' + khextemp + _('colon') + ' ' + _('Noncharacter');
        $('#displayUnicodeDesc2').value = kent +
          'U+' + khextemp + _('colon') + ' ' + _('Noncharacter');
      } else if (!unihanType) {
        const notfoundval = 'U+' + khextemp + _('colon') + ' ' + _('Not_found');
        $('#displayUnicodeDesc').value = notfoundval;
        $('#displayUnicodeDesc2').value = notfoundval;
        for (let j = 2; j <= 14; j++) {
          if (j === 10) { continue; }
          try {
            $('#_detailedView' + j).value = '';
            $('#_detailedView' + j).parentNode.hidden = hideMissing;
            removeViewChildren(j);
          } catch (e) {
            alert('2' + e + j);
          }
        }
      }
    } catch (e) {
      if (surrogate) {
        $('#displayUnicodeDesc').value = kent +
          'U+' + khextemp + _('colon') + ' ' + surrogate;
        $('#displayUnicodeDesc2').value = kent +
          'U+' + khextemp + _('colon') + ' ' + surrogate;
      } else if (privateuse) {
        $('#displayUnicodeDesc').value = kent +
          'U+' + khextemp + _('colon') + ' ' + _('Private_use_character');
        $('#displayUnicodeDesc2').value = kent +
          'U+' + khextemp + _('colon') + ' ' + _('Private_use_character');
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
        $('#displayUnicodeDesc').value = kent +
          'U+' + khextemp + _('colon') + ' ' + _('Noncharacter');
        $('#displayUnicodeDesc2').value = kent +
          'U+' + khextemp + _('colon') + ' ' + _('Noncharacter');
      } else {
        const notfoundval = 'U+' + khextemp + _('colon') + ' ' + _('Not_found');
        $('#displayUnicodeDesc').value = notfoundval;
        $('#displayUnicodeDesc2').value = notfoundval;
        for (let j = 2; j <= 14; j++) {
          if (j === 10) { continue; }
          try {
            $('#_detailedView' + j).value = '';
            $('#_detailedView' + j).parentNode.hidden = hideMissing;
            removeViewChildren(j);
          } catch (err) {
            alert('3' + err + j);
          }
        }
      }
    }
    // const canreturn = true;

    if (this.unihanDb_exists) {
      try {
        // $('#displayUnicodeDesc').value= _('retrieving_description');
        const results = unihanDatabase.getUnicodeFields(khextemp);
        if (results) {
          // Fix: display data more readably, with heading, etc. (and
          //   conditional)
          result = results[14];
          if (result === null && !cjkText) {
            result = _('No_definition');
          }
          // Fix: Display meta-data in table (get to be stable by
          //   right-clicking)
          // $('#_detailedCJKView' + 3).value = result ? result : '';
          for (let i = 1; i <= 13; i++) {
            // Fix: display data more readably, etc.
            const temp = results[i];
            if (temp) {
              if (hideMissingUnihan) {
                $('#_detailedCJKView' + i).parentNode.hidden = false;
              }
              // result += '; ' + temp;
              /*
              switch (i) {
              case 1:
                // Optional code to transform output into something
                //   more readable
                break;
              case 2:
                break;
              default:
                break;
              }
              */
              $('#_detailedCJKView' + i).value = temp;
            } else {
              $('#_detailedCJKView' + i).parentNode.hidden = hideMissingUnihan;
              $('#_detailedCJKView' + i).value = '';
            }
          }
          for (let i = 15; i <= 90; i++) {
            let temp;
            try {
              // Fix: display data more readably, etc.
              temp = results[i];
            } catch (e) {
              alert(i);
            }
            if (temp) {
              if (hideMissingUnihan) {
                $('#_detailedCJKView' + i).parentNode.hidden = false;
              }
              /*
              switch (i) {
              case 4:
                // Optional code to transform output into something
                //   more readable
                break;
              case 5:
                break;
              default:
                break;
              }
              */
              $('#_detailedCJKView' + i).value = temp;
            } else {
              $('#_detailedCJKView' + i).parentNode.hidden = hideMissingUnihan;
              $('#_detailedCJKView' + i).value = '';
            }
          }
        }

        if (result !== '' && result !== null && result !== undefined) {
          // Commenting out to show general category under definition
          // $('#displayUnicodeDesc2').value = kent +
          //   'U+' + khextemp + _('colon')+' ' + result;
          $('#displayUnicodeDescUnihan').value = kent +
            'U+' + khextemp + _('colon') + ' ' + result;
          $('#displayUnicodeDesc').value = kent +
            'U+' + khextemp + _('colon') + ' ' + result;
          $('#displayUnicodeDesc2').value = kent +
            'U+' + khextemp + _('colon') + ' ' + result;
        } else {
          const notfoundval = 'U+' + khextemp + _('colon') + ' ' +
            _('Not_found');

          if (!cjkText || hangul) {
            for (let j = 2; j <= 14; j++) {
              if (j === 10) { continue; }
              try {
                $('#_detailedView' + j).value = '';
                $('#_detailedView' + j).parentNode.hidden = hideMissing;
                removeViewChildren(j);
              } catch (e) {
                alert('1' + e + j);
              }
            }
            for (let i = 1; i <= 13; i++) {
              $('#_detailedCJKView' + i).parentNode.hidden = hideMissingUnihan;
              $('#_detailedCJKView' + i).value = '';
            }
            for (let i = 15; i <= 90; i++) {
              $('#_detailedCJKView' + i).parentNode.hidden = hideMissingUnihan;
              $('#_detailedCJKView' + i).value = '';
            }
          }

          if (!cjkText) {
            $('#displayUnicodeDesc').value = notfoundval;
            $('#displayUnicodeDescUnihan').value = notfoundval;
            $('#displayUnicodeDesc2').value = notfoundval;
          } else {
            const finalval = kent +
              'U+' + khextemp + _('colon') + ' ' + cjkText + ' ' +
              (hangul
                ? ''
                : _('left_parenth') + _('No_definition') +
                  _('right_parenth'));
            $('#displayUnicodeDesc').value = finalval;
            $('#displayUnicodeDesc2').value = finalval;
            $('#displayUnicodeDescUnihan').value = finalval;
            // $('#displayUnicodeDesc2').value = notfoundval;
          }
        }
      } catch (e) {
        alert(e);
      }
      // return;
    } // Excised Ajax code...

    if (
      this.unihanDb_exists && unihanType &&
      $('#viewTabs').selectedTab === $('#detailedView')
    ) {
      $('#viewTabs').$selectTab($('#detailedCJKView'));
    }

    // const alink = createHTMLElement('a');
    const alink = createXULElement('label');
    alink.target = '_blank';
    alink.className = 'text-link';
    alink.href = `https://unicode.org/charts/PDF/U${codePointStart}.pdf`;
    alink.setAttribute('value', script + ' (PDF)');

    // Handle PDF link
    placeItem('#pdflink', alink);

    // Handle plane #
    const planeText = _('plane_num', {plane}) + '\u00A0';
    placeItem('#plane', planeText);

    if (await getPref('showImg')) {
      const img = createXULElement('image');
      // img.width = '80';
      // img.height = '80';
      img.setAttribute('src', 'https://unicode.org/cgi-bin/refglyph?1-' + Number(kdectemp).toString(16));
      placeItem('#unicodeImg', img);
    }
  },
  async fontsizetextbox (size) { // Changes font-size
    const txtbxsize = await getPref('fontsizetextbox') + size;
    setPref('fontsizetextbox', txtbxsize);

    $('#toconvert').style.fontSize = txtbxsize + 'px';
    $('#converted').style.fontSize = txtbxsize + 'px';
    if (size > 0) {
      // On Mac at least, resizing for reducing font size, causes button to
      // go off screen
      window.sizeToContent();
    }
  },
  async tblfontsize (size) { // Changes font-size of chart table cells
    const fsize = await getPref('tblfontsize') + size;
    // const tds = createHTMLElement('td');
    setPref('tblfontsize', fsize);
    this.resizecells({sizeToContent: size > 0});
  },
  async resizecells ({sizeToContent} = {}) {
    $$(
      "*[name='dec'],*[name='hex'],*[name='unicode']"
    ).forEach(async (control) => {
      control.style.fontSize =
        await getPref('tblfontsize') + 'px';
    });
    $('#insertText').style.fontSize =
      await getPref('tblfontsize') + 'px';
    // $('#displayUnicodeDesc').style.fontSize =
    //   await getPref('tblfontsize') + 'px';
    if (sizeToContent) {
      // On Mac at least, resizing for reducing font size, causes button to
      // go off screen
      window.sizeToContent();
    }
  },
  flip (e) {
    this.setCurrstartset(this.j);
    this.setprefs(e);
    chartBuild();
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
    default:
      throw new Error('Unexpected menu value');
    }
    setPref('cssWhitespace', value);
  },
  /* xstyleflip () {
    this.setCurrstartset(this.j);
    const currxstyle = 'x';
    const prevxstyle = await getPref('xstyle');
    if (prevxstyle === 'x') {
      currxstyle = 'X';
    }
    setPref('xstyle', currxstyle);
    chartBuild();
  }, */
  rowsset (e) {
    this.setCurrstartset(this.j);
    if (e.target.value !== null && e.target.value !== '') {
      setPref('tblrowsset', e.target.value);
    }
    chartBuild();
  },
  colsset (e) {
    this.setCurrstartset(this.j);
    if (e.target.value !== null && e.target.value !== '') {
      setPref('tblcolsset', e.target.value);
    }
    chartBuild();
  },
  async startset (tbx, descripts) {
    this.disableEnts();
    const data = tbx.value !== null &&
      tbx.value !== undefined &&
      tbx.value !== ''
      ? tbx.value
      : (await getPref('startset'));
    this.setCurrstartset(data);

    chartBuild(descripts);
  },
  searchUnihan (obj) {
    this.searchUnicode(obj, 'Unihan');
  },
  disableEnts () {
    this.setBoolChecked('onlyentsyes', false);
  },
  async searchUnicode (obj, table, nochart, strict) { // Fix: allow Jamo!
    charrefunicodeConverter.searchUnicode(obj, table, nochart, strict);
    if (!nochart) {
      const tmp = await getPref('currentStartCharCode');
      this.startset(obj, true); // Could remember last description (?)
      this.setCurrstartset(tmp); // Set it back as it was before the search
    }
    // Doesn't work since name_desc_val is search value, not first
    //  result value (we could remember the last search and whether it
    //  were a search, however); we need to be careful, however, since
    //  some searches run automatically on start-up
    /* if (name_desc === 'Name' || name_desc === 'kDefinition') {
      this.setCurrstartset(name_desc_val);
    } */
  },
  moveoutput (movedid) {
    const insertText = $(movedid);
    $('#unicodetabs').selectedIndex = 1;
    $('#toconvert').value = insertText.value;
  },
  append2htmlflip (e) {
    this.setprefs(e);
    registerDTD(); // (in case DTD not also changed, still need to reset)
  },
  /**
   * Sets the preference for whether to display the chosen character
   * in the middle of the chart (or beginning).
   * @param {boolean} bool Whether to set to true or not
   */
  startCharInMiddleOfChart (bool) {
    // Commented this out because while it will always change (unlike
    //   now), the value will be misleading
    // $(EXT_BASE + 'startCharInMiddleOfChart').checked = bool;
    setPref('startCharInMiddleOfChart', bool);
  },
  /**
   * Sets a value in preferences at which the Unicode chart view will
   * begin on next start-up.
   * @param {Integer} value The value to which to set the current
   *   starting value
   */
  setCurrstartset (value) {
    setPref('currentStartCharCode', value);
  },
  // Some of these defaults may become irrelevant due to the
  //  /default/preferences/charrefunicode.js file's settings
  k (setval) {
    this.setCurrstartset(setval);
  },
  insertent () {
    insertIntoOrOverExisting({
      textReceptacle: $('#DTDtextbox'),
      value: '<!ENTITY  "">\n'
    });
    // The following works but may be annoying if trying to insert
    //  multiple entities at a time (thus the addition of the newline)
    // Bring cursor back a little
    // textarea.selectionStart = this.selst - 5;
    // textarea.selectionEnd = this.selend - 5;
  },
  /**
   * Display the Unicode description box size (multline or not) according
   * to user preferences.
   * @param {Event} e The event (not in use)
   */
  async multiline (e) {
    const display = $('#displayUnicodeDesc');
    if (await getPref('multiline') === false) {
      setPref('multiline', true);
      display.setAttribute('multiline', true);
      display.setAttribute('rows', 3);
    } else {
      setPref('multiline', false);
      display.setAttribute('multiline', false);
      display.setAttribute('rows', 1);
    }
  },
  async addToToolbar () {
    const dropdownArr = await getPref('dropdownArr');
    dropdownArr.push($('#insertText').value);
    setPref('dropdownArr', dropdownArr);
    if (await this.refreshToolbarDropdown()) {
      alert(_('yourItemAdded'));
    } else {
      alert(_('problemAddingToolbarItem'));
    }
  },
  async refreshToolbarDropdown () {
    // SETUP
    const dropdownArr = await getPref('dropdownArr');
    const toolbarbuttonPopup = $('#charrefunicode-toolbar-chars');
    if (!toolbarbuttonPopup) {
      return false;
    }

    // EMPTY OLD CONTENTS
    while (toolbarbuttonPopup.firstChild) {
      toolbarbuttonPopup.firstChild.remove();
    }

    // ADD NEW CONTENTS
    for (const item of dropdownArr) {
      const menuitem = document.createElementNS(xulns, 'menuitem');
      menuitem.setAttribute('label', item);
      menuitem.setAttribute('value', item);
      toolbarbuttonPopup.append(menuitem);
    }
    return true;
  },
  idgen: 0,
  prefs: null,

  // Build these programmatically? (and in UI?)
  /* Pseudo-constants */
  unihanProperties: [
    'AccountingNumeric', 'BigFive', 'CCCII', 'CNS1986', 'CNS1992',
    'Cangjie', 'Cantonese', 'CheungBauer', 'CheungBauerIndex',
    'CihaiT', 'CompatibilityVariant', 'Cowles', 'DaeJaweon', 'EACC', 'Fenn',
    'FennIndex', 'FourCornerCode', 'Frequency', 'GB0', 'GB1', 'GB3', 'GB5',
    'GB7', 'GB8', 'GSR', 'GradeLevel', 'HDZRadBreak', 'HKGlyph', 'HKSCS',
    'HanYu', 'Hangul', 'HanyuPinlu', 'HanyuPinyin', 'IBMJapan', 'IICore',
    'IRGDaeJaweon', 'IRGDaiKanwaZiten', 'IRGHanyuDaZidian', 'IRGKangXi',
    'IRG_GSource', 'IRG_HSource', 'IRG_JSource', 'IRG_KPSource',
    'IRG_KSource', 'IRG_MSource', 'IRG_TSource', 'IRG_USource',
    'IRG_VSource', 'JIS0213', 'JapaneseKun', 'JapaneseOn', 'Jis0', 'Jis1',
    'KPS0', 'KPS1', 'KSC0', 'KSC1', 'KangXi', 'Karlgren', 'Korean', 'Lau',
    'MainlandTelegraph', 'Mandarin', 'Matthews', 'MeyerWempe', 'Morohashi',
    'Nelson', 'OtherNumeric', 'Phonetic', 'PrimaryNumeric', 'PseudoGB1',
    'RSAdobe_Japan1_6', 'RSJapanese', 'RSKanWa', 'RSKangXi', 'RSKorean',
    'RSUnicode', 'SBGY', 'SemanticVariant', 'SimplifiedVariant',
    'SpecializedSemanticVariant', 'TaiwanTelegraph', 'Tang',
    'TotalStrokes', 'TraditionalVariant', 'Vietnamese', 'XHC1983',
    'Xerox', 'ZVariant'
  ],
  UnihanMenus: [], // Unused
  Unicode: [
    'General_Category', 'Canonical_Combining_Class', 'Bidi_Class',
    'Decomposition_Type_and_Mapping', 'Decimal', 'Digit', 'Numeric',
    'Bidi_Mirrored', 'Unicode_1_Name', 'ISO_Comment',
    'Simple_Uppercase_Mapping', 'Simple_Lowercase_Mapping',
    'Simple_Titlecase_Mapping'
  ],
  UnicodeMenus: [
    'General_Category', 'Canonical_Combining_Class', 'Bidi_Class',
    'Bidi_Mirrored', 'Digit', 'Decimal'
  ],

  UnicodeMenuBidi_Class: [
    'L', 'LRE', 'LRO', 'R', 'AL', 'RLE', 'RLO', 'PDF', 'EN', 'ES', 'ET',
    'AN', 'CS', 'NSM', 'BN', 'B', 'S', 'WS', 'ON'
  ],
  // Also 11-36 are automated above
  UnicodeMenuCanonical_Combining_Class: [
    0, 1, 7, 8, 9, 10, 199, 200, 202, 204, 208, 210, 212, 214, 216, 218,
    220, 222, 224, 226, 228, 230, 232, 233, 234, 240
  ],
  UnicodeMenuCCVNumericOnly: [84, 91, 103, 107, 118, 122, 129, 130, 132],
  UnicodeMenuGeneral_Category: [
    'Lu', 'Ll', 'Lt', 'Lm', 'Lo', 'Mn', 'Mc', 'Me', 'Nd', 'Nl', 'No',
    'Pc', 'Pd', 'Ps', 'Pe', 'Pi', 'Pf', 'Po', 'Sm', 'Sc', 'Sk', 'So',
    'Zs', 'Zl', 'Zp', 'Cc', 'Cf', 'Cs', 'Co', 'Cn'
  ],
  UnicodeMenuBidi_Mirrored: ['Y', 'N'],
  UnicodeMenuDigit: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  UnicodeMenuDecimal: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
};
export default unicodecharref;
