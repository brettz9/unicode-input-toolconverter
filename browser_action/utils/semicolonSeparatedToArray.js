/**
* @param {string} text
* @returns {string[][]}
*/
function semicolonSeparatedToArray (text) {
  const lines = text.split('\n');
  return lines.map((line) => {
    return line.split(';');
  });
}

export default semicolonSeparatedToArray;
