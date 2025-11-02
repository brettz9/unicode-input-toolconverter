import terserDefault from '@rollup/plugin-terser';
import {babel} from '@rollup/plugin-babel';
import istanbul from 'rollup-plugin-istanbul';

// Assert the default export type for smooth JS/TS interop under NodeNext
const terser = /**
 * @type {(options?: import('@rollup/plugin-terser').Options)
 *   => import('rollup').Plugin}
 */ (
  /** @type {unknown} */ (terserDefault)
  );

/**
 * @param {object} config
 * @param {string} config.input
 * @param {boolean} [config.minifying]
 * @param {boolean} [config.instrument]
 * @returns {import('rollup').RollupOptions}
 */
function getRollupObject ({input, minifying, instrument}) {
  const nonMinified = {
    input,
    output: {
      format: /** @type {const} */ ('iife'),
      sourcemap: minifying,
      file: `${
        instrument
          ? input.replace(/\.js$/v, '.instrumented.iife')
          : input.replace(/\.js$/v, '.iife')
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
