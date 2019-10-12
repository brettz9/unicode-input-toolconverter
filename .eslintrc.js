module.exports = {
  // Todo: Switch to ash-nazg
  "extends": "standard",
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
  "overrides": [
      {
          files: ["server.js"],
          env: {
              node: true
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
    "object-curly-newline": 0
  }
};
