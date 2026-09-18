chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action !== 'pasteText') {
    return;
  }

  const t = request.text;
  const activeEl = document.activeElement;
  if (activeEl && (activeEl.tagName === 'TEXTAREA' ||
    activeEl.tagName === 'INPUT')
  ) {
    const el = /** @type {HTMLTextAreaElement|HTMLInputElement} */ (activeEl);
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    el.value = el.value.slice(0, start) + t + el.value.slice(end);
    el.selectionStart = start + t.length;
    el.selectionEnd = start + t.length;
    sendResponse({success: true});
  } else if (activeEl && /** @type {HTMLElement} */ (
    activeEl
  ).isContentEditable) {
    document.execCommand('insertText', false, t);
    sendResponse({success: true});
  } else {
    sendResponse({success: false, error: 'No active input element found.'});
  }
});
