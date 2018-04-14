/* eslint-env webextensions */
/* globals jQuery, console */
import addMillerColumnPlugin from '/vendor/miller-columns/dist/index-es.min.js';
import jml from '/vendor/jamilih/dist/jml-es.js';
import unicodeScripts from '/browser_action/unicode-scripts.js';

console.log('unicodeScripts', unicodeScripts);

(async () => {
await addMillerColumnPlugin(jQuery, {stylesheets: [
    '/vendor/miller-columns/miller-columns.css'
]});

jml('div', [
    ['div', {class: 'miller-breadcrumbs'}],
    jQuery(
        jml('div', {class: 'miller-columns', tabindex: '1'}, [
            ['ul', [
                ['li', ['abc']]
            ]]
        ])
    ).millerColumns({
        current ($item, $cols) {
            console.log('User selected:', $item);
        }
    })[0]
], document.body);
})();
