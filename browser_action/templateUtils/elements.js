import {jml} from '../../vendor/jamilih/dist/jml.mjs';

/**
 * @param {{
 *   arg: string
 * }} cfg
 */
export const code = function ({arg}) {
  return jml('code', [arg]);
};

/**
 * @param {{
 *   arg: string
 * }} cfg
 */
export const link = function ({arg}) {
  // Todo: Could parse arg for link different from text
  return jml('a', {
    href: arg,
    target: '_blank'
  }, [arg]);
};
