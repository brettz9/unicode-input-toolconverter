import {jml, $$} from '../../vendor/jamilih/dist/jml-es.js';

export const makeTabBox = function (sel) {
  $$(sel).forEach(function (tabbox) {
    tabbox.$getTabs = function () {
      return [...this.querySelector('.tabs').children].filter((child) => {
        return child.classList.contains('tab');
      });
    };
    tabbox.$getTabPanels = function () {
      return [...this.children].filter((tabPanel) => {
        return tabPanel.classList.contains('tabpanel');
      });
    };
    tabbox.$selectTabForTabPanel = function (tabPanel) {
      const tabs = tabbox.$getTabs();
      const tab = tabs.find((tb) => {
        return tb.dataset.label === tabPanel.dataset.label;
      });
      return tabbox.$selectTab(tab);
    };
    tabbox.$selectTab = function (tab) {
      const tabs = tabbox.$getTabs();
      tabbox.$getTabPanels().forEach((tabPanel, i) => {
        const childTab = tabs[i];
        if (tab === childTab) {
          childTab.dataset.selected = true;
          tabPanel.dataset.selected = true;
        } else {
          delete childTab.dataset.selected;
          delete tabPanel.dataset.selected;
        }
      });
    };
    /*
    // Should work, but unused
    tabbox.$selectedTab = function (tab) {
      return tabbox.$getTabPanels().find(({dataset: {selected}}) => {
        return selected;
      });
    };
    */
    tabbox.querySelector('.tabs').prepend(...tabbox.$getTabPanels().map(({
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
      }, [label]);
    }), jml('br', {style: 'clear: left;'}));
  });
};
