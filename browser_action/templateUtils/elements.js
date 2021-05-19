import {jml} from '../../vendor/jamilih/dist/jml-es.js';

export const code = function ({arg}) {
  return jml('code', [arg]);
};
export const link = function ({arg}) {
  // Todo: Could parse arg for link different from text
  return jml('a', {
    href: arg,
    target: '_blank'
  }, [arg]);
};
