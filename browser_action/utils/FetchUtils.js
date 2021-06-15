/**
* @param {string} path
* @returns {JSON}
*/
const getJSON = async (path) => {
  const response = await fetch(path);
  return await response.json();
};

/**
* @param {string} path
* @returns {JSON}
*/
const getText = async (path) => {
  const response = await fetch(path);
  return await response.text();
};

export {getJSON, getText};
