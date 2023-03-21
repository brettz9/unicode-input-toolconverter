export const safeLink = function (link) {
  return (/https?:/u).test(link) ? link : '';
};
