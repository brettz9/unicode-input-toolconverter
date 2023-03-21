export const safeLink = function (link) {
  return (/https?:/u).test(link)
    ? link
    /* istanbul ignore next -- All links should be safe */
    : '';
};
