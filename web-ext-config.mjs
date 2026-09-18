import path from 'node:path';
import os from 'node:os';

export default {
  verbose: true,
  ignoreFiles: [
    // Files beginning with dot, zip/xpi, node_modules, and
    //   web-ext-artifacts auto-ignored
    'browser_action/index.instrumented.iife.min.js',
    'browser_action/index.instrumented.iife.min.js.map',
    'download/unihan/unihan.json', // Downloadable by user
    'pnpm-lock.yaml',
    'pnpm-workspace.yaml',
    'package.json',
    'screenshots',
    'old' // Remove when deleted
  ],
  run: {
    firefoxProfile: path.join(os.homedir(), '.tmp-firefox-profile-unicode'),
    keepProfileChanges: true,
    profileCreateIfMissing: true
  }
};
