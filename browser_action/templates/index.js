import {jml, body, $, $$, nbsp} from '../../vendor/jamilih/dist/jml-es.js';
import {fill} from '../templateUtils/fill.js';
import {safeLink} from '../templateUtils/validation.js';
// import encodings from '../encodings.js';
import unicodeScripts from '../unicode/unicodeScripts.js';
import {
  unihanFieldInfo, unicodeFieldInfo
} from '../unicode/unicodeFieldInfo.js';
import unicodecharref from '../unicodecharref.js';
import CharrefConverterBridges from '../charrefConverters.js';
import {registerDTD} from '../entityBehaviors.js';

const indexTemplate = function ({_, fonts}) {
  $('html').lang = _.resolvedLocale;
  document.title = _('uresults_title');
  jml('div', {
    role: 'main'
  }, [
    ['div', {
      id: 'unicodeTabBox',
      style: 'width: 700px;',
      class: 'tabbox'
    }, [
      ['div', {class: 'tabs'}],
      ['div', {
        id: 'charts',
        dataset: {
          selected: true,
          label: _('Charts_tab_label')
        },
        class: 'tabpanel'
      }, [
        ['div', {class: 'hbox'}, [
          ['div', {
            id: 'chart_selectchar_persist_vbox', class: 'vbox chartBox'
          }, [
            ['div', {id: 'selectChar'}, [
              ['fieldset', [
                ['legend', [_('caption_chart_selectchar')]],
                ['div', {class: 'hbox'}, [
                  ['div', {title: _('desc_digits')}, [
                    ['label', {for: 'startset'}, [
                      _('charhexdecchoices')
                    ]]
                  ]],
                  ['div', [
                    ['label', {for: 'searchName'}, [
                      _('searchName')
                    ]]
                  ]],
                  ['div', [
                    ['label', {for: 'searchkDefinition'}, [
                      _('searchkDefinition')
                    ]]
                  ]]
                ]],
                ['div', {class: 'hbox'}, [
                  ['input', {
                    title: _('desc_digits'),
                    id: 'startset',
                    class: 'searchBox',
                    $on: {
                      change () {
                        unicodecharref.startset(this);
                      },
                      input () {
                        unicodecharref.startset(this);
                      }
                    }
                  }],
                  ['input', {
                    id: 'searchName',
                    class: 'searchBox',
                    $on: {
                      async change () {
                        await unicodecharref.searchUnicode(this);
                      },
                      async input () {
                        await unicodecharref.searchUnicode(this);
                      }
                    }
                  }],
                  ['input', {
                    id: 'searchkDefinition',
                    class: 'searchBox',
                    $on: {
                      change () {
                        unicodecharref.searchUnihan(this);
                      },
                      input () {
                        unicodecharref.searchUnihan(this);
                      }
                    }
                  }]
                ]]
              ]]
            ]],
            ['div', {id: 'chart_selectchar_persist'}, [
              ['div', {id: 'menulists', class: 'vbox'}, [
                ['fieldset', [
                  ['legend', [_('chooseregion')]],
                  ['div', {class: 'miller-breadcrumbs'}],
                  ['div', {class: 'miller-columns', tabindex: '1'}, [
                    unicodeScripts(_)
                    /*
                    // Avoid erring on missing
                    unicodeScripts((...args) => {
                      try {
                        return _(...args);
                      } catch (err) {
                        return args[0];
                      }
                    })
                    */
                  ]]
                ]]
              ]]
            ]],
            /*
            // ['splitter'],
            ['div', {id: 'specializedSearch', hidden: true}, [
              ['fieldset', [
                ['legend', [_('Specialized_search')]],
                ['div', {
                  id: 'tabboxSearch',
                  class: 'tabbox'
                }, [
                  ['div', {class: 'tabs'}, []],
                  ['div', {
                    id: 'regularSearch',
                    dataset: {
                      label: _('Regular_tab_label'),
                      title: _('Regular_tooltip'),
                      selected: true
                    },
                    class: 'tabpanel'
                  }, [
                    ['div', {class: 'hbox'}, [
                      ['div', {
                        id: 'searchGrid'
                      }, [
                        ['div', {
                          id: 'UnicodeSearch'
                        }]
                      ]]
                    ]]
                  ]],
                  ['div', {
                    id: 'cjkSearch',
                    dataset: {
                      label: _('CJK_tab_label'),
                      title: _('CJK_tooltip'),
                      selected: true
                    },
                    class: 'tabpanel'
                  }, [
                    ['div', {class: 'hbox'}, [
                      ['div', {id: 'searchGridCJK'}, [
                        ['div', {
                          id: 'UnihanSearch'
                        }]
                      ]]
                    ]]
                  ]]
                ]]
              ]]
            ]],
            */
            // ['splitter'],
            ['div', {id: 'chart_layout_persist'}, [
              ['fieldset', [
                ['legend', [_('caption_chart_layout')]],
                ['div', {class: 'vbox'}, [
                  ['div', {class: 'hbox chartLayout'}, [
                    ['label', [
                      ['input', {
                        type: 'checkbox',
                        id: 'onlyentsyes',
                        class: 'charthbox',
                        $on: {
                          async click (e) {
                            await unicodecharref.onlyentsyesflip(e);
                          }
                        }
                      }],
                      _('label_onlyentsyesq')
                    ]]
                  ]],
                  ['div', [
                    ['div', {class: 'hbox chartLayout'}, [
                      ['label', [
                        _('label_norows'), nbsp.repeat(2),
                        ['input', {
                          id: 'rowsset',
                          $on: {
                            async change (e) {
                              await unicodecharref.rowsset(e);
                            }
                          }
                        }]
                      ]],
                      nbsp.repeat(4),
                      ['label', [
                        _('label_nocols'), nbsp.repeat(2),
                        ['input', {
                          id: 'colsset',
                          $on: {
                            async change (e) {
                              await unicodecharref.colsset(e);
                            }
                          }
                        }]
                      ]]
                    ]],
                    ['div', {class: 'hbox'}, [
                      ['label', {class: 'chartLayout'}, [
                        ['input', {
                          type: 'checkbox',
                          id: 'entyes',
                          class: 'charthbox',
                          $on: {
                            async click (e) {
                              await unicodecharref.entflip(e);
                            }
                          }
                        }],
                        _('label_entq')
                      ]],
                      nbsp.repeat(3),
                      ['label', [
                        ['input', {
                          type: 'checkbox',
                          id: 'decyes',
                          class: 'charthbox',
                          $on: {
                            async click (e) {
                              await unicodecharref.decflip(e);
                            }
                          }
                        }],
                        _('label_decq')
                      ]],
                      nbsp.repeat(3),
                      ['label', [
                        ['input', {
                          type: 'checkbox',
                          id: 'hexyes',
                          class: 'charthbox',
                          $on: {
                            async click (e) {
                              await unicodecharref.hexflip(e);
                            }
                          }
                        }],
                        _('label_hexq')
                      ]],
                      nbsp.repeat(3),
                      ['label', [
                        ['input', {
                          type: 'checkbox',
                          id: 'unicodeyes',
                          class: 'charthbox',
                          $on: {
                            async click (e) {
                              await unicodecharref.unicodeflip(e);
                            }
                          }
                        }],
                        _('label_unicodeq')
                      ]]
                    ]],
                    ['div', {class: 'hbox'}, [
                      ['label', {class: 'chartLayout'}, [
                        ['input', {
                          type: 'checkbox',
                          id: 'startCharInMiddleOfChart',
                          class: 'charthbox',
                          $on: {
                            async click (e) {
                              await unicodecharref.middleflip(e);
                            }
                          }
                        }],
                        _('label_middleq')
                      ]],
                      nbsp.repeat(3),
                      ['label', {class: 'chartLayout'}, [
                        ['input', {
                          type: 'checkbox',
                          id: 'buttonyes',
                          class: 'charthbox',
                          $on: {
                            async click (e) {
                              await unicodecharref.buttonflip(e);
                            }
                          }
                        }],
                        _('label_buttonq')
                      ]]
                    ]],
                    ['div', {class: 'hbox chartLayout'}, [
                      ['label', [_('label_fontsize')]],
                      nbsp.repeat(2),
                      ['button', {class: 'fontsize', $on: {
                        click () {
                          unicodecharref.tblfontsize(+1);
                        }
                      }}, [_('plus')]],
                      nbsp,
                      ['button', {class: 'fontsize', $on: {
                        click () {
                          unicodecharref.tblfontsize(-1);
                        }
                      }}, [_('minus')]]
                    ]]
                  ]],
                  ['div', {class: 'vbox'}, [
                    ['div', {class: 'hbox chartLayout'}, [
                      ['label', [
                        _('font_label'),
                        nbsp.repeat(2),
                        ['input', {
                          id: 'font',
                          size: '12',
                          $custom: {
                            $setFontFamily (value) {
                              const val = (/\s/u).test(value)
                                ? ('"' +
                                value.replace(/^"/gu, '').replace(/"$/gu, '') +
                                '"')
                                : value;
                              $('#insertText').style.fontFamily = val;
                              // Form elements don't inherit, so find these
                              //   manually
                              $$('#chart_table button[name="unicode"]')
                                .forEach((button) => {
                                  button.style.fontFamily = val;
                                });
                            }
                          },
                          $on: {
                            async change (e) {
                              await unicodecharref.setprefs(e);
                              this.$setFontFamily(this.value);
                            }
                          }
                        }],
                        ['br'],
                        ['select', {$on: {
                          click () {
                            $('#font').$setFontFamily(this.value);
                          }
                        }}, [
                          ['option', [
                            _('choose_a_font')
                          ]],
                          // Todo: Set pref to remember
                          ...fonts.map((font) => {
                            return ['option', [font]];
                          })
                        ]]
                      ]]
                    ]],
                    ['div', {
                      class: 'hbox',
                      title: _('lang_tooltiptext')
                    }, [
                      ['label', [
                        _('lang_label'),
                        nbsp.repeat(2),
                        ['input', {
                          id: 'lang',
                          size: '5',
                          $on: {
                            async change (e) {
                              await unicodecharref.setprefs(e);
                              $('#chart_table').lang = this.value;
                            }
                          }
                        }]
                      ]]
                    ]]
                  ]]
                ]]
              ]]
            ]]
          ]],
          // ['splitter'],
          ['div', {id: 'chartcontent', class: 'vbox chartBox'}, [
            ['div', {
              id: 'tableholder',
              class: 'vbox'
            }, [
              ['div', {
                id: 'chartContainer'
              }]
            ]],
            // ['splitter']
            ['div', {
              id: 'viewTabs',
              class: 'tabbox viewTabs'
            }, [
              ['div', {class: 'tabs'}],
              ['div', {
                id: 'basicView',
                dataset: {
                  selected: true,
                  label: _('basicView_tab')
                },
                class: 'tabpanel'
              }, [
                ['div', {class: 'vbox'}, [
                  ['div', {class: 'hbox'}, [
                    ['label', [
                      ['input', {
                        id: 'multiline',
                        type: 'checkbox',
                        $on: {
                          click () {
                            unicodecharref.multiline();
                          }
                        }
                      }],
                      _('button_multiline')
                    ]],
                    nbsp.repeat(3),
                    ['label', [
                      ['input', {
                        id: 'showImg',
                        title: _('ShowImg_tooltiptext'),
                        type: 'checkbox',
                        $on: {
                          async click (e) {
                            await unicodecharref.setImagePref(e);
                          }
                        }
                      }],
                      _('ShowImg_checkbox_label')
                    ]]
                  ]],
                  ['label', {
                    class: 'leftlabel'
                  }, [
                    _('caption_displayUnicodeDesc'),
                    nbsp.repeat(2),
                    ['input', {
                      id: 'displayUnicodeDesc'
                    }]
                  ]]
                ]],
                ['div', {id: 'unicodeImg', class: 'hbox'}],
                ['div', {id: 'linksection', class: 'hbox'}, [
                  ['div', {id: 'plane'}],
                  ' ',
                  ['div', {id: 'pdflink', class: 'hbox'}]
                ]],
                ['div', [
                  ['fieldset', [
                    ['legend', [_('caption_chart_output')]],
                    ['div', {class: 'hbox'}, [
                      ['label', [
                        _('outputtocopy'),
                        ['textarea', {
                          id: 'insertText'
                        }]
                      ]],
                      ['div', [
                        ['button', {id: 'clearoutput', $on: {
                          click () {
                            $('#insertText').value = '';
                          }
                        }}, [
                          _('button_clearoutput')
                        ]]
                      ]]
                    ]],
                    ['div', {id: 'outputButtons', class: 'hbox'}, [
                      ['div', {class: 'hbox'}, [
                        ['button', {
                          tooltiptext: _('willreplaceprecnv'),
                          class: 'outputcopybutton',
                          $on: {
                            click () {
                              unicodecharref.moveoutput('#insertText');
                            }
                          }
                        }, [
                          _('button_moveoutput')
                        ]]
                      ]],
                      nbsp.repeat(2),
                      ['button', {$on: {
                        async click () {
                          await unicodecharref.copyToClipboard('#insertText');
                        }
                      }}, [
                        _('copyToClipboard')
                      ]],
                      ['div', {
                        hidden: typeof browser === 'undefined'
                      }, [
                        nbsp.repeat(2),
                        ['button', {$on: {
                          click () {
                            unicodecharref.addToToolbar();
                          }
                        }}, [
                          _('addToToolbar')
                        ]]
                      ]]
                    ]]
                  ]]
                ]]
              ]],
              ['div', {
                id: 'detailedView',
                dataset: {
                  label: _('detailedView_tab')
                },
                class: 'tabpanel'
              }, [
                ['div', {id: 'unicodeDescArea', class: 'vbox'}, [
                  ['label', [
                    ['input', {
                      type: 'checkbox',
                      id: 'showAllDetailedView',
                      $on: {
                        async click (e) {
                          await unicodecharref.setprefs(e);
                        }
                      }
                    }],
                    _('showAllDetailedView_label')
                  ]],
                  ['div', {
                    id: 'displayUnicodeDescContainer',
                    class: 'displayUnicodeDescContainer hbox'
                  }, [
                    ['label', [
                      ['h3', [
                        _('textbox_displayUnicodeDesc')
                      ]],
                      ['input', {
                        id: 'displayUnicodeDesc2'
                      }]
                    ]]
                  ]]
                ]],
                ['div', {class: 'detailedViewRows vbox'}, [
                  ['div', [
                    ['div', {
                      class: 'detailedViewContainer vbox'
                    }, unicodeFieldInfo.map((key, i) => {
                      if (i === 8) {
                        return '';
                      }
                      return ['div', {
                        class: 'detailedView vbox'
                      }, [
                        ['label', {
                          class: 'heading'
                        }, [
                          _(key),
                          nbsp.repeat(2),
                          ['input', {
                            id: `_detailedView${i + 2}`
                          }]
                        ]]
                      ]];
                    })]
                  ]]
                ]]
              ]],
              ['div', {
                id: 'detailedCJKView',
                dataset: {
                  label: _('detailedCJKView_tab')
                },
                class: 'tabpanel'
              }, [
                ['div', {id: 'displayUnihanArea', class: 'vbox'}, [
                  ['label', [
                    ['input', {
                      type: 'checkbox',
                      id: 'showAllDetailedCJKView',
                      $on: {
                        async click (e) {
                          await unicodecharref.setprefs(e);
                        }
                      }
                    }],
                    _('showAllDetailedCJKView_label')
                  ]],
                  ['div', {class: 'hbox displayUnicodeDescContainer'}, [
                    ['label', [
                      ['h3', [_('textbox_displayUnicodeDesc')]],
                      ['input', {id: 'displayUnicodeDescUnihan'}]
                    ]]
                  ]],
                  ['div', {class: 'detailedCJKViewRows vbox'}, [
                    ['div', unihanFieldInfo.map(([key, num]) => {
                      return ['div', {class: 'detailedCJKView vbox'}, [
                        ['label', {class: 'heading'}, [
                          _(key),
                          nbsp.repeat(2),
                          ['input', {
                            id: `_detailedCJKView${num}`
                          }]
                        ]]
                      ]];
                    })]
                  ]]
                ]]
              ]]
            ]]
          ]]
        ]]
      ]],
      ['div', {
        id: 'conversion',
        class: 'tabpanel',
        dataset: {
          label: _('Conversion_tab_label')
        }
      }, [
        ['div', {id: 'conversionhbox', class: 'hbox'}, [
          ['div', {
            id: 'conversion_buttons_persist', class: 'vbox conversionSection'
          }, [
            ['h2', {class: 'dialogheader'}, [
              _('Reconvert_dialogheader_title')
            ]],
            ['button', {id: 'b1', class: 'reconvert', $on: {
              async click (e) {
                await CharrefConverterBridges.charref2unicode(e);
              }
            }}, [_('charref2unicode_label')]],
            ['button', {id: 'b2', class: 'reconvert', $on: {
              async click (e) {
                await CharrefConverterBridges.charref2htmlents(e);
              }
            }}, [_('charref2htmlents_label')]],
            ['button', {id: 'b3', class: 'reconvert', $on: {
              async click (e) {
                await CharrefConverterBridges.unicode2charrefDec(e);
              }
            }}, [_('unicode2charrefDec_label')]],
            ['button', {id: 'b4', class: 'reconvert', $on: {
              async click (e) {
                await CharrefConverterBridges.unicode2charrefHex(e);
              }
            }}, [_('unicode2charrefHex_label')]],
            ['button', {
              id: 'b3b',
              class: 'reconvert',
              title: _('unicode2charrefSurrogate_tooltip'),
              $on: {
                click (e) {
                  CharrefConverterBridges.unicode2charrefDecSurrogate(e);
                }
              }
            }, [_('unicode2charrefDecSurrogate_label')]],
            ['button', {
              id: 'b4b',
              class: 'reconvert',
              title: _('unicode2charrefSurrogate_tooltip'),
              $on: {
                click (e) {
                  CharrefConverterBridges.unicode2charrefHexSurrogate(e);
                }
              }
            }, [_('unicode2charrefHexSurrogate_label')]],
            ['button', {id: 'b5', class: 'reconvert', $on: {
              async click (e) {
                await CharrefConverterBridges.unicode2htmlents(e);
              }
            }}, [_('unicode2htmlents_label')]],
            ['div', {class: 'hbox'}, [
              ['button', {id: 'b6', class: 'reconvert', $on: {
                click (e) {
                  CharrefConverterBridges.unicode2jsescape(e);
                }
              }}, [_('unicode2JSEscape_label')]],
              ['button', {id: 'b7', class: 'reconvert', $on: {
                click (e) {
                  CharrefConverterBridges.unicodeTo6Digit(e);
                }
              }}, [_('unicodeTo6Digit_label')]]
            ]],
            ['button', {id: 'b8', class: 'reconvert', $on: {
              click (e) {
                CharrefConverterBridges.unicode2cssescape(e);
              }
            }}, [_('unicode2CSSEscape_label')]],
            ['button', {id: 'b9', class: 'reconvert', $on: {
              async click (e) {
                await CharrefConverterBridges.htmlents2charrefDec(e);
              }
            }}, [_('htmlents2charrefDec_label')]],
            ['button', {id: 'b10', class: 'reconvert', $on: {
              async click (e) {
                await CharrefConverterBridges.htmlents2charrefHex(e);
              }
            }}, [_('htmlents2charrefHex_label')]],
            ['button', {id: 'b11', class: 'reconvert', $on: {
              async click (e) {
                await CharrefConverterBridges.htmlents2unicode(e);
              }
            }}, [_('htmlents2unicode_label')]],
            ['button', {id: 'b12', class: 'reconvert', $on: {
              async click (e) {
                await CharrefConverterBridges.hex2dec(e);
              }
            }}, [_('hex2dec_label')]],
            ['button', {id: 'b13', class: 'reconvert', $on: {
              async click (e) {
                await CharrefConverterBridges.dec2hex(e);
              }
            }}, [_('dec2hex_label')]],
            ['div', {class: 'hbox'}, [
              ['button', {id: 'b14', class: 'reconvert', $on: {
                click (e) {
                  CharrefConverterBridges.jsescape2unicode(e);
                }
              }}, [_('jsescape2unicode_label')]],
              ['button', {id: 'b15', class: 'reconvert', $on: {
                click (e) {
                  CharrefConverterBridges.sixDigit2Unicode(e);
                }
              }}, [_('sixDigit2unicode_label')]]
            ]],
            ['button', {id: 'b16', class: 'reconvert', $on: {
              click (e) {
                CharrefConverterBridges.cssescape2unicode(e);
              }
            }}, [_('cssescape2unicode_label')]],
            ['div', {class: 'hbox'}, [
              ['button', {id: 'b17', class: 'reconvert', $on: {
                async click (e) {
                  await CharrefConverterBridges.unicode2CharDesc(e);
                }
              }}, [_('unicode2CharDesc_label')]],
              ['button', {id: 'b18', class: 'reconvert', $on: {
                async click (e) {
                  await CharrefConverterBridges.charDesc2Unicode(e);
                }
              }}, [_('charDesc2Unicode_label')]]
            ]]
            /*
            ['fieldset', {id: 'convertEncoding'}, [
              ['div', {id: 'convertFromEncoding'}, [
                ['label', [
                  _('Convert_From_Encoding'),
                  nbsp.repeat(2),
                  // Todo: Set pref to remember
                  ['select', {
                    id: 'encoding_from',
                    class: 'reconvert',
                    multiple: 'multiple'
                  }, encodings.map((option) => {
                    return ['option', [option]];
                  })]
                ]]
              ]],
              ['label', [
                _('Convert_To_Encoding'),
                nbsp.repeat(2),
                // Todo: Set pref to remember
                ['select', {
                  id: 'encoding_to',
                  class: 'reconvert',
                  multiple: 'multiple'
                }, encodings.map((option) => {
                  return ['option', [option]];
                })]
              ]]
            ]]
            */
          ]],
          // ['splitter'],
          ['div', {id: 'toconvert_persist', class: 'vbox conversionSection'}, [
            // ['h2', {class: 'dialogheader'}, [ _ ('uresults_value') ]],
            ['label', {id: 'toconvert_persist_label'}, [
              _('uresults_preconverted'),
              ['div', [
                ['textarea', {
                  id: 'toconvert',
                  placeholder: _('toconvert_placeholder'),
                  class: 'convertBox'
                }]
              ]]
            ]],
            // ['splitter'],
            ['label', [
              _('uresults_converted'),
              ['div', [
                ['textarea', {
                  id: 'converted',
                  class: 'convertBox',
                  placeholder: _('converted_value_placeholder')
                }]
              ]]
            ]],
            ['div', {class: 'hbox'}, [
              _('label_fontsize'),
              nbsp.repeat(2),
              ['button', {class: 'fontsize', $on: {
                click () {
                  unicodecharref.fontsizetextbox(+1);
                }
              }}, [
                _('plus')
              ]],
              nbsp,
              ['button', {class: 'fontsize', $on: {
                click () {
                  unicodecharref.fontsizetextbox(-1);
                }
              }}, [
                _('minus')
              ]],
              nbsp.repeat(7),
              ['button', {$on: {click () {
                unicodecharref.moveoutput('#converted');
              }}}, [
                _('moveconvertedup_label')
              ]]
            ]]
          ]]
        ]]
      ]],
      ['div', {
        id: 'prefs',
        class: 'tabpanel vbox',
        dataset: {
          label: _('Prefs_tab_label')
        }
      }, [
        ['h2', {class: 'dialogheader'}, [_('Preferences_dialogheader_title')]],
        ['div', {
          id: 'DownloadButtonBox',
          class: 'bottomboxed vbox',
          title: _('Download_unihan_tooltip')
        }, [
          ['div', [
            ['button', {
              $on: {
                async click () {
                  await unicodecharref.downloadUnihan();
                }
              }
            }, [_('DownloadUnihan')]]
          ]]
        ]],
        ['div', {
          id: 'DownloadProgressBox',
          class: 'vbox',
          hidden: true
        }, [
          ['label', [
            ['progressmeter', {id: 'progress_element'}]
          ]],
          ['button', {
            id: 'closeDownloadProgressBox',
            hidden: true,
            $on: {
              click () {
                unicodecharref.closeDownloadProgressBox();
              }
            }
          }, [_('Close')]]
        ]],
        ['div', {id: 'UnihanInstalled', class: 'vbox'}, [
          _('UnihanInstalled')
        ]],
        ['div', {class: 'boxed vbox'}, [
          ['label', [
            _('initialTab_label'), nbsp.repeat(3),
            ['select', {id: 'initialTab', $on: {
              async change (e) {
                await unicodecharref.setprefs(e);
              }
            }}, [
              ['option', {
                id: 'mi_charts', value: 'charts'
              }, [_('Charts_tab_label')]],
              ['option', {
                id: 'mi_conversion', value: 'conversion'
              }, [_('Conversion_tab_label')]],
              ['option', {
                id: 'mi_prefs', value: 'prefs'
              }, [_('Prefs_tab_label')]],
              ['option', {
                id: 'mi_DTDpanel', value: 'DTDpanel'
              }, [_('DTD_tab_label')]],
              ['option', {
                id: 'mi_notes', value: 'notes'
              }, [_('Notes_tab_label')]],
              ['option', {
                id: 'mi_about', value: 'about'
              }, [_('About_tab_label')]]
            ]]
          ]]
        ]],
        ['div', {class: 'boxedbottom vbox'}, [
          ['label', [
            ['input', {
              type: 'checkbox',
              id: 'asciiLt128',
              $on: {
                async click (e) {
                  await unicodecharref.setprefs(e);
                }
              }
            }],
            _('Ascii_checkbox_label')
          ]]
        ]],
        ['div', {class: 'boxedbottom vbox'}, [
          ['label', [
            ['input', {
              type: 'checkbox',
              id: 'hexLettersUpper',
              class: 'topofpanel',
              $on: {
                async click (e) {
                  await unicodecharref.hexLettersCasing(e);
                }
              }
            }],
            _('Hexletters_checkbox_label')
          ]]
        ]],
        ['div', {class: 'boxedbottom vbox'}, [
          ['label', [
            ['input', {
              type: 'checkbox',
              id: 'xhtmlentmode',
              class: 'topofpanel',
              $on: {
                async click (e) {
                  await unicodecharref.setprefs(e);
                }
              }
            }],
            _('xhtmlentmode_label')
          ]]
        ]],
        ['div', {class: 'boxedbottom vbox'}, [
          ['label', [
            ['input', {
              type: 'checkbox',
              id: 'xmlentkeep',
              class: 'topofpanel',
              $on: {
                async click (e) {
                  await unicodecharref.setprefs(e);
                }
              }
            }],
            _('xmlentmode_label')
          ]]
        ]],
        ['div', {class: 'boxedbottom vbox'}, [
          ['label', [
            ['input', {
              type: 'checkbox',
              id: 'ampkeep',
              class: 'topofpanel',
              $on: {
                async click (e) {
                  await unicodecharref.setprefs(e);
                }
              }
            }],
            _('ampkeep_label')
          ]]
        ]],
        ['div', {class: 'boxedbottom vbox'}, [
          ['label', [
            ['input', {
              type: 'checkbox',
              id: 'ampspace',
              class: 'topofpanel',
              $on: {
                async click (e) {
                  await unicodecharref.setprefs(e);
                }
              }
            }],
            _('ampspace_label')
          ]]
        ]],
        /*
        ['div', {class: 'boxedbottom vbox'}, [
          ['label', [
            ['input', {
              type: 'checkbox',
              id: 'showComplexWindow',
              class: 'topofpanel',
              $on: {
                async click (e) {
                  await unicodecharref.setprefs(e);
                  await unicodecharref.testIfComplexWindow();
                }
              }
            }],
            _('showComplexWindow_label')
          ]]
        ]],
        */
        ['div', {class: 'boxedbottom vbox'}, [
          ['label', [
            ['input', {
              type: 'checkbox',
              id: 'cssUnambiguous',
              class: 'topofpanel',
              $on: {
                async click (e) {
                  await unicodecharref.setprefs(e);
                }
              }
            }],
            _('cssUnambiguous_label')
          ]],
          ['br'],
          ['label', [
            _('CSSWhitespace_label'), nbsp.repeat(3),
            ['select', {
              id: 'CSSWhitespace',
              $on: {
                async change (e) {
                  await unicodecharref.cssWhitespace(e);
                }
              }
            }, [
              ['option', {value: 'space'}, [_('CSS_space')]],
              ['option', {value: 'rn'}, [_('CSS_rn')]],
              ['option', {value: 'r'}, [_('CSS_r')]],
              ['option', {value: 'n'}, [_('CSS_n')]],
              ['option', {value: 't'}, [_('CSS_t')]],
              ['option', {value: 'f'}, [_('CSS_f')]]
            ]]
          ]]
        ]],
        ['div', {style: 'text-align: center;'}, [
          ['button', {id: 'resetdefaultbutton', $on: {
            click () {
              unicodecharref.resetdefaults();
            }
          }}, [
            _('resettodefault_label')
          ]]
        ]]
      ]],
      ['div', {
        id: 'DTDpanel',
        class: 'tabpanel vbox',
        dataset: {
          label: _('DTD_tab_label')
        }
      }, [
        ['h2', {class: 'dialogheader'}, [
          _('dialogheader_value')
        ]],
        ...fill(2).map((__, i) => {
          return ['p', [
            _(`DTD_desc_value${i + 1}`)
          ]];
        }),
        ['div', {class: 'hbox'}, [
          ['textarea', {id: 'DTDtextbox', $on: {
            async change () {
              await registerDTD();
              await unicodecharref.chartBuildResize();
            }
          }}, [
            _('DTD_textbox_value')
          ]],
          ['div', {class: 'vbox'}, [
            ['div', {class: 'hbox'}, [
              ['label', [
                _('DTD_insertEntityFile'), nbsp.repeat(2),
                ['select', {
                  id: 'insertEntityFile',
                  class: 'dtdbutton'
                }, [
                  ['option', {value: ''}, [
                    _('choose_an_entity_file')
                  ]],
                  ['optgroup', {label: 'Recommended (Non-legacy)'}, [
                    ['option', {
                      value: 'htmlmathml-f'
                    }, [_('ent_htmlmathml_f')]],
                    ['option', {
                      value: 'w3centities-f'
                    }, [_('ent_w3centities_f')]]
                  ]],
                  ['optgroup', {label: 'Graphic'}, [
                    ['option', {value: 'isobox'}, [_('ent_isobox')]],
                    ['option', {value: 'isonum'}, [_('ent_isonum')]]
                  ]],
                  ['optgroup', {label: 'Math Symbols'}, [
                    ['option', {
                      value: 'xhtml1-symbol'
                    }, [_('ent_xhtml1_symbol')]],
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
                    ['option', {
                      value: 'xhtml1-special'
                    }, [_('ent_xhtml1_special')]],
                    ['option', {
                      value: 'xhtml1-symbol'
                    }, [_('ent_xhtml1_symbol')]],
                    ['option', {
                      value: 'html5-uppercase'
                    }, [_('ent_html5_uppercase')]],
                    ['option', {value: 'predefined'}, [_('ent_predefined')]]
                  ]],
                  ['optgroup', {label: 'Other'}, [
                    ['option', {value: 'isodia'}, [_('ent_isodia')]],
                    ['option', {value: 'isopub'}, [_('ent_isopub')]],
                    ['option', {value: 'isotech'}, [_('ent_isotech')]]
                  ]]
                ]]
              ]]
            ]],
            ['div', {style: 'text-align: center; margin-top: 10px;'}, [
              ['button', {class: 'dtdbutton', $on: {click () {
                unicodecharref.insertent('DTDtextbox');
              }}}, [
                _('DTD_insertent')
              ]]
            ]],
            ['label', {style: 'margin-top: 10px;'}, [
              ['input', {
                id: 'appendtohtmldtd',
                type: 'checkbox',
                $on: {
                  async click (e) {
                    await unicodecharref.append2htmlflip(e);
                  }
                }
              }],
              _('appendhtml_checkbox')
            ]]
          ]]
        ]]
      ]],
      ['div', {
        id: 'notes',
        class: 'tabpanel vbox',
        dataset: {
          label: _('Notes_tab_label')
        }
      }, [
        ['h2', {class: 'dialogheader'}, [_('Notes_dialogheader_title')]],
        ['div', {class: 'hbox'}, [
          ['div', {class: 'noteDescriptionBox vbox'}, [
            ['h3', [_('note_heading')]],
            ...fill(8).map((__, i) => {
              return ['div', {class: 'notesdescription'}, [
                _(`notespar${i + 1}`)
              ]];
            })
          ]],
          ['div', {class: 'noteDescriptionBox vbox'}, [
            ['h3', [_('usage_note_heading')]],
            ...fill(13).map((__, i) => {
              return ['div', {class: 'usage_notesdescription'}, [
                _(`usage_notespar${i + 1}`)
              ]];
            })
          ]]
        ]]
      ]],
      ['div', {
        id: 'about',
        class: 'tabpanel vbox',
        dataset: {
          label: _('About_tab_label')
        }
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
                id: 'donationbutton'
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
                href: safeLink(_('About_ial_wikipedia_linkURL'))
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

  // See why intl-dom not apparently keeping event handlers
  $('#donationbutton').addEventListener('click', () => {
    window.open(
      'https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=brettz9%40yahoo%2ecom&no_shipping=0&no_note=1&tax=0&currency_code=USD&bn=PP%2dDonationsBF&charset=UTF%2d8',
      'bzamirdonation'
    );
  });
};

export default indexTemplate;
