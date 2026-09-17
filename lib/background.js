import {i18n, setJSONExtra} from 'intl-dom';

// Currently not bundling json-6
import jsonExtra from 'json-6';

setJSONExtra(jsonExtra);

const _ = await i18n({defaults: false, localesBasePath: '../'});

// eslint-disable-next-line no-console -- Debugging
console.log('Unicode Input Tool/Converter background started');
// eslint-disable-next-line no-console -- Debugging
console.log('Locale test: ' + _('extensionName'));
