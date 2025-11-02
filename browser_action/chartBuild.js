import {jml} from '../vendor/jamilih/dist/jml-es.js';
import {getUnicodeDefaults} from './preferences/prefDefaults.js';
import chartBuildTemplate from './templates/chartBuild.js';

/**
 * @typedef {{
 *   decyes: (k: number) => string,
 *   hexyes: (k: number) => string,
 *   unicodeyes: (k: number) => string,
 * }} DisplayTypes
 */

/**
 * @typedef {(info: {
 *   textReceptacle: HTMLTextAreaElement|HTMLInputElement,
 *   value: string
 * }) => void} InsertText
 */

/**
 * @typedef {InstanceType<ReturnType<
 *   import('./unicode/UnicodeConverter.js').getUnicodeConverter
 * >>} CharrefUnicodeConverter
 */

/** @type {HTMLElement} */
let chartContainer;

/** @type {InsertText} */
let insertText;

/** @type {CharrefUnicodeConverter} */
let charrefunicodeConverter;

/** @type {import('intl-dom').I18NCallback<string>} */
let _;

/** @type {HTMLTextAreaElement|HTMLInputElement} */
let textReceptacle;

/**
 * @param {{
 *   _: import('intl-dom').I18NCallback<string>,
 *   charrefunicodeConverter: CharrefUnicodeConverter,
 *   textReceptacle: HTMLTextAreaElement|HTMLInputElement,
 *   chartContainer: HTMLElement,
 *   descripts?: boolean,
 *   insertText: InsertText
 * }} cfg
 */
const getChartBuild = async function ({
  _: i18n,
  descripts,
  insertText: it,
  textReceptacle: tr,
  chartContainer: cc,
  charrefunicodeConverter: uc
}) {
  textReceptacle = tr;
  chartContainer = cc;
  insertText = it;
  charrefunicodeConverter = uc;
  _ = i18n;
  return await chartBuild({descripts});
};

/** @type {number} */
export let lastStartCharCode;

/**
 * @param {{
 *   descripts?: boolean
 * }} [cfg]
 */
const chartBuild = async function chartBuild ({descripts} = {}) {
  const {getPref, setPref} = getUnicodeDefaults();
  const [
    startCharInMiddleOfChart,
    cols,
    onlyentsyes,
    entyes, buttonyes, decyes, hexyes, unicodeyes,
    hexLettersUpper,
    font, lang,
    tblrowsset, currentStartCharCodeInitial
  ] = await Promise.all([
    getPref('startCharInMiddleOfChart'),
    /** @type {Promise<number>} */ (getPref('tblcolsset')),
    /** @type {Promise<boolean>} */ (getPref('onlyentsyes')),
    /** @type {Promise<boolean>} */ (getPref('entyes')),
    /** @type {Promise<boolean>} */ (getPref('buttonyes')),
    getPref('decyes'),
    getPref('hexyes'),
    getPref('unicodeyes'),
    getPref('hexLettersUpper'),
    /** @type {Promise<string>} */ (getPref('font')),
    /** @type {Promise<string>} */ (getPref('lang')),
    getPref('tblrowsset'),
    getPref('currentStartCharCode')
  ]);

  const current = {
    startCharCode: /** @type {number} */ (currentStartCharCodeInitial)
  };
  let rows = /** @type {number} */ (tblrowsset);

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
  }
  resetCurrentStartCharCodeIfOutOfBounds();

  // Todo: Document (or better name) what's going on here with these
  /** @type {number|undefined} */
  let q;
  /** @type {number} */
  let prev;
  /** @type {number[]|undefined} */
  let arr;
  let remainder, rowceil, colsOverRemainder;
  const descriptsOrOnlyEnts = onlyentsyes || Boolean(descripts);
  if (descriptsOrOnlyEnts) {
    arr = descripts
      ? charrefunicodeConverter.descripts
      : charrefunicodeConverter.numericCharacterReferences;
  }
  if (arr) { // `descriptsOrOnlyEnts` and if Unihan, it is present
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
      q = -1; // Had to add this as will increment
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
    rows: (rows * 20) - 10,
    cols: (cols * 20) - 10
  });
  chartContainer.textContent = '';

  const types = {hexyes, decyes, unicodeyes, entyes};
  const appliedFormats = /** @type {const} */ ([
    'decyes', 'hexyes', 'unicodeyes'
  ]).filter((t) => types[t]);

  /** @type {DisplayTypes} */
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

  /** @type {string[]} */
  const captioncntnt = [];
  ['unicode', 'hex', 'dec', 'ent'].forEach((type) => {
    if (types[/** @type {keyof types} */ (type + 'yes')]) {
      captioncntnt.push(_(type + '_noun'));
    }
  });

  const captionContent = _.list([
    // Make first letter of first word upper case
    captioncntnt[0].replace(/^./v, (s) => s.toLocaleUpperCase(
      _.resolvedLocale
    )),
    ...captioncntnt.slice(1)
  ]);

  chartBuildTemplate({
    _, rows, cols, charrefunicodeConverter, current,
    resetCurrentStartCharCodeIfOutOfBounds, // descriptsOrOnlyEnts,
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
