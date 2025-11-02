import {UnihanDatabase} from './charrefunicodeDb.js';

// import {getText} from '../utils/FetchUtils.js';
// const unihanPath = `/download/unihan/unihan.json`;

/* eslint-disable jsdoc/reject-any-type -- Arbitrary */
/**
 * @typedef {any} AnyValue
 */
/* eslint-enable jsdoc/reject-any-type -- Arbitrary */

/**
 * @param {AnyValue} updateUnicodeData
 * @returns {Promise<UnihanDatabase>}
 */
async function unihanDbPopulate (updateUnicodeData) {
  const namespace = 'unicode-input-toolconverter-Unihan';
  await indexedDB.deleteDatabase(namespace);
  const unihanDatabase = new UnihanDatabase({
    // We don't peg to package major version as database version may vary
    //  independently
    version: 1
  });
  await unihanDatabase.connect({
    updateUnicodeData
  });

  return unihanDatabase;
}

export default unihanDbPopulate;
