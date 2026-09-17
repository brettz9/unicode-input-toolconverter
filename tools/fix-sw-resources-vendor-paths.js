import fs from 'node:fs/promises';

// `find-es-resources` resolves bare specifiers (e.g., `import ... from
//   'jamilih'`) via plain Node resolution, which always lands in
//   `node_modules` -- it has no notion of `browser_action/index.html`'s
//   `importmap`, which is what actually redirects those specifiers to
//   `/vendor/...` builds in the browser. `node_modules` is gitignored, so
//   any `node_modules` entry here would 404 once deployed.
const html = await fs.readFile('browser_action/index.html', 'utf8');
const importmapMatch = html.match(
  /<script type="importmap">([\s\S]*?)<\/script>/v
);
if (!importmapMatch) {
  throw new Error(
    'Could not find `<script type="importmap">` in browser_action/index.html'
  );
}
const {imports} = JSON.parse(importmapMatch[1]);

const indexHtmlUrl = new URL(
  'https://example.invalid/browser_action/index.html'
);
const vendorPathBySpecifier = new Map(
  Object.entries(imports).map(([specifier, relativePath]) => {
    return [specifier, new URL(relativePath, indexHtmlUrl).pathname];
  })
);

const swResourcesPath = 'browser_action/service-worker/sw-resources.json';
const resources = JSON.parse(await fs.readFile(swResourcesPath, 'utf8'));

const nodeModulesPattern = /^\/node_modules\/((?:@[^\/]+\/)?[^\/]+)\//v;

const fixedResources = [...new Set(resources.flatMap((resource) => {
  const nodeModulesMatch = resource.match(nodeModulesPattern);
  if (!nodeModulesMatch) {
    return [resource];
  }
  const [, packageName] = nodeModulesMatch;
  const fullSpecifier = resource.replace(/^\/node_modules\//, '');
  const vendorPath = vendorPathBySpecifier.get(fullSpecifier) || vendorPathBySpecifier.get(packageName);
  if (!vendorPath) {
    // Only reachable by following a `node_modules` package's own source
    //   (e.g., a sub-dependency); nothing deployed actually imports it
    //   this way, so drop it.
    // eslint-disable-next-line no-console -- CLI
    console.log(`Dropping undeployable resource: ${resource}`);
    return [];
  }
  return [vendorPath];
// eslint-disable-next-line unicorn/require-array-sort-compare -- Consistency
}))].toSorted();

await fs.writeFile(
  swResourcesPath,
  JSON.stringify(fixedResources, null, 2) + '\n'
);
