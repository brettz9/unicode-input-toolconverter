/* globals jQuery -- No ESM */
import {$} from '../vendor/jamilih/dist/jml-es.js';
import {getChartBuild, chartBuild} from './chartBuild.js';
import unicodecharref from './unicodecharref.js';
import {insertIntoOrOverExisting} from './utils/TextUtils.js';
import {getUnicodeDefaults} from './preferences/prefDefaults.js';
import addMillerColumnPlugin from
  '../vendor/miller-columns/dist/index-es.min.js';

/**
 * @param {PlainObject} cfg
 * @param {external:IntlDom} cfg._
 * @param {charrefunicodeConverter} cfg.charrefunicodeConverter
 * @returns {Promise<void>}
 */
async function characterSelection ({
  _, charrefunicodeConverter
}) {
  const {setPref} = getUnicodeDefaults();
  await getChartBuild({
    _,
    charrefunicodeConverter,
    textReceptacle: $('#insertText'),
    chartContainer: $('#chartContainer'),
    // Todo: Get working
    insertText ({textReceptacle, value}) {
      insertIntoOrOverExisting({textReceptacle, value});

      // Save values for manipulation by entity addition function, 'insertent'
      // Todo: Fix and use
      /*
      this.selst = textReceptacle.selectionStart;
      this.selend = textReceptacle.selectionEnd;
      */
    }
  });

  await addMillerColumnPlugin(jQuery, {stylesheets: [
    // Per our widget "standard", allow for injecting of others in parallel
    [
      location.href.includes('index-pages')
        ? '/unicode-input-toolconverter/icons/openWindow24.png'
        : '/icons/openWindow24.png',
      {favicon: true}
    ],
    location.href.includes('index-pages')
      ? '/unicode-input-toolconverter/browser_action/styles/unicode-dialog.css'
      : '/browser_action/styles/unicode-dialog.css',
    location.href.includes('index-pages')
      ? '/unicode-input-toolconverter//vendor/miller-columns/miller-columns.css'
      : '/vendor/miller-columns/miller-columns.css'
  ]});

  jQuery('div.miller-columns').millerColumns({
    /*
    preview () {
      // $('#chart_selectchar_persist').scrollLeft = 2000;
      return '';
    },
    */
    delay: 100, // Shorten delay until we can figure out how to fix jumpiness
    scroll () {
      // Due to an overflow within an overflow, we have to also force
      //   this scroll left
      $('#chart_selectchar_persist').scrollLeft = 2000;
    },
    async current ($item, $cols) {
      if (!$item) { // Todo: Is this an error?
        return;
      }
      // console.log('User selected:', $item);
      const title = $item[0].getAttribute('title');
      if (!title) {
        return;
      }
      await setPref(
        'currentStartCharCode',
        Number.parseInt(title.replace(/-.*$/u, ''), 16)
      );
      // Free to use `chartBuild` now that we have passed set-up
      await chartBuild(); // Todo: descripts?
      await unicodecharref.resizecells();
    }
  });
  $('div.miller-columns').style.display = 'block';
}

export default characterSelection;
