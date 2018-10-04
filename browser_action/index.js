/* eslint-env browser, webextensions */
/* globals jQuery */
import addMillerColumnPlugin from '/vendor/miller-columns/dist/index-es.min.js';
import {jml, body, $} from '/vendor/jamilih/dist/jml-es.js';
import unicodeScripts from '/browser_action/unicode-scripts.js';
import getBuildChart from '/browser_action/build-chart.js';
import insertIntoOrOverExisting from '/browser_action/insertIntoOrOverExisting.js';

(async () => {
await addMillerColumnPlugin(jQuery, {stylesheets: [
    '/vendor/miller-columns/miller-columns.css'
]});

jml('div', [
    ['div', {class: 'miller-breadcrumbs'}],
    ['div', {class: 'miller-columns', tabindex: '1'}, [
        unicodeScripts
    ]],

    ['div', {
        id: 'chartContainer'
    }],
    ['input', {
        id: 'insertText'
    }]
], body);

jQuery('div.miller-columns').millerColumns({
    // current ($item, $cols) { console.log('User selected:', $item); }
});

await getBuildChart({
    locales: navigator.languages,
    textReceptable: $('#insertText'),
    chartContainer: $('#chartContainer'),
    // Todo: Get working
    insertText: ({textReceptable, value}) => {
        insertIntoOrOverExisting({textReceptable, value});

        // Save values for manipulation by entity addition function, 'insertent'
        // Todo: Fix and use
        this.selst = textReceptable.selectionStart;
        this.selend = textReceptable.selectionEnd;
    }
});
})();
