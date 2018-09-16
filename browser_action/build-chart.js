/* eslint-env browser */
import {jml, $, nbsp} from '/vendor/jamilih/dist/jml-es.js';

// Todo:
const _ = (s) => s;

let idgen = 0;

const fill = (items, filler = null) => {
    return new Array(items).fill(filler);
};

// Todo: Should namespace and JSON-convert when retrieving/setting
const getPref = (pref) => {
    switch (pref) {
    case 'hexLettersUpper': case 'onlyentsyes': case 'middleyes':
        return false;
    case 'hexyes': case 'decyes': case 'unicodeyes': case 'buttonyes': case 'entyes':
        return true;
    case 'tblrowsset':
        return 4;
    case 'tblcolsset':
        return 3;
    case 'tblfontsize':
        return 13;
    case 'currstartset':
        return 'a';
    case 'font':
        return '';
    case 'lang':
        return 'en-US';
    }
};

// Todo:
let Unicodecharref;

// Todo:
let j, noGetDescripts;
export {j, noGetDescripts};

const charrefunicodeConverter = {
    descripts: [],
    charrefs: []
};
const CharrefunicodeConsts = {
    ents: [],
    charrefs: []
};

function defineMouseover (kent, khextemp) {
    return function () {
        if (!noGetDescripts) {
            Unicodecharref.getUnicodeDesc(kent, khextemp);
        }
    };
}
const decreg = /^(&#|#)?([0-9][0-9]+);?$/;
const decreg2 = /^(&#|#)([0-9]);?$/;
const hexreg = /^(&#|#|0|U|u)?([xX+])([0-9a-fA-F]+);?$/;

const conversions = {
    hexyes: (k) => `&#${k};`,
    decyes: (k) => {
        const kto16 = getPref('hexLettersUpper')
            ? k.toString(16).toUpperCase()
            : k.toString(16);
        return '&#x' + kto16 + ';';
    },
    unicodeyes: (k) => String.fromCodePoint(k)
};

export default function buildChart (descripts) {
    // Will track where the user last left off
    let k = getPref('currstartset');
    j = k;

    if (k < 0) {
        k = 1114112 + parseInt(k);
    } else if (k.toString().match(decreg)) { // Dec
        k = k.toString().replace(decreg, '$2');
        k = parseInt(k);
    } else if (k.toString().match(decreg2)) { // Dec
        k = k.toString().replace(decreg2, '$2');
        k = parseInt(k);
    } else if (k.toString().match(hexreg)) { // Hex
        k = k.toString().replace(hexreg, '$3');
        k = parseInt(k, 16);
    } else {
        // Convert toString in case trying to get the ASCII for a single digit number
        const kt = k.toString().charCodeAt(0);
        if (kt >= 0xD800 && kt < 0xF900) { // surrogate component (higher plane)
            k = ((kt - 0xD800) * 0x400) + (k.toString().charCodeAt(1) - 0xDC00) + 0x10000;
        } else {
            k = kt;
        }
    }

    if (k > 1114111) {
        k = 0;
    } else if (k < 0) { // could still be less than 0
        k += 1114112;
    }

    let rows = getPref('tblrowsset');
    const cols = getPref('tblcolsset');

    jml($('#inserttext'), {
        rows: rows * 20 - 10,
        cols: cols * 20 - 10
    });

    const decyes = getPref('decyes');
    const hexyes = getPref('hexyes');
    const unicodeyes = getPref('unicodeyes');
    const types = {hexyes, decyes, unicodeyes};
    const middleyes = getPref('middleyes');
    const entyes = getPref('entyes');

    if (middleyes) {
        k = Math.round(k - ((rows * cols) / 2));
        if (k < 0) { // Could still be less than 0
            k += 1114112;
        }
    }

    const onlyentsyes = getPref('onlyentsyes');
    let q, prev, chars, obj, remainder, newrowceil;
    if (onlyentsyes || descripts) {
        chars = descripts ? 'descripts' : 'charrefs';
        obj = descripts ? charrefunicodeConverter : CharrefunicodeConsts;
        const chrreflgth = obj[chars].length;

        if ((rows * cols) > chrreflgth) {
            const newrows = chrreflgth / cols;
            newrowceil = Math.ceil(newrows);

            rows = newrowceil;
            remainder = (rows * cols) - chrreflgth;
        }
        q = obj[chars].indexOf(k);
        if (q === -1) {
            q = 0;
            k = obj[chars][q];
        }

        let newq = q - (cols * rows);
        if (newq < 0) { // Go backwards in the entity array
            newq = chrreflgth + newq;
        }
        prev = obj[chars][newq];
    } else {
        prev = k - (cols * rows);
    }

    // Ensure 0-9 get treated as char. ref. values rather than Unicode digits
    if (prev >= 0 && prev <= 9) {
        prev = `'#${prev}'`;
    }

    const tablecntnr = $('#tablecntnr');
    tablecntnr.textContent = '';

    const captioncntnt = [];
    if (unicodeyes) {
        captioncntnt.push(_('unicode_(noun)'));
    }
    if (hexyes) {
        captioncntnt.push(_('hexadecimal_(noun)'));
    }
    if (decyes) {
        captioncntnt.push(_('decimal_(noun)'));
    }
    if (entyes) {
        captioncntnt.push(_('entities_(noun)'));
    }

    let captcnt = captioncntnt[0].replace(/^([a-z])(.*)$/,
        // Make first letter of first word upper case
        function (_, lower, remainder) {
            return lower.toUpperCase() + remainder;
        }
    );

    // Build caption further
    for (let l = 1; l < captioncntnt.length - 1; l++) {
        captcnt += _('comma') + ' ' + captioncntnt[l];
    }
    if (captioncntnt.length > 2) {
        // <SPACE> is needed at beginning in Hungarian and beginning spaces are lost if don't put such a placeholder
        captcnt += _('commaspaceand').replace(/<SPACE>/, ' ') + ' ' + captioncntnt[captioncntnt.length - 1];
    } else if (captioncntnt.length === 2) {
        captcnt += ' ' + _('and') + ' ' + captioncntnt[captioncntnt.length - 1];
    }

    const buttonyes = getPref('buttonyes');

    const tempcharrefs = CharrefunicodeConsts.charrefs;
    const tempents = CharrefunicodeConsts.ents;
    console.log('rows', rows);
    jml('table', {
        id: 'chart_table',
        class: 'unicodetablecell',
        style: {
            'font-family': getPref('font')
        },
        // Not sure if this will require fixing if xml:lang bug is fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=234485
        lang: getPref('lang')
    }, [
        ['caption', {
            class: 'dialogheader',
            title: _('Unicode_table_caption_title')
        }, [
            captcnt
        ]],
        ...fill(rows).map((row, j) => {
            return ['tr', fill(cols).map((col, i) => {
                if (
                    (descripts || onlyentsyes) &&
                    j === (newrowceil - 1) &&
                    remainder > 0 &&
                    i === (cols - remainder)
                ) {
                    return '';
                }

                let kent = '', kent0 = '';
                const charRefIdx = tempcharrefs.indexOf(k);
                if (charRefIdx > -1) { // If recognized multiple char ent. (won't convert these to decimal)
                    kent0 = '&' + tempents[charRefIdx] + ';';
                    kent = '(' + kent0 + ') ';
                }

                const khextemp = k.toString(16).toUpperCase().padStart(4, '0');

                if (k >= 1114111) {
                    k = 0;
                } else if (onlyentsyes || descripts) {
                    q++;
                    if (q >= obj[chars].length) {
                        q = 0;
                    }
                    k = obj[chars][q];
                } else {
                    k++;
                }

                return ['td', {
                    class: (charRefIdx > -1 ? 'entity ' : '') + 'unicodetablecell',
                    $on: {
                        mouseover: defineMouseover(kent, khextemp),
                        // trying dblclick worked but might not be obvious to
                        //   user and single clicks still activated; relying on
                        //   right button doesn't work
                        click (e) {
                            if (e.ctrlKey) {
                                noGetDescripts = !noGetDescripts;
                            }
                        }
                    }
                }, [
                    ...['decyes', 'hexyes', 'unicodeyes'].filter((t) => types[t]).flatMap((type, i, arr) => {
                        const name = type.replace('yes', '');
                        const isMiddle = i === 1 && arr.length === 2;
                        const isFinal = i === 2;
                        const button = [(buttonyes ? 'button' : 'div'), {
                            class: buttonyes ? 'buttonyes' : null,
                            name,
                            id: '_' + idgen++,
                            $on: {
                                click ({ctrlKey, target}) {
                                    if (!ctrlKey) {
                                        Unicodecharref.insertText('inserttext', target.dataset.value);
                                    }
                                }
                            }
                        }, [
                            conversions[type](k)
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
                    ...(entyes && charRefIdx > -1
                        ? [
                            ['a', {
                                dataset: {
                                    value: kent0
                                },
                                href: '#',
                                $on: {
                                    click (e) {
                                        e.preventDefault();
                                        if (!e.ctrlKey) {
                                            Unicodecharref.insertText('inserttext', kent0);
                                        }
                                    }
                                }
                            }, [
                                kent0
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
                        click () {
                            Unicodecharref.k(prev);
                            Unicodecharref.middleyes(false);
                            Unicodecharref.printunicode(descripts);
                        }
                    }
                }, [
                    _('Prev_set')
                ]],
                ' ' + nbsp + ' ',
                ['a', {
                    href: '#',
                    $on: {
                        click (e) {
                            const next = (k >= 0 && k <= 9)
                                ? `'#${k}'`
                                : k;
                            Unicodecharref.k(next);
                            Unicodecharref.middleyes(false);
                            Unicodecharref.printunicode(descripts);
                            e.preventDefault();
                        }
                    }
                }, [
                    _('Next_set')
                ]]
            ]]
        ]]
    ], tablecntnr);

    /*  This was making the current preferences increment each time the window opened, even if it had not been changed
        this.setCurrstartset(k);
    */

    // Todo: Restore
    // this.resizecells(false, null);
    // window.sizeToContent();
}
