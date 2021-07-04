import {i18n, setJSONExtra} from '../vendor/intl-dom/dist/index.esm.js';
// Currently not bundling json-6
import jsonExtra from '../vendor/json-6/dist/index.mjs';

import {makeTabBox} from './templatesElementCustomization/widgets.js';
import {code, link} from './templateUtils/elements.js';

import {setPrefDefaultVars} from
  './preferences/prefDefaults.js';
import {getUnicodeConverter} from './unicode/UnicodeConverter.js';
import unicodecharref, {shareVars as shareVarsUresults} from
  './unicodecharref.js';
import indexTemplate from './templates/index.js';

import setupServiceWorker from './utils/setupServiceWorker.js';

import {
  shareVars as shareVarsEntity, setupEntityEvents
} from './entityBehaviors.js';
import {
  shareVars as shareVarsCharrefConverter
} from './charrefConverters.js';
import characterSelection from './characterSelection.js';
import {setupEncodingEvents} from './encodingBehaviors.js';

setJSONExtra(jsonExtra);

(async () => { // eslint-disable-line padded-blocks -- Ugly

// SETUP

// Todo: Support hash searchParams / streamline with `pushState`
const {searchParams} = new URL(location);

const lang = searchParams.get('lang');

// ['sv-SE']; // ['pt-BR']; // ['hu-HU'];
const locales = [...new Set([
  // Ensure there is at least one working language!
  ...(lang ? [lang] : [...navigator.languages]),
  'en-US'
])];

const _ = await i18n({
  locales, defaults: false, localesBasePath: '../',
  substitutions: {code, link}
});

if (searchParams.get('serviceWorker')) {
  // Doesn't work in FF as SW using ESM so putting behind switch for now
  await setupServiceWorker();
}

setPrefDefaultVars({_});
const charrefunicodeConverter = new (getUnicodeConverter())({_});
shareVarsUresults({_, charrefunicodeConverter});
shareVarsEntity({charrefunicodeConverter});
shareVarsCharrefConverter({charrefunicodeConverter});

// MAIN TEMPLATE
// Slows down loading so putting behind switch
const fonts = searchParams.get('fonts')
  ? await (await fetch('/fonts')).json()
  : [];

indexTemplate({_, fonts});

// ADD GENERAL BEHAVIORS
makeTabBox('.tabbox');

// TAB-SPECIFIC
await characterSelection({
  _, charrefunicodeConverter
});
setupEncodingEvents({_});
setupEntityEvents();

// Todo: Move functionality to relevant files
unicodecharref.initialize({
  targetid: 'context-unicodechart'
});

/**
* The following works, but if used will not allow user to cancel to
* get out of the current window size and will go back to the last
* window size.
*/
// window.addEventListener('resize', function (e) {
//   setPref('outerHeight', window.outerHeight);
//   setPref('outerWidth', window.outerWidth);
// });
})();
