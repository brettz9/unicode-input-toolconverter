/* eslint-disable no-console -- Debugging */
/* eslint-env serviceworker -- Service worker */

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
 * @param {PlainObject} args
 * @param {
 *   "log"|"error"|"beginInstall"|"finishedInstall"|"beginActivate"|
 *   "finishedActivate"
 * } args.type
 * @param {string} [args.message]
 * @returns {Promise<void>}
 */
async function post ({type, message = type}) {
  const windowClients = await self.clients.matchAll({
    // Are there any uncontrolled within activate anyways?
    includeUncontrolled: true,
    type: 'window'
  }) || [];
  if (message.includes('Posting finished')) {
    message += ` (count: ${windowClients.length})`;
  }
  windowClients.forEach((client) => {
    // Although we only need one client to which to send
    //   arguments, we want to signal phase complete to all
    // eslint-disable-next-line unicorn/require-post-message-target-origin -- Rule being reviewed: https://github.com/sindresorhus/eslint-plugin-unicorn/issues/1396
    client.postMessage({message, type});
  });
}

/**
 * @callback Logger
 * @param {string[]} messages
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
    message, errorType: error.type, name: error.name, type: 'error'
  });
}

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
    logError(err, err.message || errMessage);
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
  const now = Date.now();
  const {version} = await getJSON('./package.json');

  const cacheKey = namespace + CURRENT_CACHES.prefetch + version;

  console.log('opening cache', cacheKey);
  const [
    cache,
    staticResourceFiles,
    localeFiles,
    unicodeDataFiles
  ] = await Promise.all([
    caches.open(cacheKey),
    getJSON(pathToStaticJSON),
    getJSON(pathToLocaleJSON),
    getJSON(pathToUnicodeDataJSON)
  ]);
  log('Install: Retrieved dependency values');

  const urlsToPrefetch = [
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
        logError(error, 'Not caching ' + urlToPrefetch + ' due to ' + error);
        throw error;
      }
    });
    await Promise.all(cachePromises);
    log('Install: Pre-fetching complete.');
  } catch (error) {
    logError(error, `Install: Pre-fetching failed: ${error}`);
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

  const [
    cacheNames,
    {version}
  ] = await Promise.all([
    caches.keys(),
    getJSON('./package.json')
  ]);

  const expectedCacheNames = Object.values(
    CURRENT_CACHES
  ).map((n) => namespace + n + version);
  cacheNames.forEach(async (cacheName) => {
    if (!expectedCacheNames.includes(cacheName)) {
      log('Activate: Deleting out of date cache:', cacheName);
      await caches.delete(cacheName);
    }
  });

  // Todo: Use `namespace` in indexedDB db
  await activateCallback({
    namespace,
    log
  });
  // log('Activate: Database changes completed');

  log(`Activate: Posting finished message to clients`);
  // Signal phase complete to all clients
  post({type: 'finishedActivate'});
}

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    tryAndRetry(install, 5 * minutes, 'Error installing')
  );
});

self.addEventListener('activate', (e) => {
  // Erring is of no present use here:
  //   https://github.com/w3c/ServiceWorker/issues/659#issuecomment-384919053
  e.waitUntil(tryAndRetry(activate, 5 * minutes, 'Error activating'));
});

// We cannot make this async as `e.respondWith` must be called synchronously
self.addEventListener('fetch', (e) => {
  // DevTools opening will trigger these o-i-c requests
  const {request} = e;
  const {cache, mode, url} = request;
  if (
    cache === 'only-if-cached' &&
    mode !== 'same-origin'
  ) {
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
