import {jml, $$} from '/vendor/jamilih/dist/jml-es.js';

export const makeTabBox = function (sel) {
    $$(sel).forEach(function (tabBox) {
        tabBox.$getTabs = function () {
            return [...this.querySelector('.tabs').children].filter((child) => {
                return child.classList.contains('tab');
            });
        };
        tabBox.$getTabPanels = function () {
            return [...this.children].filter((tabPanel) => {
                return tabPanel.classList.contains('tabpanel');
            });
        };
        tabBox.$selectTab = function (tab) {
            const tabs = tabBox.$getTabs();
            tabBox.$getTabPanels().forEach((tabPanel, i) => {
                const childTab = tabs[i];
                if (tab === childTab) {
                    childTab.dataset.selected = true;
                    tabPanel.dataset.selected = true;
                } else {
                    childTab.removeAttribute('data-selected');
                    tabPanel.removeAttribute('data-selected');
                }
            });
        };
        tabBox.$selectedTab = function (tab) {
            return tabBox.$getTabPanels().find(({dataset: {selected}}) => {
                return selected;
            });
        };
        tabBox.querySelector('.tabs').prepend(...tabBox.$getTabPanels().map((tabPanel) => {
            return jml('div', {
                class: 'tab',
                dataset: {selected: tabPanel.dataset.selected},
                $on: {
                    click () {
                        tabBox.$selectTab(this);
                    }
                }
            }, [tabPanel.title]);
        }), jml('br', {style: 'clear: left;'}));
    });
};
