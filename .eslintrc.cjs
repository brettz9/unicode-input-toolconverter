'use strict';

const rulesToIgnoreForNow = {
  'no-alert': 0,
  'prefer-named-capture-group': 0
};

module.exports = {
  extends: ['ash-nazg/sauron-overrides'],
  env: {
    es6: true,
    node: false,
    'shared-node-browser': false,
    browser: true,
    webextensions: true
  },
  settings: {
    polyfills: [
      'Array.fill',
      'Array.from',
      'fetch',
      'Number.parseInt',
      'Object.assign',
      'Object.entries',
      'Object.values',
      'Promise.all',
      'String.fromCodePoint',
      'URL'
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
        'web-ext-config.js'
      ],
      rules: {
        ...rulesToIgnoreForNow
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