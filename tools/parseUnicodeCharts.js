/* eslint-env node */
const fetch = require('node-fetch');
const jsdom = require('jsdom');
const fs = require('fs-extra');
const path = require('path');

// For `localize` `true`, need to provide strings for all
//  possible; could auto-add to locale files if missing
const localize = true;

const {JSDOM} = jsdom;

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

const uniqueTextPlaceholder = localize ? '___placeholder___' : ''; // We know it is not present inside Unicode script names!

const cleanupText = (txt) => {
    return txt.trim().replace(/\s\((?:\d\.?\d*)MB\)$/, '');
};

const jamilih = scriptMaps.map((scriptMap) => {
    const majorHeading = cleanupText(scriptMap.previousElementSibling.textContent);
    // const scriptGroups = [...scriptMap.querySelectorAll('table td p')];

    const scriptGroups = [...scriptMap.querySelectorAll('table td p.sg')];
    // sg, mb, pb/sb
    let lastChildren;
    return ['li', [
        majorHeading,
        ['ul', scriptGroups.map((scriptGroup) => {
            return ['li', [
                ['b', [
                    uniqueTextPlaceholder + cleanupText(scriptGroup.textContent)
                ]],
                (() => {
                    const lists = [];
                    do {
                        const a = scriptGroup.querySelector('a');
                        const title = a && a.title;
                        if (scriptGroup.matches('.mb')) {
                            const children = [uniqueTextPlaceholder + cleanupText(scriptGroup.textContent)];
                            lastChildren = children;
                            lists.push(
                                ['li', {title}, children]
                            );
                        } else if (scriptGroup.matches('.pb,.sb')) {
                            const children = [
                                ['i', [
                                    uniqueTextPlaceholder + cleanupText(scriptGroup.textContent)
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
    ? await (async () => {
        const localesDir = '_locales';
        const dirs = (await fs.readdir(localesDir)).filter((f) => !f.includes('.'));
        const localeFiles = dirs.map((dir) => path.join(localesDir, dir, 'messages.json'));
        const localeFileContents = (await Promise.all(localeFiles.map((localeFile) => {
            return fs.readFile(localeFile, 'utf-8');
        }))).map((fileContents) => {
            return JSON.parse(fileContents);
        });
        let i = 0;
        return JSON.stringify(['ul', jamilih], null, 4).replace(
            new RegExp(
                '^(\\s*)"' + uniqueTextPlaceholder + '(.*)"(,)?$',
                'gm'
            ),
            (_, initialWS, key, possibleComma = '') => {
                const chromeSafeLocaleKey = key.replace(/\\n/g, '').replace(/\s\s*/g, ' ') // Getting some extra WS
                    .replace(/\W/g, '_');
                // Todo: Instead of this block, for all of
                //   `localeFileContents`, insert `chromeSafeLocaleKey` if not present;
                //   but first rename any similar ones if present; also hard-code each
                //   locale to make sure no other l10n errors for missing keys, script
                //   or otherwise
                if (!(chromeSafeLocaleKey in localeFileContents[0])) {
                    i++;
                    console.log(i, chromeSafeLocaleKey, key);
                }
                return `${initialWS}_("${chromeSafeLocaleKey}")${possibleComma}`;
            }
        );
    })()
    : JSON.stringify(['ul', jamilih], null, 4)
) +
    `;
}
`);
})();
