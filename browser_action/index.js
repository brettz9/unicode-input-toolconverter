/* eslint-env browser, webextensions */
/* globals jQuery */
import {jml, body, $} from '/vendor/jamilih/dist/jml-es.js';
import {i18n} from './I18n.js';
import addMillerColumnPlugin from '/vendor/miller-columns/dist/index-es.min.js';
import unicodeScripts from '/browser_action/unicode-scripts.js';
import getBuildChart from '/browser_action/build-chart.js';
import insertIntoOrOverExisting from '/browser_action/insertIntoOrOverExisting.js';

(async () => {
await addMillerColumnPlugin(jQuery, {stylesheets: [
    '/vendor/miller-columns/miller-columns.css'
]});

// Todo:
const lang = new URL(location).searchParams.get('lang');
const locales = lang ? [lang] : navigator.languages; // ['sv-SE']; // ['pt-BR']; // ['hu-HU'];
if (!locales.includes('en-US')) { // Ensure there is at least one working language!
    locales.push('en-US');
}
const _ = await i18n({locales, defaults: false});

const selectTabs = {
    $selectTab (tab) {
        [...this.children].forEach((childTab) => {
            tab.dataset.selected = tab === childTab;
        });
    },
    $selectedTab () {
        return [...this.children].find(({dataset: {selected}}) => {
            return selected;
        });
    }
};

jml('div', [
    ['div', {
        id: 'unicodetabpanels', // tabbox
        class: 'tabpanels',
        $custom: selectTabs
    }, [
        ['div', {
            id: 'charts',
            title: _('Charts_tab_label'),
            class: 'tabpanel'
        }, []],
        ['div', {
            id: 'conversion',
            title: _('Conversion_tab_label'),
            class: 'tabpanel'
        }, []],
        ['div', {
            id: 'prefs',
            title: _('Prefs_tab_label'),
            class: 'tabpanel'
        }, []],
        ['div', {
            id: 'DTDpanel',
            title: _('DTD_tab_label'),
            class: 'tabpanel'
        }, []],
        ['div', {
            id: 'notes',
            title: _('Notes_tab_label'),
            class: 'tabpanel'
        }, []],
        ['div', {
            id: 'about',
            title: _('About_tab_label'),
            class: 'tabpanel'
        }, [
            ['h2', [_('About_dialogheader_title')]],
            ['p', [
                _('About_developer_and_contributors', {
                    About_developer: _('About_developer'),
                    About_contributors: _('About_contributors'),
                    About_developer_link: jml('a', {
                        href: 'mailto:brett@brett-zamir.name',
                        target: '_top'
                    }, [
                        _('About_developer_linkText')
                    ])
                }),
                ' ',
                _('About_paypal', {
                    About_paypal_button: jml('button', {
                        id: 'paypalbutton',
                        $on: {
                            click () {
                                window.open(
                                    'https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=brettz9%40yahoo%2ecom&no_shipping=0&no_note=1&tax=0&currency_code=USD&bn=PP%2dDonationsBF&charset=UTF%2d8',
                                    'bzamirpaypal'
                                );
                            }
                        }
                    }, [
                        _('About_paypal_buttonText')
                    ])
                })
            ]],
            ['p', [
                _('About_ial', {
                    About_ial_wikipedia_link: jml('a', {
                        class: 'text-link',
                        target: '_blank',
                        href: _('About_ial_wikipedia_linkURL')
                    }, [
                        _('About_ial_wikipedia_linkText')
                    ]),
                    About_ial_onetongue_link: jml('a', {
                        class: 'text-link',
                        target: '_blank',
                        href: 'http://onetongue.com'
                    }, [
                        _('About_ial_onetongue_linkText')
                    ])
                })
            ]]
        ]]
    ]],
    ['div', {class: 'miller-breadcrumbs'}],
    ['div', {class: 'miller-columns', tabindex: '1'}, [
        unicodeScripts
    ]],

    ['div', {
        id: 'chartContainer'
    }],
    ['input', {
        id: 'insertText'
    }]
], body);

jQuery('div.miller-columns').millerColumns({
    // current ($item, $cols) { console.log('User selected:', $item); }
});

await getBuildChart({
    _,
    textReceptable: $('#insertText'),
    chartContainer: $('#chartContainer'),
    // Todo: Get working
    insertText: ({textReceptable, value}) => {
        insertIntoOrOverExisting({textReceptable, value});

        // Save values for manipulation by entity addition function, 'insertent'
        // Todo: Fix and use
        this.selst = textReceptable.selectionStart;
        this.selend = textReceptable.selectionEnd;
    }
});
})();
