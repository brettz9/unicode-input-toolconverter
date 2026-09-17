import fs from 'node:fs/promises';

const {version} = JSON.parse(await fs.readFile('package.json', 'utf8'));

fs.writeFile(
  'browser_action/service-worker/sw-version.json',
  JSON.stringify({version}, null, 2) + '\n'
);
