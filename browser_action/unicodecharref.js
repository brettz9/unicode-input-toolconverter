/* eslint-disable camelcase -- Temporary */
// See https://unicode.org/Public/UNIDATA/ for data use

import {$$, jml} from '../vendor/jamilih/dist/jml.mjs';
// Todo: Filed the following to avoid both sync and callbacks:
//  https://github.com/101arrowz/fflate/issues/70
import {strFromU8} from '../vendor/fflate/esm/browser.js'; // unzipSync,
import {
  getUnicodeDefaults, getPrefDefaults
} from './preferences/prefDefaults.js';
import {chartBuild, lastStartCharCode} from './chartBuild.js';

import camelCase from '../vendor/camelcase/index.js';
import {insertIntoOrOverExisting} from './utils/TextUtils.js';
import {joinChunks} from './utils/TypedArrayUtils.js';
import {
  placeItem, removeViewChildren, createHTMLElement,
  showProgress, $, $s, $i, $o, $t, $tabbox, $tabpanel
} from './utils/DOMUtils.js';
import getScriptInfoForCodePoint from './unicode/getScriptInfoForCodePoint.js';
import charrefunicodeDb, {UnihanDatabase} from './unicode/charrefunicodeDb.js';
import {getCJKTypeFromHexString} from './unicode/unihan.js';
import unihanDbPopulate from './unicode/unihanDbPopulate.js';
// import parseUnihanFromTextFileStrings from
//   './unicode/parseUnihanFromTextFileStrings.js';
import {registerDTD} from './entityBehaviors.js';
import {entities, numericCharacterReferences} from './entities.js';
import {findBridgeForTargetID} from './charrefConverters.js';

/* eslint-disable jsdoc/reject-any-type -- Arbitrary */
/**
 * @typedef {any} AnyValue
 */
/* eslint-enable jsdoc/reject-any-type -- Arbitrary */

/**
 * @typedef {number} Integer
 */

/** @type {import('intl-dom').I18NCallback<string>} */
let _;

/**
 * @type {InstanceType<ReturnType<
 *   import('./unicode/UnicodeConverter.js').getUnicodeConverter
 * >>}
 */
let charrefunicodeConverter;

/** @type {ReturnType<getUnicodeDefaults>['getPref']} */
let getPref;
/** @type {ReturnType<getUnicodeDefaults>['setPref']} */
let setPref;

/**
 * @param {{
 *   _: import('intl-dom').I18NCallback<string>
 *   charrefunicodeConverter: InstanceType<ReturnType<
 *     import('./unicode/UnicodeConverter.js').getUnicodeConverter
 *   >>
 * }} cfg
 * @returns {void}
 */
export const shareVars = ({_: l10n, charrefunicodeConverter: _uc}) => {
  _ = l10n;
  charrefunicodeConverter = _uc;
  ({getPref, setPref} = getUnicodeDefaults());
};

/**
 * @returns {Promise<Object<string,string[]>>}
 */
async function getDownloadResults () {
  const receivedInfo = await showProgress({
    // 6747669; // 39.5 MB unzipped;
    // url: '/download/unihan/Unihan.zip',
    url: location.href.includes('index-pages')
      /* istanbul ignore next -- For GitHub Pages only */
      ? '/unicode-input-toolconverter/download/unihan/unihan.json'
      : '/download/unihan/unihan.json',
    progressElement: /** @type {HTMLProgressElement} */ (
      $('#progress_element')
    ),
    progress (percentComplete) {
      return `${_('download_progress')} ${
        percentComplete.toFixed(2)
      }${_('percentSign')}`;
    }
  });
  const compressed = joinChunks(receivedInfo);

  return JSON.parse(strFromU8(compressed));

  /*
  // Works but easier to work with generated file over zip

  const decompressedObj = unzipSync(compressed);
  const scriptFileAsStrings = Object.values(decompressedObj).map(
    (decompressed) => {
      return strFromU8(decompressed);
    }
  );

  return parseUnihanFromTextFileStrings(scriptFileAsStrings);
  */
}

const unicodecharref = {
  /** @type {string[]} */
  origents: [],

  /** @type {number[]} */
  origcharrefs: [],

  /** @type {string[]} */
  orignewents: [],

  /** @type {(string|number)[]} */
  orignewcharrefs: [],

  /** @type {UnihanDatabase|null} */
  unihanDatabase: null,

  unihanDb_exists: false,

  async downloadUnihan () {
    $('#DownloadButtonBox').hidden = true;
    $('#DownloadProgressBox').hidden = false;

    try {
      const parsed = await getDownloadResults();

      this.unihanDatabase?.close();
      this.unihanDatabase = await unihanDbPopulate(parsed);

      // Confirm it worked
      await this.unihanDatabase.getUnicodeFields('3400');

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
  /**
   * Unused.
   */
  /*
  makeDropMenuRows (type) {
    const prefix = (type === 'Unihan') ? 'searchk' : 'search';
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
    }
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
            case 'Bidi_Class': {
              const menulist = createXULElement('menulist');
              menulist.className = 'searchMenu';
              const menupopup = createXULElement('menupopup');
              for (let j = 0; j < this['UnicodeMenu' + match].length; j++) {
                const menuitem = createXULElement('menuitem');
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
                for (let j = 11; j <= 36; j++) {
                  // Other Non-Numeric not listed in UnicodeMenuCCVNumericOnly
                  const menuitem = createXULElement('menuitem');
                  menuitem.setAttribute('label', j);
                  menuitem.setAttribute('tooltiptext', j);
                  menuitem.setAttribute('value', j);
                  menupopup.append(menuitem);
                }
                for (
                  let j = 0;
                  j < this['UnicodeMenu' + 'CCVNumericOnly'].length;
                  j++
                ) {
                  const menuitem = createXULElement('menuitem');
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
            } default:
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
  */
  // Fix: Should also create the detailedView and detailedCJKView's
  //  content dynamically (and thus fully conditionally rather than hiding)
  /*
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
  */
  /**
   * @param {...string} els
   */
  setupBoolChecked (...els) {
    els.forEach(async (el) => {
      /** @type {HTMLInputElement} */
      ($('#' + el)).checked = /** @type {boolean} */ (await getPref(el));
    });
  },
  /**
  * @param {object} cfg
  * @param {string|null} [cfg.customProtocol]
  * @param {string|null} [cfg.options]
  * @param {string|null} [cfg.convert]
  * @param {string|null} [cfg.targetid]
  * @param {string} [cfg.selection]
  * @returns {Promise<void>}
  */
  async initialize (cfg) {
    // this.refreshToolbarDropdown(); // redundant?

    this.unihanDb_exists = false;
    try {
      // const namespace = 'unicode-input-toolconverter-Unihan';
      this.unihanDatabase = new UnihanDatabase({
        // name: namespace,
        // We don't peg to package major version as database version may vary
        //  independently
        version: 1
      });
      // Do not update here; just checking if already downloaded
      await this.unihanDatabase.connect();

      // Test Unihan value
      await this.unihanDatabase.getUnicodeFields('3400');

      this.unihanDb_exists = true;
      $('#DownloadButtonBox').hidden = true;
      $('#UnihanInstalled').hidden = false;
    } catch (e) {
      /* istanbul ignore if -- Only expected for transactions */
      if (!(/** @type {Error} */ (e)).message.includes('ransaction')) {
        // eslint-disable-next-line no-console -- Debug
        console.error(e);
      }
      $('#DownloadButtonBox').hidden = false;
      $('#UnihanInstalled').hidden = true;
    }

    // document.documentElement.maxWidth =
    //  window.screen.availWidth-(window.screen.availWidth*1/100);
    $('#unicodeTabBox').style.maxWidth = String(window.screen.availWidth -
      (window.screen.availWidth * 3 / 100));
    $('#unicodeTabBox > .tabs').style.maxWidth = String(
      window.screen.availWidth - (window.screen.availWidth * 3 / 100)
    );
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

    // await this.testIfComplexWindow();

    const [
      lang, font, initialTab, multiline,
      cssWhitespace, tblrowsset, tblcolsset, ampspace,
      DTDtxtbxval
      // outerh, outerw
    ] = await Promise.all([
      /** @type {Promise<string>} */ (getPref('lang')),
      /** @type {Promise<string>} */ (getPref('font')),
      getPref('initialTab'),
      getPref('multiline'),
      getPref('cssWhitespace'),
      getPref('tblrowsset'),
      getPref('tblcolsset'),
      getPref('ampspace'),
      /** @type {Promise<string>} */ (getPref('DTDtextbox'))
      // getPref('outerHeight'),
      // getPref('outerWidth')
    ]);

    if (multiline) {
      const display = $('#displayUnicodeDesc');
      display.replaceWith(jml('textarea', {
        id: 'displayUnicodeDesc',
        rows: 3
      }));
    }

    this.setupBoolChecked(...Object.entries(getPrefDefaults()).filter((
      [, value]
    ) => {
      return typeof value === 'boolean';
    }).map(([key]) => key));
    switch (cssWhitespace) {
    case ' ':
      $s('#CSSWhitespace').selectedIndex = 0;
      break;
    /*
    // Carriage returns shouldn't survive
    case '\r\n':
      $('#CSSWhitespace').selectedIndex = 1;
      break;
    case '\r':
      $('#CSSWhitespace').selectedIndex = 2;
      break;
    */
    case '\n':
      $s('#CSSWhitespace').selectedIndex = 1;
      break;
    case '\t':
      $s('#CSSWhitespace').selectedIndex = 2;
      break;
    case '\f':
      $s('#CSSWhitespace').selectedIndex = 3;
      break;
    /* istanbul ignore next -- Unexpected value */
    default:
      /* istanbul ignore next -- Unexpected value */
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
    await this.resizecells();

    /** @type {HTMLInputElement} */
    ($('#rowsset')).value = String(tblrowsset);
    /** @type {HTMLInputElement} */
    ($('#colsset')).value = String(tblcolsset);

    // Save copies in case decide to reset later (i.e., not append to
    //  HTML entities, then wish to append to them again)

    this.origents = [...entities];
    this.origcharrefs = [...numericCharacterReferences];
    this.orignewents = [...charrefunicodeConverter.newents];
    this.orignewcharrefs = [...charrefunicodeConverter.newcharrefs];

    $i('#lang').value = lang;
    $i('#font').value = font;

    $s('#initialTab').value = $o('#mi_' + initialTab).value;

    /** @type {HTMLTextAreaElement} */
    ($('#DTDtextbox')).value = DTDtxtbxval;
    await registerDTD();

    // These defaults are necessary for the sake of the options URL
    //  (when called from addons menu)
    let toconvert = null;

    /** @type {string|null|undefined} */
    let targetid = '';
    // const targetid = 'context-launchunicode';

    // Todo: Check first for our custom protocol
    const {customProtocol} = cfg;
    // Fix: the initial portion of this handling really should be inside
    //  the protocol handler, but that requires implementing the object to
    //  add arguments
    let unicodeQueryObj;
    let chr;
    let bridgeResult;
    // Will be passed a query string if a protocol handler has been triggered
    if (customProtocol) {
      // Skip over the initial question mark too
      const req = new URL(customProtocol);
      const queryType = req.pathname;
      unicodeQueryObj = req.searchParams;
      switch (queryType) {
      case 'find':
        chr = unicodeQueryObj.get('char');
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
        alert(
          _('Unrecognized_query_type')
        );
      }
    } else if (!cfg.options) {
      // Do nothing here for options dialog
      toconvert = cfg.convert || '';
      ({targetid} = cfg);
      //  toconvert = charreftoconvert.replace(/\n/g, ' ');
      $t('#toconvert').value = toconvert;

      if (ampspace) {
        toconvert = toconvert.replaceAll(/&([^;\s]*\s)/gv, '&amp;$1');
      }

      if (targetid) {
        bridgeResult = await findBridgeForTargetID({toconvert, targetid, _});
      }
    }

    // Detect which context menu item was selected:
    let out = ''; // converttypeid;

    if (
      // bridgeResult !== false &&
      bridgeResult !== undefined
    ) {
      out = bridgeResult;
    } else {
      switch (targetid) {
      case 'context-unicodechart':
        await this.disableEnts();
        $i('#startset').value = String(chr);
        $tabbox('#unicodeTabBox').$selectTabForTabPanel($tabpanel('#charts'));
        // Fallthrough
      case 'context-launchunicode':
      case 'tools-charrefunicode':
        // out = '';
        break;
      case 'searchName':
        $i('#' + targetid).value = String(unicodeQueryObj?.get('string'));
        $('#' + targetid).focus();
        await this.searchUnicode({
          id: targetid, value: String(unicodeQueryObj?.get('string'))
        }); // Assume non-CJK
        break;
      case 'searchkDefinition':
        $i('#' + targetid).value = String(unicodeQueryObj?.get('string'));
        $i('#' + targetid).focus();
        await this.searchUnihan({
          id: targetid, value: String(unicodeQueryObj?.get('string'))
        });
        break;
      default:
        // out = ''; // Plain launcher with no values sent
        // const prefstab = true;
        break;
      }
    }
    $t('#converted').value = out;

    if (!customProtocol) {
      if (cfg.options) { // options menu
        $tabbox('#unicodeTabBox').$selectTabForTabPanel($tabpanel('#prefs'));
      } else if (toconvert !== null && targetid) {
        // Keyboard invocation or button
        // $('#unicodetabs').selectedIndex = 0; // Fix: set by preference
        $tabbox('#unicodeTabBox').$selectTabForTabPanel(
          $tabpanel('#conversion')
        );
      } else if (
        targetid !== 'context-unicodechart' &&
        targetid !== 'tools-charrefunicode'
      ) {
        $tabbox('#unicodeTabBox').$selectTabForTabPanel(
          $tabpanel('#' + initialTab)
        );
      }
    }

    if (targetid !== 'searchName' && targetid !== 'searchkDefinition') {
      if (toconvert || chr) { // Seemed to become necessarily suddenly
        await this.setCurrstartset(
          /** @type {number} */ (
            /** @type {string} */
            (toconvert || chr).codePointAt(0)
          ) - 1
        );
      }
      await chartBuild();
    }
    this.tblfontsize(0); // Draw with the preferences value

    /*
    if (converttypeid != 0) {
      $(converttypeid).className='buttonactive';
    }
    */

    /*
    // Disabling for now
    // Set window size to that set last time hit "ok"
    if (outerh > 0) {
      window.resizeTo(window.outerWidth, outerh);
    }
    if (outerw > 0) {
      window.resizeTo(outerw, window.outerHeight);
    }

    window.addEventListener('resize', async (e) => {
      await setPref('outerHeight', window.outerHeight);
      await setPref('outerWidth', window.outerWidth);
    });
    */
  },
  /**
   * @param {string} sel
   */
  async copyToClipboard (sel) {
    const text = $t(sel).value;
    await navigator.clipboard.writeText(text);
    alert(_('copiedToClipboard'));
  },
  /**
   * @param {{target: {type: string, id: string, value: string}}} e
   */
  async setprefs (e) {
    // eslint-disable-next-line prefer-destructuring -- TS
    const target = /** @type {HTMLInputElement} */ (e.target);
    switch (target.type) {
    case 'select-one': case 'text':
      return await setPref(
        target.id,
        target.value
      );
    case 'checkbox':
      return await setPref(target.id, Boolean(target.checked));
    /*
    // Should work but not in use
    case 'radio': {
      let radioid;
      const result = target.id.match(/^_(\d)+-(.*)$/u);
      if (result !== null) {
        radioid = result[2]; // Extract preference name
        return await setPref(radioid, result[1] === '1');
      }
      break;
    }
    */
    /* istanbul ignore next -- Just a guard */
    default:
      /* istanbul ignore next -- Just a guard */
      break;
    }
    /* istanbul ignore next -- Just a guard */
    return undefined;
  },
  async resetdefaults () {
    // Todo: Change to programmatic setting
    // If make changes here, also change the default/preferences
    //  charrefunicode.js file
    await this.setBoolChecked([
      'asciiLt128', 'showImg', 'xhtmlentmode', 'hexLettersUpper', 'multiline'
    ], false);
    await this.setBoolChecked([
      'xmlentkeep', 'ampkeep', 'appendtohtmldtd', 'cssUnambiguous'
    ], true);

    $i('#ampspace').checked = false;
    // $('#showComplexWindow').checked = false;
    $i('#showAllDetailedView').checked = true;
    $i('#showAllDetailedCJKView').checked = true;

    /**
    * @param {string} langOrFont
    * @returns {Promise<string>}
    */
    async function langFont (langOrFont) { // Fix: needs to get default!
      const deflt = /** @type {string} */ (await getPref(langOrFont));
      $i('#' + langOrFont).value = deflt;
      await setPref(langOrFont, deflt);
      return deflt;
    }
    $('#chart_table').lang = await langFont('lang');

    $('#insertText').style.fontFamily = await langFont('font');
    // Form elements don't inherit, so find these manually
    $$('#chart_table button[name="unicode"]').forEach(async (button) => {
      button.style.fontFamily = await langFont('font');
    });

    // await setPref('hexstyleLwr', true);
    // $(EXT_BASE + 'hexstyleLwr').selectedIndex = 0;

    await setPref('fontsizetextbox', 13);
    this.fontsizetextbox(0);

    /*
    Easy enough to manually remove DTD -- wouldn't want to lose that data
    await setPref('DTDtextbox', '');
    $('#DTDtextbox').value = '';
    */

    // Don't really need to reset since user can't currently change
    //  this (only for blank string entry)
    await setPref(
      'startset', /** @type {number} */ ('a'.codePointAt(0)) - 1
    );

    await this.setCurrstartset(
      /** @type {number} */ (await getPref('startset'))
    );

    // These get activated in chartBuild(); below
    await setPref('tblrowsset', 4);
    $i('#rowsset').value = '4';
    await setPref('tblcolsset', 3);
    $i('#colsset').value = '3';

    await this.setBoolChecked([
      'entyes', 'hexyes', 'decyes', 'unicodeyes', 'buttonyes'
    ], true);
    await this.setBoolChecked([
      'onlyentsyes', 'startCharInMiddleOfChart'
    ], false);

    // await setPref('xstyle', 'x');
    // $('#xstyle').checked = true;

    await setPref('initialTab', 'charts');
    $s('#initialTab').value = $o('#mi_charts').value;

    await setPref('tblfontsize', 13);
    await this.resizecells();

    await chartBuild();
    await Promise.all([
      setPref('outerHeight', 0),
      setPref('outerWidth', 0)
    ]);
  },

  /**
   * Set a boolean preference (and its checked state in the interface) to
   * a given boolean value.
   * @param {string|string[]} els The element ID string or strings which
   *   should have their values set
   * @param {boolean} value The value for the preference and checked state
   */
  async setBoolChecked (els, value) {
    els = typeof els === 'string' ? [els] : els;
    return await Promise.all(els.map(async (el) => {
      await setPref(el, value);
      $i('#' + el).checked = value;
    }));
  },

  // End UI bridges

  /**
   * @param {{target: {type: string, id: string, value: string}}} e
   */
  async setImagePref (e) {
    await this.setprefs(e);
    if ($('#unicodeImg').firstChild) {
      $('#unicodeImg').firstChild?.remove();
    }
    return false;
  },

  /**
   * @param {string} kent
   * @param {string} khextemp
   */
  async getUnicodeDescription (kent, khextemp) {
    const hideMissing = !(await getPref('showAllDetailedView'));
    const hideMissingUnihan = !(await getPref('showAllDetailedCJKView'));
    const {
      unihanType, hangul, cjkText, searchValue
    } = getCJKTypeFromHexString({khextemp, _});

    if (
      !unihanType && !hangul &&
      $tabbox('#viewTabs').$selectedTab() === $('#detailedCJKView')
    ) {
      $tabbox('#viewTabs').$selectTabForTabPanel(
        $tabpanel('#detailedView')
      );
    }

    const kdectemp = Number.parseInt(khextemp, 16);
    const {
      codePointStart, script, plane, privateuse, surrogate
    } = getScriptInfoForCodePoint(kdectemp, _);

    // Todo: Make reactive!
    if (!unihanType) {
      for (
        let i = 0;
        i < unicodecharref.Unihan.length;
        i++
      ) {
        if (i === this.kDefinitionIndex) {
          continue;
        }
        $t('#_detailedCJKView' + i).value = '';
      }
      for (const prop of this.Unihan) {
        // eslint-disable-next-line @stylistic/max-len -- Long
        /* istanbul ignore next -- May not be generated based on `showComplexWindow` */
        if ($i('#searchk' + prop)) {
          $i('#searchk' + prop).value = '';
        }
      }
    }

    let result;
    try {
      await charrefunicodeDb.connect();

      const results = await charrefunicodeDb.getUnicodeFields(searchValue);

      /* istanbul ignore else -- Should have thrown if no result */
      if (results) {
        result = cjkText ||
          // We had obtained Jamo from Jamo.txt and showed it in parentheses,
          //  but it seems this is now included in UnicodeData.txt as we
          //  import into our database.
          // if (kdectemp >= 0x1100 && kdectemp < 0x1200) {
          results.name;
        for (const [i, unicodeField] of unicodecharref.Unicode.entries()) {
          // Fix: display data more readably, etc.
          const camelizedField = camelCase(unicodeField);
          // console.log('camelizedField', camelizedField);
          let temp = results[camelizedField];
          if (unicodeField === 'Unicode_1_Name') {
            if (temp) {
              result += ';\u00A0\u00A0\u00A0\u00A0\n' +
                _('searchUnicode_1_Name') + _('colon') + ' ' + temp;
            }
            continue;
          }
          if (temp) {
            if (hideMissing) {
              /** @type {HTMLElement} */
              ($('#_detailedView' + i).parentNode).hidden = false;
            }
            switch (unicodeField) {
            case 'General_Category':
              temp = _('General_Category' + temp);
              break;
            case 'Canonical_Combining_Class':
              if (Number(temp) < 11 || Number(temp) > 132) {
                // 199, 200, 204, 208, 210, 212 do not have members yet and
                //  others from 11 to 132 do not have name listed
                temp = _('Canonical_Combining_Class' + temp);
              }
              break;
            case 'Bidi_Class':
              temp = _('Bidi_Class' + temp);
              break;
            case 'Bidi_Mirrored':
              temp = (temp === 'Y')
                ? _('Bidi_MirroredY')
                : _('Bidi_MirroredN'); // Only two choices
              break;
            case 'numericType': {
              const view = $('#_detailedView' + i);
              removeViewChildren(i);
              jml('select', [
                'None',
                'Decimal',
                'Digit',
                'Numeric'
              // eslint-disable-next-line no-loop-func -- Not an issue
              ].map((value) => {
                return [
                  'option',
                  temp === value
                    ? {
                      selected: true
                    }
                    : {},
                  [
                    _(value)
                  ]
                ];
              }), view);
              break;
            }
            case 'decompositionMapping':
            case 'Simple_Uppercase_Mapping':
            case 'Simple_Lowercase_Mapping':
            case 'Simple_Titlecase_Mapping': {
              const a = createHTMLElement('a');
              // eslint-disable-next-line no-script-url -- This is controlled
              a.href = 'javascript:void(0)';

              a.addEventListener(
                'click',
                async (e) => {
                  await unicodecharref.startset({
                    value: /** @type {HTMLElement} */ (
                      e.target
                    ).textContent
                  });
                  // Probably want to start checking again since
                  //   move to new page
                  // that.noGetDescripts = false;
                }
              );
              const tempno = Number.parseInt(temp, 16);
              a.textContent = String.fromCodePoint(tempno);
              a.className = 'text-link';
              const view = $('#_detailedView' + i);
              removeViewChildren(i);

              const box = createHTMLElement('span');
              box.append(a);
              box.append(' (' + temp + ')');
              view.append(box);

              // alert(new XMLSerializer().serializeToString(view));
              break;
            } default:
              break;
            }
            // Not casing
            if (
              !unicodeField.includes('case_Mapping') &&
              unicodeField !== 'decompositionMapping'
            ) {
              $i('#_detailedView' + i).value = temp;
            }
          // Not casing
          } else if (
            !unicodeField.includes('case_Mapping') &&
            unicodeField !== 'decompositionMapping'
          ) {
            /** @type {HTMLElement} */
            ($i('#_detailedView' + i).parentNode).hidden = hideMissing;
            $i('#_detailedView' + i).value = '';
          } else {
            /** @type {HTMLElement} */
            ($i('#_detailedView' + i).parentNode).hidden = hideMissing;
            removeViewChildren(i);
          }
        }
      }

      if (!unihanType) {
        $t('#displayUnicodeDesc').value = kent +
          'U+' + khextemp + _('colon') + ' ' + result;
        $t('#displayUnicodeDesc2').value = kent +
          'U+' + khextemp + _('colon') + ' ' + result;
      }
    } catch {
      if (surrogate) {
        $t('#displayUnicodeDesc').value = kent +
          'U+' + khextemp + _('colon') + ' ' + surrogate;
        $t('#displayUnicodeDesc2').value = kent +
          'U+' + khextemp + _('colon') + ' ' + surrogate;
      } else if (privateuse) {
        $t('#displayUnicodeDesc').value = kent +
          'U+' + khextemp + _('colon') + ' ' + _('Private_use_character');
        $t('#displayUnicodeDesc2').value = kent +
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
        (kdectemp >= 0xEFFFE && kdectemp <= 0xEFFFF)
        /*
        // Also surrogates
        (kdectemp >= 0xFFFFE && kdectemp <= 0xFFFFF) ||
        (kdectemp >= 0x10FFFE && kdectemp <= 0x10FFFF)
        */
      ) {
        $t('#displayUnicodeDesc').value = kent +
          'U+' + khextemp + _('colon') + ' ' + _('Noncharacter');
        $t('#displayUnicodeDesc2').value = kent +
          'U+' + khextemp + _('colon') + ' ' + _('Noncharacter');
      } else {
        const notfoundval = 'U+' + khextemp + _('colon') + ' ' + _('Not_found');
        $t('#displayUnicodeDesc').value = notfoundval;
        $t('#displayUnicodeDesc2').value = notfoundval;
      }
      for (const [j, unicodeField] of unicodecharref.Unicode.entries()) {
        if (unicodeField === 'Unicode_1_Name') {
          continue;
        }
        try {
          $i('#_detailedView' + j).value = '';
          /** @type {HTMLElement} */
          ($('#_detailedView' + j).parentNode).hidden = hideMissing;
          removeViewChildren(j);
        /* istanbul ignore next -- Debugging */
        } catch (err) {
          /* eslint-disable no-console -- Debugging */
          /* istanbul ignore next -- Debugging */
          console.log('3' + err + j);
          /* eslint-enable no-console -- Debugging */
        }
      }
    }
    // const canreturn = true;

    if (this.unihanDb_exists) {
      try {
        // $('#displayUnicodeDesc').value= _('retrieving_description');
        const results = await this.unihanDatabase?.getUnicodeFields(khextemp);
        if (results) {
          // Fix: display data more readably, with heading, etc. (and
          //   conditional)
          result = results[this.kDefinitionIndex];

          // Fix: Display meta-data in table (get to be stable by
          //   right-clicking)
          for (
            let i = 0;
            i < unicodecharref.Unihan.length;
            i++
          ) {
            if (i === this.kDefinitionIndex) {
              continue;
            }
            let temp;
            try {
              // Fix: display data more readably, etc.
              temp = results[i];
            /* istanbul ignore next -- Debugging */
            } catch {
              /* istanbul ignore next -- Debugging */
              alert(i);
            }
            if (temp) {
              if (hideMissingUnihan) {
                /** @type {HTMLElement} */
                ($('#_detailedCJKView' + i).parentNode).hidden = false;
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
              $i('#_detailedCJKView' + i).value = temp;
            } else {
              /** @type {HTMLElement} */
              ($i('#_detailedCJKView' + i).parentNode).hidden =
                hideMissingUnihan;
              $i('#_detailedCJKView' + i).value = '';
            }
          }
        }

        if (result !== '' && result !== null && result !== undefined) {
          // Commenting out to show general category under definition
          // $('#displayUnicodeDesc2').value = kent +
          //   'U+' + khextemp + _('colon')+' ' + result;
          $t('#displayUnicodeDescUnihan').value = kent +
            'U+' + khextemp + _('colon') + ' ' + result;
          $t('#displayUnicodeDesc').value = kent +
            'U+' + khextemp + _('colon') + ' ' + result;
          $t('#displayUnicodeDesc2').value = kent +
            'U+' + khextemp + _('colon') + ' ' + result;
        } else {
          const notfoundval = 'U+' + khextemp + _('colon') + ' ' +
            _('Not_found');

          if (!cjkText || hangul) {
            for (const [j, unicodeField] of unicodecharref.Unicode.entries()) {
              if (unicodeField === 'Unicode_1_Name') {
                continue;
              }
              try {
                $i('#_detailedView' + j).value = '';
                /** @type {HTMLElement} */
                ($i('#_detailedView' + j).parentNode).hidden = hideMissing;
                removeViewChildren(j);
              /* istanbul ignore next -- Debugging */
              } catch (e) {
                /* istanbul ignore next -- Debugging */
                alert('1' + e + j);
              }
            }
            for (
              let i = 0;
              i < unicodecharref.Unihan.length;
              i++
            ) {
              if (i === this.kDefinitionIndex) {
                continue;
              }
              /** @type {HTMLElement} */
              ($('#_detailedCJKView' + i).parentNode).hidden =
                hideMissingUnihan;
              $i('#_detailedCJKView' + i).value = '';
            }
          }

          if (!cjkText) {
            $i('#displayUnicodeDesc').value = notfoundval;
            $i('#displayUnicodeDescUnihan').value = notfoundval;
            $i('#displayUnicodeDesc2').value = notfoundval;
          } else {
            const finalval = kent +
              'U+' + khextemp + _('colon') + ' ' + cjkText +
              (hangul
                ? ''
                : ' ' + _('left_parenth') + _('No_definition') +
                  _('right_parenth'));
            $i('#displayUnicodeDesc').value = finalval;
            $i('#displayUnicodeDesc2').value = finalval;
            $i('#displayUnicodeDescUnihan').value = finalval;
            // $('#displayUnicodeDesc2').value = notfoundval;
          }
        }
      /* istanbul ignore next -- Debugging */
      } catch (e) {
        /* istanbul ignore next -- Debugging */
        alert(e);
      }
      // return;
    } // Excised Ajax code...

    if (
      this.unihanDb_exists && unihanType &&
      $tabbox('#viewTabs').$selectedTab() === $('#detailedView')
    ) {
      $tabbox('#viewTabs').$selectTabForTabPanel($tabpanel('#detailedCJKView'));
    }

    const alink = createHTMLElement('a');
    alink.target = '_blank';
    alink.className = 'text-link';
    alink.href = `https://unicode.org/charts/PDF/U${codePointStart}.pdf`;
    alink.textContent = script + ' (PDF)';

    // Handle PDF link
    placeItem('#pdflink', alink);

    // Handle plane #
    const planeText = _('plane_num', {plane}) + '\u00A0';
    placeItem('#plane', planeText);

    if (await getPref('showImg')) {
      const img = createHTMLElement('img');
      // img.width = '80';
      // img.height = '80';
      img.setAttribute('src', 'https://unicode.org/cgi-bin/refglyph?1-' + Number(kdectemp).toString(16));
      placeItem('#unicodeImg', img);
    }
  },
  /**
   * @param {number} size
   */
  async fontsizetextbox (size) { // Changes font-size
    const txtbxsize = /** @type {number} */ (
      await getPref('fontsizetextbox')
    ) + size;
    await setPref('fontsizetextbox', txtbxsize);

    $('#toconvert').style.fontSize = txtbxsize + 'px';
    $('#converted').style.fontSize = txtbxsize + 'px';

    /* istanbul ignore next -- Firefox only */
    if (size > 0 && 'sizeToContent' in globalThis) {
      // On Mac at least, resizing for reducing font size, causes button to
      // go off screen
      // @ts-expect-error Firefox only
      globalThis.sizeToContent();
    }
  },
  /**
   * @param {number} size
   */
  async tblfontsize (size) { // Changes font-size of chart table cells
    const fsize = /** @type {number} */ (await getPref('tblfontsize')) + size;
    // const tds = createHTMLElement('td');
    await setPref('tblfontsize', fsize);
    await this.resizecells({sizeToContent: size > 0});
  },
  /**
   * @param {{sizeToContent?: boolean}} cfg
   */
  async resizecells ({sizeToContent} = {}) {
    await Promise.all($$(
      "*[name='dec'],*[name='hex'],*[name='unicode']"
    ).map(async (control) => {
      control.style.fontSize =
        await getPref('tblfontsize') + 'px';
    }));
    $('#insertText').style.fontSize =
      await getPref('tblfontsize') + 'px';
    // $('#displayUnicodeDesc').style.fontSize =
    //   await getPref('tblfontsize') + 'px';

    /* istanbul ignore next -- Firefox only */
    if (sizeToContent && 'sizeToContent' in globalThis) {
      // On Mac at least, resizing for reducing font size, causes button to
      // go off screen
      // @ts-expect-error Firefox only
      globalThis.sizeToContent();
    }
  },
  /**
   * @param {{target: {type: string, id: string, value: string}}} e
   */
  async hexLettersCasing (e) {
    await this.setprefs(e);
    await chartBuild();
    return await this.resizecells();
  },
  /**
   * @param {{target: {type: string, id: string, value: string}}} e
   */
  async flip (e) {
    await this.setCurrstartset(lastStartCharCode);
    await this.setprefs(e);
    await chartBuild();
    return await this.resizecells();
  },
  /**
   * @param {{target: {type: string, id: string, value: string}}} e
   */
  async onlyentsyesflip (e) {
    return await this.flip(e);
  },
  /**
   * @param {{target: {type: string, id: string, value: string}}} e
   */
  async hexflip (e) {
    return await this.flip(e);
  },
  /**
   * @param {{target: {type: string, id: string, value: string}}} e
   */
  async decflip (e) {
    return await this.flip(e);
  },
  /**
   * @param {{target: {type: string, id: string, value: string}}} e
   */
  async unicodeflip (e) {
    return await this.flip(e);
  },
  /**
   * @param {{target: {type: string, id: string, value: string}}} e
   */
  async middleflip (e) {
    return await this.flip(e);
  },
  /**
   * @param {{target: {type: string, id: string, value: string}}} e
   */
  async buttonflip (e) {
    return await this.flip(e);
  },
  /**
   * @param {{target: {type: string, id: string, value: string}}} e
   */
  async entflip (e) {
    return await this.flip(e);
  },
  /**
   * @param {{target: {type: string, id: string, value: string}}} e
   */
  async cssWhitespace (e) {
    let {value} = e.target;
    // Escape \r since \r may be lost?
    switch (value) {
    case 'space':
      value = ' ';
      break;
    /*
    case 'rn':
      value = '\r\n';
      break;
    case 'r':
      value = '\r';
      break;
    */
    case 'n':
      value = '\n';
      break;
    case 't':
      value = '\t';
      break;
    case 'f':
      value = '\f';
      break;
    /* istanbul ignore next -- Guard */
    default:
      /* istanbul ignore next -- Guard */
      throw new Error('Unexpected menu value');
    }
    await setPref('cssWhitespace', value);
  },
  /* async xstyleflip () {
    await this.setCurrstartset(lastStartCharCode);
    const currxstyle = 'x';
    const prevxstyle = await getPref('xstyle');
    if (prevxstyle === 'x') {
      currxstyle = 'X';
    }
    await setPref('xstyle', currxstyle);
    return await chartBuild();
  }, */
  /**
   * @param {{target: {type: string, id: string, value: string}}} e
   */
  async rowsset (e) {
    await this.setCurrstartset(lastStartCharCode);
    if (e.target.value !== null && e.target.value !== '') {
      await setPref('tblrowsset', e.target.value);
    }
    await chartBuild();
    return await this.resizecells();
  },
  /**
   * @param {{target: {type: string, id: string, value: string}}} e
   */
  async colsset (e) {
    await this.setCurrstartset(lastStartCharCode);
    if (e.target.value !== null && e.target.value !== '') {
      await setPref('tblcolsset', e.target.value);
    }
    await chartBuild();
    return await this.resizecells();
  },

  /**
   * @param {{value: string}} tbx
   * @param {boolean} [descripts]
   * @returns {Promise<void>}
   */
  async startset (tbx, descripts) {
    /**
     * @param {string} str
     * @returns {Integer}
     */
    function convert (str) {
      str = str.replace(/;$/v, '');
      const hexInit = str.match(/^&?#?x/v);
      if (hexInit) {
        return Number.parseInt(str.slice(hexInit[0].length), 16) - 1;
      }
      const decInit = str.match(/^&?#/v);
      if (decInit) {
        return Number.parseInt(str.slice(decInit[0].length)) - 1;
      }
      return /** @type {number} */ (str.codePointAt(0)) - 1;
    }
    await this.disableEnts();
    const data = tbx.value !== null &&
      tbx.value !== undefined &&
      tbx.value !== ''
      ? convert(tbx.value)
      : /** @type {number} */ (
        (
          /** @type {string} */ (await getPref('startset')) || 'a'
        ).codePointAt(0)
      ) - 1;
    await this.setCurrstartset(data);

    await chartBuild({descripts});
    return await this.resizecells();
  },
  /**
   * Sets a value in preferences at which the Unicode chart view will
   * begin on next start-up.
   * @param {Integer} value The value to which to set the current
   *   starting value
   */
  async setCurrstartset (value) {
    /* istanbul ignore if -- Guard */
    if (typeof value !== 'number') {
      const err = /** @type {Error & {value: AnyValue}} */ (
        new Error('Bad value')
      );
      err.value = value;
      // eslint-disable-next-line no-console -- Debugging
      console.error(err);
      alert(
        'Look at trace to see where setting ' +
        '`currentStartCharCode` as undefined'
      );
    }

    return await setPref('currentStartCharCode', value);
  },
  // Unused
  // Some of these defaults may become irrelevant due to the
  //  /default/preferences/charrefunicode.js file's settings
  /*
  async k (setval) {
    return await this.setCurrstartset(setval);
  },
  */
  async chartBuildResize () {
    await chartBuild();
    return await this.resizecells();
  },
  /**
   * @param {{id: string, value: string}} obj
   */
  async searchUnihan (obj) {
    return await this.searchUnicode(obj, 'Unihan');
  },
  async disableEnts () {
    return await this.setBoolChecked('onlyentsyes', false);
  },
  /**
   * @param {{id: string, value: string}} obj
   * @param {string} [table]
   * @param {boolean} [nochart]
   * @param {boolean} [strict]
   */
  async searchUnicode (obj, table, nochart, strict) { // Fix: allow Jamo!
    await charrefunicodeConverter.searchUnicode(obj, table, nochart, strict);
    if (!nochart) {
      const tmp = await getPref('currentStartCharCode');
      this.startset(obj, true); // Could remember last description (?)
      // Set it back as it was before the search
      await this.setCurrstartset(/** @type {number} */ (tmp));
      this.resizecells();
    }
    // Doesn't work since name_desc_val is search value, not first
    //  result value (we could remember the last search and whether it
    //  were a search, however); we need to be careful, however, since
    //  some searches run automatically on start-up
    /* if (name_desc === 'Name' || name_desc === 'kDefinition') {
      await this.setCurrstartset(name_desc_val.codePointAt(0) - 1);
    } */
  },
  /**
   * @param {string} movedSel
   */
  moveoutput (movedSel) {
    const insertText = $i(movedSel);
    $tabbox('#unicodeTabBox').$selectTabForTabPanel($tabpanel('#conversion'));
    $t('#toconvert').value = insertText.value;
  },
  /**
   * @param {{target: {type: string, id: string, value: string}}} e
   */
  async append2htmlflip (e) {
    await this.setprefs(e);
    await registerDTD(); // (in case DTD not also changed, still need to reset)
    await chartBuild();
    await this.resizecells();
  },
  /*
   * @ todo Unused
   * Sets the preference for whether to display the chosen character
   * in the middle of the chart (or beginning).
   * @ param {boolean} bool Whether to set to true or not
   */
  /*
  async startCharInMiddleOfChart (bool) {
    // Commented this out because while it will always change (unlike
    //   now), the value will be misleading
    // $(EXT_BASE + 'startCharInMiddleOfChart').checked = bool;
    return await setPref('startCharInMiddleOfChart', bool);
  },
  */
  insertent () {
    insertIntoOrOverExisting({
      textReceptacle: $t('#DTDtextbox'),
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
   */
  async multiline () {
    const display = $('#displayUnicodeDesc');
    if (await getPref('multiline') === false) {
      await setPref('multiline', true);
      display.replaceWith(jml('textarea', {
        id: 'displayUnicodeDesc',
        rows: 3
      }));
    } else {
      await setPref('multiline', false);
      display.replaceWith(jml('input', {
        id: 'displayUnicodeDesc',
        rows: 1
      }));
    }
  },
  /*
  async addToToolbar () {
    const dropdownArr = await getPref('dropdownArr');
    dropdownArr.push($('#insertText').value);
    await setPref('dropdownArr', dropdownArr);
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
      jml('option', {
        value: item
      }, [item], toolbarbuttonPopup);
    }
    return true;
  },
  */
  idgen: 0,
  prefs: null,

  // Build these programmatically? (and in UI?)
  /* Pseudo-constants */
  Unihan: [ // Ordered by database array; todo: rpplace above `Unihan`?
    'kAccountingNumeric', 'kAlternateTotalStrokes', 'kBigFive', 'kCangjie',
    'kCantonese', 'kCCCII', 'kCheungBauer', 'kCheungBauerIndex', 'kCihaiT',
    'kCNS1986', 'kCNS1992', 'kCompatibilityVariant', 'kCowles', 'kDaeJaweon',
    'kDefinition', 'kEACC', 'kFenn', 'kFennIndex', 'kFourCornerCode',
    'kFrequency', 'kGB0', 'kGB1', 'kGB3', 'kGB5', 'kGB7', 'kGB8',
    'kGradeLevel', 'kGSR', 'kHangul', 'kHanYu', 'kHanyuPinlu',
    'kHanyuPinyin', 'kHDZRadBreak', 'kHKGlyph', 'kHKSCS', 'kIBMJapan',
    'kIICore', 'kIRG_GSource', 'kIRG_HSource', 'kIRG_JSource',
    'kIRG_KPSource', 'kIRG_KSource', 'kIRG_MSource', 'kIRG_SSource',
    'kIRG_TSource', 'kIRG_UKSource', 'kIRG_USource', 'kIRG_VSource',
    'kIRGDaeJaweon', 'kIRGDaiKanwaZiten', 'kIRGHanyuDaZidian',
    'kIRGKangXi', 'kJa', 'kJapaneseKun', 'kJapaneseOn', 'kJinmeiyoKanji',
    'kJis0', 'kJis1', 'kJIS0213', 'kJoyoKanji', 'kKangXi', 'kKarlgren',
    'kKorean', 'kKoreanEducationHanja', 'kKoreanName', 'kKPS0', 'kKPS1',
    'kKSC0', 'kKSC1', 'kLau', 'kMainlandTelegraph', 'kMandarin',
    'kMatthews', 'kMeyerWempe', 'kMorohashi', 'kNelson', 'kOtherNumeric',
    'kPhonetic', 'kPrimaryNumeric', 'kPseudoGB1', 'kRSAdobe_Japan1_6',
    'kRSKangXi', 'kRSUnicode', 'kSBGY', 'kSemanticVariant',
    'kSimplifiedVariant', 'kSpecializedSemanticVariant', 'kSpoofingVariant',
    'kStrange', 'kTaiwanTelegraph', 'kTang', 'kTGH', 'kTGHZ2013',
    'kTotalStrokes', 'kTraditionalVariant', 'kUnihanCore2020',
    'kVietnamese', 'kXerox', 'kXHC1983', 'kZVariant'
  ],
  UnihanMenus: [], // Unused
  Unicode: [
    'General_Category', 'Canonical_Combining_Class', 'Bidi_Class',
    // We broke it up into two parts for easier viewing
    // 'Decomposition_Type_and_Mapping',
    'decompositionMapping',
    'decompositionType',
    // We broke this up for more convenient querying/display
    /*
    'Decimal',
    'Digit',
    'Numeric',
    */
    'numericType',
    'numericValue',
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
  UnicodeMenuDecimal: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  kDefinitionIndex: -1
};

unicodecharref.kDefinitionIndex = unicodecharref.Unihan.indexOf('kDefinition');

export default unicodecharref;
