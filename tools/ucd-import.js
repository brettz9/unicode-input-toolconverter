// As the Unicode server does not have CORS enabled, we can't adapt
//  this file for the browser, but we're keeping this file for demonstrating
//  an approach for live-obtaining the live version.

import download from 'download';

const args = process.argv.slice(2);

const targetDir = `${process.cwd()}/download/UCD`;

if (args.includes('download')) {
  await download(
    'https://www.unicode.org/Public/UCD/latest/ucd/UCD.zip', targetDir, {extract: true}
  );
}
