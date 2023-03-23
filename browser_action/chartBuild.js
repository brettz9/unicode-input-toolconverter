import {jml} from '../vendor/jamilih/dist/jml-es.js';
import {getUnicodeDefaults} from './preferences/prefDefaults.js';
import chartBuildTemplate from './templates/chartBuild.js';

let _, textReceptacle, chartContainer, insertText, charrefunicodeConverter;

const getChartBuild = async function ({
  _: i18n,
  descripts,
  insertText: it, textReceptacle: tr, chartContainer: cc,
  charrefunicodeConverter: uc
}) {
  textReceptacle = tr;
  chartContainer = cc;
  insertText = it;
  charrefunicodeConverter = uc;
  _ = i18n;
  return await chartBuild({descripts});
};

// eslint-disable-next-line import/no-mutable-exports -- Easier
export let lastStartCharCode;

// Todo:
// eslint-disable-next-line no-unused-expressions -- Bug in lgtm?
lastStartCharCode; // lgtm [js/useless-expression]

const chartBuild = async function chartBuild ({descripts} = {}) {
  const {getPref, setPref} = getUnicodeDefaults();
  const [
    startCharInMiddleOfChart,
    cols, onlyentsyes,
    entyes, buttonyes, decyes, hexyes, unicodeyes,
    hexLettersUpper,
    font, lang,
    tblrowsset, currentStartCharCodeInitial
  ] = await Promise.all([
    'startCharInMiddleOfChart',
    'tblcolsset', 'onlyentsyes',
    'entyes', 'buttonyes', 'decyes', 'hexyes', 'unicodeyes',
    'hexLettersUpper',
    'font', 'lang',
    'tblrowsset', 'currentStartCharCode'
  ].map((pref) => {
    return getPref(pref);
  }));

  const current = {startCharCode: currentStartCharCodeInitial};
  let rows = tblrowsset;

  lastStartCharCode = current.startCharCode;

  const resetCurrentStartCharCodeIfOutOfBounds = () => {
    if (current.startCharCode < 0) {
      current.startCharCode += 1114112;
      return;
    }
    if (current.startCharCode > 1114111) {
      current.startCharCode = 0;
    }
  };

  if (startCharInMiddleOfChart) {
    current.startCharCode = Math.round(
      current.startCharCode - ((rows * cols) / 2)
    );
    resetCurrentStartCharCodeIfOutOfBounds();
  } else {
    resetCurrentStartCharCodeIfOutOfBounds();
  }

  // Todo: Document (or better name) what's going on here
  let q, prev, arr, remainder, rowceil, colsOverRemainder;
  const descriptsOrOnlyEnts = onlyentsyes || descripts;
  if (descriptsOrOnlyEnts) {
    arr = descripts
      ? charrefunicodeConverter.descripts
      : charrefunicodeConverter.numericCharacterReferences;
    const chrreflgth = arr.length;

    if ((rows * cols) > chrreflgth) {
      const newrows = chrreflgth / cols;
      rows = Math.ceil(newrows);
      rowceil = rows - 1;
      remainder = (rows * cols) - chrreflgth;
      const hasRemainder = remainder > 0;
      colsOverRemainder = hasRemainder && cols - remainder;
    }
    q = arr.indexOf(current.startCharCode);
    if (q === -1) {
      q = 0;
      current.startCharCode = arr[q];
    }

    let newq = q - (cols * rows);
    if (newq < 0) { // Go backwards in the entity array
      newq = chrreflgth + newq;
    }
    prev = arr[newq];
  } else {
    prev = current.startCharCode - (cols * rows);
  }

  jml(textReceptacle, {
    rows: rows * 20 - 10,
    cols: cols * 20 - 10
  });
  chartContainer.textContent = '';

  const types = {hexyes, decyes, unicodeyes, entyes};
  const appliedFormats = [
    'decyes', 'hexyes', 'unicodeyes'
  ].filter((t) => types[t]);
  const displayTypes = {
    decyes (k) {
      return `&#${k};`;
    },
    hexyes (k) {
      const kto16 = hexLettersUpper
        ? k.toString(16).toUpperCase()
        : k.toString(16);
      return '&#x' + kto16 + ';';
    },
    unicodeyes (k) {
      return String.fromCodePoint(k);
    }
  };

  const captioncntnt = [];
  ['unicode', 'hex', 'dec', 'ent'].forEach((type) => {
    if (types[type + 'yes']) {
      captioncntnt.push(_(type + '_noun'));
    }
  });

  const captionContent = _.list([
    // Make first letter of first word upper case
    captioncntnt[0].replace(/^./u, (s) => s.toLocaleUpperCase(
      _.locale
    )),
    ...captioncntnt.slice(1)
  ]);

  chartBuildTemplate({
    _, rows, cols, charrefunicodeConverter, current,
    resetCurrentStartCharCodeIfOutOfBounds, descriptsOrOnlyEnts,
    q, arr, textReceptacle, entyes, chartBuild, descripts,
    chartContainer,
    setPref, insertText, buttonyes, font, lang, prev,
    rowceil, colsOverRemainder, appliedFormats, displayTypes,
    captionContent
  });

  // Todo: Restore
  // await this.resizecells({sizeToContent: true});
};

export {chartBuild, getChartBuild};
