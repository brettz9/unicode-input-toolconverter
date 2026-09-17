/* eslint-disable jsdoc/reject-any-type -- Arbitrary */
/**
 * @param {number} items
 * @param {null|(() => any)} [filler]
 */
export const fill = (items, filler = null) => {
  // eslint-disable-next-line unicorn/no-array-from-fill -- Ok to try?
  return Array.from({length: items}).fill(filler);
};
