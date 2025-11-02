/* eslint-disable jsdoc/reject-any-type -- Arbitrary */
/**
 * @param {number} items
 * @param {null|(() => any)} [filler]
 */
export const fill = (items, filler = null) => {
  return Array.from({length: items}).fill(filler);
};
