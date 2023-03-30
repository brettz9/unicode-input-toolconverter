import {jml, nbsp} from '../../vendor/jamilih/dist/jml-es.js';
import {fill} from '../templateUtils/fill.js';
import unicodecharref from '../unicodecharref.js';

let idgen = 0;
const chartBuildTemplate = function ({
  _, rows, cols, charrefunicodeConverter, current,
  resetCurrentStartCharCodeIfOutOfBounds, descriptsOrOnlyEnts,
  q, textReceptacle, entyes, chartBuild, descripts,
  chartContainer, arr,
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
    // Todo: Not sure if this (or the `lang_tooltiptext` locale message) requires fixing with xml:lang bug fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=234485
    lang
  }, [
    ['caption', {
      class: 'dialogheader',
      title: _('Unicode_table_caption_title')
    }, [
      captionContent
    ]],
    ...fill(rows).map((_row, j) => {
      return ['tr', fill(cols).map((_col, i) => {
        // If more rows/cols. specified than match
        if (j === rowceil && i === colsOverRemainder) {
          return '';
        }

        const charRefIdx = charrefunicodeConverter
          .numericCharacterReferences.indexOf(
            // We've now had to add 1 here for some reason
            current.startCharCode + 1
          );
        const hasEntity = charRefIdx > -1;
        const entity = hasEntity
          // If recognized multiple char ent. (won't convert these to decimal)
          ? '&' + charrefunicodeConverter.entities[charRefIdx] + ';'
          : '';

        // Todo: Document what's going on here
        if (descriptsOrOnlyEnts) {
          q++;
          if (q >= arr.length) {
            q = 0;
          }
          current.startCharCode = arr[q];
        } else {
          current.startCharCode++;
        }
        resetCurrentStartCharCodeIfOutOfBounds();

        return ['td', {
          class: (hasEntity ? 'entity ' : '') + 'unicodetablecell',
          $on: {
            mouseover: (function (_entity, startCharCode) {
              return function () {
                if (!this.$noGetDescripts) {
                  unicodecharref.getUnicodeDescription(
                    _entity,
                    // Needed to convert this for some reason
                    startCharCode.toString(16).toUpperCase().padStart(4, '0')
                  );
                }
              };
            })(entity, current.startCharCode),
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
          ...appliedFormats.flatMap((type, idx, array) => {
            const name = type.replace('yes', '');
            const isMiddle = idx === 1 && array.length === 2;
            const isFinal = idx === 2;
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
              await chartBuild({descripts});
              await unicodecharref.resizecells();
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
              await chartBuild({descripts});
              await unicodecharref.resizecells();
            }
          }
        }, [
          _('Next_set')
        ]]
      ]]
    ]]
  ], chartContainer);
};

export default chartBuildTemplate;
