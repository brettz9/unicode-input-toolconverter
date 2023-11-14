import {UnicodeDatabase} from '../unicode/charrefunicodeDb.js';
import {getText} from '../utils/FetchUtils.js';
import semicolonSeparatedToArray from '../utils/semicolonSeparatedToArray.js';

/**
 * @param {string} db
 * @returns {Promise<void>}
 */
function deleteDatabase (db) {
  // eslint-disable-next-line promise/avoid-new -- No API
  return new Promise((resolve) => {
    const req = indexedDB.deleteDatabase(db);
    req.addEventListener('success', () => {
      resolve();
    });
    req.addEventListener(
      'error',
      /* istanbul ignore next -- Just for protection */
      () => {
        resolve();
      }
    );
    req.addEventListener(
      'blocked',
      /* istanbul ignore next -- Just for protection */
      () => {
        resolve();
      }
    );
  });
}

/**
 * @param {PlainObject} cfg
 * @param {string} cfg.namespace
 * @returns {Promise<void>}
 */
async function activateCallback ({namespace /* , log */}) {
  await deleteDatabase(namespace); // Chrome sometimes doesn't complete
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
