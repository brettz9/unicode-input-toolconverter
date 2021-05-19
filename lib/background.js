import {i18n, setJSONExtra} from '../vendor/intl-dom/dist/index.esm.js';

// Currently not bundling json-6
import jsonExtra from '../vendor/json-6/dist/index.mjs';

setJSONExtra(jsonExtra);

(async () => { // eslint-disable-line padded-blocks -- ugly here

const _ = await i18n({defaults: false, localesBasePath: '../'});

// eslint-disable-next-line no-console -- Debugging
console.log('Unicode Input Tool/Converter background started');
// eslint-disable-next-line no-console -- Debugging
console.log('Locale test: ' + _('extensionName'));
})();
