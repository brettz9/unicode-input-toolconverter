// As the Unicode server does not have CORS enabled, we can't adapt
//  this file for the browser, but we're keeping this file for demonstrating
//  an approach for live-obtaining the live version.

import fs from 'fs/promises';

// eslint-disable-next-line no-shadow -- Clearer
import fetch from 'node-fetch';

import {load} from 'cheerio';

const args = process.argv.slice(2);

const targetDir = `${process.cwd()}/download/entities`;
const entityBasePath = 'https://www.w3.org/2003/entities/2007/';

const getText = async (file) => {
  return await (await fetch(
    file
  )).text();
};

// const targetDir = `${process.cwd()}/download/entities`;

if (args.includes('download')) {
  const htmlText = await getText(entityBasePath);
  const $ = load(htmlText);
  const elems = $('a[href$=".ent"]');
  const entityFiles = [];
  // eslint-disable-next-line unicorn/no-for-loop -- Not iterable
  for (let i = 0; i < elems.length; i++) {
    entityFiles.push(elems[i].attribs.href);
  }
  const entityFileTexts = await Promise.all(
    entityFiles.map(async (entityFile) => {
      if ([
        // We don't really need these as express parameter entities
        'htmlmathml.ent',
        'w3centities.ent'
      ].includes(entityFile)) {
        return {};
      }
      return {
        file: `${targetDir}/${entityFile}`,
        text: await getText(`${entityBasePath}${entityFile}`)
      };
    })
  );

  // eslint-disable-next-line no-console -- CLI
  console.log('entity file file count', entityFileTexts.length);

  await Promise.all(entityFileTexts.map(({file, text}) => {
    if (!file) {
      return undefined;
    }
    return fs.writeFile(file, text);
  }));

  // eslint-disable-next-line no-console -- CLI
  console.log('Complete!');
}
