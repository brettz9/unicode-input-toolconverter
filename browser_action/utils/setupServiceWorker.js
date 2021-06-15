/**
 * @param {string} [serviceWorkerPath="service-worker/sw.js"]
 * @returns {Promise<void>}
 */
async function setupServiceWorker (
  serviceWorkerPath = 'service-worker/sw.js'
) {
  let registration = await navigator.serviceWorker.getRegistration(
    serviceWorkerPath
  );
  if (!registration ||
    // Not sure these are possible here:
    registration.installing || registration.waiting || registration.active
  ) {
    try {
      registration = await navigator.serviceWorker.register(
        serviceWorkerPath, {
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
      /* eslint-disable no-console -- Debug */
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
      /* eslint-enable no-console -- Debug */
    });
  });
}

export default setupServiceWorker;
