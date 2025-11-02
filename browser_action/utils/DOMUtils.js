/**
 * @param {string} sel
 */
export const $ = (sel) => {
  return /** @type {HTMLElement} */ (document.querySelector(sel));
};

/**
 * @param {string} sel
 */
export const $s = (sel) => {
  return /** @type {HTMLSelectElement} */ ($(sel));
};

/**
 * @param {string} sel
 */
export const $i = (sel) => {
  return /** @type {HTMLInputElement} */ ($(sel));
};

/**
 * @param {string} sel
 */
export const $o = (sel) => {
  return /** @type {HTMLOptionElement} */ ($(sel));
};

/**
 * @param {string} sel
 */
export const $t = (sel) => {
  return /** @type {HTMLTextAreaElement} */ ($(sel));
};

/**
 * @param {string} sel
 */
export const $tabbox = (sel) => {
  // eslint-disable-next-line @stylistic/max-len -- Long
  return /** @type {import('../templatesElementCustomization/widgets.js').TabBox} */ (
    $(sel)
  );
};

/**
 * @param {string} sel
 */
export const $tabpanel = (sel) => {
  return /** @type {HTMLDivElement} */ ($(sel));
};

/**
 * @typedef {number} Integer
 */
/**
 * @typedef {number} Float
 */
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
 * @param {Element|string} item
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

const // xulns = 'https://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul',
  htmlns = 'https://www.w3.org/1999/xhtml';

/**
* @param {string} el
* @returns {HTMLAnchorElement}
*/
function createHTMLElement (el) {
  // return document.createElementNS(htmlns, el);
  return /** @type {HTMLAnchorElement} */ (document.createElement(el));
}

/**
* @param {string} el
* @returns {Element}
*/

/*
function createXULElement (el) {
  return document.createElementNS(xulns, el);
}
*/

/**
* @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
* @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator
*/
class AsyncStreamIterable {
  /**
  * @param {ReadableStream} stream
  */
  constructor (stream) {
    this._stream = stream;
  }

  /**
  * @returns {AsyncGenerator}
  * @yields {Integer}
  */
  async *[Symbol.asyncIterator] () {
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
 * @param {object} cfg
 * @param {string} cfg.url
 * @param {HTMLProgressElement} cfg.progressElement
 * @param {ProgressCallback} cfg.progress
 * @returns {Promise<{
 *  receivedLength: Integer, totalBytes: Integer, chunks: Uint8Array[]
 * }>}
 */
async function showProgress ({url, progressElement, progress}) {
  const response = await fetch(url);
  const totalBytes = Number(response.headers.get('content-length'));
  progressElement.max = totalBytes;

  /** @type {Uint8Array[]} */
  const chunks = [];
  let receivedLength = 0;
  for await (const value of new AsyncStreamIterable(
    /** @type {ReadableStream<Uint8Array<ArrayBuffer>>} */
    (response.body)
  )) {
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
  showProgress
};
