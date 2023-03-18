/**
* @see {@link https://stackoverflow.com/a/2970667/271577}
* @param {string} str
* @returns {string}
*/
export function camelize (str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/gu, (match, index) => {
    if (Number(match) === 0) {
      return ''; // or if (/\s+/.test(match)) for white spaces
    }
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  }).replace(/_/gu, '');
}
