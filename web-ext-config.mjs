export default {
  verbose: true,
  ignoreFiles: [
    // Files beginning with dot, zip/xpi, node_modules, and
    //   web-ext-artifacts auto-ignored
    'pnpm-lock.yaml',
    'pnpm-workspace.yaml',
    'package.json',
    'screenshots',
    'old' // Remove when deleted
  ]
};
