import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const target = process.argv[2];
if (!['chrome', 'firefox'].includes(target)) {
  // eslint-disable-next-line no-console -- Feedback
  console.error('Usage: node manifest-switch.js [chrome|firefox]');
  // eslint-disable-next-line unicorn/no-process-exit -- Why not?
  process.exit(1);
}

const manifestPath = path.join(__dirname, '../manifest.json');
const manifestData = await fs.readFile(manifestPath, 'utf8');
const manifest = JSON.parse(manifestData);

if (!manifest.background) {
  manifest.background = {type: 'module'};
}

if (target === 'chrome') {
  delete manifest.background.scripts;
  // eslint-disable-next-line camelcase -- API
  manifest.background.service_worker = 'sw.js';
} else if (target === 'firefox') {
  delete manifest.background.service_worker;
  manifest.background.scripts = ['sw.js'];
}

await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

// eslint-disable-next-line no-console -- Feedback
console.log(`Successfully converted manifest.json for ${target}!`);
