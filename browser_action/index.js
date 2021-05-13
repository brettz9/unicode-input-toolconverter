/* globals jQuery -- No ESM */
import {$} from '../vendor/jamilih/dist/jml-es.js';
import {i18n} from '../vendor/i18n-safe/index-es.js';
import {makeTabBox} from './templatesElementCustomization/widgets.js';
import addMillerColumnPlugin from '../node_modules/miller-columns/dist/index-es.js'; // Todo: Switch to vendor version
import getBuildChart, {buildChart} from './build-chart.js';
import insertIntoOrOverExisting from './templatesElementCustomization/insertIntoOrOverExisting.js';
import {getUnicodeDefaults, setPrefDefaultVars} from './preferences/prefDefaults.js';
import {getUnicodeConverter} from './unicode/UnicodeConverter.js';
import Unicodecharref, {shareVars as uresultsShareVars} from './uresults.js';
import {insertEntityFile, shareVars as entityShareVars} from './entities.js';
import {convertEncoding} from './charset-converters.js';
import indexTemplate from './templates/index.js';
import {
  shareVars as charrefConverterShareVars, classChange as charrefClassChange
} from './charref-converters.js';

(async () => { // eslint-disable-line padded-blocks -- Ugly

// SETUP
const lang = new URL(location).searchParams.get('lang');
const locales = lang ? [lang] : [...navigator.languages]; // ['sv-SE']; // ['pt-BR']; // ['hu-HU'];
const engPos = locales.indexOf('en-US');
if (engPos > -1) {
  locales[engPos] = 'en'; // Optimize for English (and avoid console errors)
}
if (!locales.includes('en')) { // Ensure there is at least one working language!
  locales.push('en');
}

const [_] = await Promise.all([
  i18n({locales, defaults: false, localesBasePath: '../'}),
  addMillerColumnPlugin(jQuery, {stylesheets: [
    // Per our widget "standard", allow for injecting of others
    ['/icons/openWindow24.png', {favicon: true}],
    'styles/unicode-dialog.css',
    '/vendor/miller-columns/miller-columns.css'
  ]})
]);

setPrefDefaultVars({_});
const charrefunicodeConverter = new (getUnicodeConverter())({_});
uresultsShareVars({_, charrefunicodeConverter});
entityShareVars({charrefunicodeConverter});
charrefConverterShareVars({charrefunicodeConverter});

const {setPref} = getUnicodeDefaults();

// TEMPLATE
// Todo: Disabling for now as slows down loading
const fonts = []; // await (await fetch('/fonts')).json();
indexTemplate({_, fonts});

// ADD BEHAVIORS
makeTabBox('.tabbox');

await getBuildChart({
  _,
  charrefunicodeConverter,
  textReceptacle: $('#insertText'),
  chartContainer: $('#chartContainer'),
  // Todo: Get working
  insertText ({textReceptacle, value}) {
    insertIntoOrOverExisting({textReceptacle, value});

    // Save values for manipulation by entity addition function, 'insertent'
    // Todo: Fix and use
    /*
    this.selst = textReceptacle.selectionStart;
    this.selend = textReceptacle.selectionEnd;
    */
  }
});

jQuery('div.miller-columns').millerColumns({
  /*
  preview () {
    // $('#chart_selectchar_persist').scrollLeft = 2000;
    return '';
  },
  */
  delay: 100, // Shorten delay until we can figure out how to fix jumpiness
  scroll () {
    // Due to an overflow within an overflow, we have to also force this scroll left
    $('#chart_selectchar_persist').scrollLeft = 2000;
  },
  async current ($item, $cols) {
    if (!$item) { // Todo: Is this an error?
      return;
    }
    // console.log('User selected:', $item);
    const title = $item[0].getAttribute('title');
    if (!title) {
      return;
    }
    await setPref('currentStartCharCode', Number.parseInt(title.replace(/-.*$/, ''), 16));
    // Free to use `buildChart` now that we have passed set-up
    buildChart(); // Todo: descripts?
  }
});

function encodingListener (e) {
  charrefClassChange(this);
  try {
    convertEncoding($('#toconvert').value);
  } catch (err) {
    alert(_('chars_could_not_be_converted'));
  }
}

// EVENTS
$('#encoding_from').addEventListener('click', encodingListener);
$('#encoding_to').addEventListener('click', encodingListener);

$('#insertEntityFile').addEventListener('change', async function (e) {
  await insertEntityFile(e);
});

Unicodecharref.initialize();

/**
* The following works, but if used will not allow user to cancel to
* get out of the current window size and will go back to the last
* window size; if use this, don't need code in "doOk" (besides
* return true).
**/
// window.addEventListener('resize', function (e) {
//   setPref('outerHeight', window.outerHeight);
//   setPref('outerWidth', window.outerWidth);
// });
})();
