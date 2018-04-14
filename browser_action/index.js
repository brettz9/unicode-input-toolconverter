/* eslint-env webextensions */
/* globals jQuery, console */
import addMillerColumnPlugin from '/vendor/miller-columns/dist/index-es.min.js';
import jml from '/vendor/jamilih/dist/jml-es.js';
import unicodeScripts from '/browser_action/unicode-scripts.js';

(async () => {
await addMillerColumnPlugin(jQuery, {stylesheets: [
    '/vendor/miller-columns/miller-columns.css'
]});
// console.log('111');
jml('div', [
    ['div', {class: 'miller-breadcrumbs'}],
    ['div', {class: 'miller-columns', tabindex: '1'}, [
        unicodeScripts
    ]]
], document.body);
/**/
jQuery('div.miller-columns').millerColumns({
    current ($item, $cols) {
        console.log('User selected:', $item);
    }
});
/**/
})();
