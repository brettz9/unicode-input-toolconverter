/* eslint-env node */
const fetch = require('node-fetch');
const jsdom = require('jsdom');
const jml = require('jamilih');
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

let html = '';
scriptMaps.forEach((scriptMap) => {
    const majorHeading = scriptMap.previousElementSibling.textContent;
    // const scriptGroups = [...scriptMap.querySelectorAll('table td p')];

    const scriptGroups = [...scriptMap.querySelectorAll('table td p.sg')];
    // sg, mb, pb/sb
    let lastChildren;
    html += jml.toHTML('ul', [
        ['li', [majorHeading]],
        ...scriptGroups.map((scriptGroup) => {
            return ['ul', [
                ['li', [
                    ['b', [
                        scriptGroup.textContent
                    ]]
                ]],
                ...(() => {
                    const lists = [];
                    do {
                        if (scriptGroup.matches('.mb')) {
                            const children = [
                                ['li', [scriptGroup.textContent]]
                            ];
                            lastChildren = children;
                            lists.push(['ul', children]);
                        } else if (scriptGroup.matches('.pb,.sb')) {
                            const children = [
                                ['li', [
                                    ['i', [
                                        scriptGroup.textContent
                                    ]]
                                ]]
                            ];
                            if (!lastChildren) { // A few rare cases to handle, e.g., "Other"
                                lists.push(['ul', children]);
                            } else {
                                lastChildren.push(['ul', children]);
                            }
                        }
                        scriptGroup = scriptGroup.nextElementSibling;
                    } while (scriptGroup && !scriptGroup.matches('p.sg'));
                    lastChildren = null;
                    return lists;
                })()
            ]];
        })
    ]);
});
// console.log('m', majorHeading, scriptGroups);
await fs.writeFile('browser_action/unicode-scripts.js', `
export default ${JSON.stringify(html)};
`);
})();
