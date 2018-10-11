# unicode-input-toolconverter

**INCOMPLETE!!**

A webextensions add-on (Firefox, Chrome) to allow selection of Unicode
characters by a variety of means and conversion between various
Unicode representations such as HTML/XML entities, numeric
character references, etc.

# Possible to-dos

1. Consider License liberalization
1. Protocol handler: <https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/protocol_handlers>
1. Various modules, some already in `vendor`, could be moved to own npm package
1. Convert
    [XUL-based add-on](https://addons.mozilla.org/en-US/firefox/addon/unicode-input-toolconverter/)
    to HTML5 (use Jamilih for greater flexibility and i18n)
1. Conversion to/from 6-digit JavaScript escapes
1. When browsing by script, have option to update its location when one uses
    next/prev
1. Utilize column browser for browsing deep hierarchies such as list of
    blocks/scripts/categories (also use in filebrowser-enhanced!);
    See <https://github.com/brettz9/miller-columns> or possibly
    <https://bitbucket.org/brettz9/colbrowser>
1. Borrow from or ideas from GPL3-licensed <https://github.com/brettz9/charpick>?
1. Get i18n completed (only en-US, hu-HU, pt-BR, sv-SE were completed)
1. Use [`system_profiler SPFontsDataType`](https://apple.stackexchange.com/a/243746/206073)
  (with my fork of [apple-system-profiler](https://github.com/brettz9/apple-system-profiler/))
  to get list of fonts on system, and allow user to change, by serving
  them with `@font-face`
1. Allow adding specific characters or sequences thereof to global system key
    commands
