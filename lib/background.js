/* eslint-env webextensions */
import {i18n} from '/vendor/i18n-safe/index-es.js';

(async () => { // eslint-disable-line padded-blocks

// Todo: i18nize `locales` property
const _ = await i18n({locales: ['en'], defaults: false, localesBasePath: '../'});
console.log('Unicode Input Tool/Converter background started');
console.log('Locale test: ' + _('extensionName'));

})(); // eslint-disable-line padded-blocks
