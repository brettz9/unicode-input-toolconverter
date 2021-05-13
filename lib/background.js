import {i18n} from '../vendor/i18n-safe/index-es.js';

(async () => { // eslint-disable-line padded-blocks -- ugly here

// Todo: i18nize `locales` property
const _ = await i18n({locales: ['en'], defaults: false, localesBasePath: '../'});

// eslint-disable-next-line no-console -- Debugging
console.log('Unicode Input Tool/Converter background started');
// eslint-disable-next-line no-console -- Debugging
console.log('Locale test: ' + _('extensionName'));
})();
