// Replace intl-dom with chrome.i18n for synchronous extension
//   event registration
if (typeof chrome !== 'undefined' && chrome.contextMenus) {
  // eslint-disable-next-line no-console -- Debugging
  console.log('Unicode Input Tool/Converter background started');

  const menuItems = [
    {id: 'context-charrefunicode1', label: 'charref2unicodeContext_label'},
    {id: 'context-charrefunicode2', label: 'charref2htmlentsContext_label'},
    {id: 'context-charrefunicode3', label: 'unicode2charrefDecContext_label'},
    {id: 'context-charrefunicode4', label: 'unicode2charrefHexContext_label'},
    {id: 'context-charrefunicode5', label: 'unicode2htmlentsContext_label'},
    {id: 'context-charrefunicode6', label: 'unicode2jsescapeContext_label'},
    {id: 'context-charrefunicode7', label: 'unicodeTo6DigitContext_label'},
    {id: 'context-charrefunicode8', label: 'unicode2cssescapeContext_label'},
    {id: 'context-charrefunicode9', label: 'htmlents2charrefDecContext_label'},
    {id: 'context-charrefunicode10', label: 'htmlents2charrefHexContext_label'},
    {id: 'context-charrefunicode11', label: 'htmlents2unicodeContext_label'},
    {id: 'context-charrefunicode12', label: 'hex2decContext_label'},
    {id: 'context-charrefunicode13', label: 'dec2hexContext_label'},
    {id: 'context-charrefunicode14', label: 'jsescape2unicodeContext_label'},
    {id: 'context-charrefunicode15', label: 'sixDigit2unicodeContext_label'},
    {id: 'context-charrefunicode16', label: 'cssescape2unicodeContext_label'},
    {id: 'context-charrefunicode17', label: 'unicode2CharDescContext_label'},
    {id: 'context-charrefunicode18', label: 'charDesc2UnicodeContext_label'},
    {id: 'context-unicodechart', label: 'unicodechartContext_label'},
    {id: 'context-launchunicode', label: 'launchunicodeContext_label'}
  ];

  chrome.runtime.onInstalled.addListener(() => {
    // Create parent menu
    chrome.contextMenus.create({
      id: 'unicode-input-tool-parent',
      title: chrome.i18n.getMessage('extensionName') || 'Unicode Input Tool',
      contexts: ['selection', 'editable', 'page']
    });

    for (const item of menuItems) {
      chrome.contextMenus.create({
        id: item.id,
        parentId: 'unicode-input-tool-parent',
        title: chrome.i18n.getMessage(item.label) || item.label,
        contexts: ['selection', 'editable', 'page']
      });
    }

    // "Saved Items" parent
    chrome.contextMenus.create({
      id: 'unicode-saved-items',
      parentId: 'unicode-input-tool-parent',
      title: chrome.i18n.getMessage('saved_characters_label') ||
        'Saved Characters',
      contexts: ['selection', 'editable', 'page']
    });

    // Populate existing saved items
    refreshSavedItemsMenu();
  });

  /** @param {string[]|null} items */
  const refreshSavedItemsMenu = (items = null) => {
    if (items) {
      rebuildSavedItemsSubmenu(items);
    } else {
      chrome.storage.local.get('dropdownArr', (
        /** @type {{dropdownArr?: string[]}} */ res
      ) => {
        rebuildSavedItemsSubmenu(res.dropdownArr || []);
      });
    }
  };

  /** @param {string[]} items */
  const rebuildSavedItemsSubmenu = (items) => {
    // There is no bulk remove children, so we remove and recreate the parent
    chrome.contextMenus.remove('unicode-saved-items', () => {
      // Ignore errors if it didn't exist
      if (chrome.runtime.lastError) {
        // ignore
      }

      chrome.contextMenus.create({
        id: 'unicode-saved-items',
        parentId: 'unicode-input-tool-parent',
        title: chrome.i18n.getMessage('saved_characters_label') ||
          'Saved Characters',
        contexts: ['selection', 'editable', 'page']
      }, () => {
        items.forEach((/** @type {string} */ item, /** @type {number} */ i) => {
          chrome.contextMenus.create({
            id: `saved-item-${i}`,
            parentId: 'unicode-saved-items',
            title: item,
            contexts: ['selection', 'editable', 'page']
          });
        });
      });
    });
  };

  chrome.contextMenus.onClicked.addListener((
    /** @type {chrome.contextMenus.OnClickData} */ info,
    /** @type {chrome.tabs.Tab|undefined} */ tab
  ) => {
    if (typeof info.menuItemId === 'string' &&
      info.menuItemId.startsWith('saved-item-')
    ) {
      const menuItemIdStr = info.menuItemId;
      // const textToInsert = info.menuItemId === 'saved-item-...'
      //   ? '...'
      //   // Wait, we can't store value in ID easily because of symbols
      //   : info.menuItemId;

      // Better to use a mapping or re-fetch from storage
      chrome.storage.local.get(
        'dropdownArr',
        async (/** @type {{dropdownArr?: string[]}} */ res) => {
          const items = res.dropdownArr || [];
          const index = parseInt(menuItemIdStr.replace('saved-item-', ''), 10);
          const item = items[index];
          if (item) {
            // Paste it by copying to clipboard and executing a paste,
            //   or script injection
            if (tab && info.editable && tab.id) {
              try {
                await chrome.scripting.executeScript({
                  target: {tabId: tab.id},
                  /** @param {string} text */
                  func (text) {
                    const activeEl = document.activeElement;
                    if (activeEl && (activeEl.tagName === 'TEXTAREA' ||
                        activeEl.tagName === 'INPUT')
                    ) {
                      // eslint-disable-next-line @stylistic/max-len -- Long
                      const el = /** @type {HTMLTextAreaElement|HTMLInputElement} */ (
                        activeEl
                      );
                      const start = el.selectionStart || 0;
                      const end = el.selectionEnd || 0;
                      el.value = el.value.slice(0, start) + text +
                        el.value.slice(end);
                      el.selectionStart = el.selectionEnd = start + text.length;
                    } else if (activeEl) {
                      const el = /** @type {HTMLElement} */ (activeEl);
                      if (el.isContentEditable) {
                        document.execCommand('insertText', false, text);
                      }
                    }
                  },
                  args: [item]
                });
              } catch (err) {
                // eslint-disable-next-line no-console -- Debugging
                console.error(err);
              }
            }
          }
        }
      );
      return;
    }

    // It's a conversion tool
    const text = info.selectionText || '';
    const url = chrome.runtime.getURL(
      '/browser_action/index.html?convert=' +
      encodeURIComponent(text) +
      '&targetid=' +
      info.menuItemId
    );
    chrome.tabs.create({url});
  });

  chrome.runtime.onMessage.addListener((
    /** @type {{action: string, items: string[]}} */ request
  ) => {
    if (request.action === 'updateSavedItems') {
      refreshSavedItemsMenu(request.items);
    }
  });
}

