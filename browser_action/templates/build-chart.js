import {jml, nbsp} from '/vendor/jamilih/dist/jml-es.js';
import {fill} from '../templateUtils/fill.js';
import charrefunicodeDb from '../unicode/charrefunicodeDb.js';

let idgen = 0;
export default function ({
    _, rows, cols, CharrefunicodeConsts, current,
    resetCurrentStartCharCodeIfOutOfBounds, descriptsOrOnlyEnts,
    q, obj, chars, textReceptacle, entyes, buildChart, descripts,
    chartContainer,
    setPref, insertText, buttonyes, font, lang, prev,
    rowceil, colsOverRemainder, appliedFormats, displayTypes,
    captionContent
}) {
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

                const charRefIdx = CharrefunicodeConsts.NumericCharacterReferences.indexOf(current.startCharCode);
                const hasEntity = charRefIdx > -1;
                const entity = hasEntity
                    // If recognized multiple char ent. (won't convert these to decimal)
                    ? '&' + CharrefunicodeConsts.Entities[charRefIdx] + ';'
                    : '';

                resetCurrentStartCharCodeIfOutOfBounds();
                // Todo: Document what's going on here
                if (descriptsOrOnlyEnts) {
                    q++;
                    if (q >= obj[chars].length) {
                        q = 0;
                    }
                    current.startCharCode = obj[chars][q];
                } else {
                    current.startCharCode++;
                }

                return ['td', {
                    class: (hasEntity ? 'entity ' : '') + 'unicodetablecell',
                    $on: {
                        mouseover: (function (entity, current) {
                            return function () {
                                if (!this.$noGetDescripts) {
                                    charrefunicodeDb.getUnicodeDescription(entity, current.startCharCode);
                                }
                            };
                        })(entity, current),
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
                                value: displayTypes[type](current.startCharCode)
                            },
                            $on: {
                                click ({ctrlKey, target: {dataset: {value}}}) {
                                    if (!ctrlKey) {
                                        insertText({textReceptacle, value});
                                    }
                                }
                            }
                        }, [
                            // Todo: Add substitute character if detect is an invisible?
                            displayTypes[type](current.startCharCode)
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
                                            insertText({textReceptacle, value: entity});
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
                                setPref('currentStartCharCode', current.startCharCode),
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
}
