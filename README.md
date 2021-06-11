# unicode-input-toolconverter

**Work in progress! (Still restoring from old browser add-on.)**

A webextensions add-on (Firefox, Chrome) to allow selection of Unicode
characters by a variety of means and conversion between various
Unicode representations such as HTML/XML entities, numeric
character references, etc.

## Screenshots

![Script Browser](./screenshots/script-browser.png)
![Entity/Numeric Character Reference/Escape Converter](./screenshots/converter.png)
![Preferences](./screenshots/preferences.png)
![Custom DTD (for highlighting entities in the script browser](./screenshots/dtd.png)

## History

This project had originally found life as a
[XUL-based Firefox add-on](https://addons.mozilla.org/en-US/firefox/addon/unicode-input-toolconverter/),
but XUL support was dropped in Firefox.

## High priority to-dos (toward restoring functionality)

1. Unihan download and other Unicode file saving into indexedDB
2. Move out description code in `UnicodeConverter.js` to `charrefunicodeDb` or
    other database-aware utility.
3. Split up `unicodecharref.js`
4. Restore starting with `unicodecharref.js` and then `charrefConverters.js`.

## Possible to-dos

1. ONGOING: Get **l10n** completed (only en-US, hu-HU, pt-BR, sv-SE were completed)

1. Conversion to/from **6-digit JavaScript escapes**
1. **Protocol handler**:
    <https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/protocol_handlers>
1. Create (reactive) **Web Components** (hyperHTML?) so that besides internal
    clarity, could reuse as pop-up script browser or character picker
1. Improve slow **font retrieval** so can reenable; need to do equivalent for
    other OS' or at least disable for them
1. After HTML conversion, restore as browser add-on, but as **webextensions**
    1. Allow adding specific characters or sequences thereof to global system
        **key commands**

## Lower-priority to-dos

1. When browsing by script, have **option to update script location** when one
    uses next/prev
1. Script for **auto-downloading entity files** (`/download/entities/`).
1. `unicode` or `utils` modules could be **moved to own npm package**
1. Utilize column browser also for **blocks/categories** (also use in
    `filebrowser-enhanced`!)
1. Offer **minimal character picker window**
