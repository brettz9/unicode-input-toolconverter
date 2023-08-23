/* eslint-disable no-console -- Debugging */
/**
 * @param {string} [serviceWorkerPath]
 * @returns {Promise<void>}
 */
async function setupServiceWorker (
  serviceWorkerPath = '../sw.js'
) {
  let registration = await navigator.serviceWorker.getRegistration(
    serviceWorkerPath
  );
  if (!registration ||
    // Not sure these are possible here:
    registration.installing || registration.waiting || registration.active
  ) {
    const persistent = await navigator.storage.persist();
    if (!persistent) {
      console.log('Denied persistent storage');
    }
    try {
      registration = await navigator.serviceWorker.register(
        serviceWorkerPath,
        {
          type: 'module'
        }
      );
    } catch (err) {
      console.log('err', err);
      alert(`
    There was an error during registration (for offline ability).
    Please refresh the page if you wish to reattempt.
    `);
      return;
    }
  }

  // "The browser checks for updates automatically after navigations and
  //  functional events, but you can also trigger them manually"
  //  -- https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#manual_updates
  const hourly = 60 * 60 * 1000;
  setInterval(() => {
    registration.update();
  }, hourly);

  registration.addEventListener('updatefound', (e) => {
    const newWorker = registration.installing;

    // statechange won't catch this installing event as already installing

    newWorker.addEventListener('statechange', async () => {
      const {state} = newWorker;
      switch (state) {
      case 'installing':
        console.log('Installing new worker');
        break;
      case 'installed':
        console.log('Installation status', state);
        alert(
          `
  A new version of this offlinable app has been downloaded.

  If you have work to complete in this tab, you can dismiss
  this dialog now and continue working with the old version.

  However, when you are finished, you should close this tab
  and any other old tabs for this site in order to be able to
  begin using the new version.
  `
        );
        break;
      case 'redundant': // discarded. Either failed install, or it's been
        //                replaced by a newer version
        // Shouldn't be replaced since we aren't skipping waiting/claiming,
        console.log('Installation status', state);
        // Todo: Try updating again if get redundant here
        await alert(
          `
  There was an error during installation (to allow offline/speeded
  cache use).

  If you have work to complete in this tab, you can dismiss
  this dialog now and continue working with the old version.

  However, when you are finished, you may wish to close this tab
  and any other old tabs for this site in order to try again
  for offline installation.
  `
        );
        break;
        // These shouldn't occur as we are not skipping waiting (?)
      case 'activating':
        console.log('Activating new worker');
        break;
      case 'activated':
        console.log('Activated new worker');
        break;
      default:
        throw new Error(`Unknown worker update state: ${state}`);
      }
    });
  });

  navigator.serviceWorker.addEventListener('message', ({data}) => {
    const {message, type, name, errorType} = data;
    console.log('msg1', message, registration);
    switch (type) {
    case 'log':
      console.log(message);
      return;
    case 'beginInstall':
      console.log('Install: Begun...');
      return;
    case 'finishedInstall':
      console.log('Install: Finished...');
      return;
    case 'beginActivate': // Just use `e.source`?
      console.log('Activate: Caching finished');
      console.log('Activate: Begin database resources storage...');
      // r.active is also available for mere "activating"
      //    as we are now
      return;
    case 'finishedActivate':
      console.log('Activate: Finished...');
      // Still not controlled even after activation is
      //    ready, so refresh page

      // Seems to be working (unlike `location.replace`),
      //  but if problems, could add `true` but as forces
      //  from server not cache, what will happen here? (also
      //  `controller` may be `null` with force-reload)
      location.reload();
      // location.replace(location); // Avoids adding to browser history)
      return;
    case 'error':
      console.log(
        message + `${
          errorType === 'dbError' ? `Database error ${name}` : ''
        }; trying again...`
      );
      break;
    default:
      console.error('Unexpected type', type);
      break;
    }
  });

  const worker = registration.installing || registration.waiting ||
    registration.active;
  switch (worker.state) {
  case 'installing':
    // If it fails, will instead be `redundant`; but will try again:
    //     1. automatically (?) per https://developers.google.com/web/fundamentals/primers/service-workers/#the_service_worker_life_cycle
    //     2. upon reattempting registration (?) per https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
    console.log('installing1');
    break;
  case 'installed':
    // Waiting ensures only one version of our service worker active
    // No dedicated "waiting" state so handle here
    // Inform user that currently waiting for old tabs (and this one) to
    //   close so install can proceed
    console.log('installed1');
    break;
  case 'activating':
    // May be called more than once in case fails?
    // May not be activated but only activating so need action in case no
    //   other tabs open to do so?
    alert(`
      Please wait for a short while as we work to update to a new version.
    `);
    break;
  case 'activated': {
    // We should be able to use the following to distinguish when
    //    active but force-reloaded (will be `null` unlike
    //    `r.active` apparently)
    const {controller} = navigator.serviceWorker;
    console.log('activated1', controller);
    break;
  } case 'redundant':
    // Either:
    // 1. A new service worker is replacing the current service worker (though
    //    presumably only if `skipWaiting`)
    // 2. The current service worker is being discarded due to an install
    //    failure
    // May have been `r.installing` (?)
    // Todo: Could try registering again later (this will reload after an alert)
    console.log('redundant1');
    break;
  default:
    break;
  }
}

export default setupServiceWorker;
