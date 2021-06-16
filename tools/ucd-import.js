// As the Unicode server does not have CORS enabled, we can't adapt
//  this file for the browser, but we're keeping this file for demonstrating
//  an approach for live-obtaining the live version.

import fs from 'fs/promises';

import download from 'download';
import extract from 'extract-zip';

const args = process.argv.slice(2);

const targetDir = `${process.cwd()}/download/UCD`;
const ucdZip = `${targetDir}/UCD.zip`;

if (args.includes('download')) {
  await download(
    'https://www.unicode.org/Public/UCD/latest/ucd/UCD.zip', targetDir
  );
}

if (args.includes('extract') || args.includes('download')) {
  await extract(ucdZip, {dir: targetDir});
  await fs.unlink(ucdZip);
}
