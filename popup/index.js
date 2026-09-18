
const openAppBtn = document.querySelector('#open-app');
const savedItemsContainer = document.querySelector('#saved-items');

if (openAppBtn) {
  openAppBtn.addEventListener('click', async () => {
    const appUrl = chrome.runtime.getURL('/browser_action/index.html');
    const tabs = await chrome.tabs.query({url: appUrl + '*'});

    if (tabs.length > 0 && tabs[0].id && tabs[0].windowId) {
      await chrome.tabs.update(tabs[0].id, {active: true});
      await chrome.windows.update(tabs[0].windowId, {focused: true});
    } else {
      await chrome.tabs.create({url: appUrl});
    }
    window.close();
  });
}

/**
 * @param {string} text
 * @returns {Promise<void>}
 */
async function pasteTextToActiveTab (text) {
  const tabs = await chrome.tabs.query({active: true, currentWindow: true});
  const tab = tabs[0];
  if (!tab || !tab.id) {
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: {tabId: tab.id},
      /** @param {string} t */
      func (t) {
        const activeEl = document.activeElement;
        if (
          activeEl &&
          (activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'INPUT')
        ) {
          const el = /** @type {HTMLTextAreaElement|HTMLInputElement} */ (
            activeEl
          );
          const start = el.selectionStart || 0;
          const end = el.selectionEnd || 0;
          el.value = el.value.slice(0, start) + t + el.value.slice(end);
          el.selectionStart = start + t.length;
          el.selectionEnd = start + t.length;
        } else if (activeEl) {
          const el = /** @type {HTMLElement} */ (activeEl);
          if (el.isContentEditable) {
            document.execCommand('insertText', false, t);
          }
        }
      },
      args: [text]
    });
  } catch (err) {
    // eslint-disable-next-line no-console -- Debugging
    console.error(err);
  }
}

chrome.storage.local.get(
  'dropdownArr',
  (/** @type {{dropdownArr?: string[]}} */ res) => {
    if (!savedItemsContainer) {
      return;
    }
    const items = res.dropdownArr || [];

    if (items.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'empty-msg';
      emptyMsg.textContent = chrome.i18n.getMessage('no_saved_items') ||
        'No saved characters';
      savedItemsContainer.append(emptyMsg);
      return;
    }

    items.forEach((item) => {
      const div = document.createElement('div');
      div.className = 'menu-item';
      div.textContent = item;
      div.addEventListener('click', async () => {
        await pasteTextToActiveTab(item);
        window.close();
      });
      savedItemsContainer.append(div);
    });
  }
);
