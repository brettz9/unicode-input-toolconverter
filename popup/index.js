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
 * @param {string[]} items
 * @returns {void}
 */
function renderSavedItems (items) {
  if (!savedItemsContainer) {
    return;
  }
  savedItemsContainer.replaceChildren(); // Clear container

  if (items.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'empty-msg';
    emptyMsg.textContent = chrome.i18n.getMessage('no_saved_items') ||
      'No saved characters';
    savedItemsContainer.append(emptyMsg);
    return;
  }

  items.forEach((item, index) => {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.justifyContent = 'space-between';
    container.style.alignItems = 'center';

    const div = document.createElement('div');
    div.className = 'menu-item';
    div.textContent = item;
    div.style.flexGrow = '1';
    div.addEventListener('click', async () => {
      try {
        const tabs = await chrome.tabs.query({active: true});
        await Promise.all(tabs.map(async (tab) => {
          if (tab.id) {
            try {
              // Send a message directly to the content script we injected!
              await chrome.tabs.sendMessage(tab.id, {
                action: 'pasteText',
                text: item
              });
            } catch (e) {
              // Ignore errors for tabs without the content script
            }
          }
        }));
      } catch (err) {
        // eslint-disable-next-line no-console -- Debugging
        console.error(err);
      }

      setTimeout(() => window.close(), 50);
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = '❌';
    delBtn.style.background = 'none';
    delBtn.style.border = 'none';
    delBtn.style.cursor = 'pointer';
    delBtn.style.padding = '0 10px';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      items.splice(index, 1);
      chrome.storage.local.set({dropdownArr: items}, () => {
        chrome.runtime.sendMessage({
          action: 'updateSavedItems',
          items
        });
        renderSavedItems(items);
      });
    });

    container.append(delBtn, div);
    savedItemsContainer.append(container);
  });
}

chrome.storage.local.get(
  'dropdownArr',
  (/** @type {{dropdownArr?: string[]}} */ res) => {
    renderSavedItems(res.dropdownArr || []);
  }
);
