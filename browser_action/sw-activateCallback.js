import {UnicodeDatabase} from './unicode/charrefunicodeDb.js';

/**
 * @param {PlainObject} cfg
 * @param {string} cfg.namespace
 * @param {Logger} cfg.log
 * @returns {void}
 */
function activateCallback ({namespace, log}) {
  const charrefunicodeDb = new UnicodeDatabase({
    name: namespace,
    // We don't peg to package major version as database version may vary
    //  independently
    version: 1
  });
  charrefunicodeDb.connect({writable: true});
}

export default activateCallback;
