import {defineConfig} from 'cypress';

import plugins from './cypress/plugins/index.js';

export default defineConfig({
  env: {
    codeCoverage: {
      url: 'http://localhost:8000/__coverage__'
    }
  },
  chromeWebSecurity: false,
  video: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents (on, config) {
      return plugins(on, config);
    },
    baseUrl: 'http://localhost:8000'
  }
});
