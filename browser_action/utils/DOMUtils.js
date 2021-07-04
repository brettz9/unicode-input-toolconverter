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

/**
* @callback ProgressCallback
* @param {Float} percentComplete
* @returns {string}
*/

/**
 * @param {PlainObject} cfg
 * @param {string} cfg.url
 * @param {Element} cfg.progressElement
 * @param {ProgressCallback} cfg.progress
 * @returns {Promise<{
 *  receivedLength: Integer, totalBytes: Integer, chunks: Integer[]
 * }>}
 */
async function showProgress ({url, progressElement, progress}) {
  const response = await fetch(url);
  const reader = response.body.getReader();
  const totalBytes = response.headers.get('content-length');
  progressElement.max = totalBytes;

  const chunks = [];
  let receivedLength = 0;
  while (true) {
    // eslint-disable-next-line no-await-in-loop -- Stream reading
    const {done, value} = await reader.read();
    if (done) {
      break;
    }

    chunks.push(value);
    receivedLength += value.length;

    const percentComplete = ((
      receivedLength / totalBytes
    ) * 100);

    progressElement.value = percentComplete;
    progressElement.textContent = progress(percentComplete);
  }
  return {receivedLength, totalBytes, chunks};
}

export {
  removeViewChildren, placeItem, createHTMLElement, htmlns,
  xulns, createXULElement, showProgress
};
