'use strict';

module.exports = {
  "extends": "ash-nazg",
  "parserOptions": {
    ecmaVersion: 2017,
    sourceType: "module"
  },
  "env": {
    "es6": true,
    "node": false,
    "browser": true,
    "webextensions": true
  },
  settings: {
    polyfills: [
      "fetch",
      "Object.assign",
      "Object.entries",
      "Object.values",
      "Promise.all",
      "String.fromCodePoint",
      "URL"
    ]
  },
  "overrides": [
    {
      files: ["server.js"],
      env: {
        node: true
      }
    },
    {
      files: ["browser_action/templates/**"],
      rules: {
        "object-curly-newline": 0,
        "multiline-ternary": 0
      }
    }
  ],
  "rules": {
    "semi": [2, "always"],
    "indent": ["error", 2, {"outerIIFEBody": 0}],
    "object-property-newline": 0,
    "one-var": 0,
    "no-var": 2,
    "prefer-const": 2,
    "object-curly-spacing": ["error", "never"],

    "import/no-absolute-path": 0,
    "import/no-anonymous-default-export": 0,
  }
};
