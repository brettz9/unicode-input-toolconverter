/* eslint-disable jsdoc/ts-no-empty-object-type -- Ok */
/**
* @param {string} path
* @returns {Promise<{}>}
*/
const getJSON = async (path) => {
  const response = await fetch(path);
  return await response.json();
};

/**
* @param {string} path
* @returns {Promise<string>}
*/
const getText = async (path) => {
  const response = await fetch(path);
  return await response.text();
};

export {getJSON, getText};
