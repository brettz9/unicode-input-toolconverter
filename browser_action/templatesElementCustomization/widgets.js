import {jml, $$} from '../../vendor/jamilih/dist/jml-es.js';

/**
 * @typedef {HTMLElement & {
 *   $getTabs: () => HTMLElement[],
 *   $getTabPanels: () => HTMLElement[],
 *   $selectTabForTabPanel: (tabPanel: HTMLDivElement) => void
 *   $selectTab: (tab: Element) => void,
 *   $selectedTab: () => HTMLElement
 * }} TabBox
 */

/**
 * @param {string} sel The selector
 */
export const makeTabBox = function (sel) {
  /**
   * @type {TabBox[]}
   */
  ($$(sel)).forEach(function (tabbox) {
    tabbox.$getTabs = function () {
      return /** @type {HTMLElement[]} */ ([...(/** @type {HTMLElement} */ (
        this.querySelector('.tabs')
      )).children].filter((child) => {
        return child.classList.contains('tab');
      }));
    };
    tabbox.$getTabPanels = function () {
      return /** @type {HTMLElement[]} */ (
        [...this.children].filter((tabPanel) => {
          return tabPanel.classList.contains('tabpanel');
        })
      );
    };
    tabbox.$selectTabForTabPanel = function (tabPanel) {
      const tabs = tabbox.$getTabs();
      const tab = tabs.find((tb) => {
        return tb.dataset.label === tabPanel.dataset.label;
      });
      tabbox.$selectTab(/** @type {Element} */ (tab));
    };
    tabbox.$selectTab = function (tab) {
      const tabs = tabbox.$getTabs();
      tabbox.$getTabPanels().forEach((tabPanel, i) => {
        const childTab = tabs[i];
        if (tab === childTab) {
          childTab.dataset.selected = 'true';
          tabPanel.dataset.selected = 'true';
        } else {
          delete childTab.dataset.selected;
          delete tabPanel.dataset.selected;
        }
      });
    };
    tabbox.$selectedTab = function (/* tab */) {
      return /** @type {HTMLElement} */ (
        tabbox.$getTabPanels().find(({dataset: {selected}}) => {
          return selected;
        })
      );
    };
    /** @type {HTMLElement} */
    (tabbox.querySelector('.tabs')).prepend(...tabbox.$getTabPanels().map(({
      dataset: {title, selected, label}
    }) => {
      // Set to h1 for accessibility, though styles will reduce default size
      return jml('h1', {
        class: 'tab',
        title,
        dataset: {selected, label},
        $on: {
          click () {
            tabbox.$selectTab(this);
          }
        }
      }, [
        /** @type {string} */ (label)
      ]);
    }), jml('br', {style: 'clear: left;'}));
  });
};
