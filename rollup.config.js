import terser from '@rollup/plugin-terser';

import {babel} from '@rollup/plugin-babel';
import istanbul from 'rollup-plugin-istanbul';

/**
 * @external RollupConfig
 * @type {object}
 * @see {@link https://rollupjs.org/guide/en#big-list-of-options}
 */

/**
 * @param {PlainObject} config
 * @param {string} config.input
 * @param {boolean} [config.minifying]
 * @param {boolean} [config.instrument]
 * @returns {RollupConfig}
 */
function getRollupObject ({input, minifying, instrument} = {}) {
  const nonMinified = {
    input,
    output: {
      format: 'iife',
      sourcemap: minifying,
      file: `${
        instrument
          ? input.replace(/\.js$/u, '.iife')
          : input.replace(/\.js$/u, '.instrumented.iife')
      }${minifying ? '.min' : ''}.js`
    },
    plugins: [
      ...(instrument ? [istanbul()] : []),
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
  }),
  getRollupObject({
    input: './browser_action/index.js', minifying: true, instrument: true
  })
];
