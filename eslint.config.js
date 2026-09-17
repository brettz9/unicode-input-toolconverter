import ashNazg from 'eslint-config-ash-nazg';
import globals from 'globals';

export default [
  {
    name: 'unicodeinputtoolconverter/ignores',
    ignores: [
      'polyfills/browser-polyfill.min.js',
      'old',
      '.idea',
      'vendor',
      'lib/misc-to-move',
      'browser_action/unicode/unicodeScripts.js',
      'download/UCD',
      'coverage',
      'browser_action/index.iife.min.js',
      'browser_action/index.instrumented.iife.min.js'
    ]
  },
  ...ashNazg(['sauron', 'browser']),
  {
    languageOptions: {
      globals: globals.webextensions
    },
    settings: {
      polyfills: [
        'Array.fill',
        'Array.from',
        'fetch',
        'navigator.languages',
        'navigator.registerProtocolHandler',
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
    }
  },
  {
    files: ['browser_action/templates/**'],
    rules: {
      'object-curly-newline': 0,
      'multiline-ternary': 0
    }
  },
  {
    rules: {
      'import/no-absolute-path': 0,

      // Disable for now
      'no-alert': 0,
      'prefer-named-capture-group': 0,
      'unicorn/no-top-level-assignment-in-function': 0,
      'sonarjs/assertions-in-tests': 0,
      'sonarjs/no-fixed-wait-in-tests': 0,
      'sonarjs/no-empty-test-file': 0,
      'mocha/no-sibling-hooks': 0,
      'unicorn/no-this-outside-of-class': 0,
      'unicorn/no-break-in-nested-loop': 0,
      'unicorn/prefer-number-coercion': 0,
      'unicorn/no-undeclared-class-members': 0,
      // Remove from ash-nazg
      'unicorn/no-unreadable-for-of-expression': 0,

      // May need in some though perhaps not all instances (for surrogates)
      'unicorn/prefer-code-point': 0
    }
  }
];
