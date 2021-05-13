import {jml} from '../vendor/jamilih/dist/jml-es.js';
import {getUnicodeDefaults} from './preferences/prefDefaults.js';
import CharrefunicodeConsts from './unicode/CharrefunicodeConsts.js';
import buildChartTemplate from './templates/build-chart.js';

let _, textReceptacle, chartContainer, insertText, charrefunicodeConverter;

const getBuildChart = async function ({
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
  return await buildChart({descripts});
};

let lastStartCharCode;

// Todo:
// eslint-disable-next-line no-unused-expressions -- Bug in lgtm?
lastStartCharCode; // lgtm [js/useless-expression]

export const buildChart = async function buildChart ({descripts} = {}) {
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
    current.startCharCode = Math.round(current.startCharCode - ((rows * cols) / 2));
    resetCurrentStartCharCodeIfOutOfBounds();
  }

  // Todo: Document (or better name) what's going on here
  let q, prev, chars, obj, remainder, rowceil, colsOverRemainder;
  const descriptsOrOnlyEnts = onlyentsyes || descripts;
  if (descriptsOrOnlyEnts) {
    chars = descripts ? 'descripts' : 'NumericCharacterReferences';
    obj = descripts ? charrefunicodeConverter : CharrefunicodeConsts;
    const chrreflgth = obj[chars].length;

    if ((rows * cols) > chrreflgth) {
      const newrows = chrreflgth / cols;
      rows = Math.ceil(newrows);
      rowceil = rows - 1;
      remainder = (rows * cols) - chrreflgth;
      const hasRemainder = remainder > 0;
      colsOverRemainder = hasRemainder && cols - remainder;
    }
    q = obj[chars].indexOf(current.startCharCode);
    if (q === -1) {
      q = 0;
      current.startCharCode = obj[chars][q];
    }

    let newq = q - (cols * rows);
    if (newq < 0) { // Go backwards in the entity array
      newq = chrreflgth + newq;
    }
    prev = obj[chars][newq];
  } else {
    prev = current.startCharCode - (cols * rows);
  }

  jml(textReceptacle, {
    rows: rows * 20 - 10,
    cols: cols * 20 - 10
  });
  chartContainer.textContent = '';

  const types = {hexyes, decyes, unicodeyes, entyes};
  const appliedFormats = ['decyes', 'hexyes', 'unicodeyes'].filter((t) => types[t]);
  const displayTypes = {
    hexyes: (k) => `&#${k};`,
    decyes (k) {
      const kto16 = hexLettersUpper
        ? k.toString(16).toUpperCase()
        : k.toString(16);
      return '&#x' + kto16 + ';';
    },
    unicodeyes: (k) => String.fromCodePoint(k)
  };

  const captioncntnt = [];
  ['unicode', 'hex', 'dec', 'ent'].forEach((type) => {
    if (types[type + 'yes']) {
      captioncntnt.push(_(type + '_noun'));
    }
  });

  // Todo: Replace this with a `Fluent.js` type plural awareness?
  // Make first letter of first word upper case
  const captionContent = captioncntnt[0].replace(/^[a-z]/, (s) => s.toUpperCase()) +
    captioncntnt.slice(1, -1).reduce((s, value) => {
      return s + _('caption_format_begin', {value});
    }, '') + (
    captioncntnt.length === 2
      ? _('caption_format_end_two', {
        value: captioncntnt.pop()
      })
      : captioncntnt.length > 2
        ? _('caption_format_end_three_plus', {
          value: captioncntnt.pop()
        })
        : '');

  buildChartTemplate({
    _, rows, cols, CharrefunicodeConsts, current,
    resetCurrentStartCharCodeIfOutOfBounds, descriptsOrOnlyEnts,
    q, obj, chars, textReceptacle, entyes, buildChart, descripts,
    chartContainer,
    setPref, insertText, buttonyes, font, lang, prev,
    rowceil, colsOverRemainder, appliedFormats, displayTypes,
    captionContent
  });

  // Todo: Restore
  // this.resizecells({sizeToContent: true});
};

export default getBuildChart;
