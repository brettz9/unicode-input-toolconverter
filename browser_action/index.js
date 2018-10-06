/* eslint-env browser, webextensions */
/* globals jQuery, Unicodecharref */
import {jml, body, $} from '/vendor/jamilih/dist/jml-es.js';
import {i18n} from './I18n.js';
import {fill} from './utils.js';
import {makeTabBox} from './widgets.js';
import addMillerColumnPlugin from '/vendor/miller-columns/dist/index-es.min.js';
import unicodeScripts from '/browser_action/unicode-scripts.js';
import getBuildChart from '/browser_action/build-chart.js';
import insertIntoOrOverExisting from '/browser_action/insertIntoOrOverExisting.js';

(async () => {
await addMillerColumnPlugin(jQuery, {stylesheets: [
    'unicode-dialog.css', // Per our widget "standard", allow for injecting of others
    '/vendor/miller-columns/miller-columns.css'
]});

// Todo:
const lang = new URL(location).searchParams.get('lang');
const locales = lang ? [lang] : [...navigator.languages]; // ['sv-SE']; // ['pt-BR']; // ['hu-HU'];
const engPos = locales.indexOf('en-US');
if (engPos > -1) {
    locales[engPos] = 'en'; // Optimize for English (and avoid console errors)
}
if (!locales.includes('en')) { // Ensure there is at least one working language!
    locales.push('en');
}
const _ = await i18n({locales, defaults: false});

jml('div', [
    ['div', {
        id: 'unicodeTabBox',
        class: 'tabBox'
    }, [
        ['div', {class: 'tabs'}],
        ['div', {
            id: 'charts',
            title: _('Charts_tab_label'),
            dataset: {selected: true},
            class: 'tabpanel'
        }, [
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
        ]],
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
        }, [
            ['h2', {class: 'dialogheader'}, [
                _('dialogheader_value')
            ]],
            ...fill(2).map((__, i) => {
                i++;
                return ['p', [
                    _(`DTD_desc_value${i}`)
                ]];
            }),
            ['textarea', {id: 'DTDtextbox', style: 'width: 400px; height: 300px;', $on: {
                change () {
                    Unicodecharref.registerDTD();
                }
            }}, [
                _('DTD_textbox_value')
            ]],
            ['label', [
                _('DTD_insertEntityFile'),
                ['select', {
                    id: 'insertEntityFile',
                    class: 'dtdbutton'
                }, [
                    ['optgroup', {label: 'Graphic'}, [
                        ['option', {value: 'isobox'}, [_('ent_isobox')]],
                        ['option', {value: 'isonum'}, [_('ent_isonum')]]
                    ]],
                    ['optgroup', {label: 'Math Symbols'}, [
                        ['option', {value: 'xhtml1-symbol'}, [_('ent_xhtml1_symbol')]],
                        ['option', {value: 'isoamsa'}, [_('ent_isoamsa')]],
                        ['option', {value: 'isoamsb'}, [_('ent_isoamsb')]],
                        ['option', {value: 'isoamsc'}, [_('ent_isoamsc')]],
                        ['option', {value: 'isoamsn'}, [_('ent_isoamsn')]],
                        ['option', {value: 'isoamso'}, [_('ent_isoamso')]],
                        ['option', {value: 'isoamsr'}, [_('ent_isoamsr')]]
                    ]],
                    ['optgroup', {label: 'Math Alphabets'}, [
                        ['option', {value: 'isomfrk'}, [_('ent_isomfrk')]],
                        ['option', {value: 'isomopf'}, [_('ent_isomopf')]],
                        ['option', {value: 'isomscr'}, [_('ent_isomscr')]]
                    ]],
                    ['optgroup', {label: 'MathML'}, [
                        ['option', {value: 'mmlextra'}, [_('ent_mmlextra')]],
                        ['option', {value: 'mmlalias'}, [_('ent_mmlalias')]]
                    ]],
                    ['optgroup', {label: 'Cyrillic'}, [
                        ['option', {value: 'isocyr1'}, [_('ent_isocyr1')]],
                        ['option', {value: 'isocyr2'}, [_('ent_isocyr2')]]
                    ]],
                    ['optgroup', {label: 'Greek'}, [
                        ['option', {value: 'isogrk1'}, [_('ent_isogrk1')]],
                        ['option', {value: 'isogrk2'}, [_('ent_isogrk2')]],
                        ['option', {value: 'isogrk3'}, [_('ent_isogrk3')]],
                        ['option', {value: 'isogrk4'}, [_('ent_isogrk4')]]
                    ]],
                    ['optgroup', {label: 'Latin'}, [
                        ['option', {value: 'isolat1'}, [_('ent_isolat1')]],
                        ['option', {value: 'isolat2'}, [_('ent_isolat2')]],
                        ['option', {value: 'xhtml1-lat1'}, [_('ent_xhtml1_lat1')]]
                    ]],
                    ['optgroup', {label: 'XHTML/HTML/XML'}, [
                        ['option', {value: 'xhtml1-lat1'}, [_('ent_xhtml1_lat1')]],
                        ['option', {value: 'xhtml1-special'}, [_('ent_xhtml1_special')]],
                        ['option', {value: 'xhtml1-symbol'}, [_('ent_xhtml1_symbol')]],
                        ['option', {value: 'html5-uppercase'}, [_('ent_html5_uppercase')]],
                        ['option', {value: 'predefined'}, [_('ent_predefined')]]
                    ]],
                    ['optgroup', {label: 'Other'}, [
                        ['option', {value: 'isodia'}, [_('ent_isodia')]],
                        ['option', {value: 'isopub'}, [_('ent_isopub')]],
                        ['option', {value: 'isotech'}, [_('ent_isotech')]]
                    ]]
                ]]
            ]],
            ['button', {class: 'dtdbutton', $on: {click () {
                Unicodecharref.insertent('DTDtextbox');
            }}}, [
                _('DTD_insertent')
            ]],
            ['label', [
                _('appendhtml_checkbox'),
                ['input', {
                    id: 'appendtohtmldtd',
                    type: 'checkbox',
                    $on: {
                        click (e) {
                            e.preventDefault();
                            Unicodecharref.append2htmlflip(e);
                        }
                    }
                }]
            ]]
        ]],
        ['div', {
            id: 'notes',
            title: _('Notes_tab_label'),
            class: 'tabpanel'
        }, [
            ['h2', {class: 'dialogheader'}, [_('Notes_dialogheader_title')]],
            ['section', [
                ['div', {class: 'noteDescriptionBox'}, [
                    ['h3', [_('note_heading')]],
                    ...fill(8).map((__, i) => {
                        i++;
                        return ['div', {class: 'notesdescription'}, [
                            _(`notespar${i}`)
                        ]];
                    })
                ]],
                ['div', {class: 'noteDescriptionBox'}, [
                    ['h3', [_('usage_note_heading')]],
                    ...fill(13).map((__, i) => {
                        i++;
                        return ['div', {class: 'usage_notesdescription'}, [
                            _(`usage_notespar${i}`)
                        ]];
                    })
                ]]
            ]]
        ]],
        ['div', {
            id: 'about',
            title: _('About_tab_label'),
            class: 'tabpanel'
        }, [
            ['h2', {class: 'dialogheader'}, [_('About_dialogheader_title')]],
            ['section', [
                ['p', {class: 'aboutdescription'}, [
                    _('About_developer_and_contributors', {
                        About_developer: _('About_developer'),
                        About_contributors: _('About_contributors'),
                        About_developer_link: jml('a', {
                            href: 'mailto:brett@brett-zamir.name',
                            target: '_top'
                        }, [
                            _('About_developer_linkText')
                        ])
                    })
                ]],
                ['p', {class: 'aboutdescription'}, [
                    _('About_donation', {
                        About_donation_button: jml('button', {
                            id: 'donationbutton',
                            $on: {
                                click () {
                                    window.open(
                                        'https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=brettz9%40yahoo%2ecom&no_shipping=0&no_note=1&tax=0&currency_code=USD&bn=PP%2dDonationsBF&charset=UTF%2d8',
                                        'bzamirdonation'
                                    );
                                }
                            }
                        }, [
                            _('About_donation_buttonText')
                        ])
                    })
                ]],
                ['p', {class: 'aboutdescription'}, [
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
        ]]
    ]]
], body);

jQuery('div.miller-columns').millerColumns({
    // current ($item, $cols) { console.log('User selected:', $item); }
});

makeTabBox('.tabBox');

await getBuildChart({
    _,
    textReceptable: $('#insertText'),
    chartContainer: $('#chartContainer'),
    // Todo: Get working
    insertText: ({textReceptable, value}) => {
        insertIntoOrOverExisting({textReceptable, value});

        // Save values for manipulation by entity addition function, 'insertent'
        // Todo: Fix and use
        /*
        this.selst = textReceptable.selectionStart;
        this.selend = textReceptable.selectionEnd;
        */
    }
});
})();
