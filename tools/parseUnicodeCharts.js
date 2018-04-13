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

scriptMaps.forEach((scriptMap) => {
    const majorHeading = scriptMap.previousElementSibling.textContent;
    // const scriptGroups = [...scriptMap.querySelectorAll('table td p')];

    const scriptGroups = [...scriptMap.querySelectorAll('table td p.sg')];
    // sg, mb, pb/sb
    const html = `
    <ul>
        <li>${majorHeading}</li>
        ${scriptGroups.map((scriptGroup) =>
        `<ul>
            <li>${scriptGroup.textContent}</li>
            ${
    (() => {
        let list = '';
        do {
            // TODO: Needs further nesting
            if (scriptGroup.matches('.mb,.pb,.sb')) {
                list += `<ul>
                    <li>${scriptGroup.textContent}</li>
                </ul>`;
            }
            scriptGroup = scriptGroup.nextElementSibling;
        } while (scriptGroup && !scriptGroup.matches('p.sg'));
        return list;
    })()}
        </ul>`
    ).join('\n')}
    </ul>
`;
    // console.log('m', majorHeading, scriptGroups);
    console.log('html', html);
});
})();
