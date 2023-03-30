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
    firstchld.replaceWith(item);
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
  // return document.createElementNS(htmlns, el);
  return document.createElement(el);
}

/**
* @param {string} el
* @returns {Element}
*/
function createXULElement (el) {
  return document.createElementNS(xulns, el);
}

/**
* @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
* @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator
*/
class AsyncStreamIterable {
  /**
  * @param {Stream} stream
  */
  constructor (stream) {
    this._stream = stream;
  }

  /**
  * @returns {void}
  * @yields {Integer}
  */
  async * [Symbol.asyncIterator] () {
    const reader = this._stream.getReader();
    try {
      while (true) {
        // eslint-disable-next-line no-await-in-loop -- Generator
        const {done, value} = await reader.read();
        if (done) {
          return;
        }
        yield value;
      }
    } finally {
      reader.releaseLock();
    }
  }
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
  const totalBytes = response.headers.get('content-length');
  progressElement.max = totalBytes;

  const chunks = [];
  let receivedLength = 0;
  for await (const value of new AsyncStreamIterable(response.body)) {
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
  createXULElement, showProgress
};
