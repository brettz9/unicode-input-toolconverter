import {jml, $$} from '/vendor/jamilih/dist/jml-es.js';

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
        tabbox.$selectTab = function (tab) {
            const tabs = tabbox.$getTabs();
            tabbox.$getTabPanels().forEach((tabPanel, i) => {
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
        tabbox.$selectedTab = function (tab) {
            return tabbox.$getTabPanels().find(({dataset: {selected}}) => {
                return selected;
            });
        };
        tabbox.querySelector('.tabs').prepend(...tabbox.$getTabPanels().map(({dataset}) => {
            return jml('div', {
                class: 'tab',
                title: dataset.title,
                dataset: {selected: dataset.selected},
                $on: {
                    click () {
                        tabbox.$selectTab(this);
                    }
                }
            }, [dataset.label]);
        }), jml('br', {style: 'clear: left;'}));
    });
};
