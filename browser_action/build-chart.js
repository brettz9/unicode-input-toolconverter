import {jml, nbsp} from '/vendor/jamilih/dist/jml-es.js';
import {getPref, setPref} from './Preferences.js';
import {fill} from './utils.js';
import {CharrefunicodeConsts} from './unicode/unicodeUtils.js';
import getUnicodeDesc from './getUnicodeDescription.js';

let idgen = 0;
let _, textReceptable, chartContainer, insertText, charrefunicodeConverter;
export default async function ({
    _: i18n,
    descripts,
    insertText: it, textReceptable: tr, chartContainer: cc,
    charrefunicodeConverter: uc
}) {
    textReceptable = tr;
    chartContainer = cc;
    insertText = it;
    charrefunicodeConverter = uc;
    _ = i18n;
    return buildChart({descripts});
}

let lastStartCharCode;

// Todo:
lastStartCharCode; // eslint-disable-line no-unused-expressions

export const buildChart = async function buildChart ({descripts} = {}) {
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
    ].map(getPref));

    let rows = tblrowsset,
        currentStartCharCode = currentStartCharCodeInitial;

    lastStartCharCode = currentStartCharCode;

    const resetCurrentStartCharCodeIfOutOfBounds = () => {
        if (currentStartCharCode < 0) {
            currentStartCharCode += 1114112;
            return;
        }
        if (currentStartCharCode > 1114111) {
            currentStartCharCode = 0;
        }
    };

    if (startCharInMiddleOfChart) {
        currentStartCharCode = Math.round(currentStartCharCode - ((rows * cols) / 2));
        resetCurrentStartCharCodeIfOutOfBounds();
    }

    // Todo: Document (or better name) what's going on here
    let q, prev, chars, obj, remainder, rowceil, colsOverRemainder;
    const descriptsOrOnlyEnts = onlyentsyes || descripts;
    if (descriptsOrOnlyEnts) {
        chars = descripts ? 'descripts' : 'charrefs';
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
        q = obj[chars].indexOf(currentStartCharCode);
        if (q === -1) {
            q = 0;
            currentStartCharCode = obj[chars][q];
        }

        let newq = q - (cols * rows);
        if (newq < 0) { // Go backwards in the entity array
            newq = chrreflgth + newq;
        }
        prev = obj[chars][newq];
    } else {
        prev = currentStartCharCode - (cols * rows);
    }

    jml(textReceptable, {
        rows: rows * 20 - 10,
        cols: cols * 20 - 10
    });
    chartContainer.textContent = '';

    const types = {hexyes, decyes, unicodeyes, entyes};
    const appliedFormats = ['decyes', 'hexyes', 'unicodeyes'].filter((t) => types[t]);
    const displayTypes = {
        hexyes: (k) => `&#${k};`,
        decyes: (k) => {
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

    jml('table', {
        id: 'chart_table',
        class: 'unicodetablecell',
        style: {
            'font-family': font
        },
        // Not sure if this will require fixing if xml:lang bug is fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=234485
        lang
    }, [
        ['caption', {
            class: 'dialogheader',
            title: _('Unicode_table_caption_title')
        }, [
            captionContent
        ]],
        ...fill(rows).map((row, j) => {
            return ['tr', fill(cols).map((col, i) => {
                // Todo: Document what this check is
                if (j === rowceil && i === colsOverRemainder) {
                    return '';
                }

                const charRefIdx = CharrefunicodeConsts.charrefs.indexOf(currentStartCharCode);
                const hasEntity = charRefIdx > -1;
                const entity = hasEntity
                    // If recognized multiple char ent. (won't convert these to decimal)
                    ? '&' + CharrefunicodeConsts.ents[charRefIdx] + ';'
                    : '';

                resetCurrentStartCharCodeIfOutOfBounds();
                // Todo: Document what's going on here
                if (descriptsOrOnlyEnts) {
                    q++;
                    if (q >= obj[chars].length) {
                        q = 0;
                    }
                    currentStartCharCode = obj[chars][q];
                } else {
                    currentStartCharCode++;
                }

                return ['td', {
                    class: (hasEntity ? 'entity ' : '') + 'unicodetablecell',
                    $on: {
                        mouseover: (function (entity, currentStartCharCode) {
                            return function () {
                                if (!this.$noGetDescripts) {
                                    getUnicodeDesc(entity, currentStartCharCode);
                                }
                            };
                        })(entity, currentStartCharCode),
                        // trying dblclick worked but might not be obvious to
                        //   user and single clicks still activated; relying on
                        //   right button doesn't work
                        click (e) {
                            if (e.ctrlKey) {
                                this.$noGetDescripts = !this.$noGetDescripts;
                            }
                        }
                    }
                }, [
                    ...appliedFormats.flatMap((type, i, arr) => {
                        const name = type.replace('yes', '');
                        const isMiddle = i === 1 && arr.length === 2;
                        const isFinal = i === 2;
                        const button = [(buttonyes ? 'button' : 'div'), {
                            class: buttonyes ? 'buttonyes' : null,
                            name,
                            id: '_' + idgen++,
                            dataset: {
                                value: displayTypes[type](currentStartCharCode)
                            },
                            $on: {
                                click ({ctrlKey, target: {dataset: {value}}}) {
                                    if (!ctrlKey) {
                                        insertText({textReceptable, value});
                                    }
                                }
                            }
                        }, [
                            // Todo: Add substitute character if detect is an invisible?
                            displayTypes[type](currentStartCharCode)
                        ]];
                        const container = isFinal ? jml('div', {
                            class: 'centered'
                        }, [button]) : button;
                        return [
                            isMiddle
                                ? nbsp.repeat(3)
                                : isFinal
                                    ? ['br']
                                    : '',
                            container
                        ];
                    }),
                    ...(entyes && hasEntity
                        ? [
                            ['a', {
                                href: '#',
                                $on: {
                                    click (e) {
                                        e.preventDefault();
                                        if (!e.ctrlKey) {
                                            insertText({textReceptable, value: entity});
                                        }
                                    }
                                }
                            }, [
                                entity
                            ]],
                            ' '
                        ]
                        : [''])
                ]];
            })];
        }),
        ['tr', [
            ['td', {
                class: 'centered',
                colspan: cols
            }, [
                ['a', {
                    href: '#',
                    $on: {
                        async click (e) {
                            e.preventDefault();
                            await Promise.all([
                                setPref('currentStartCharCode', prev),
                                setPref('startCharInMiddleOfChart', false)
                            ]);
                            buildChart(descripts);
                        }
                    }
                }, [
                    _('Prev_set')
                ]],
                ' ' + nbsp + ' ',
                ['a', {
                    href: '#',
                    $on: {
                        async click (e) {
                            e.preventDefault();
                            await Promise.all([
                                setPref('currentStartCharCode', currentStartCharCode),
                                setPref('startCharInMiddleOfChart', false)
                            ]);
                            buildChart(descripts);
                        }
                    }
                }, [
                    _('Next_set')
                ]]
            ]]
        ]]
    ], chartContainer);

    // Todo: Restore
    // this.resizecells({sizeToContent: true});
};
