import {UnicodeDatabase} from '../unicode/charrefunicodeDb.js';
import {getText} from '../utils/FetchUtils.js';
import semicolonSeparatedToArray from '../utils/semicolonSeparatedToArray.js';

/**
 * @param {PlainObject} cfg
 * @param {string} cfg.namespace
 * @param {Logger} cfg.log
 * @returns {Promise<void>}
 */
async function activateCallback ({namespace, log}) {
  indexedDB.deleteDatabase(namespace);
  const charrefunicodeDb = new UnicodeDatabase({
    name: namespace,
    // We don't peg to package major version as database version may vary
    //  independently
    version: 1
  });
  const unicodeData = (await getText('/download/UCD/UnicodeData.txt')).trim();
  const updateUnicodeData = semicolonSeparatedToArray(unicodeData);
  await charrefunicodeDb.connect({
    updateUnicodeData
  });
}

export default activateCallback;
