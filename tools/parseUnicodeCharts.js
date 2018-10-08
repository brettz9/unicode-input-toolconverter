/* eslint-env node */
const fetch = require('node-fetch');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;

const fs = require('fs-extra');
const path = require('path');

(async () => {
let text;
const chartsFile = path.join(__dirname, 'unicode-charts.html');
if (process.argv[2] === 'save') {
    const resp = await fetch('https://www.unicode.org/charts/');
    text = await resp.text();
    console.log('retrieved', text);
    await fs.writeFile(chartsFile, text);
    console.log('saved file');
} else {
    text = await fs.readFile(chartsFile, 'utf-8');
}

const doc = new JSDOM(text).window.document;
const scriptMaps = [...doc.querySelectorAll('table.map')];

const localize = false; // Works if `true`, but will need to provide strings for all possible; could auto-add to locale files if missing
const uniqueTextPlaceholder = localize ? '___placeholder___' : ''; // We know it is not present inside Unicode script names!

const jamilih = scriptMaps.map((scriptMap) => {
    const majorHeading = scriptMap.previousElementSibling.textContent;
    // const scriptGroups = [...scriptMap.querySelectorAll('table td p')];

    const scriptGroups = [...scriptMap.querySelectorAll('table td p.sg')];
    // sg, mb, pb/sb
    let lastChildren;
    return ['li', [
        majorHeading,
        ['ul', scriptGroups.map((scriptGroup) => {
            return ['li', [
                ['b', [
                    uniqueTextPlaceholder + scriptGroup.textContent
                ]],
                (() => {
                    const lists = [];
                    do {
                        const a = scriptGroup.querySelector('a');
                        const title = a && a.title;
                        if (scriptGroup.matches('.mb')) {
                            const children = [uniqueTextPlaceholder + scriptGroup.textContent];
                            lastChildren = children;
                            lists.push(
                                ['li', {title}, children]
                            );
                        } else if (scriptGroup.matches('.pb,.sb')) {
                            const children = [
                                ['i', [
                                    uniqueTextPlaceholder + scriptGroup.textContent
                                ]]
                            ];
                            if (!lastChildren) { // A few rare cases to handle, e.g., "Other"
                                lists.push(
                                    ['li', {title}, children]
                                );
                            } else {
                                if (!lastChildren[1]) {
                                    lastChildren[1] = ['ul', []];
                                }
                                lastChildren[1][1].push(
                                    ['li', {title}, children]
                                );
                            }
                        }
                        scriptGroup = scriptGroup.nextElementSibling;
                    } while (scriptGroup && !scriptGroup.matches('p.sg'));
                    lastChildren = null;
                    if (!lists.length) { // Just be safe
                        return '';
                    }
                    return ['ul', lists];
                })()
            ]];
        })]
    ]];
});
// console.log('m', majorHeading, scriptGroups);

// We only actually need the ESLint `indent` rule for the localized version, but add anyway
await fs.writeFile('browser_action/unicode/unicode-scripts.js', `
/* eslint-disable comma-spacing, quotes, indent */
export default function (_) {
    return ` + (localize
    ? JSON.stringify(['ul', jamilih], null, 4).replace(
        new RegExp(
            '^(\\s*)"' + uniqueTextPlaceholder + '(.*)"(,)?$',
            'gm'
        ),
        (_, initialWS, key, possibleComma = '') => {
            return initialWS + '_("' +
                key.replace(/\\n/g, '').replace(/\s\s*/g, ' ') // Getting some extra WS
                    .replace(/\W/g, '_') + // Make safe for Chrome locales
                '")' + possibleComma;
        }
    )
    : JSON.stringify(['ul', jamilih], null, 4)
) +
    `;
}
`);
})();
