export const safeLink = function (link) {
  return link.startsWith('http') ? link : '';
};
