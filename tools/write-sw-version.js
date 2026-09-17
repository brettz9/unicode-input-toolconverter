import fs from 'node:fs/promises';

const {version} = JSON.parse(await fs.readFile('package.json', 'utf8'));

const swPath = 'sw.js';
const sw = await fs.readFile(swPath, 'utf8');

const buildVersionPattern = /const BUILD_VERSION = '[^']*';/v;
if (!buildVersionPattern.test(sw)) {
  throw new Error(`Could not find \`BUILD_VERSION\` declaration in ${swPath}`);
}

await fs.writeFile(
  swPath,
  sw.replace(buildVersionPattern, () => `const BUILD_VERSION = '${version}';`)
);
