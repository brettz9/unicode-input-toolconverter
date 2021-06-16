import {UnihanDatabase} from './charrefunicodeDb.js';

// import {getText} from '../utils/FetchUtils.js';
// const unihanPath = `/download/unihan/unihan.json`;

/**
 * @param {JSON} updateUnicodeData
 * @returns {Promise<UnihanDatabase>}
 */
async function unihanDbPopulate (updateUnicodeData) {
  const namespace = 'unicode-input-toolconverter-Unihan';
  indexedDB.deleteDatabase(namespace);
  const unihanDatabase = new UnihanDatabase({
    name: namespace,
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
