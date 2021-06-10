import {$} from '../../vendor/jamilih/dist/jml-es.js';

/**
 * @param {Integer} i
 * @returns {void}
 */
function removeViewChildren (i) {
  const view = $('#_detailedView' + i);
  while (view.firstChild) {
    view.firstChild.remove();
  }
}
/**
 * @param {string} sel
 * @param {Element} item
 * @returns {void}
 */
function placeItem (sel, item) {
  const firstchld = $(sel).firstChild;
  if (firstchld !== null) {
    $(sel).replaceChild(item, firstchld);
  } else {
    $(sel).append(item);
  }
}

const xulns = 'https://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul',
  htmlns = 'https://www.w3.org/1999/xhtml';

/**
* @param {string} el
* @returns {Element}
*/
function createHTMLElement (el) {
  return document.createElementNS(htmlns, el);
}

/**
* @param {string} el
* @returns {Element}
*/
function createXULElement (el) {
  return document.createElementNS(xulns, el);
}

export {
  removeViewChildren, placeItem, createHTMLElement, htmlns,
  xulns, createXULElement
};
