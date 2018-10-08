/* eslint-env browser, webextensions */
/* globals jQuery */
import {$} from '/vendor/jamilih/dist/jml-es.js';
import {i18n} from '/vendor/i18n-safe/index-es.js';
import {makeTabBox} from './templatesElementCustomization/widgets.js';
import {setPref, configurePrefs, PrefDefaults} from '/vendor/easy-prefs/index-es.js';
import addMillerColumnPlugin from '/node_modules/miller-columns/dist/index-es.js'; // Todo: Switch to vendor version
import getBuildChart, {buildChart} from './build-chart.js';
import insertIntoOrOverExisting from './templatesElementCustomization/insertIntoOrOverExisting.js';
import {getPrefDefaults, setVars as setPrefDefaultVars} from './preferences/prefDefaults.js';
import charrefunicodeDb from './unicode/charrefunicodeDb.js';
import UnicodeConverter from './unicode/UnicodeConverter.js';
import Unicodecharref, {shareVars as uresultsShareVars} from './uresults.js';
import indexTemplate from './templates/index.js';

(async () => { // eslint-disable-line padded-blocks

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

const charrefunicodeConverter = new UnicodeConverter({
    _, charrefunicodeDb
});
uresultsShareVars({_, charrefunicodeConverter, charrefunicodeDb});
setPrefDefaultVars({_});

configurePrefs({
    l10n: _,
    prefDefaults: new PrefDefaults({
        _,
        defaults: getPrefDefaults()
    }),
    appNamespace: 'unicode-input-tool-converter-'
});

// TEMPLATE
indexTemplate(_);

// ADD BEHAVIORS
makeTabBox('.tabbox');

await getBuildChart({
    _,
    charrefunicodeConverter,
    textReceptacle: $('#insertText'),
    chartContainer: $('#chartContainer'),
    // Todo: Get working
    insertText: ({textReceptacle, value}) => {
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
        await setPref('currentStartCharCode', parseInt(title.replace(/-.*$/, ''), 16));
        // Free to use `buildChart` now that we have passed set-up
        buildChart(); // Todo: descripts?
    }
});

// EVENTS
$('#encoding_from').addEventListener('click', function (e) {
    Unicodecharref.convertEncoding($('#toconvert').value, this);
});
$('#encoding_to').addEventListener('click', function (e) {
    Unicodecharref.convertEncoding($('#toconvert').value, this);
});
$('#insertEntityFile').addEventListener('change', function (e) {
    Unicodecharref.insertEntityFile(e);
});
Unicodecharref.initialize();
/**
* The following works, but if used will not allow user to cancel to
* get out of the current window size and will go back to the last
* window size; if use this, don't need code in "doOk" (besides
* return true)
window.addEventListener('resize', function (e) {
    setPref('outerHeight', window.outerHeight);
    setPref('outerWidth', window.outerWidth);
});
*/
})();
