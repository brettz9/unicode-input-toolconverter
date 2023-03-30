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

import activateCallback from
  './service-worker/sw-activateCallback.js';

import {
  shareVars as shareVarsEntity, setupEntityEvents
} from './entityBehaviors.js';
import {
  shareVars as shareVarsCharrefConverter
} from './charrefConverters.js';
import characterSelection from './characterSelection.js';
// import {setupEncodingEvents} from './encodingBehaviors.js';

setJSONExtra(jsonExtra);

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

// eslint-disable-next-line unicorn/prefer-top-level-await -- No iife export
(async () => {
const _ = await i18n({
  locales, defaults: false, localesBasePath: '../',
  substitutions: {code, link}
});

if (searchParams.get('serviceWorker')) {
  // Doesn't work in FF as SW using ESM so putting behind switch for now
  await setupServiceWorker();
} else if (searchParams.get('characterDescriptions')) {
  const namespace = 'unicode-input-toolconverter';
  await activateCallback({
    namespace
  });
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
// setupEncodingEvents({_});
setupEntityEvents();

// Todo: Move functionality to relevant files
await unicodecharref.initialize({
  customProtocol: searchParams.get('customProtocol'),
  options: searchParams.get('options'),
  // Todo: Add-ons API for conversions
  // convert: window.getSelection().toString()
  convert: searchParams.get('convert'),
  targetid: searchParams.get('targetid')
});
})();
