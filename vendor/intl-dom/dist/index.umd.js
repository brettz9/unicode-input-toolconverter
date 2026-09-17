(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.IntlDom = {}));
})(this, (function (exports) { 'use strict';

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithHoles(r) {
    if (Array.isArray(r)) return r;
  }
  function _arrayWithoutHoles(r) {
    if (Array.isArray(r)) return _arrayLikeToArray(r);
  }
  function _assertThisInitialized(e) {
    if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return e;
  }
  function asyncGeneratorStep(n, t, e, r, o, a, c) {
    try {
      var i = n[a](c),
        u = i.value;
    } catch (n) {
      return void e(n);
    }
    i.done ? t(u) : Promise.resolve(u).then(r, o);
  }
  function _asyncToGenerator(n) {
    return function () {
      var t = this,
        e = arguments;
      return new Promise(function (r, o) {
        var a = n.apply(t, e);
        function _next(n) {
          asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
        }
        function _throw(n) {
          asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
        }
        _next(void 0);
      });
    };
  }
  function _callSuper(t, o, e) {
    return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, [], _getPrototypeOf(t).constructor) : o.apply(t, e));
  }
  function _classCallCheck(a, n) {
    if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
  }
  function _defineProperties(e, r) {
    for (var t = 0; t < r.length; t++) {
      var o = r[t];
      o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
    }
  }
  function _createClass(e, r, t) {
    return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
      writable: false
    }), e;
  }
  function _defineProperty(e, r, t) {
    return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
      value: t,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e[r] = t, e;
  }
  function _getPrototypeOf(t) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
      return t.__proto__ || Object.getPrototypeOf(t);
    }, _getPrototypeOf(t);
  }
  function _inherits(t, e) {
    if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
    t.prototype = Object.create(e && e.prototype, {
      constructor: {
        value: t,
        writable: true,
        configurable: true
      }
    }), Object.defineProperty(t, "prototype", {
      writable: false
    }), e && _setPrototypeOf(t, e);
  }
  function _isNativeReflectConstruct() {
    try {
      var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    } catch (t) {}
    return (_isNativeReflectConstruct = function () {
      return !!t;
    })();
  }
  function _iterableToArray(r) {
    if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
  }
  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e,
        n,
        i,
        u,
        a = [],
        f = true,
        o = false;
      try {
        if (i = (t = t.call(r)).next, 0 === l) {
          if (Object(t) !== t) return;
          f = !1;
        } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
      } catch (r) {
        o = true, n = r;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
        _defineProperty(e, r, t[r]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
      });
    }
    return e;
  }
  function _possibleConstructorReturn(t, e) {
    if (e && ("object" == typeof e || "function" == typeof e)) return e;
    if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
    return _assertThisInitialized(t);
  }
  function _regenerator() {
    /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */
    var e,
      t,
      r = "function" == typeof Symbol ? Symbol : {},
      n = r.iterator || "@@iterator",
      o = r.toStringTag || "@@toStringTag";
    function i(r, n, o, i) {
      var c = n && n.prototype instanceof Generator ? n : Generator,
        u = Object.create(c.prototype);
      return _regeneratorDefine(u, "_invoke", function (r, n, o) {
        var i,
          c,
          u,
          f = 0,
          p = o || [],
          y = false,
          G = {
            p: 0,
            n: 0,
            v: e,
            a: d,
            f: d.bind(e, 4),
            d: function (t, r) {
              return i = t, c = 0, u = e, G.n = r, a;
            }
          };
        function d(r, n) {
          for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) {
            var o,
              i = p[t],
              d = G.p,
              l = i[2];
            r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0));
          }
          if (o || r > 1) return a;
          throw y = true, n;
        }
        return function (o, p, l) {
          if (f > 1) throw TypeError("Generator is already running");
          for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) {
            i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u);
            try {
              if (f = 2, i) {
                if (c || (o = "next"), t = i[o]) {
                  if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object");
                  if (!t.done) return t;
                  u = t.value, c < 2 && (c = 0);
                } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1);
                i = e;
              } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break;
            } catch (t) {
              i = e, c = 1, u = t;
            } finally {
              f = 1;
            }
          }
          return {
            value: t,
            done: y
          };
        };
      }(r, o, i), true), u;
    }
    var a = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    t = Object.getPrototypeOf;
    var c = [][n] ? t(t([][n]())) : (_regeneratorDefine(t = {}, n, function () {
        return this;
      }), t),
      u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c);
    function f(e) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e;
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine(u), _regeneratorDefine(u, o, "Generator"), _regeneratorDefine(u, n, function () {
      return this;
    }), _regeneratorDefine(u, "toString", function () {
      return "[object Generator]";
    }), (_regenerator = function () {
      return {
        w: i,
        m: f
      };
    })();
  }
  function _regeneratorDefine(e, r, n, t) {
    var i = Object.defineProperty;
    try {
      i({}, "", {});
    } catch (e) {
      i = 0;
    }
    _regeneratorDefine = function (e, r, n, t) {
      function o(r, n) {
        _regeneratorDefine(e, r, function (e) {
          return this._invoke(r, n, e);
        });
      }
      r ? i ? i(e, r, {
        value: n,
        enumerable: !t,
        configurable: !t,
        writable: !t
      }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2));
    }, _regeneratorDefine(e, r, n, t);
  }
  function _setPrototypeOf(t, e) {
    return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
      return t.__proto__ = e, t;
    }, _setPrototypeOf(t, e);
  }
  function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
  }
  function _taggedTemplateLiteral(e, t) {
    return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, {
      raw: {
        value: Object.freeze(t)
      }
    }));
  }
  function _toConsumableArray(r) {
    return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
  }
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r);
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }
  function _wrapRegExp() {
    _wrapRegExp = function (e, r) {
      return new BabelRegExp(e, void 0, r);
    };
    var e = RegExp.prototype,
      r = new WeakMap();
    function BabelRegExp(e, t, p) {
      var o = RegExp(e, t);
      return r.set(o, p || r.get(e)), _setPrototypeOf(o, BabelRegExp.prototype);
    }
    function buildGroups(e, t) {
      var p = r.get(t);
      return Object.keys(p).reduce(function (r, t) {
        var o = p[t];
        if ("number" == typeof o) r[t] = e[o];else {
          for (var i = 0; void 0 === e[o[i]] && i + 1 < o.length;) i++;
          r[t] = e[o[i]];
        }
        return r;
      }, Object.create(null));
    }
    return _inherits(BabelRegExp, RegExp), BabelRegExp.prototype.exec = function (r) {
      var t = e.exec.call(this, r);
      if (t) {
        t.groups = buildGroups(t, this);
        var p = t.indices;
        p && (p.groups = buildGroups(p, this));
      }
      return t;
    }, BabelRegExp.prototype[Symbol.replace] = function (t, p) {
      if ("string" == typeof p) {
        var o = r.get(this);
        return e[Symbol.replace].call(this, t, p.replace(/\$<([^>]+)(>|$)/g, function (e, r, t) {
          if ("" === t) return e;
          var p = o[r];
          return Array.isArray(p) ? "$" + p.join("$") : "number" == typeof p ? "$" + p : "";
        }));
      }
      if ("function" == typeof p) {
        var i = this;
        return e[Symbol.replace].call(this, t, function () {
          var e = arguments;
          return "object" != typeof e[e.length - 1] && (e = [].slice.call(e)).push(buildGroups(e, i)), p.apply(this, e);
        });
      }
      return e[Symbol.replace].call(this, t, p);
    }, _wrapRegExp.apply(this, arguments);
  }

  /* eslint-disable unicorn/no-top-level-assignment-in-function -- Temporary */
  // We want it to work in the browser, so commenting out
  // import jsonExtra from 'json5';
  // import jsonExtra from 'json-6';

  /* eslint-disable jsdoc/reject-any-type -- Ok */
  /**
   * @typedef {any} JSON6
   */
  /**
   * @typedef {any} AnyValue
   */
  /* eslint-enable jsdoc/reject-any-type -- Ok */

  // Don't use ts-expect-error here, as result differs by tsconfig
  // @ts-ignore Need typing for JSON6
  var _jsonExtra = globalThis.jsonExtra;

  /**
   * @param {JSON6} __jsonExtra
   */
  var setJSONExtra = function setJSONExtra(__jsonExtra) {
    _jsonExtra = __jsonExtra;
  };

  /**
   * @param {string} str
   * @returns {string}
   */
  var unescapeBackslashes = function unescapeBackslashes(str) {
    return str.replaceAll(/\\+/g, function (esc) {
      return esc.slice(0, esc.length / 2);
    });
  };

  /**
   * @param {string} args
   * @returns {AnyValue}
   */
  var parseJSONExtra = function parseJSONExtra(args) {
    return _jsonExtra.parse(
    // Doesn't actually currently allow explicit brackets,
    //  but in case we change our regex to allow inner brackets
    '{' + (args || '').replace(/^\{/, '').replace(/\}$/, '') + '}');
  };

  // Todo: Extract to own library (RegExtras?)

  /**
   * @callback BetweenMatches
   * @param {string} str
   * @returns {void}
   */

  /**
   * @callback AfterMatch
   * @param {string} str
   * @returns {void}
   */

  /**
   * @callback EscapeAtOne
   * @param {string} str
   * @returns {void}
   */

  /**
   * @param {RegExp} regex
   * @param {string} str
   * @param {{
   *   onMatch: (...arg0: string[]) => void,
   *   extra?: BetweenMatches|AfterMatch|EscapeAtOne
   *   betweenMatches?: BetweenMatches,
   *   afterMatch?: AfterMatch,
   *   escapeAtOne?: EscapeAtOne
   * }} cfg
   */
  var processRegex = function processRegex(regex, str, _ref) {
    var onMatch = _ref.onMatch,
      extra = _ref.extra,
      betweenMatches = _ref.betweenMatches,
      afterMatch = _ref.afterMatch,
      escapeAtOne = _ref.escapeAtOne;
    if (extra) {
      betweenMatches = extra;
      afterMatch = extra;
      escapeAtOne = extra;
    }
    if (!betweenMatches || !afterMatch) {
      throw new Error('You must have `extra` or `betweenMatches` and `afterMatch` arguments.');
    }
    var match;
    var previousIndex = 0;
    while ((match = regex.exec(str)) !== null) {
      var _match = match,
        _match2 = _slicedToArray(_match, 2),
        _ = _match2[0],
        esc = _match2[1];
      var lastIndex = regex.lastIndex;
      var startMatchPos = lastIndex - _.length;
      if (startMatchPos > previousIndex) {
        betweenMatches(str.slice(previousIndex, startMatchPos));
      }
      if (escapeAtOne && esc.length % 2) {
        previousIndex = lastIndex;
        escapeAtOne(_);
        continue;
      }
      onMatch.apply(void 0, _toConsumableArray(match));
      previousIndex = lastIndex;
    }
    if (previousIndex !== str.length) {
      // Get text at end
      afterMatch(str.slice(previousIndex));
    }
  };

  /* globals document -- Polyglot variable */
  /* eslint-disable unicorn/no-top-level-assignment-in-function -- Necessary */
  /**
   * @typedef {(
   *   input: RequestInfo|URL, init?: RequestInit
   * ) => Promise<Response>} Fetch
   */
  /**
   * @type {null|Fetch}
   */
  var _fetch = typeof fetch !== 'undefined' ? fetch
  /* c8 ignore next -- Available in Node now too */ : null;

  /**
   * @param {Fetch} f
   * @returns {void}
   */
  var setFetch = function setFetch(f) {
    _fetch = f;
  };

  /**
   * @returns {Fetch|null}
   */
  var getFetch = function getFetch() {
    return _fetch;
  };

  /** @type {Document|null} */
  var _doc = typeof document !== 'undefined'
  /* c8 ignore next -- Not available by default in Node */ ? document : null;

  /**
   * @param {Document} doc
   * @returns {void}
   */
  var setDocument = function setDocument(doc) {
    _doc = doc;
  };

  /**
   * @returns {Document|null}
   */
  var getDocument = function getDocument() {
    return _doc;
  };

  var _templateObject$2;

  /**
   *
   * @returns {string}
   */
  function generateUUID() {
    //  Adapted from original: public domain/MIT: https://stackoverflow.com/a/8809472/271577
    var d = Date.now();
    /* c8 ignore next 5 -- Available in Node */
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); // use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replaceAll(/[xy]/g, function (c) {
      /* eslint-disable no-bitwise, sonarjs/pseudo-random -- Convenient */
      var r = Math.trunc((d + Math.random() * 16) % 16);
      d = Math.floor(d / 16);
      return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
      /* eslint-enable no-bitwise, sonarjs/pseudo-random -- Convenient */
    });
  }

  /**
   *
   * @param {string} locale
   * @param {string[]} arrayOfItems
   * @param {Intl.CollatorOptions|undefined} options
   * @returns {string[]}
   */
  var sort = function sort(locale, arrayOfItems, options) {
    // eslint-disable-next-line unicorn/no-array-sort -- Modifies
    return arrayOfItems.sort(new Intl.Collator(locale, options).compare);
  };

  /**
   *
   * @param {string} locale
   * @param {string[]} arrayOfItems
   * @param {Intl.ListFormatOptions|undefined} [options]
   * @returns {string}
   */
  var list = function list(locale, arrayOfItems, options) {
    return new Intl.ListFormat(locale, options).format(arrayOfItems);
  };

  /**
   *
   * @param {string} locale
   * @param {string[]} arrayOfItems
   * @param {Intl.ListFormatOptions|undefined} [listOptions]
   * @param {Intl.CollatorOptions|undefined} [collationOptions]
   * @returns {string}
   */
  var sortListSimple = function sortListSimple(locale, arrayOfItems, listOptions, collationOptions) {
    sort(locale, arrayOfItems, collationOptions);
    return list(locale, arrayOfItems, listOptions);
  };

  /**
   * @typedef {number} Integer
   */

  /**
   *
   * @param {string} locale
   * @param {string[]} arrayOfItems
   * @param {import('./index.js').SortListMapper|
   *   Intl.ListFormatOptions|undefined} map
   * @param {Intl.ListFormatOptions|undefined} [listOptions]
   * @param {Intl.CollatorOptions|undefined} [collationOptions]
   * @returns {DocumentFragment|string}
   */
  var sortList = function sortList(locale, arrayOfItems, map, listOptions, collationOptions) {
    if (typeof map !== 'function') {
      return sortListSimple(locale, /** @type {string[]} */arrayOfItems, map, listOptions);
    }
    sort(locale, arrayOfItems, collationOptions);
    var randomId = generateUUID();
    var placeholderArray = _toConsumableArray(arrayOfItems).map(function (_, i) {
      return "<<".concat(randomId).concat(i, ">>");
    });

    /** @type {(string|Node)[]} */
    var nodes = [];

    /**
     * @param {string} arg
     * @returns {void}
     */
    var push = function push(arg) {
      nodes.push(arg);
    };
    processRegex(
    // // eslint-disable-next-line prefer-named-capture-group
    new RegExp(String.raw(_templateObject$2 || (_templateObject$2 = _taggedTemplateLiteral(["<<", "(d)>>"], ["<<", "(\\d)>>"])), randomId), 'gv'), list(locale, placeholderArray, listOptions), {
      betweenMatches: push,
      afterMatch: push,
      onMatch: function onMatch(_, idx) {
        push(map(arrayOfItems[Number(idx)], Number(idx)));
      }
    });
    var _doc = /** @type {Document} */getDocument();
    var container = _doc.createDocumentFragment();
    container.append.apply(container, nodes);
    return container;
  };

  /**
   * @typedef {number} Integer
   */

  /**
   * @param {{
   *   object: import('./defaultLocaleResolver.js').DateRangeValueArray|
   *     import('./defaultLocaleResolver.js').ListValueArray|
   *     import('./defaultLocaleResolver.js').RelativeValueArray|
   *     import('./defaultLocaleResolver.js').ValueArray
   * }} cfg
   * @returns {{
   *   value: number|string|string[]|Date,
   *   options?: Intl.NumberFormatOptions|Intl.PluralRulesOptions|
   *     string|Date|number,
   *   extraOpts?: object,
   *   callback?: (item: string, i: Integer) => Element
   * }}
   */
  var getFormatterInfo = function getFormatterInfo(_ref) {
    var object = _ref.object;
    if (Array.isArray(object)) {
      if (typeof object[1] === 'function') {
        var _object = _slicedToArray(
          /**
           * @type {[
           *   string[], (item: string, i: Integer) => Element, object, object
           * ]}
           */
          object, 4),
          _value = _object[0],
          callback = _object[1],
          _options = _object[2],
          _extraOpts = _object[3];
        return {
          value: _value,
          callback: callback,
          options: _options,
          extraOpts: _extraOpts
        };
      }
      var _object2 = _slicedToArray(object, 3),
        value = _object2[0],
        options = _object2[1],
        extraOpts = _object2[2];
      return {
        value: value,
        options: options,
        extraOpts: extraOpts
      };
    }
    return {
      value: object
    };
  };

  /**
   * Callback to give replacement text based on a substitution value.
   *
   * `value` - contains the value returned by the individual substitution.
   * `arg` - See `cfg.arg` of {@link SubstitutionCallback}.
   * `key` - The substitution key Not currently in use
   * `locale` - The locale.
   * @typedef {(info: {
   *   value: import('./defaultLocaleResolver.js').SubstitutionObjectValue
   *   arg?: string,
   *   key?: string,
   *   locale?: string
   * }) => string|Node} AllSubstitutionCallback
   */

  /**
   * @type {AllSubstitutionCallback}
   */
  var defaultAllSubstitutions = function defaultAllSubstitutions(_ref2) {
    var value = _ref2.value,
      arg = _ref2.arg,
      locale = _ref2.locale;
    // Strings or DOM Nodes
    if (typeof value === 'string' || value && _typeof(value) === 'object' && 'nodeType' in value) {
      return value;
    }

    /** @type {object|string|Date|number|undefined} */
    var opts;

    /**
     * @param {{
     *   type: string,
     *   options?: object,
     *   checkArgOptions?: boolean;
     * }} cfg
     * @returns {object|undefined}
     */
    var applyArgs = function applyArgs(_ref3) {
      var type = _ref3.type,
        _ref3$options = _ref3.options,
        options = _ref3$options === void 0 ? (/** @type {object|undefined} */
        opts) : _ref3$options,
        _ref3$checkArgOptions = _ref3.checkArgOptions,
        checkArgOptions = _ref3$checkArgOptions === void 0 ? false : _ref3$checkArgOptions;
      if (typeof arg === 'string') {
        // eslint-disable-next-line prefer-const -- Convenient
        var _arg$split = arg.split('|', 3),
          _arg$split2 = _slicedToArray(_arg$split, 3),
          userType = _arg$split2[0],
          extraArgs = _arg$split2[1],
          argOptions = _arg$split2[2];
        // Alias
        if (userType === 'DATE') {
          userType = 'DATETIME';
        }
        if (userType === type) {
          if (!extraArgs) {
            options = {};
          } else if (!checkArgOptions || argOptions) {
            // Todo: Allow escaping and restoring of pipe symbol
            options = _objectSpread2(_objectSpread2({}, options), parseJSONExtra(checkArgOptions && argOptions ? argOptions : extraArgs));
          }
        }
      }
      return options;
    };
    var expectsDatetime = false;
    if (value && _typeof(value) === 'object' && !Array.isArray(value)) {
      var singleKey = Object.keys(value)[0];
      /**
       * @typedef {"number"|"date"|"datetime"|"dateRange"|
       *   "datetimeRange"|"relative"|"region"|"language"|
       *   "script"|"currency"|"list"|"plural"} SpecialFormat
       */
      if (['number', 'date', 'datetime', 'dateRange', 'datetimeRange', 'relative', 'region', 'language', 'script', 'currency', 'list', 'plural'].includes(singleKey)) {
        var extraOpts, callback;
        var obj = /** @type {unknown} */
        /** @type {Record<string, keyof SpecialFormat>} */
        value[(
        /**
         * @type {SpecialFormat}
         */
        singleKey)];
        var _getFormatterInfo = getFormatterInfo({
          object: (
          /**
           * @type {import('./defaultLocaleResolver.js').DateRangeValueArray|
           *   import('./defaultLocaleResolver.js').ListValueArray|
           *   import('./defaultLocaleResolver.js').RelativeValueArray|
           *   import('./defaultLocaleResolver.js').ValueArray
           * }
           */
          obj)
        });
        value = _getFormatterInfo.value;
        opts = _getFormatterInfo.options;
        extraOpts = _getFormatterInfo.extraOpts;
        callback = _getFormatterInfo.callback;
        switch (singleKey) {
          case 'date':
          case 'datetime':
            expectsDatetime = true;
            break;
          case 'dateRange':
          case 'datetimeRange':
            {
              var dtf = new Intl.DateTimeFormat(locale, applyArgs({
                type: 'DATERANGE',
                options: extraOpts
              }));
              return dtf.formatRange.apply(dtf, _toConsumableArray(/** @type {[Date, Date]} */
              [(/** @type {number|Date} */
              value), (/** @type {Date} */
              opts)].map(function (val) {
                return typeof val === 'number' ? new Date(val) : val;
              })));
            }
          case 'region':
          case 'language':
          case 'script':
          case 'currency':
            return /** @type {string} */new Intl.DisplayNames(locale, _objectSpread2(_objectSpread2({}, applyArgs({
              type: singleKey.toUpperCase()
            })), {}, {
              type: singleKey
            })).of(/** @type {string} */value);
          case 'relative':
            // The second argument actually contains the primary options, so swap
            // eslint-disable-next-line @stylistic/max-len -- Long
            var _ref4 = /** @type {[Intl.RelativeTimeFormatUnit, object?]} */
            [opts, extraOpts];
            extraOpts = _ref4[0];
            opts = _ref4[1];
            return new Intl.RelativeTimeFormat(locale, applyArgs({
              type: 'RELATIVE'
            })).format(/** @type {number} */value, extraOpts);

          // ListFormat (with Collator)
          case 'list':
            if (callback) {
              return sortList(/** @type {string} */locale, /** @type {string[]} */
              value, callback, applyArgs({
                type: 'LIST'
              }), applyArgs({
                type: 'LIST',
                options: extraOpts,
                checkArgOptions: true
              }));
            }
            return sortList(/** @type {string} */locale, /** @type {string[]} */
            value, applyArgs({
              type: 'LIST'
            }), applyArgs({
              type: 'LIST',
              options: extraOpts,
              checkArgOptions: true
            }));
        }
      }
    }

    // Dates
    if (value) {
      if (typeof value === 'number' && (expectsDatetime || /^DATE(?:TIME)(?:\||$)/.test(/** @type {string} */arg))) {
        value = new Date(value);
      }
      if (_typeof(value) === 'object' && 'getTime' in value && typeof value.getTime === 'function') {
        return new Intl.DateTimeFormat(locale, applyArgs({
          type: 'DATETIME'
        })).format(value);
      }
    }

    // Date range
    if (Array.isArray(value)) {
      var _Intl$DateTimeFormat;
      var _extraOpts2 = /** @type {Intl.DateTimeFormatOptions|undefined} */
      value[2];
      return (_Intl$DateTimeFormat = new Intl.DateTimeFormat(locale, applyArgs({
        type: 'DATERANGE',
        options: _extraOpts2
      }))).formatRange.apply(_Intl$DateTimeFormat, _toConsumableArray(/** @type {[Date, Date]} */
      value.slice(0, 2).map(function (val) {
        return typeof val === 'number' ? new Date(val) : val;
      })));
    }

    // Numbers
    if (typeof value === 'number') {
      return new Intl.NumberFormat(locale, applyArgs({
        type: 'NUMBER'
      })).format(value);
    }

    // console.log('value', value);
    throw new TypeError('Unknown formatter');
  };

  var _templateObject$1, _templateObject2$1;

  /**
   * Base class for formatting.
   */
  var Formatter = /*#__PURE__*/_createClass(function Formatter() {
    _classCallCheck(this, Formatter);
  });

  /**
   * @param {object} cfg
   * @param {string} cfg.key
   * @param {import('./getMessageForKeyByStyle.js').LocaleBody} cfg.body
   * @param {string} cfg.type
   * @param {"richNested"|"rich"|"plain"|
   *   "plainNested"|import('./getMessageForKeyByStyle.js').
   *   MessageStyleCallback} [cfg.messageStyle]
   * @returns {string}
   */
  var _getSubstitution = function getSubstitution(_ref) {
    var key = _ref.key,
      body = _ref.body,
      type = _ref.type,
      _ref$messageStyle = _ref.messageStyle,
      messageStyle = _ref$messageStyle === void 0 ? 'richNested' : _ref$messageStyle;
    var messageForKey = getMessageForKeyByStyle({
      messageStyle: messageStyle
    });
    var substitution = messageForKey({
      body: body
    }, key);
    if (!substitution) {
      throw new Error("Key value not found for ".concat(type, " key: (").concat(key, ")"));
    }
    // We don't allow a substitution function here or below as comes
    //  from locale and locale content should not pose security concerns
    return substitution.value;
  };

  /**
   * Formatter for local variables.
   */
  var LocalFormatter = /*#__PURE__*/function (_Formatter) {
    /**
     * @param {import('./getMessageForKeyByStyle.js').LocalObject} locals
     */
    function LocalFormatter(locals) {
      var _this;
      _classCallCheck(this, LocalFormatter);
      _this = _callSuper(this, LocalFormatter);
      _this.locals = locals;
      return _this;
    }
    /**
     * @param {string} key
     * @returns {string|Element}
     */
    _inherits(LocalFormatter, _Formatter);
    return _createClass(LocalFormatter, [{
      key: "getSubstitution",
      value: function getSubstitution(key) {
        return _getSubstitution({
          key: key.slice(1),
          body: this.locals,
          type: 'local'
        });
      }
      /**
       * @param {string} key
       * @returns {boolean}
       */
    }, {
      key: "isMatch",
      value: function isMatch(key) {
        var components = key.slice(1).split('.');
        /** @type {import('./getMessageForKeyByStyle.js').LocaleBody} */
        var parent = this.locals;
        return /** @type {typeof LocalFormatter} */this.constructor.isMatchingKey(key) && components.every(function (cmpt) {
          var result = Object.hasOwn(parent, cmpt);
          parent =
          /**
           * @type {import('./defaultLocaleResolver.js').
           *     RichNestedLocaleStringBodyObject|
           *   import('./defaultLocaleResolver.js').
           *     PlainNestedLocaleStringBodyObject|
           *   import('./defaultLocaleResolver.js').RichLocaleStringSubObject
           * }
           */
          /**
           * @type {import('./defaultLocaleResolver.js').
           *     RichNestedLocaleStringBodyObject|
           *   import('./defaultLocaleResolver.js').
           *     PlainNestedLocaleStringBodyObject
           * }
           */
          parent[cmpt];
          return result;
        });
      }
    }], [{
      key: "isMatchingKey",
      value:
      /**
       * @param {string} key
       * @returns {boolean}
       */
      function isMatchingKey(key) {
        return key.startsWith('-');
      }
    }]);
  }(Formatter);

  /**
   * Formatter for regular variables.
   */
  var RegularFormatter = /*#__PURE__*/function (_Formatter2) {
    /**
     * @param {import('./defaultLocaleResolver.js').SubstitutionObject
     * } substitutions
     */
    function RegularFormatter(substitutions) {
      var _this2;
      _classCallCheck(this, RegularFormatter);
      _this2 = _callSuper(this, RegularFormatter);
      _this2.substitutions = substitutions;
      return _this2;
    }
    /**
     * @param {string} key
     * @returns {boolean}
     */
    _inherits(RegularFormatter, _Formatter2);
    return _createClass(RegularFormatter, [{
      key: "isMatch",
      value: function isMatch(key) {
        return /** @type {typeof RegularFormatter} */this.constructor.isMatchingKey(key) && Object.hasOwn(this.substitutions, key);
      }
    }], [{
      key: "isMatchingKey",
      value:
      /**
       * @param {string} key
       * @returns {boolean}
       */
      function isMatchingKey(key) {
        return /^[0-9A-Z_a-z]/.test(key);
      }
    }]);
  }(Formatter);

  /**
   * Formatter for switch variables.
   */
  var SwitchFormatter = /*#__PURE__*/function (_Formatter3) {
    /**
     * @param {import('./defaultLocaleResolver.js').Switches} switches
     * @param {object} cfg
     * @param {import('./defaultLocaleResolver.js').
     *   SubstitutionObject} cfg.substitutions
     */
    function SwitchFormatter(switches, _ref2) {
      var _this3;
      var substitutions = _ref2.substitutions;
      _classCallCheck(this, SwitchFormatter);
      _this3 = _callSuper(this, SwitchFormatter);
      _this3.switches = switches;
      _this3.substitutions = substitutions;
      return _this3;
    }

    /**
     * @param {string} key
     * @param {object} cfg
     * @param {string} cfg.locale
     * @param {(string|undefined)[]} cfg.usedKeys
     * @param {string} cfg.arg
     * @param {import('./getDOMForLocaleString.js').
     *   MissingSuppliedFormattersCallback} cfg.missingSuppliedFormatters
     * @returns {string}
     */
    _inherits(SwitchFormatter, _Formatter3);
    return _createClass(SwitchFormatter, [{
      key: "getSubstitution",
      value: function getSubstitution(key, _ref3) {
        var locale = _ref3.locale,
          usedKeys = _ref3.usedKeys,
          arg = _ref3.arg,
          missingSuppliedFormatters = _ref3.missingSuppliedFormatters;
        var ky = /** @type {typeof SwitchFormatter} */this.constructor.getKey(key).slice(1);
        // Expression might not actually use formatter, e.g., for singular,
        //  the conditional might just write out "one"

        var _this$getMatch = this.getMatch(ky),
          _this$getMatch2 = _slicedToArray(_this$getMatch, 3),
          objKey = _this$getMatch2[0],
          body = _this$getMatch2[1],
          keySegment = _this$getMatch2[2];
        usedKeys.push(keySegment);
        var type;
        /** @type {string} */
        var opts;
        if (objKey && objKey.includes('|')) {
          var _objKey$split = objKey.split('|', 3);
          var _objKey$split2 = _slicedToArray(_objKey$split, 3);
          type = _objKey$split2[1];
          opts = _objKey$split2[2];
        }
        if (!body) {
          missingSuppliedFormatters({
            key: key,
            formatter: this
          });
          return String.raw(_templateObject$1 || (_templateObject$1 = _taggedTemplateLiteral(["{"], ["\\{"]))) + key + '}';
        }

        /*
        if (!(ky in this.substitutions)) {
          throw new Error(`Switch expecting formatter: ${ky}`);
        }
        */

        /**
         * @param {number} value
         * @param {Intl.NumberFormatOptions|undefined} [defaultOptions]
         * @returns {string}
         */
        var getNumberFormat = function getNumberFormat(value, defaultOptions) {
          var numberOpts = parseJSONExtra(opts);
          return new Intl.NumberFormat(locale, _objectSpread2(_objectSpread2({}, defaultOptions), numberOpts)).format(value);
        };

        /**
         * @param {number} value
         * @param {Intl.PluralRulesOptions|undefined} [defaultOptions]
         * @returns {Intl.LDMLPluralRule}
         */
        var getPluralFormat = function getPluralFormat(value, defaultOptions) {
          var pluralOpts = parseJSONExtra(opts);
          return new Intl.PluralRules(locale, _objectSpread2(_objectSpread2({}, defaultOptions), pluralOpts)).select(value);
        };
        var formatterValue = this.substitutions[(/** @type {string} */keySegment)];
        var match = formatterValue;
        if (typeof formatterValue === 'number') {
          switch (type) {
            case 'NUMBER':
              match = getNumberFormat(formatterValue);
              break;
            case 'PLURAL':
              match = getPluralFormat(formatterValue);
              break;
            default:
              match = new Intl.PluralRules(locale).select(formatterValue);
              break;
          }
        } else if (formatterValue && _typeof(formatterValue) === 'object') {
          var singleKey = Object.keys(formatterValue)[0];
          if (['number', 'plural'].includes(singleKey)) {
            var _getFormatterInfo = getFormatterInfo({
                object:
                /**
                 * @type {import('./defaultLocaleResolver.js').NumberInfo|
                 *   import('./defaultLocaleResolver.js').PluralInfo}
                 */
                // @ts-expect-error Ok
                formatterValue[(/** @type {"number"|"plural"} */singleKey)]
              }),
              value = _getFormatterInfo.value,
              options = _getFormatterInfo.options;
            if (!type) {
              type = singleKey.toUpperCase();
            }
            var typeMatches = singleKey.toUpperCase() === type;
            if (!typeMatches) {
              throw new TypeError("Expecting type \"".concat(type.toLowerCase(), "\"; instead found \"").concat(singleKey, "\"."));
            }
            // eslint-disable-next-line default-case -- Just two cases
            switch (type) {
              case 'NUMBER':
                match = getNumberFormat(/** @type {number} */value, /** @type {Intl.NumberFormatOptions} */
                options);
                break;
              case 'PLURAL':
                match = getPluralFormat(/** @type {number} */value, /** @type {Intl.PluralRulesOptions} */
                options);
                break;
            }
          }
        }

        // We do not want the default `richNested` here as that will split
        //  up the likes of `0.0`
        var messageStyle = 'richNested';

        /**
         * @param {string} s
         * @returns {string}
         */
        var preventNesting = function preventNesting(s) {
          return s.replaceAll('\\', '\\\\').replaceAll('.', String.raw(_templateObject2$1 || (_templateObject2$1 = _taggedTemplateLiteral(["."], ["\\."]))));
        };
        try {
          return _getSubstitution({
            messageStyle: messageStyle,
            key: match ? preventNesting(/** @type {string} */match) : arg,
            body: body,
            type: 'switch'
          });
        } catch (err) {
          try {
            return _getSubstitution({
              messageStyle: messageStyle,
              key: '*' + preventNesting(/** @type {string} */match),
              body: body,
              type: 'switch'
            });
          } catch (error) {
            var k = Object.keys(body).find(function (switchKey) {
              return switchKey.startsWith('*');
            });
            if (!k) {
              throw new Error("No defaults found for switch ".concat(ky), {
                cause: error
              });
            }
            return _getSubstitution({
              messageStyle: messageStyle,
              key: preventNesting(k),
              body: body,
              type: 'switch'
            });
          }
        }
      }

      /**
       * @param {string} key
       * @returns {boolean}
       */
    }, {
      key: "isMatch",
      value: function isMatch(key) {
        return Boolean(key && /** @type {typeof SwitchFormatter} */this.constructor.isMatchingKey(key) && this.getMatch(key.slice(1)).length);
      }

      /**
       * @typedef {[
       *   objKey?: string,
       *   body?: import('./getMessageForKeyByStyle.js').LocaleBody,
       *   keySegment?: string
       * ]} SwitchMatch
       */

      /**
       * @typedef {number} Integer
       */

      /**
       * @param {string} ky
       * @returns {SwitchMatch}
       */
    }, {
      key: "getMatch",
      value: function getMatch(ky) {
        var _this4 = this;
        var ks = ky.split('.');
        var returnValue = /** @type {unknown} */ks.reduce(
        /**
         * @param {import('./defaultLocaleResolver.js').SwitchArrays|
         *   import('./defaultLocaleResolver.js').SwitchArray|
         *   import('./defaultLocaleResolver.js').SwitchCaseArray|SwitchMatch} obj
         * @param {string} k
         * @param {Integer} i
         * @throws {Error}
         * @returns {import('./defaultLocaleResolver.js').SwitchArrays|
         *   import('./defaultLocaleResolver.js').SwitchArray|
         *   import('./defaultLocaleResolver.js').SwitchCaseArray|
         *   SwitchMatch}
         */
        function (obj, k, i) {
          if (Array.isArray(obj)) {
            return obj;
          }
          if (i < ks.length - 1) {
            if (!Object.hasOwn(obj, k)) {
              throw new Error("Switch key \"".concat(k, "\" not found (from \"~").concat(ky, "\")"));
            }
            return obj[k];
          }
          // Todo: Should throw on encountering duplicate fundamental keys (even
          //  if there are different arguments, that should not be allowed)
          var ret = Object.entries(obj).find(function (_ref4) {
            var _ref5 = _slicedToArray(_ref4, 1),
              switchKey = _ref5[0];
            return k === /** @type {typeof SwitchFormatter} */_this4.constructor.getKey(switchKey);
          });
          return ret ? [].concat(_toConsumableArray(ret), [k]) : [];
        },
        /**
         * @type {import('./defaultLocaleResolver.js').SwitchArrays|
         *   import('./defaultLocaleResolver.js').SwitchArray|
         *   import('./defaultLocaleResolver.js').SwitchCaseArray|SwitchMatch}
         */ /** @type {unknown} */
        this.switches);
        return /** @type {SwitchMatch} */returnValue;
      }
    }], [{
      key: "isMatchingKey",
      value:
      /**
       * @param {string} key
       * @returns {boolean}
       */
      function isMatchingKey(key) {
        return key.startsWith('~');
      }
      /**
       * @param {string} key
       * @returns {string}
       */
    }, {
      key: "getKey",
      value: function getKey(key) {
        var match = key.match(/^(?:[\0-\{\}-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*/);
        return /** @type {string} */match && match[0];
      }
    }]);
  }(Formatter);

  /* eslint-disable jsdoc/reject-any-type -- Generic API */
  /**
   * @typedef {(value: any) => Promise<any>|any} PromiseChainErrback
   */

  /**
   * The given array will have its items processed in series; if the supplied
   *  `errBack` (which is guaranteed to run at least once), when passed the
   *  current item, returns a `Promise` or value that resolves, that value will
   *  be used for the return result of this function and no other items in
   *  the array will continue to be processed; if it rejects, however, the
   *  next item will be processed with `errBack`.
   * Accept an array of values to pass to an errback which should return
   *  a promise (or final result value) which resolves to a result or which
   *  rejects so that the next item in the array can be checked in series.
   * @param {Array<any>} values Array of values
   * @param {PromiseChainErrback} errBack Accepts an item of the array as its
   *   single argument
   * @param {string} [errorMessage]
   * @returns {Promise<any>} Either resolves to a value derived from an item in
   *  the array or rejects if all items reject
   * @example
  promiseChainForValues(['a', 'b', 'c'], (val) => {
    return new Promise(function (resolve, reject) {
      if (val === 'a') {
        reject(new Error('missing'));
      }
      setTimeout(() => {
        resolve(val);
      }, 100);
    });
  });
   */
  var promiseChainForValues = function promiseChainForValues(values, errBack) {
    var errorMessage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Reached end of values array.';
    if (!Array.isArray(values)) {
      throw new TypeError('The `values` argument to `promiseChainForValues` must be an array.');
    }
    if (typeof errBack !== 'function') {
      throw new TypeError('The `errBack` argument to `promiseChainForValues` must be a function.');
    }
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var ret, p, breaking, value, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            p = Promise.reject(new Error('Intentionally reject so as to begin checking chain'));
          case 1:
            value = values.shift();
            _context.p = 2;
            _context.n = 3;
            return p;
          case 3:
            ret = _context.v;
            return _context.a(3, 7);
          case 4:
            _context.p = 4;
            _t = _context.v;
            if (!breaking) {
              _context.n = 5;
              break;
            }
            throw new Error(errorMessage, {
              cause: _t
            });
          case 5:
            // We allow one more try
            if (!values.length) {
              breaking = true;
            }
            // // eslint-disable-next-line no-await-in-loop
            p = errBack(value);
          case 6:
            _context.n = 1;
            break;
          case 7:
            return _context.a(2, ret);
        }
      }, _callee, null, [[2, 4]]);
    }))();
  };

  /**
   * `arg` - By default, accepts the third portion of the
   *   `formattingRegex` within `insertNodes`, i.e., to allow the locale to
   *   supply arguments back to the calling script.
   * `key` - The substitution key.
   * @callback SubstitutionCallback
   * @param {{
   *   arg: string,
   *   key: string
   * }} cfg
   * @returns {string|Element} The replacement text or element
   */

  /**
   * May have additional properties if supplying options to an underlying
   * formatter.
   * The first value is the main value.
   * The second are the options related to the main value.
   * The third are any additional options.
   * @typedef {[string|number|Date, object?, object?]} ValueArray
   */

  /**
   * @typedef {number} Integer
   */

  /**
   * @typedef {[
   *   string[],
   *   (((item: string, i: Integer) => Element)|object)?,
   *   object?,
   *   object?
   * ]} ListValueArray
   */

  /**
   * @typedef {[
   *   Date|number, Date|number, Intl.DateTimeFormatOptions|undefined
   * ]} DateRangeValueArray
   */

  /**
   * @typedef {[number, Intl.RelativeTimeFormatUnit, object?]} RelativeValueArray
   */

  /**
   * @typedef {object} RelativeTimeInfo
   * @property {RelativeValueArray} relative
   */

  /**
   * @typedef {object} ListInfo
   * @property {ListValueArray} list
   */

  /**
   * @typedef {object} NumberInfo
   * @property {ValueArray|number} number
   */

  /**
   * @typedef {object} DateInfo
   * @property {ValueArray} date
   */

  /**
   * @typedef {object} DateTimeInfo
   * @property {ValueArray} datetime
   */

  /**
   * @typedef {object} DateRangeInfo
   * @property {DateRangeValueArray} dateRange
   */

  /**
   * @typedef {object} DatetimeRangeInfo
   * @property {DateRangeValueArray} datetimeRange
   */

  /**
   * @typedef {object} RegionInfo
   * @property {ValueArray} region
   */

  /**
   * @typedef {object} LanguageInfo
   * @property {ValueArray} language
   */

  /**
   * @typedef {object} ScriptInfo
   * @property {ValueArray} script
   */

  /**
   * @typedef {object} CurrencyInfo
   * @property {ValueArray} currency
   */

  /**
   * @typedef {object} PluralInfo
   * @property {ValueArray} plural
   */

  /**
   * @typedef {{[key: string]: string}} PlainLocaleStringBodyObject
   */

  /**
   * @typedef {{
   *   [key: string]: string|PlainNestedLocaleStringBodyObject
   * }} PlainNestedLocaleStringBodyObject
   */

  /**
   * @typedef {object} SwitchCaseInfo
   * @property {boolean} [default=false] Whether this conditional is the default
   */

  /**
   * Contains the type, the message, and optional info about the switch case.
   * @typedef {[string, string, SwitchCaseInfo?]} SwitchCaseArray
   */

  /**
   * @typedef {Record<string, SwitchCaseArray>} SwitchArray
   */

  /**
   * @typedef {Record<string, SwitchArray>} SwitchArrays
   */

  /**
   * @typedef {object} SwitchCase
   * @property {string} message The locale message with any formatting
   *   place-holders; defaults to use of any single conditional
   * @property {string} [description] A description to add for translators
   */

  /**
   * @typedef {Record<string, SwitchCase>} SwitchGroup
   */

  /**
   * @typedef {Record<string, SwitchCase|SwitchGroup>} Switch
   */

  /**
   * @typedef {Record<string, Switch>} Switches
   */

  /**
   * @typedef {object} RichLocaleStringSubObject
   * @property {string} message The locale message with any formatting
   *   place-holders; defaults to use of any single conditional
   * @property {string} [description] A description to add for translators
   * @property {Switches} [switches] Conditionals
   */

  /**
   * @typedef {{
   *   [key: string]: RichLocaleStringSubObject
   * }} RichLocaleStringBodyObject
   */

  /**
   * @typedef {{
   *   [key: string]: RichLocaleStringSubObject|RichNestedLocaleStringBodyObject
   * }} RichNestedLocaleStringBodyObject
   */

  /**
   * Takes a base path and locale and gives a URL.
   * @callback LocaleResolver
   * @param {string} localesBasePath (Trailing slash optional)
   * @param {string} locale BCP-47 language string
   * @returns {string|false} URL of the locale file to be fetched
   */

  /**
   * @typedef {[
   *   Date|number, Date|number, (Intl.DateTimeFormatOptions|undefined)?
   * ]} DateRange
   */

  /**
   * @typedef {string|string[]|number|Date|DateRange|
   *     Element|Node|SubstitutionCallback|
   *     NumberInfo|PluralInfo|CurrencyInfo|LanguageInfo|ScriptInfo|
   *     DatetimeRangeInfo|DateRangeInfo|RegionInfo|DateTimeInfo|DateInfo|
   *     ListInfo|RelativeTimeInfo
   * } SubstitutionObjectValue
   */

  /**
   * @typedef {{
   *   [key: string]: SubstitutionObjectValue
   * }} SubstitutionObject
   */

  /**
   * @type {LocaleResolver}
   */
  var defaultLocaleResolver = function defaultLocaleResolver(localesBasePath, locale) {
    if (typeof localesBasePath !== 'string') {
      throw new TypeError('`defaultLocaleResolver` expects a string `localesBasePath`.');
    }
    if (typeof locale !== 'string') {
      throw new TypeError('`defaultLocaleResolver` expects a string `locale`.');
    }
    if (/[\.\/\\]/.test(locale)) {
      throw new TypeError('Locales cannot use file-reserved characters, `.`, `/` or `\\`');
    }
    return "".concat(localesBasePath.replace(/\/$/, ''), "/_locales/").concat(locale, "/messages.json");
  };

  /**
   * @typedef {number} Integer
   */

  /**
   * @callback Replace
   * @param {{
   *   str: string,
   *   substs?: import('./defaultLocaleResolver.js').SubstitutionObject,
   *   formatter?: import('./Formatter.js').RegularFormatter|
   *     import('./Formatter.js').LocalFormatter|
   *     import('./Formatter.js').SwitchFormatter
   * }} cfg
   * @returns {string}
   */

  /**
   * @callback ProcessSubstitutions
   * @param {{
   *   str: string,
   *   substs?: import('./defaultLocaleResolver.js').SubstitutionObject,
   *   formatter?: import('./Formatter.js').RegularFormatter|
   *     import('./Formatter.js').LocalFormatter|
   *     import('./Formatter.js').SwitchFormatter
   * }} cfg
   * @returns {(string|Node)[]}
   */

  /**
   * Callback to return a string or array of nodes and strings based on
   *   a localized string, substitutions object, and other metadata.
   *
   * `string` - The localized string.
   * `dom` - If substitutions known to contain DOM, can be set
   *    to `true` to optimize.
   * `usedKeys` - Array for tracking which keys have been used. Defaults
   *   to empty array.
   * `substitutions` - The formatting substitutions object.
   * `allSubstitutions` - The
   *   callback or array composed thereof for applying to each substitution.
   * `locale` - The successfully resolved locale
   * `locals` - The local section.
   * `switches` - The switch section.
   * `maximumLocalNestingDepth` - Depth of local variable resolution to
   *   check before reporting a recursion error. Defaults to 3.
   * `missingSuppliedFormatters` - Callback
   *   supplied key to throw if the supplied key is present (if
   *   `throwOnMissingSuppliedFormatters` is enabled). Defaults to no-op.
   * `checkExtraSuppliedFormatters` - No
   *   argument callback to check if any formatters are not present in `string`
   *   (if `throwOnExtraSuppliedFormatters` is enabled). Defaults to no-op.
   * @typedef {(cfg: {
   *   string: string,
   *   dom?: boolean,
   *   usedKeys: string[],
   *   substitutions: import('./defaultLocaleResolver.js').SubstitutionObject,
   *   allSubstitutions?: ?(
   *     import('./defaultAllSubstitutions.js').AllSubstitutionCallback|
   *     import('./defaultAllSubstitutions.js').AllSubstitutionCallback[]
   *   )
   *   locale: string|undefined,
   *   locals?: import('./getMessageForKeyByStyle.js').LocalObject|undefined,
   *   switches: import('./defaultLocaleResolver.js').Switches|undefined,
   *   maximumLocalNestingDepth?: Integer,
   *   missingSuppliedFormatters: import('./getDOMForLocaleString.js').
   *     MissingSuppliedFormattersCallback,
   *   checkExtraSuppliedFormatters: import('./getDOMForLocaleString.js').
   *     CheckExtraSuppliedFormattersCallback
   * }) => string|(Node|string)[]} InsertNodesCallback
   */

  /**
   * @type {InsertNodesCallback}
   */
  var defaultInsertNodes = function defaultInsertNodes(_ref) {
    var string = _ref.string,
      dom = _ref.dom,
      usedKeys = _ref.usedKeys,
      substitutions = _ref.substitutions,
      allSubstitutions = _ref.allSubstitutions,
      locale = _ref.locale,
      locals = _ref.locals,
      switches = _ref.switches,
      _ref$maximumLocalNest = _ref.maximumLocalNestingDepth,
      maximumLocalNestingDepth = _ref$maximumLocalNest === void 0 ? 3 : _ref$maximumLocalNest,
      missingSuppliedFormatters = _ref.missingSuppliedFormatters,
      checkExtraSuppliedFormatters = _ref.checkExtraSuppliedFormatters;
    if (typeof maximumLocalNestingDepth !== 'number') {
      throw new TypeError('`maximumLocalNestingDepth` must be a number.');
    }
    var addFunctionKeys = function addFunctionKeys() {
      Object.entries(substitutions).forEach(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
          key = _ref3[0],
          value = _ref3[1];
        if (typeof value === 'function') {
          usedKeys.push(key);
        }
      });
    };
    addFunctionKeys();
    var localFormatter = new LocalFormatter(/** @type {import('./getMessageForKeyByStyle.js').LocalObject} */locals);
    var regularFormatter = new RegularFormatter(substitutions);
    var switchFormatter = new SwitchFormatter(/** @type {import('./defaultLocaleResolver.js').Switches} */
    switches, {
      substitutions: substitutions
    });

    // eslint-disable-next-line prefer-named-capture-group -- Convenient for now
    var formattingRegex = /(\\*)\{((?:(?:[\0-\|~-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])|\\\})*?)(?:(\|)((?:[\0-\|~-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*))?\}/g;
    if (allSubstitutions) {
      allSubstitutions = Array.isArray(allSubstitutions) ? allSubstitutions : [allSubstitutions];
    }

    /**
     * @param {{
     *   key: string,
     *   arg: string,
     *   substs: import('./defaultLocaleResolver.js').SubstitutionObject
     * }} cfg
     * @returns {string|Node}
     */
    var getSubstitution = function getSubstitution(_ref4) {
      var key = _ref4.key,
        arg = _ref4.arg,
        substs = _ref4.substs;
      /** @type {import('./defaultLocaleResolver.js').SubstitutionObjectValue} */
      var substitution;
      var isLocalKey =
      /**
       * @type {typeof import('./Formatter.js').LocalFormatter}
       */
      localFormatter.constructor.isMatchingKey(key);
      if (isLocalKey) {
        substitution = localFormatter.getSubstitution(key);
      } else if (
      /**
       * @type {typeof import('./Formatter.js').SwitchFormatter}
       */
      switchFormatter.constructor.isMatchingKey(key)) {
        substitution = switchFormatter.getSubstitution(key, {
          locale: (/** @type {string} */locale),
          usedKeys: usedKeys,
          arg: arg,
          missingSuppliedFormatters: missingSuppliedFormatters
        });
      } else {
        substitution = substs[key];
        if (typeof substitution === 'function') {
          substitution = substitution({
            arg: arg,
            key: key
          });
        }
      }
      // Todo: Could support resolving locals within arguments
      // Todo: Even for `null` `allSubstitutions`, we could have
      //  a mode to throw for non-string/non-DOM (non-numbers?),
      //  or whatever is not likely intended as a target for `toString()`.
      if (allSubstitutions) {
        substitution = /** @type {string|Node} */
        /**
         * @type {import('./defaultAllSubstitutions.js').
         *   AllSubstitutionCallback[]
         * }
         */allSubstitutions.reduce(
        /**
         * @param {import('./defaultLocaleResolver.js').
         *   SubstitutionObjectValue} subst
         * @param {import('./defaultAllSubstitutions.js').
         *   AllSubstitutionCallback} allSubst
         * @returns {string|Node}
         */
        function (subst, allSubst) {
          return allSubst({
            value: subst,
            arg: arg,
            key: key,
            locale: locale
          });
        }, substitution);
      } else if (arg && /^(?:NUMBER|DATE(?:TIME|RANGE|TIMERANGE)?|REGION|LANGUAGE|SCRIPT|CURRENCY|RELATIVE|LIST)(?:\||$)/.test(arg)) {
        substitution = defaultAllSubstitutions({
          value: substitution,
          arg: arg,
          locale: locale
        });
      }

      // Change this and return type if other substitutions possible
      return /** @type {string|Node} */substitution;
    };
    var recursiveLocalCount = 1;
    /**
     * @param {{
     *   substitution: string|Node,
     *   ky: string,
     *   arg: string,
     *   processSubsts: Replace|ProcessSubstitutions
     * }} cfg
     * @returns {number|string|Node|(string|Node)[]}
     */
    var checkLocalVars = function checkLocalVars(_ref5) {
      var substitution = _ref5.substitution,
        ky = _ref5.ky,
        arg = _ref5.arg,
        processSubsts = _ref5.processSubsts;
      /** @type {number|string|Node|(string|Node)[]} */
      var subst = substitution;
      if (typeof substitution === 'string' && substitution.includes('{')) {
        if (recursiveLocalCount++ > maximumLocalNestingDepth) {
          throw new TypeError('Too much recursion in local variables.');
        }
        if (/** @type {typeof import('./Formatter.js').LocalFormatter} */localFormatter.constructor.isMatchingKey(ky)) {
          var extraSubsts = substitutions;
          var localFormatters;
          if (arg) {
            localFormatters = parseJSONExtra(arg);
            extraSubsts = _objectSpread2(_objectSpread2({}, substitutions), localFormatters);
          }
          subst = processSubsts({
            str: substitution,
            substs: extraSubsts,
            formatter: localFormatter
          });
          if (localFormatters) {
            checkExtraSuppliedFormatters({
              substitutions: localFormatters
            });
          }
        } else if (/** @type {typeof import('./Formatter.js').SwitchFormatter} */
        switchFormatter.constructor.isMatchingKey(ky)) {
          subst = processSubsts({
            str: substitution
          });
        }
      }
      return subst;
    };

    // Give chance to avoid this block when known to contain DOM
    if (!dom) {
      // Run this block to optimize non-DOM substitutions
      var returnsDOM = false;

      /** @type {Replace} */
      var _replace = function replace(_ref6) {
        var str = _ref6.str,
          _ref6$substs = _ref6.substs,
          substs = _ref6$substs === void 0 ? substitutions : _ref6$substs,
          _ref6$formatter = _ref6.formatter,
          formatter = _ref6$formatter === void 0 ? regularFormatter : _ref6$formatter;
        return str.replaceAll(formattingRegex,
        /**
         * @param {string} _
         * @param {string} esc
         * @param {string} ky
         * @param {string} pipe
         * @param {string} arg
         * @returns {string}
         */
        function (_, esc, ky, pipe, arg) {
          if (esc.length % 2) {
            return _;
          }
          if (missingSuppliedFormatters({
            key: ky,
            formatter: formatter
          })) {
            return _;
          }
          /** @type {string|number|Node|(string|Node)[]} */
          var substitution = getSubstitution({
            key: ky,
            arg: arg,
            substs: substs
          });
          substitution = checkLocalVars({
            substitution: substitution,
            ky: ky,
            arg: arg,
            processSubsts: _replace
          });
          returnsDOM || (returnsDOM = substitution !== null && _typeof(substitution) === 'object' && 'nodeType' in substitution);
          usedKeys.push(ky);
          return esc + substitution;
        });
      };
      var ret = _replace({
        str: string
      });
      if (!returnsDOM) {
        checkExtraSuppliedFormatters({
          substitutions: substitutions
        });
        usedKeys.length = 0;
        addFunctionKeys();
        return unescapeBackslashes(ret);
      }
      usedKeys.length = 0;
      addFunctionKeys();
    }
    recursiveLocalCount = 1;

    /** @type {ProcessSubstitutions} */
    var _processSubstitutions = function processSubstitutions(_ref7) {
      var str = _ref7.str,
        _ref7$substs = _ref7.substs,
        substs = _ref7$substs === void 0 ? substitutions : _ref7$substs,
        _ref7$formatter = _ref7.formatter,
        formatter = _ref7$formatter === void 0 ? regularFormatter : _ref7$formatter;
      /** @type {(string|Node)[]} */
      var nodes = [];

      // Copy to ensure we are resetting index on each instance (manually
      // resetting on `formattingRegex` is problematic with recursion that
      // uses the same regex copy)
      var regex = new RegExp(formattingRegex, 'gv');

      /**
       * @param {...(string|Node)} args
       */
      var push = function push() {
        nodes.push.apply(nodes, arguments);
      };
      processRegex(regex, str, {
        extra: push,
        onMatch: function onMatch(_, esc, ky, pipe, arg) {
          if (missingSuppliedFormatters({
            key: ky,
            formatter: formatter
          })) {
            push(_);
          } else {
            if (esc.length) {
              push(esc);
            }

            /** @type {string|number|Node|(string|Node)[]} */
            var substitution = getSubstitution({
              key: ky,
              arg: arg,
              substs: substs
            });
            substitution = checkLocalVars({
              substitution: substitution,
              ky: ky,
              arg: arg,
              processSubsts: _processSubstitutions
            });
            if (Array.isArray(substitution)) {
              push.apply(void 0, _toConsumableArray(substitution));
            } else if (
            // Clone so that multiple instances may be added (and no
            // side effects to user code)
            substitution && _typeof(substitution) === 'object' && 'nodeType' in substitution) {
              push(substitution.cloneNode(true));
            } else {
              // Why no number here?
              push(/** @type {string} */substitution);
            }
          }
          usedKeys.push(ky);
        }
      });
      return nodes;
    };
    var nodes = _processSubstitutions({
      str: string
    });
    checkExtraSuppliedFormatters({
      substitutions: substitutions
    });
    usedKeys.length = 0;
    return nodes.map(function (node) {
      if (typeof node === 'string') {
        return unescapeBackslashes(node);
      }
      return node;
    });
  };

  var _templateObject, _templateObject2;
  /**
   * @callback KeyCheckerConverterCallback
   * @param {string|string[]} key By default may be an array (if the type ends
   *   with "Nested") or a string, but a non-default validator may do otherwise.
   * @param {"plain"|"plainNested"|"rich"|
   *   "richNested"|
   *   import('./getMessageForKeyByStyle.js').MessageStyleCallback
   * } messageStyle
   * @throws {TypeError}
   * @returns {string} The converted (or unconverted) key
   */

  /**
   * @type {KeyCheckerConverterCallback}
   */
  var defaultKeyCheckerConverter = function defaultKeyCheckerConverter(key, messageStyle) {
    if (typeof messageStyle === 'string' && Array.isArray(key) && key.every(function (k) {
      return typeof k === 'string';
    }) && messageStyle.endsWith('Nested')) {
      return key.map(function (k) {
        return k.replaceAll(/*#__PURE__*/_wrapRegExp(/(\\+)/g, {
          backslashes: 1
        }), String.raw(_templateObject || (_templateObject = _taggedTemplateLiteral(["$<backslashes>"], ["\\$<backslashes>"])))).replaceAll('.', String.raw(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["."], ["\\."]))));
      }).join('.');
    }
    if (typeof key !== 'string') {
      throw new TypeError('`key` is expected to be a string (or array of strings for nested style)');
    }
    return key;
  };

  /**
   * @typedef {LocaleBody} LocalObject
   */

  /**
   * May also contain language code and direction, translator name and
   * contact, etc., but no defaults currently apply besides reserving `locals`
   * @typedef {object} LocaleHead
   * @property {LocalObject} [locals]
   * @property {import('./defaultLocaleResolver.js').Switches} [switches]
   */

  /**
   * @typedef {import('./defaultLocaleResolver.js').
   *   RichNestedLocaleStringBodyObject|
   *   import('./defaultLocaleResolver.js').RichLocaleStringBodyObject|
   *   import('./defaultLocaleResolver.js').PlainLocaleStringBodyObject|
   *   import('./defaultLocaleResolver.js').PlainNestedLocaleStringBodyObject|
   *   object
   * } LocaleBody
   */

  /**
   * @typedef {object} LocaleObject
   * @property {LocaleHead} [head]
   * @property {LocaleBody} body
   */

  /**
   * @typedef {object} MessageStyleCallbackResult
   * @property {string} value Regardless of message style, will contain
   *    the string result
   * @property {import(
   *  './defaultLocaleResolver.js'
   *  ).RichLocaleStringSubObject} [info] Full info on the localized item
   *   (for rich message styles only)
   */

  /**
   * @callback MessageStyleCallback
   * @param {LocaleObject} obj The exact
   *   format depends on the `cfg.defaults` of `i18n`
   * @param {string} key
   * @returns {false|MessageStyleCallbackResult} If `false`, will resort to
   *   default
   */

  /* eslint-disable @stylistic/max-len -- Long */
  /**
   * @param {object} [cfg]
   * @param {"richNested"|"rich"|"plain"|"plainNested"|MessageStyleCallback} [cfg.messageStyle]
   * @returns {MessageStyleCallback}
   */
  var getMessageForKeyByStyle = function getMessageForKeyByStyle() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$messageStyle = _ref.messageStyle,
      messageStyle = _ref$messageStyle === void 0 ? 'richNested' : _ref$messageStyle;
    return typeof messageStyle === 'function' ? messageStyle : messageStyle === 'richNested' ? function (mainObj, key) {
      var obj =
      /**
       * @type {import('./defaultLocaleResolver.js').
       *   RichNestedLocaleStringBodyObject
       * }
       */
      mainObj && _typeof(mainObj) === 'object' && mainObj.body;

      /**
       * @type {string[]}
       */
      var keys = [];
      // eslint-disable-next-line @stylistic/max-len -- Long
      // eslint-disable-next-line prefer-named-capture-group -- Convenient for now
      var possiblyEscapedCharPattern = /(\\*)\./g;

      /**
       * @param {string} val
       * @returns {void}
       */
      var mergeWithPreviousOrStart = function mergeWithPreviousOrStart(val) {
        if (!keys.length) {
          keys[0] = '';
        }
        keys[keys.length - 1] += val;
      };
      processRegex(possiblyEscapedCharPattern, key, {
        // If odd, this is just an escaped dot, so merge content with
        //   any previous
        extra: mergeWithPreviousOrStart,
        onMatch: function onMatch(_, esc) {
          // If even, there are no backslashes, or they are just escaped
          //  backslashes and not an escaped dot, so start anew, though
          //  first merge any backslashes
          mergeWithPreviousOrStart(esc);
          keys.push('');
        }
      });
      var keysUnescaped = keys.map(function (ky) {
        return unescapeBackslashes(ky);
      });

      /**
       * @type {false|{
       *   value: string|undefined,
       *   info: import('./defaultLocaleResolver.js').
       *     RichLocaleStringSubObject
       * }}
       */
      var ret = false;
      var currObj = obj;

      // eslint-disable-next-line @stylistic/max-len -- Long
      // eslint-disable-next-line unicorn/no-unused-array-method-return -- Shortcircuiting
      keysUnescaped.some(function (ky, i, kys) {
        if (!currObj || _typeof(currObj) !== 'object') {
          return true;
        }
        if (
        // If specified key is too deep, we should fail
        i === kys.length - 1 && Object.hasOwn(currObj, ky) && currObj[ky] !== null && _typeof(currObj[ky]) === 'object' && 'message' in currObj[ky] &&
        // NECESSARY FOR SECURITY ON UNTRUSTED LOCALES
        typeof currObj[ky].message === 'string') {
          ret = {
            value: (/** @type {string} */currObj[ky].message),
            info: (
            /**
             * @type {import('./defaultLocaleResolver.js').
             *   RichLocaleStringSubObject}
             */
            currObj[ky])
          };
        }
        currObj =
        /**
         * @type {import('./defaultLocaleResolver.js').
         *   RichNestedLocaleStringBodyObject
         * }
         */
        currObj[ky];
        return false;
      });
      return ret;
    } : messageStyle === 'rich' ? function (mainObj, key) {
      var obj =
      /**
       * @type {import('./defaultLocaleResolver.js').
       *   RichLocaleStringBodyObject
       * }
       */
      mainObj && _typeof(mainObj) === 'object' && mainObj.body;
      if (obj && _typeof(obj) === 'object' && Object.hasOwn(obj, key) && obj[key] !== null && _typeof(obj[key]) === 'object' && 'message' in obj[key] &&
      // NECESSARY FOR SECURITY ON UNTRUSTED LOCALES
      typeof obj[key].message === 'string') {
        return {
          value: obj[key].message,
          info: obj[key]
        };
      }
      return false;
    } : messageStyle === 'plain' ? function (mainObj, key) {
      var obj =
      /**
       * @type {import('./defaultLocaleResolver.js').
       *   PlainLocaleStringBodyObject
       * }
       */
      mainObj && _typeof(mainObj) === 'object' && mainObj.body;
      if (obj && _typeof(obj) === 'object' && Object.hasOwn(obj, key) && obj[key] !== null && typeof obj[key] === 'string') {
        return {
          value: obj[key]
        };
      }
      return false;
    } : messageStyle === 'plainNested' ? function (mainObj, key) {
      var obj =
      /**
       * @type {import('./defaultLocaleResolver.js').
       *   PlainNestedLocaleStringBodyObject
       * }
       */
      mainObj && _typeof(mainObj) === 'object' && mainObj.body;
      if (obj && _typeof(obj) === 'object') {
        // Should really be counting that it is an odd number
        //  of backslashes only
        var keys = key.split(/(?<!\\)\./);
        var value = keys.reduce(
        /**
         * @param {null|string|import('./defaultLocaleResolver.js').
         *   PlainNestedLocaleStringBodyObject} o
         * @param {string} k
         * @returns {null|string|import('./defaultLocaleResolver.js').
         *   PlainNestedLocaleStringBodyObject}
         */
        function (o, k) {
          // eslint-disable-next-line @stylistic/max-len -- Long
          // eslint-disable-next-line unicorn/no-computed-property-existence-check -- Ok
          if (o && _typeof(o) === 'object' && o[k]) {
            return o[k];
          }
          return null;
        }, obj);
        if (value && typeof value === 'string') {
          return {
            value: value
          };
        }
      }
      return false;
    } : function () {
      throw new TypeError("Unknown `messageStyle` ".concat(messageStyle));
    }();
  };

  /**
   * @param {object} cfg
   * @param {string|false} [cfg.message] If present, this string will be
   *   the return value.
   * @param {false|null|undefined|
   *   import('./getMessageForKeyByStyle.js').LocaleObject
   * } [cfg.defaults]
   * @param {"richNested"|"rich"|"plain"|"plainNested"|
   *   import('./getMessageForKeyByStyle.js').MessageStyleCallback
   * } [cfg.messageStyle]
   * @param {import('./getMessageForKeyByStyle.js').
   *   MessageStyleCallback
   * } [cfg.messageForKey] Defaults to getting `MessageStyleCallback` based
   *   on `messageStyle`
   * @param {string} cfg.key Key to check against object of strings;
   *   used to find a default if no string `message` is provided.
   * @returns {string}
   */
  var getStringFromMessageAndDefaults = function getStringFromMessageAndDefaults(_ref) {
    var message = _ref.message,
      defaults = _ref.defaults,
      messageStyle = _ref.messageStyle,
      _ref$messageForKey = _ref.messageForKey,
      messageForKey = _ref$messageForKey === void 0 ? getMessageForKeyByStyle({
        messageStyle: messageStyle
      }) : _ref$messageForKey,
      key = _ref.key;
    // NECESSARY CHECK FOR SECURITY ON UNTRUSTED LOCALES
    /** @type {string|false} */
    var str;
    if (typeof message === 'string') {
      str = message;
    } else if (
    // eslint-disable-next-line @stylistic/max-len -- Long
    // eslint-disable-next-line unicorn/prefer-includes-over-repeated-comparisons -- TS
    defaults === false || defaults === undefined || defaults === null) {
      str = false;
    } else if (defaults && _typeof(defaults) === 'object') {
      var msg = messageForKey(defaults, key);
      str = msg ? msg.value : msg;
    } else {
      throw new TypeError("Default locale strings must resolve to `false`, " + "nullish, or an object!");
    }
    if (str === false) {
      throw new Error("Key value not found for key: (".concat(key, ")"));
    }
    return str;
  };

  /**
   * @typedef {number} Integer
   */

  /**
   * @callback CheckExtraSuppliedFormattersCallback
   * @param {import('./defaultLocaleResolver.js').SubstitutionObject|{
   *   substitutions: import('./defaultLocaleResolver.js').SubstitutionObject
   * }} substs (Why is an arg. of `substitutions` being passed in?)
   * @throws {Error} Upon an extra formatting key being found
   * @returns {void}
   */

  /**
   * @typedef {(
   *   cfg: {
   *     key: string,
   *     formatter: import('./Formatter.js').LocalFormatter|
   *       import('./Formatter.js').RegularFormatter|
   *       import('./Formatter.js').SwitchFormatter
   *   }
   * ) => boolean} MissingSuppliedFormattersCallback
   */

  /**
   *
   * @param {object} cfg
   * @param {string} cfg.string
   * @param {string} [cfg.locale] The (possibly already resolved) locale
   *   for use by configuring formatters
   * @param {import('./getMessageForKeyByStyle.js').LocalObject} [cfg.locals]
   * @param {import('./defaultLocaleResolver.js').Switches} [cfg.switches]
   * @param {Integer} [cfg.maximumLocalNestingDepth]
   * @param {?(import('./defaultAllSubstitutions.js').AllSubstitutionCallback|
   *   import('./defaultAllSubstitutions.js').AllSubstitutionCallback[])
   * } [cfg.allSubstitutions]
   * @param {import('./defaultInsertNodes.js').InsertNodesCallback
   * } [cfg.insertNodes]
   * @param {false|import('./defaultLocaleResolver.js').SubstitutionObject
   * } [cfg.substitutions]
   * @param {boolean} [cfg.dom]
   * @param {boolean} [cfg.forceNodeReturn]
   * @param {boolean} [cfg.throwOnMissingSuppliedFormatters]
   * @param {boolean} [cfg.throwOnExtraSuppliedFormatters]
   * @returns {string|Text|DocumentFragment}
   */
  var getDOMForLocaleString = function getDOMForLocaleString(_ref) {
    var string = _ref.string,
      locale = _ref.locale,
      locals = _ref.locals,
      switches = _ref.switches;
      _ref.maximumLocalNestingDepth;
      var _ref$allSubstitutions = _ref.allSubstitutions,
      allSubstitutions = _ref$allSubstitutions === void 0 ? [defaultAllSubstitutions] : _ref$allSubstitutions,
      _ref$insertNodes = _ref.insertNodes,
      insertNodes = _ref$insertNodes === void 0 ? defaultInsertNodes : _ref$insertNodes,
      _ref$substitutions = _ref.substitutions,
      substitutions = _ref$substitutions === void 0 ? false : _ref$substitutions,
      _ref$dom = _ref.dom,
      dom = _ref$dom === void 0 ? false : _ref$dom,
      _ref$forceNodeReturn = _ref.forceNodeReturn,
      forceNodeReturn = _ref$forceNodeReturn === void 0 ? false : _ref$forceNodeReturn,
      _ref$throwOnMissingSu = _ref.throwOnMissingSuppliedFormatters,
      throwOnMissingSuppliedFormatters = _ref$throwOnMissingSu === void 0 ? true : _ref$throwOnMissingSu,
      _ref$throwOnExtraSupp = _ref.throwOnExtraSuppliedFormatters,
      throwOnExtraSuppliedFormatters = _ref$throwOnExtraSupp === void 0 ? true : _ref$throwOnExtraSupp;
    if (typeof string !== 'string') {
      throw new TypeError('An options object with a `string` property set to a string must ' + 'be provided for `getDOMForLocaleString`.');
    }

    /**
     * @param {string} str
     * @returns {Text|string}
     */
    var stringOrTextNode = function stringOrTextNode(str) {
      var _doc = getDocument();
      return forceNodeReturn ? /** @type {Document} */_doc.createTextNode(str) : str;
    };
    if (!substitutions && !allSubstitutions && !throwOnMissingSuppliedFormatters) {
      return stringOrTextNode(string);
    }
    if (!substitutions) {
      substitutions = {};
    }

    /** @type {string[]} */
    var usedKeys = [];

    /**
     * @type {CheckExtraSuppliedFormattersCallback}
     */
    var checkExtraSuppliedFormatters = function checkExtraSuppliedFormatters(_ref2) {
      var substs = _ref2.substitutions;
      if (throwOnExtraSuppliedFormatters) {
        Object.keys(substs).forEach(function (key) {
          if (!usedKeys.includes(key)) {
            throw new Error("Extra formatting key: ".concat(key));
          }
        });
      }
    };

    /**
     * @type {MissingSuppliedFormattersCallback}
     */
    var missingSuppliedFormatters = function missingSuppliedFormatters(_ref3) {
      var key = _ref3.key,
        formatter = _ref3.formatter;
      var matching = formatter.isMatch(key);
      if (!matching &&
      /**
       * @type {typeof import('./Formatter.js').LocalFormatter|
       *       typeof import('./Formatter.js').RegularFormatter|
       *       typeof import('./Formatter.js').SwitchFormatter}
       */
      formatter.constructor.isMatchingKey(key)) {
        if (throwOnMissingSuppliedFormatters) {
          throw new Error("Missing formatting key: ".concat(key));
        }
        return true;
      }
      return false;
    };
    var nodes = insertNodes({
      string: string,
      dom: dom,
      usedKeys: usedKeys,
      substitutions: substitutions,
      allSubstitutions: allSubstitutions,
      locale: locale,
      locals: locals,
      switches: switches,
      missingSuppliedFormatters: missingSuppliedFormatters,
      checkExtraSuppliedFormatters: checkExtraSuppliedFormatters
    });
    if (typeof nodes === 'string') {
      return stringOrTextNode(nodes);
    }
    var _doc = getDocument();
    var container = /** @type {Document} */_doc.createDocumentFragment();
    container.append.apply(container, _toConsumableArray(nodes));
    return container;
  };

  /**
   * Takes a locale and returns a new locale to check.
   * @callback LocaleMatcher
   * @param {string} locale The failed locale
   * @throws {Error} If there are no further hyphens left to check
   * @returns {string|Promise<string>} The new locale to check
   */

  /**
   * @type {LocaleMatcher}
   */
  var defaultLocaleMatcher = function defaultLocaleMatcher(locale) {
    if (!locale.includes('-')) {
      throw new Error('Locale not available');
    }
    // Try without hyphen, i.e., the "lookup" algorithm:
    // See https://tools.ietf.org/html/rfc4647#section-3.4 and
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
    return locale.replace(/-(?:[\0-,\.-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*$/, '');
  };

  /**
   * @param {object} cfg
   * @param {string} cfg.locale
   * @param {string[]} cfg.locales
   * @param {LocaleMatcher} [cfg.localeMatcher]
   * @returns {string|false}
   */
  var getMatchingLocale = function getMatchingLocale(_ref) {
    var locale = _ref.locale,
      locales = _ref.locales,
      _ref$localeMatcher = _ref.localeMatcher,
      localeMatcher = _ref$localeMatcher === void 0 ? defaultLocaleMatcher : _ref$localeMatcher;
    try {
      while (!locales.includes(locale)) {
        // Catch as `defaultLocaleMatcher` will throw if no hyphen found
        locale = localeMatcher(locale);
      }
    } catch (err) {
      return false;
    }
    return locale;
  };

  /**
   * @typedef {object} LocaleObjectInfo
   * @property {import('./getMessageForKeyByStyle.js').
   *   LocaleObject} strings The successfully retrieved locale strings
   * @property {string} locale The successfully resolved locale
   */

  /**
   * @typedef {{
   *   locales?: string[],
   *   defaultLocales?: string[],
   *   localesBasePath?: string,
   *   localeResolver?: import('./defaultLocaleResolver.js').LocaleResolver,
   *   localeMatcher?: "lookup"|LocaleMatcher
   * }} LocaleStringArgs
   */

  /**
   * `locales` - BCP-47 language strings. Defaults to `navigator.languages`.
   * `defaultLocales` - Defaults to ["en-US"].
   * `localesBasePath` - Defaults to `.`.
   * `localeResolver` - Defaults to `defaultLocaleResolver`.
   * @typedef {(
   *   cfg?: LocaleStringArgs
   * ) => Promise<LocaleObjectInfo>} LocaleStringFinder
   */

  /**
   *
   * @type {LocaleStringFinder}
   */
  var findLocaleStrings = function findLocaleStrings() {
    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      locales = _ref2.locales,
      defaultLocales = _ref2.defaultLocales,
      localeResolver = _ref2.localeResolver,
      localesBasePath = _ref2.localesBasePath,
      localeMatcher = _ref2.localeMatcher;
    return /** @type {Promise<LocaleObjectInfo>} */_findLocale({
      locales: locales,
      defaultLocales: defaultLocales,
      localeResolver: localeResolver,
      localesBasePath: localesBasePath,
      localeMatcher: localeMatcher
    });
  };

  /**
   * Resolves to the successfully resolved locale.
   * `locales` - BCP-47 language strings. Defaults to `navigator.languages`.
   * `defaultLocales` - Defaults to ["en-US"].
   * `localesBasePath` - Defaults to `.`.
   * `localeResolver` - Defaults to `defaultLocaleResolver`.
   * `localeMatcher`.
   * @typedef {(cfg?: LocaleStringArgs) => Promise<string>} LocaleFinder
   */

  /**
   *
   * @type {LocaleFinder}
   */
  var findLocale = function findLocale() {
    var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      locales = _ref3.locales,
      defaultLocales = _ref3.defaultLocales,
      localeResolver = _ref3.localeResolver,
      localesBasePath = _ref3.localesBasePath,
      localeMatcher = _ref3.localeMatcher;
    return /** @type {Promise<string>} */_findLocale({
      locales: locales,
      defaultLocales: defaultLocales,
      localeResolver: localeResolver,
      localesBasePath: localesBasePath,
      localeMatcher: localeMatcher,
      headOnly: true
    });
  };

  /**
   * @type {(
   *   cfg: LocaleStringArgs & {
   *     headOnly?: boolean
   *   }
   * ) => Promise<string|LocaleObjectInfo>} Also has a `headOnly` boolean
   *  property to determine whether to make a simple HEAD and resolve to
   *  the locale rather than locale and contents
   */
  var _findLocale = /*#__PURE__*/function () {
    var _findLocale2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(_ref4) {
      var _ref4$locales, locales, _ref4$defaultLocales, defaultLocales, _ref4$localeResolver, localeResolver, _ref4$localesBasePath, localesBasePath, _ref4$localeMatcher, localeMatcher, _ref4$headOnly, headOnly, getLocale, _getLocale;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            _getLocale = function _getLocale3() {
              _getLocale = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(locale) {
                var url, _fetch, resp, strings, newLocale, _t;
                return _regenerator().w(function (_context) {
                  while (1) switch (_context.p = _context.n) {
                    case 0:
                      if (!(typeof locale !== 'string')) {
                        _context.n = 1;
                        break;
                      }
                      throw new TypeError('Non-string locale type');
                    case 1:
                      url = localeResolver(localesBasePath, locale);
                      if (!(typeof url !== 'string')) {
                        _context.n = 2;
                        break;
                      }
                      throw new TypeError('`localeResolver` expected to resolve to (URL) string.');
                    case 2:
                      _context.p = 2;
                      _fetch = /** @type {import('./shared.js').Fetch} */getFetch();
                      _context.n = 3;
                      return headOnly ? _fetch(url, {
                        method: 'HEAD'
                      }) : _fetch(url);
                    case 3:
                      resp = _context.v;
                      if (!(resp.status === 404)) {
                        _context.n = 4;
                        break;
                      }
                      throw new Error('Trying again');
                    case 4:
                      if (!headOnly) {
                        _context.n = 5;
                        break;
                      }
                      return _context.a(2, locale);
                    case 5:
                      _context.n = 6;
                      return resp.json();
                    case 6:
                      strings = _context.v;
                      return _context.a(2, {
                        locale: locale,
                        strings: strings
                      });
                    case 7:
                      _context.p = 7;
                      _t = _context.v;
                      if (!(/** @type {Error} */_t.name === 'SyntaxError')) {
                        _context.n = 8;
                        break;
                      }
                      throw _t;
                    case 8:
                      _context.n = 9;
                      return /** @type {LocaleMatcher} */localeMatcher(locale);
                    case 9:
                      newLocale = _context.v;
                      return _context.a(2, getLocale(newLocale));
                  }
                }, _callee, null, [[2, 7]]);
              }));
              return _getLocale.apply(this, arguments);
            };
            getLocale = function _getLocale2(_x2) {
              return _getLocale.apply(this, arguments);
            };
            _ref4$locales = _ref4.locales, locales = _ref4$locales === void 0 ? typeof intlDomLocale !== 'undefined' ? [intlDomLocale] : typeof navigator === 'undefined' ? [] : navigator.languages : _ref4$locales, _ref4$defaultLocales = _ref4.defaultLocales, defaultLocales = _ref4$defaultLocales === void 0 ? ['en-US'] : _ref4$defaultLocales, _ref4$localeResolver = _ref4.localeResolver, localeResolver = _ref4$localeResolver === void 0 ? defaultLocaleResolver : _ref4$localeResolver, _ref4$localesBasePath = _ref4.localesBasePath, localesBasePath = _ref4$localesBasePath === void 0 ? '.' : _ref4$localesBasePath, _ref4$localeMatcher = _ref4.localeMatcher, localeMatcher = _ref4$localeMatcher === void 0 ? 'lookup' : _ref4$localeMatcher, _ref4$headOnly = _ref4.headOnly, headOnly = _ref4$headOnly === void 0 ? false : _ref4$headOnly;
            /**
             * @callback getLocale
             * @throws {SyntaxError|TypeError|Error}
             * @param {string} locale
             * @returns {Promise<LocaleObjectInfo|string>}
             */
            if (!(localeMatcher === 'lookup')) {
              _context2.n = 1;
              break;
            }
            localeMatcher = defaultLocaleMatcher;
            _context2.n = 2;
            break;
          case 1:
            if (!(typeof localeMatcher !== 'function')) {
              _context2.n = 2;
              break;
            }
            throw new TypeError('`localeMatcher` must be "lookup" or a function!');
          case 2:
            _context2.n = 3;
            return promiseChainForValues([].concat(_toConsumableArray(locales), _toConsumableArray(defaultLocales)), getLocale, 'No matching locale found for ' + [].concat(_toConsumableArray(locales), _toConsumableArray(defaultLocales)).join(', '));
          case 3:
            return _context2.a(2, _context2.v);
        }
      }, _callee2);
    }));
    function _findLocale(_x) {
      return _findLocale2.apply(this, arguments);
    }
    return _findLocale;
  }();

  /**
   * @typedef {import('./index.js').Sort} Sort
   */
  /**
   * @typedef {import('./index.js').SortList} SortList
   */
  /**
   * @typedef {import('./index.js').List} List
   */

  /**
   * @typedef {import('./index.js').I18NCallback} I18NCallback
   */

  /**
   * @param {object} cfg
   * @param {import('./getMessageForKeyByStyle.js').LocaleObject} cfg.strings
   * @param {string} cfg.resolvedLocale
   * @param {"richNested"|"rich"|"plain"|"plainNested"|
   *   import('./getMessageForKeyByStyle.js').
   *     MessageStyleCallback} [cfg.messageStyle]
   * @param {?import('./defaultAllSubstitutions.js').AllSubstitutionCallback|
   *   import('./defaultAllSubstitutions.js').
   *     AllSubstitutionCallback[]} [cfg.allSubstitutions]
   * @param {import('./defaultInsertNodes.js').
   *   InsertNodesCallback} [cfg.insertNodes]
   * @param {import('./defaultKeyCheckerConverter.js').
   *   KeyCheckerConverterCallback} [cfg.keyCheckerConverter]
   * @param {false|null|undefined|
   *   import('./getMessageForKeyByStyle.js').LocaleObject} [cfg.defaults]
   * @param {false|import('./defaultLocaleResolver.js').
   *   SubstitutionObject} [cfg.substitutions]
   * @param {Integer} [cfg.maximumLocalNestingDepth]
   * @param {boolean} [cfg.dom]
   * @param {boolean} [cfg.forceNodeReturn]
   * @param {boolean} [cfg.throwOnMissingSuppliedFormatters]
   * @param {boolean} [cfg.throwOnExtraSuppliedFormatters]
   * @returns {I18NCallback} Rejects if no suitable locale is found.
   */
  var i18nServer = function i18nServer(_ref) {
    var strings = _ref.strings,
      resolvedLocale = _ref.resolvedLocale,
      _ref$messageStyle = _ref.messageStyle,
      messageStyle = _ref$messageStyle === void 0 ? 'richNested' : _ref$messageStyle,
      defaultAllSubstitutionsValue = _ref.allSubstitutions,
      insertNodes = _ref.insertNodes,
      _ref$keyCheckerConver = _ref.keyCheckerConverter,
      keyCheckerConverter = _ref$keyCheckerConver === void 0 ? defaultKeyCheckerConverter : _ref$keyCheckerConver,
      defaultDefaults = _ref.defaults,
      defaultSubstitutions = _ref.substitutions,
      maximumLocalNestingDepth = _ref.maximumLocalNestingDepth,
      _ref$dom = _ref.dom,
      domDefaults = _ref$dom === void 0 ? false : _ref$dom,
      _ref$forceNodeReturn = _ref.forceNodeReturn,
      forceNodeReturnDefault = _ref$forceNodeReturn === void 0 ? false : _ref$forceNodeReturn,
      _ref$throwOnMissingSu = _ref.throwOnMissingSuppliedFormatters,
      throwOnMissingSuppliedFormattersDefault = _ref$throwOnMissingSu === void 0 ? true : _ref$throwOnMissingSu,
      _ref$throwOnExtraSupp = _ref.throwOnExtraSuppliedFormatters,
      throwOnExtraSuppliedFormattersDefault = _ref$throwOnExtraSupp === void 0 ? true : _ref$throwOnExtraSupp;
    if (!strings || _typeof(strings) !== 'object') {
      throw new TypeError("Locale strings must be an object!");
    }
    var messageForKey = getMessageForKeyByStyle({
      messageStyle: messageStyle
    });

    /**
     * @type {I18NCallback}
     */
    var formatter = function formatter(key, substitutions) {
      var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref2$allSubstitution = _ref2.allSubstitutions,
        allSubstitutions = _ref2$allSubstitution === void 0 ? defaultAllSubstitutionsValue : _ref2$allSubstitution,
        _ref2$defaults = _ref2.defaults,
        defaults = _ref2$defaults === void 0 ? defaultDefaults : _ref2$defaults,
        _ref2$dom = _ref2.dom,
        dom = _ref2$dom === void 0 ? domDefaults : _ref2$dom,
        _ref2$forceNodeReturn = _ref2.forceNodeReturn,
        forceNodeReturn = _ref2$forceNodeReturn === void 0 ? forceNodeReturnDefault : _ref2$forceNodeReturn,
        _ref2$throwOnMissingS = _ref2.throwOnMissingSuppliedFormatters,
        throwOnMissingSuppliedFormatters = _ref2$throwOnMissingS === void 0 ? throwOnMissingSuppliedFormattersDefault : _ref2$throwOnMissingS,
        _ref2$throwOnExtraSup = _ref2.throwOnExtraSuppliedFormatters,
        throwOnExtraSuppliedFormatters = _ref2$throwOnExtraSup === void 0 ? throwOnExtraSuppliedFormattersDefault : _ref2$throwOnExtraSup;
      key = /** @type {string} */keyCheckerConverter(key, messageStyle);
      var message = messageForKey(strings, key);
      var string = getStringFromMessageAndDefaults({
        message: message && typeof message.value === 'string' ? message.value : false,
        defaults: defaults,
        messageForKey: messageForKey,
        key: key
      });
      return getDOMForLocaleString({
        string: string,
        locals: strings.head && strings.head.locals,
        switches: strings.head && strings.head.switches,
        locale: resolvedLocale,
        maximumLocalNestingDepth: maximumLocalNestingDepth,
        allSubstitutions: allSubstitutions,
        insertNodes: insertNodes,
        substitutions: _objectSpread2(_objectSpread2({}, defaultSubstitutions), substitutions),
        dom: dom,
        forceNodeReturn: forceNodeReturn,
        throwOnMissingSuppliedFormatters: throwOnMissingSuppliedFormatters,
        throwOnExtraSuppliedFormatters: throwOnExtraSuppliedFormatters
      });
    };
    formatter.resolvedLocale = resolvedLocale;
    formatter.strings = strings;

    /** @type {Sort} */
    formatter.sort = function (arrayOfItems, options) {
      return sort(resolvedLocale, arrayOfItems, options);
    };

    /** @type {SortList} */
    formatter.sortList = function (arrayOfItems, map, listOptions, collationOptions) {
      return sortList(resolvedLocale, arrayOfItems, map, listOptions, collationOptions);
    };

    /** @type {List} */
    formatter.list = function (arrayOfItems, options) {
      return list(resolvedLocale, arrayOfItems, options);
    };
    return formatter;
  };

  /**
   * @typedef {number} Integer
   */

  /**
   * @param {object} [cfg]
   * @param {string[]} [cfg.locales] BCP-47 language strings
   * @param {string[]} [cfg.defaultLocales]
   * @param {import('./findLocaleStrings.js').
   *   LocaleStringFinder} [cfg.localeStringFinder]
   * @param {string} [cfg.localesBasePath]
   * @param {import('./defaultLocaleResolver.js').
   *   LocaleResolver} [cfg.localeResolver]
   * @param {"lookup"|import('./findLocaleStrings.js').
   *   LocaleMatcher} [cfg.localeMatcher]
   * @param {"richNested"|"rich"|"plain"|"plainNested"|
   *   import('./getMessageForKeyByStyle.js').
   *     MessageStyleCallback} [cfg.messageStyle]
   * @param {?(import('./defaultAllSubstitutions.js').AllSubstitutionCallback|
   *   import('./defaultAllSubstitutions.js').
   *     AllSubstitutionCallback[])} [cfg.allSubstitutions]
   * @param {import('./defaultInsertNodes.js').
   *   InsertNodesCallback} [cfg.insertNodes]
   * @param {import('./defaultKeyCheckerConverter.js').
   *   KeyCheckerConverterCallback} [cfg.keyCheckerConverter]
   * @param {false|null|undefined|
   *   import('./getMessageForKeyByStyle.js').LocaleObject} [cfg.defaults]
   * @param {false|
   *   import('./defaultLocaleResolver.js').
   *     SubstitutionObject} [cfg.substitutions]
   * @param {Integer} [cfg.maximumLocalNestingDepth]
   * @param {boolean} [cfg.dom]
   * @param {boolean} [cfg.forceNodeReturn]
   * @param {boolean} [cfg.throwOnMissingSuppliedFormatters]
   * @param {boolean} [cfg.throwOnExtraSuppliedFormatters]
   * @returns {Promise<I18NCallback>} Rejects if no suitable locale is found.
   */
  var i18n = /*#__PURE__*/function () {
    var _i18n = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var _ref3,
        locales,
        defaultLocales,
        _ref3$localeStringFin,
        localeStringFinder,
        localesBasePath,
        localeResolver,
        localeMatcher,
        messageStyle,
        allSubstitutions,
        insertNodes,
        keyCheckerConverter,
        defaults,
        substitutions,
        maximumLocalNestingDepth,
        dom,
        forceNodeReturn,
        throwOnMissingSuppliedFormatters,
        throwOnExtraSuppliedFormatters,
        _yield$localeStringFi,
        strings,
        resolvedLocale,
        defaultLocale,
        _yield$localeStringFi2,
        _args = arguments;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            _ref3 = _args.length > 0 && _args[0] !== undefined ? _args[0] : {}, locales = _ref3.locales, defaultLocales = _ref3.defaultLocales, _ref3$localeStringFin = _ref3.localeStringFinder, localeStringFinder = _ref3$localeStringFin === void 0 ? findLocaleStrings : _ref3$localeStringFin, localesBasePath = _ref3.localesBasePath, localeResolver = _ref3.localeResolver, localeMatcher = _ref3.localeMatcher, messageStyle = _ref3.messageStyle, allSubstitutions = _ref3.allSubstitutions, insertNodes = _ref3.insertNodes, keyCheckerConverter = _ref3.keyCheckerConverter, defaults = _ref3.defaults, substitutions = _ref3.substitutions, maximumLocalNestingDepth = _ref3.maximumLocalNestingDepth, dom = _ref3.dom, forceNodeReturn = _ref3.forceNodeReturn, throwOnMissingSuppliedFormatters = _ref3.throwOnMissingSuppliedFormatters, throwOnExtraSuppliedFormatters = _ref3.throwOnExtraSuppliedFormatters;
            _context.n = 1;
            return localeStringFinder({
              locales: locales,
              defaultLocales: defaultLocales,
              localeResolver: localeResolver,
              localesBasePath: localesBasePath,
              localeMatcher: localeMatcher
            });
          case 1:
            _yield$localeStringFi = _context.v;
            strings = _yield$localeStringFi.strings;
            resolvedLocale = _yield$localeStringFi.locale;
            if (!(!defaults && defaultLocales)) {
              _context.n = 3;
              break;
            }
            _context.n = 2;
            return localeStringFinder({
              locales: defaultLocales,
              defaultLocales: [],
              localeResolver: localeResolver,
              localesBasePath: localesBasePath,
              localeMatcher: localeMatcher
            });
          case 2:
            _yield$localeStringFi2 = _context.v;
            defaults = _yield$localeStringFi2.strings;
            defaultLocale = _yield$localeStringFi2.locale;
            if (defaultLocale === resolvedLocale) {
              defaults = null; // No need to fall back
            }
          case 3:
            return _context.a(2, i18nServer({
              strings: strings,
              resolvedLocale: resolvedLocale,
              messageStyle: messageStyle,
              allSubstitutions: allSubstitutions,
              insertNodes: insertNodes,
              keyCheckerConverter: keyCheckerConverter,
              defaults: defaults,
              substitutions: substitutions,
              maximumLocalNestingDepth: maximumLocalNestingDepth,
              dom: dom,
              forceNodeReturn: forceNodeReturn,
              throwOnMissingSuppliedFormatters: throwOnMissingSuppliedFormatters,
              throwOnExtraSuppliedFormatters: throwOnExtraSuppliedFormatters
            }));
        }
      }, _callee);
    }));
    function i18n() {
      return _i18n.apply(this, arguments);
    }
    return i18n;
  }();

  exports.Formatter = Formatter;
  exports.LocalFormatter = LocalFormatter;
  exports.RegularFormatter = RegularFormatter;
  exports.SwitchFormatter = SwitchFormatter;
  exports.defaultAllSubstitutions = defaultAllSubstitutions;
  exports.defaultInsertNodes = defaultInsertNodes;
  exports.defaultKeyCheckerConverter = defaultKeyCheckerConverter;
  exports.defaultLocaleMatcher = defaultLocaleMatcher;
  exports.defaultLocaleResolver = defaultLocaleResolver;
  exports.findLocale = findLocale;
  exports.findLocaleStrings = findLocaleStrings;
  exports.getDOMForLocaleString = getDOMForLocaleString;
  exports.getDocument = getDocument;
  exports.getFetch = getFetch;
  exports.getMatchingLocale = getMatchingLocale;
  exports.getMessageForKeyByStyle = getMessageForKeyByStyle;
  exports.getStringFromMessageAndDefaults = getStringFromMessageAndDefaults;
  exports.i18n = i18n;
  exports.i18nServer = i18nServer;
  exports.parseJSONExtra = parseJSONExtra;
  exports.processRegex = processRegex;
  exports.promiseChainForValues = promiseChainForValues;
  exports.setDocument = setDocument;
  exports.setFetch = setFetch;
  exports.setJSONExtra = setJSONExtra;
  exports.unescapeBackslashes = unescapeBackslashes;

}));
