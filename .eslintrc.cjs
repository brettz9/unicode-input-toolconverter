'use strict';

const rulesToIgnoreForNow = {
  'no-alert': 0,
  'prefer-named-capture-group': 0,

  // May need in some though perhaps not all instances (for surrogates)
  'unicorn/prefer-code-point': 0
};

module.exports = {
  extends: ['ash-nazg/sauron-overrides'],
  env: {
    es2021: true,
    node: false,
    'shared-node-browser': false,
    browser: true,
    webextensions: true
  },
  parserOptions: {
    ecmaVersion: 2021
  },
  settings: {
    polyfills: [
      'Array.fill',
      'Array.from',
      'fetch',
      'navigator.languages',
      'navigator.serviceWorker',
      'Number.parseInt',
      'Object.assign',
      'Object.entries',
      'Object.values',
      'Promise',
      'Promise.all',
      'Request',
      'String.fromCodePoint',
      'URL',
      'URLSearchParams',
      'URLSearchParams.get'
    ]
  },
  overrides: [
    {
      extends: ['ash-nazg/sauron-node-script-overrides'],
      env: {
        node: true,
        browser: false
      },
      files: [
        'web-ext-config.js',
        // For now until can use type: module with Cypress
        'server.js',
        'cypress/plugins/index.js'
      ],
      rules: {
        ...rulesToIgnoreForNow
      }
    },
    {
      files: [
        'cypress/**'
      ],
      extends: [
        'plugin:cypress/recommended'
      ],
      rules: {
        'import/unambiguous': 0
      }
    },
    {
      files: 'tools/**',
      parser: '@babel/eslint-parser',
      parserOptions: {
        ecmaVersion: 2021
      },
      env: {
        browser: false
      },
      extends: ['ash-nazg/sauron-node-overrides']
    },
    {
      files: ['browser_action/templates/**'],
      rules: {
        'object-curly-newline': 0,
        'multiline-ternary': 0
      }
    }
  ],
  rules: {
    'import/no-absolute-path': 0,

    // Disable for now
    ...rulesToIgnoreForNow
  }
};
