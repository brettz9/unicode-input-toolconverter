import terser from '@rollup/plugin-terser';

import {babel} from '@rollup/plugin-babel';

/**
 * @external RollupConfig
 * @type {PlainObject}
 * @see {@link https://rollupjs.org/guide/en#big-list-of-options}
 */

/**
 * @param {PlainObject} config
 * @param {string} config.input
 * @param {boolean} [config.minifying=false]
 * @returns {external:RollupConfig}
 */
function getRollupObject ({input, minifying} = {}) {
  const nonMinified = {
    input,
    output: {
      format: 'iife',
      sourcemap: minifying,
      file: `${input.replace(/\.js$/u, '.iife')}${minifying ? '.min' : ''}.js`
    },
    plugins: [
      babel({
        babelHelpers: 'bundled'
      })
    ]
  };
  if (minifying) {
    nonMinified.plugins.push(terser());
  }
  return nonMinified;
}

export default [
  getRollupObject({
    input: './browser_action/index.js', minifying: true
  })
];
