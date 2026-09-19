/* eslint-disable no-console -- Debugging */

import './lib/background.js';

import {getJSON} from './browser_action/utils/FetchUtils.js';
import activateCallback from
  './browser_action/service-worker/sw-activateCallback.js';

const CURRENT_CACHES = {
  prefetch: 'prefetch-cache-v'
};
const minutes = 60 * 1000;

// v1

// Utilities

/**
 *
 * @param {object} args
 * @param {"log"|"error"|"beginInstall"|"finishedInstall"|"beginActivate"|
 *   "finishedActivate"
 * } args.type
 * @param {string} [args.message]
 * @returns {Promise<void>}
 */
async function post ({type, message = type}) {
  // `clients` is a genuine-ServiceWorker-only global: absent when this
  //   script runs as a Firefox extension background (event page) rather
  //   than a real service worker.
  if (!('clients' in globalThis)) {
    return;
  }
  const windowClients = await /** @type {ServiceWorkerGlobalScope} */ (
    /** @type {unknown} */ (globalThis)
  ).clients.matchAll({
    // Are there any uncontrolled within activate anyways?
    includeUncontrolled: true,
    type: 'window'
  }) || [];
  if (message.includes('Posting finished')) {
    message += ` (count: ${windowClients.length})`;
  }
  windowClients.forEach(/**
                         * @param {WindowClient} client
                         * @returns {void}
                         */ (client) => {
    // Although we only need one client to which to send
    //   arguments, we want to signal phase complete to all
    // eslint-disable-next-line unicorn/require-post-message-target-origin -- Rule being reviewed: https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1396
      client.postMessage({message, type});
    }
  );
}

/**
 * @callback Logger
 * @param {...string[]} messages
 * @returns {Promise<void>}
 */

/**
 * @type {Logger}
 */
function log (...messages) {
  const message = messages.join(' ');
  console.log(message);
  return post({message, type: 'log'});
}

/**
 *
 * @param {Error} error
 * @param {string[]} messages
 * @returns {Promise<void>}
 */
function logError (error, ...messages) {
  const message = messages.join(' ');
  console.error(error, message);
  return post({
    message,
    // errorType: error.type,
    // name: error.name,
    type: 'error'
  });
}

/**
 * @typedef {number} PositiveInteger
 */

/**
 * @typedef {number} Float
 */

/**
 * @callback DelayCallback
 * @param {Float} time
 * @returns {void}
 */

/**
 *
 * @param {DelayCallback} cb
 * @param {PositiveInteger} timeout
 * @param {string} errMessage
 * @param {PositiveInteger} [time]
 * @returns {Promise<void>}
 */
async function tryAndRetry (cb, timeout, errMessage, time = 0) {
  time++;
  try {
    // eslint-disable-next-line @stylistic/max-len -- Long
    // eslint-disable-next-line promise/prefer-await-to-callbacks -- Needed for retries
    await cb(time);
    return undefined;
  } catch (err) {
    console.log('errrr', err);
    logError(/** @type {Error} */ (err), /** @type {Error} */ (
      err
    ).message || errMessage);
    // eslint-disable-next-line promise/avoid-new -- Need timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(tryAndRetry(cb, timeout, errMessage, time));
      }, timeout);
    });
  }
}

const namespace = 'unicode-input-toolconverter';
const pathToStaticJSON = './browser_action/service-worker/sw-resources.json';
const pathToLocaleJSON = './browser_action/service-worker/sw-locales.json';
const pathToUnicodeDataJSON =
  './browser_action/service-worker/sw-unicode-data.json';

// Auto-updated by `npm run service-worker` (see tools/write-sw-version.js).
//   Keeping this in sync with `package.json`'s version ensures this file's
//   own bytes change on every release, so browsers with an already-
//   installed service worker actually detect the update (the update check
//   is a byte-for-byte diff of this script) instead of silently continuing
//   to serve a stale cache indefinitely.
const BUILD_VERSION = '0.2.3';

console.log('sw info', pathToStaticJSON);

/**
 *
 * @param {PositiveInteger} time
 * @throws {Error}
 * @returns {Promise<void>}
 */
async function install (time) {
  post({type: 'beginInstall'});
  log(`Install: Trying, attempt ${time}`);

  if (typeof chrome !== 'undefined') {
    // In a browser extension, our own resource files are already bundled
    //   locally rather than fetched over the network, and the Cache
    //   Storage API rejects `chrome-extension:`/`moz-extension:` scheme
    //   requests outright ("Request scheme ... is unsupported"), so this
    //   prefetch-caching strategy (meant for the plain, installable-
    //   web-app case) neither applies nor works here.
    log('Install: Skipping prefetch caching inside a browser extension.');
    post({type: 'finishedInstall'});
    return;
  }

  const now = Date.now();

  const cacheKey = namespace + CURRENT_CACHES.prefetch + BUILD_VERSION;

  console.log('opening cache', cacheKey);
  const [
    cache,
    staticResourceFiles,
    localeFiles,
    unicodeDataFiles
  ] = await Promise.all([
    caches.open(cacheKey),
    /** @type {Promise<string[]>} */ (getJSON(pathToStaticJSON)),
    /** @type {Promise<string[]>} */ (getJSON(pathToLocaleJSON)),
    /** @type {Promise<string[]>} */ (getJSON(pathToUnicodeDataJSON))
  ]);
  log('Install: Retrieved dependency values');

  const urlsToPrefetch = [
    // Only reached in the plain, non-extension case (see the early return
    //   above). A real web server resolves this bare directory URL to
    //   `index.html` (which is also separately listed in
    //   `staticResourceFiles`, under its own full filename, so both request
    //   forms get cached).
    '/browser_action/',
    ...staticResourceFiles,
    ...localeFiles,
    ...unicodeDataFiles
  ];
  console.log('urlsToPrefetch', urlsToPrefetch);

  // .map((url) => url === 'index.html'
  //   ? new Request(url, {cache: 'reload'}) : url)
  try {
    const cachePromises = urlsToPrefetch.map(async (urlToPrefetch) => {
      // This constructs a new URL object using the service worker's script
      //   location as the base for relative URLs.
      const url = new URL(urlToPrefetch, location.href);
      url.search += (url.search ? '&' : '?') + 'cache-bust=' + now;
      const request = new Request(url, {mode: 'no-cors'});
      try {
        const resp = await fetch(request);
        if (resp.status >= 400) {
          throw new Error(
            'request for ' + urlToPrefetch +
            ' failed with status ' + resp.statusText
          );
        }
        return cache.put(urlToPrefetch, resp);
      } catch (error) {
        logError(
          /** @type {Error} */ (error),
          `Not caching ${urlToPrefetch} due to ${error}`
        );
        throw error;
      }
    });
    await Promise.all(cachePromises);
    log('Install: Pre-fetching complete.');
  } catch (error) {
    logError(
      /** @type {Error} */ (error),
      `Install: Pre-fetching failed: ${error}`
    );
    // Failing gives chance for a new client to re-trigger install?
    throw error;
  }

  // An install update event will not be reported until controlled,
  //    so we need to inform the clients
  log(`Install: Posting finished message to clients`);

  // Although we only need one client to which to send
  //   arguments, we want to signal phase complete to all
  post({type: 'finishedInstall'});
}

/**
 *
 * @param {PositiveInteger} time
 * @returns {Promise<void>}
 */
async function activate (time) {
  post({type: 'beginActivate'});
  log(`Activate: Trying, attempt ${time}`);

  const cacheNames = await caches.keys();

  const expectedCacheNames = Object.values(
    CURRENT_CACHES
  ).map((n) => namespace + n + BUILD_VERSION);
  cacheNames.forEach(async (cacheName) => {
    if (expectedCacheNames.includes(cacheName)) {
      return;
    }

    log('Activate: Deleting out of date cache:', cacheName);
    await caches.delete(cacheName);
  });

  await provisionDatabase(time);

  log(`Activate: Posting finished message to clients`);
  // Signal phase complete to all clients
  post({type: 'finishedActivate'});
}

/**
 * Provisions the IndexedDB database. Called both from the ServiceWorker
 *   `activate` event above (needed for the plain, non-extension page case,
 *   where this script runs as a genuine page-registered service worker) and
 *   from `chrome.runtime.onInstalled` below (needed for the Firefox
 *   extension case, where the background runs as an event page rather than
 *   a genuine service worker and never dispatches `install`/`activate` at
 *   all). Running from both in the Chrome-extension case is harmless
 *   redundancy, not a correctness issue.
 * @param {PositiveInteger} time
 * @returns {Promise<void>}
 */
async function provisionDatabase (time) {
  console.log(`Provisioning database, attempt ${time}`);
  // Todo: Use `namespace` in indexedDB db
  await activateCallback({
    namespace
  });
  console.log('Database provisioning complete');
}

const sw = /** @type {ServiceWorkerGlobalScope} */ (
  /** @type {unknown} */ (globalThis)
);

sw.addEventListener('install', /**
                                * @param {ExtendableEvent} e
                                * @returns {void}
                                */ (e) => {
    sw.skipWaiting();
    e.waitUntil(
      tryAndRetry(install, 5 * minutes, 'Error installing')
    );
  });

sw.addEventListener('activate', /**
                                 * @param {ExtendableEvent} e
                                 * @returns {void}
                                 */ (e) => {
  // Erring is of no present use here:
  //   https://github.com/w3c/ServiceWorker/issues/659#issuecomment-384919053
    e.waitUntil(tryAndRetry(activate, 5 * minutes, 'Error activating'));
  });

// `chrome` (a WebExtension-only global) is absent when this script runs as
//   a plain, non-extension page-registered service worker, so this only
//   applies within a browser extension (needed there for Firefox, whose
//   event-page background never fires ServiceWorker `activate`).
if (typeof chrome !== 'undefined' && chrome.runtime?.onInstalled) {
  chrome.runtime.onInstalled.addListener(() => {
    tryAndRetry(
      provisionDatabase, 5 * minutes, 'Error provisioning database'
    );
  });
}

// We cannot make this async as `e.respondWith` must be called synchronously
sw.addEventListener('fetch', /**
                              * @param {FetchEvent} e
                              * @returns {void}
                              */ (e) => {
  // DevTools opening will trigger these o-i-c requests
    const {request} = e;
    const {cache, mode, url} = request;
    if (
      cache === 'only-if-cached' &&
    mode !== 'same-origin'
    ) {
      return;
    }
    // Never cached/prefetched (see `sw-unicode-data.json`), and streaming
    //   this large a download (~40MB+) back through the service worker's
    //   own relayed `fetch` causes Firefox (though not Chrome) to fail
    //   with "Error in input stream" once the transfer runs long. Skip
    //   interception entirely so the browser fetches it directly.
    if (url.includes('/download/unihan/unihan.json')) {
      return;
    }
    console.log('fetching', url);
    e.respondWith((async () => {
      const cached = await caches.match(request);
      if (!cached) {
        console.log('no cached found', url);
      }
      return cached || fetch(request);
    })());
  });
