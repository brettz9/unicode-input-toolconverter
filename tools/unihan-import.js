// As the Unicode server does not have CORS enabled, we can't adapt
//  this file for the browser, but we're keeping this file for demonstrating
//  an approach for live-obtaining the live version.
//  The current process we're using on our (bahai-browser.org) server
//  was instead just to use
//  `curl -LO https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip`
//  while in the `bahai-browser.org/download/unihan` directory and serve
//  `Unihan.zip` with a static file server so our browser script (elsewhere)
//  can download it and unpack its contents to supply to the method shared with
//  this file, `parseUnihanFromTextFileStrings.js`. (CORS is not currently
//  enabled, however, so this would need to be adjusted for cross-origin
//  browser use.)

import fs from 'fs/promises';

import download from 'download';
import extract from 'extract-zip';
import fetch from 'file-fetch';

import parseUnihanFromTextFileStrings from
  '../browser_action/unicode/parseUnihanFromTextFileStrings.js';

const args = process.argv.slice(2);

const targetDir = `${process.cwd()}/download/unihan`;
const unihanZip = `${targetDir}/Unihan.zip`;
const targetJSONUnihan = `${targetDir}/unihan.json`;

if (args.includes('download')) {
  await download(
    'https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip', targetDir
  );
}

if (args.includes('extract') || args.includes('download')) {
  await extract(unihanZip, {dir: targetDir});
  await fs.unlink(unihanZip);
}

addScript(targetDir);

/**
 * @param {string} baseURL
 * @returns {Promise<void>}
 */
async function addScript (baseURL) {
  const scriptFileAsStrings = await Promise.all([
    'Unihan_DictionaryIndices.txt',
    'Unihan_DictionaryLikeData.txt',
    'Unihan_IRGSources.txt',
    'Unihan_NumericValues.txt',
    'Unihan_OtherMappings.txt',
    'Unihan_RadicalStrokeCounts.txt',
    'Unihan_Readings.txt',
    'Unihan_Variants.txt'
  ].map(async (file) => {
    const fileObj = await fetch(`${baseURL}/${file}`);
    return await fileObj.text();
  }));

  const arr = parseUnihanFromTextFileStrings(scriptFileAsStrings);

  await fs.writeFile(targetJSONUnihan, JSON.stringify(arr));
}
