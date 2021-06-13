import fs from 'fs/promises';

const dirs = await fs.readdir('_locales');

const json = dirs.filter((dir) => {
  return dir !== '.DS_Store';
}).map((dir) => {
  return `/_locales/${dir}/messages.json`;
}).sort();

// eslint-disable-next-line no-console -- CLI
console.log('json', json);

fs.writeFile('sw-locales.json', JSON.stringify(json, null, 2) + '\n');
