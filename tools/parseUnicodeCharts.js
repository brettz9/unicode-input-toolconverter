import fs from 'fs/promises';
import path from 'path';

// eslint-disable-next-line no-shadow -- Remove?
import fetch from 'node-fetch';
import jsdom from 'jsdom';

// For `localize` `true`, need to provide strings for all
//  possible; could auto-add to locale files if missing
const localize = true;

const {JSDOM} = jsdom;

/**
 * @param {string} key
 * @returns {string}
 */
function getChromeSafeLocaleKey (key) {
  return key.replaceAll('\\n', '').replaceAll(/\s+/gu, ' '). // Getting some extra WS
    replaceAll(/\W/gu, '_');
}

let text;
const lastScriptNamesFile = new URL(
  '../browser_action/unicode/lastScriptNames.json', import.meta.url
);
const chartsURL = 'https://unicode.org/charts/';
const chartsFile = new URL('unicode-charts.html', import.meta.url);
if (process.argv[2] === 'retrieve') {
  const resp = await fetch(chartsURL);
  text = await resp.text();
  // eslint-disable-next-line no-console -- CLI
  console.log('retrieved', text);
  await fs.writeFile(chartsFile, text);
  // eslint-disable-next-line no-console -- CLI
  console.log('saved file');
} else {
  text = await fs.readFile(chartsFile, 'utf8');
}

const doc = new JSDOM(text).window.document;
const scriptMaps = [...doc.querySelectorAll('table.map')];

const uniqueTextPlaceholder = localize
  ? '___placeholder___'
  : ''; // We know it is not present inside Unicode script names!

const cleanupText = (txt) => {
  return txt.trim().
    replace(/(?<initWS>\s)\s+/u, '$<initWS>').
    replace(/\s*\((?:ASCII|Odia)\)$/u, '').
    replace(/\s\(\d\.?\d*MB\)$/u, ''); // Remove MB size
};

const scriptsAndStartRanges = [];

const jamilih = scriptMaps.map((scriptMap) => {
  const majorHeading = cleanupText(
    scriptMap.previousElementSibling.textContent
  );
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
            let cleanedText;
            if (scriptGroup.matches('.mb')) {
              cleanedText = cleanupText(scriptGroup.textContent);
              const children = [uniqueTextPlaceholder + cleanedText];
              lastChildren = children;
              lists.push(
                ['li', {title}, children]
              );
            } else if (scriptGroup.matches('.pb,.sb')) {
              cleanedText = cleanupText(scriptGroup.textContent);
              const children = [
                ['i', [
                  uniqueTextPlaceholder + cleanedText
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
            if (cleanedText && title) {
              scriptsAndStartRanges.push({
                script: getChromeSafeLocaleKey(cleanedText),
                startRange: title.replace(/-.*$/u, '')
              });
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

/**
* @typedef {JSON} LocaleFileContents
* @todo Indicate more precise format
*/

/**
 * @param {string[]} localeFiles
 * @param {LocaleFileContents} localeFileContents
 * @returns {Promise<void>}
 */
async function saveLocalesWithoutDupes (localeFiles, localeFileContents) {
  return await Promise.all(
    localeFiles.map((localeFile, i) => {
      return fs.writeFile(
        localeFile, JSON.stringify(localeFileContents[i], null, 2) + '\n'
      );
    })
  );
}

/**
 * @param {string[]} newScriptNames
 * @param {LocaleFileContents} localeFileContents
 * @returns {Promise<void>}
 */
async function deleteUnusedScriptNames (newScriptNames, localeFileContents) {
  const {lastScriptNames} = JSON.parse(
    await fs.readFile(lastScriptNamesFile, 'utf8')
  );
  lastScriptNames.forEach((lastScriptName) => {
    if (!newScriptNames.includes(lastScriptName)) {
      localeFileContents.forEach((lfc) => {
        delete lfc.body[lastScriptName];
      });
    }
  });
}

// We only actually need the ESLint `indent` rule for the localized
//  version, but add anyway
await fs.writeFile(
  'browser_action/unicode/unicodeScripts.js',
  `/* eslint-disable @stylistic/comma-spacing, quotes, indent */
// Do not edit this file; this is an auto-generated file used to
//   build a hierarchy of script names. It is built by
//   \`parseUnicodeCharts.js\` using ${chartsURL}.
function unicodeScripts (_) {
  return ` + (localize
    ? await (async () => {
      const localesDir = '_locales';
      const dirs = (
        await fs.readdir(localesDir)
      ).filter((f) => !f.includes('.'));
      const localeFiles = dirs.map(
        (dir) => path.join(localesDir, dir, 'messages.json')
      );
      const localeFileContents = (
        await Promise.all(localeFiles.map((localeFile) => {
          return fs.readFile(localeFile, 'utf8');
        }))
      ).map((fileContents) => {
        return JSON.parse(fileContents);
      });

      const dirResults = (
        await recurseDirectory({directory: 'browser_action'})
      ).filter(({keys}) => {
        return keys.length;
      });
      // console.log('dirResults', JSON.stringify(dirResults, null, 2));
      const keyMap = {};
      dirResults.forEach(({path: pth, keys}) => {
        keys.forEach((key) => {
          localeFileContents.forEach((lfc, i) => {
            if (!(key in lfc.body)) {
              if (!keyMap[key]) {
                keyMap[key] = {paths: [], locales: []};
              }
              if (!keyMap[key].paths.includes(pth)) {
                keyMap[key].paths.push(pth);
              }
              if (!keyMap[key].locales.includes(localeFiles[i])) {
                keyMap[key].locales.push(localeFiles[i]);
              }
            }
          });
        });
      });

      /*
      Object.entries(keyMap).forEach(([key, {paths, locales}]) => {
        // Working:
        // console.log(
        //   `key "${key}" found in paths [${paths.join(', ')}] is ` +
        //   `missing in locales: [${locales.join(', ')}]\n`
        // );
      });
      */

      localeFileContents.forEach((lfc, i) => {
        if (i !== 0) { // Just test one for now
          return;
        }
        Object.keys(lfc.body).forEach((localeKey) => {
          if (!dirResults.some(({
            keys
            // path: pth
          }) => {
            // console.log('keys', keys);
            return keys.includes(localeKey);
          })) {
            // Working:
            // console.log(`Locale key "${localeKey}" not present in keys
            //   used in any of the found file paths.`);
          }
        });
      });

      const newScriptNames = [];
      const ret = JSON.stringify(['ul', jamilih], null, 2).replaceAll(
        new RegExp(
          '^(\\s*)"' + uniqueTextPlaceholder + '(.*)"(,)?$',
          'gum'
        ),
        (_, initialWS, key, possibleComma = '') => {
          const chromeSafeLocaleKey = getChromeSafeLocaleKey(key);

          newScriptNames.push(chromeSafeLocaleKey);
          // Insert `chromeSafeLocaleKey` if not present;
          //   Todo: Hard-code-test each locale to make sure no other
          //      l10n errors for missing keys, script or otherwise
          localeFileContents.forEach((lfc) => {
            /*
            // Works
            localeFileContents.forEach((lfc2, j) => {
              if (i === j) {
                return;
              }
              Object.entries(lfc.body).forEach(([key, val]) => {
                if (!(key in lfc2)) {
                  console.log(`key, ${key}, not present in ${localeFiles[j]}`);
                }
              });
            });
            */
            if (lfc.body.langCode.message !== 'hu-HU') {
              // return;
            }
            if (!(chromeSafeLocaleKey in lfc.body)) {
              lfc.body[chromeSafeLocaleKey] = {
                message: key
              };
              // console.log(1, chromeSafeLocaleKey, key);
              // fs.writeFile(localeFiles[i], JSON.stringify(lfc, null, 2));
            }
          });
          /*
          // Find change in *values*
          if (
            lfc.body[chromeSafeLocaleKey] &&
            lfc.body[chromeSafeLocaleKey].message !== key
          ) {
            console.log(key, lfc.body[chromeSafeLocaleKey].message);
          }
          */
          return `${initialWS}_("${chromeSafeLocaleKey}")${possibleComma}`;
        }
      );
      await deleteUnusedScriptNames(newScriptNames, localeFileContents);
      await saveLocalesWithoutDupes(localeFiles, localeFileContents);

      /* eslint-disable @stylistic/max-len -- JSON */
      await fs.writeFile(lastScriptNamesFile, `
{
  "$comment": "Do not edit this file; this is an auto-generated file used to track script names, some of which may end up needing to be deleted from locale files if no longer in use",
  "lastScriptNames": ${JSON.stringify(newScriptNames)}
}
`);
      /* eslint-enable @stylistic/max-len -- JSON */
      return ret;
    })()
    : JSON.stringify(['ul', jamilih], null, 2)
  ) +
  `;
}
export default unicodeScripts;
`
);

scriptsAndStartRanges.sort((
  {startRange: aStartRange}, {startRange: bStartRange}
) => {
  return Number.parseInt(aStartRange, 16) >
    Number.parseInt(bStartRange, 16)
    ? 1
    : -1;
});

let ifElseBlocks = '';
let lastStartRange = '0000';
let lastScript = 'null';
scriptsAndStartRanges.forEach(({script, startRange}) => {
  if (startRange === '0000' || !lastScript) {
    return;
  }
  // Todo: Add plane, privateuse, surrogate info
  ifElseBlocks += `
  } else if (num < 0x${startRange}) {
    codePointStart = '${lastStartRange}';
    script = _('${lastScript}');${
  // Not in chart:
  // startRange === 'DB80' ? "surrogate = _('High_Private_Use_Surrogate')" :
  lastStartRange === 'D800'
    ? `
surrogate = _('High_Surrogate');`
    : lastStartRange === 'DC00'
      ? `
surrogate = _('Low_Surrogate');`
      : ['E000', 'F0000', '100000'].includes(lastStartRange)
        ? `
privateuse = true;`
        : ''
}`;
  lastStartRange = startRange;
  lastScript = script;
});

/**
 * @param {PlainObject} cfg
 * @param {string} cfg.directory
 * @param {string} [cfg.basePath]
 * @param {{path, keys}} cfg.results
 * @returns {Promise<{path, keys}|void>}
 */
async function recurseDirectory ({directory, basePath = './', results}) {
  const dirPath = path.join(basePath, directory);
  const filesAndDirs = await fs.readdir(dirPath);
  let finalPromise = false;
  if (!results) {
    finalPromise = true;
    results = [];
  }
  await Promise.all(
    filesAndDirs.filter((fileOrDir) => {
      // Is a directory or JavaScript file
      return !fileOrDir.includes('.') || (/\.js$/u).test(fileOrDir);
    }).map(async (fileOrDir) => {
      if (!fileOrDir.includes('.')) { // Should check `isDirectory()` or such
        return recurseDirectory({
          directory: fileOrDir,
          basePath: dirPath,
          results
        });
      }
      const pth = path.join(dirPath, fileOrDir);
      const contents = await fs.readFile(pth, 'utf8');

      const i18nRegex = // /_\((?:['"]([^'"]*)['"])\)/g;
      // Todo: Works to find variable forms:
        /_\((?:['"](?<key1>[^'"]*)['"]|(?<key2>[^"')][^{)]*|[^{)]*[^"')]))\)/gu;

      const keys = [];
      let result;
      while ((result = (i18nRegex.exec(contents))) !== null) {
        keys.push(result.groups.key1 || result.groups.key2);
      }
      results.push({path: pth, keys});
      return undefined;
    })
  );
  if (finalPromise) {
    return results;
  }
  return undefined;
}

// console.log('scriptsAndStartRanges', scriptsAndStartRanges);

const output = `
// Todo: Auto-generate this function

/**
 * @param {PositiveInteger} num
 * @param {IntlDom} _
 * @returns {{
 *   codePointStart: string, script: string, plane: PositiveInteger,
 *   privateuse: boolean, surrogate: boolean|string
 * }}
 */
export default function getScriptInfoForCodePoint (num, _) {
  let privateuse = false, surrogate = false;
  let plane = num >= 0x10000 && num <= 0x1FFFF ? 1 : 0;
  let script = '', codePointStart = '';
${ifElseBlocks.slice('} else '.length) + '\n  }'}

  return {codePointStart, script, plane, privateuse, surrogate};
}
`;

// eslint-disable-next-line no-console -- Debugging
console.log('output', output);
