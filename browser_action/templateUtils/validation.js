/**
 * @param {string} link
 */
export const safeLink = function (link) {
  return (/https?:/v).test(link)
    ? link
    /* istanbul ignore next -- All links should be safe */
    : '';
};
