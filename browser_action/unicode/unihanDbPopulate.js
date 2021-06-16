import {UnihanDatabase} from './charrefunicodeDb.js';
import {getText} from '../utils/FetchUtils.js';

const unihanPath = `/download/unihan/unihan.json`;

/**
* @returns {Promise<UnihanDatabase>}
*/
async function unihanDbPopulate () {
  const namespace = 'unicode-input-toolconverter-Unihan';
  indexedDB.deleteDatabase(namespace);
  const unihanDatabase = new UnihanDatabase({
    name: namespace,
    // We don't peg to package major version as database version may vary
    //  independently
    version: 1
  });
  const updateUnicodeData = (await getText(unihanPath)).trim();
  await unihanDatabase.connect({
    updateUnicodeData
  });

  return unihanDatabase;
}

export default unihanDbPopulate;
