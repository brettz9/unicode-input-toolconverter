export const safeLink = function (link) {
  return safeLink.startsWith('http') ? link : '';
};
