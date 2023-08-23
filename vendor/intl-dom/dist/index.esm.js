function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
function _wrapRegExp() {
  _wrapRegExp = function (re, groups) {
    return new BabelRegExp(re, void 0, groups);
  };
  var _super = RegExp.prototype,
    _groups = new WeakMap();
  function BabelRegExp(re, flags, groups) {
    var _this = new RegExp(re, flags);
    return _groups.set(_this, groups || _groups.get(re)), _setPrototypeOf(_this, BabelRegExp.prototype);
  }
  function buildGroups(result, re) {
    var g = _groups.get(re);
    return Object.keys(g).reduce(function (groups, name) {
      var i = g[name];
      if ("number" == typeof i) groups[name] = result[i];else {
        for (var k = 0; void 0 === result[i[k]] && k + 1 < i.length;) k++;
        groups[name] = result[i[k]];
      }
      return groups;
    }, Object.create(null));
  }
  return _inherits(BabelRegExp, RegExp), BabelRegExp.prototype.exec = function (str) {
    var result = _super.exec.call(this, str);
    if (result) {
      result.groups = buildGroups(result, this);
      var indices = result.indices;
      indices && (indices.groups = buildGroups(indices, this));
    }
    return result;
  }, BabelRegExp.prototype[Symbol.replace] = function (str, substitution) {
    if ("string" == typeof substitution) {
      var groups = _groups.get(this);
      return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) {
        var group = groups[name];
        return "$" + (Array.isArray(group) ? group.join("$") : group);
      }));
    }
    if ("function" == typeof substitution) {
      var _this = this;
      return _super[Symbol.replace].call(this, str, function () {
        var args = arguments;
        return "object" != typeof args[args.length - 1] && (args = [].slice.call(args)).push(buildGroups(args, _this)), substitution.apply(this, args);
      });
    }
    return _super[Symbol.replace].call(this, str, substitution);
  }, _wrapRegExp.apply(this, arguments);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}
function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

// We want it to work in the browser, so commenting out
// import jsonExtra from 'json5';
// import jsonExtra from 'json-6';

/**
 * @typedef {any} JSON6
 */

// @ts-expect-error Need typing for JSON6
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
  return str.replace(/\\+/g, function (esc) {
    return esc.slice(0, esc.length / 2);
  });
};

/**
 * @typedef {any} AnyValue
 */

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
  var match;
  var previousIndex = 0;
  if (extra) {
    betweenMatches = extra;
    afterMatch = extra;
    escapeAtOne = extra;
  }
  if (!betweenMatches || !afterMatch) {
    throw new Error('You must have `extra` or `betweenMatches` and `afterMatch` arguments.');
  }
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

/* globals fetch, document */

/**
 * @typedef {(
 *   input: RequestInfo|URL, init?: RequestInit
 * ) => Promise<Response>} Fetch
 */
/**
 * @type {null|Fetch}
 */
var _fetch = typeof fetch !== 'undefined' ? fetch
/* c8 ignore next */ : null;

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
/* c8 ignore next */ ? document : null;

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

/**
 *
 * @returns {string}
 */
function generateUUID() {
  //  Adapted from original: public domain/MIT: http://stackoverflow.com/a/8809472/271577
  var d = Date.now();
  /* c8 ignore next 5 */
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); // use high-precision timer if available
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    /* eslint-disable no-bitwise */
    var r = Math.trunc((d + Math.random() * 16) % 16);
    d = Math.floor(d / 16);
    return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
    /* eslint-enable no-bitwise */
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
 * @param {((str: string, idx: Integer) => any)|
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
  new RegExp("<<".concat(randomId, "(\\d)>>"), 'gu'), list(locale, placeholderArray, listOptions), {
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
    arg = _ref2.arg;
    _ref2.key;
    var locale = _ref2.locale;
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
      options = _ref3$options === void 0 ? /** @type {object|undefined} */
      opts : _ref3$options,
      _ref3$checkArgOptions = _ref3.checkArgOptions,
      checkArgOptions = _ref3$checkArgOptions === void 0 ? false : _ref3$checkArgOptions;
    if (typeof arg === 'string') {
      var _arg$split = arg.split('|'),
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
    if (['number', 'date', 'datetime', 'dateRange', 'datetimeRange', 'relative', 'region', 'language', 'script', 'currency', 'list', 'plural'].includes(singleKey)) {
      var extraOpts, callback;
      /**
       * @typedef {any} AnyValue
       */

      var obj = /** @type {unknown} */
      /** @type {AnyValue} */
      value[
      /**
        * @type {"number"|"date"|"datetime"|"dateRange"|
        *   "datetimeRange"|"relative"|"region"|"language"|
        *   "script"|"currency"|"list"|"plural"}
        */
      singleKey];
      var _getFormatterInfo = getFormatterInfo({
        object:
        /**
         * @type {import('./defaultLocaleResolver.js').DateRangeValueArray|
         *   import('./defaultLocaleResolver.js').ListValueArray|
         *   import('./defaultLocaleResolver.js').RelativeValueArray|
         *   import('./defaultLocaleResolver.js').ValueArray
         * }
         */
        obj
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
            return dtf.formatRange.apply(dtf, _toConsumableArray( /** @type {[Date, Date]} */
            [/** @type {number|Date} */
            value, /** @type {Date} */
            opts].map(function (val) {
              return typeof val === 'number' ? new Date(val) : val;
            })));
          }
        case 'region':
        case 'language':
        case 'script':
        case 'currency':
          return (/** @type {string} */new Intl.DisplayNames(locale, _objectSpread2(_objectSpread2({}, applyArgs({
              type: singleKey.toUpperCase()
            })), {}, {
              type: singleKey
            })).of( /** @type {string} */value)
          );
        case 'relative':
          // The second argument actually contains the primary options, so swap
          // eslint-disable-next-line max-len -- Long
          var _ref4 = /** @type {[Intl.RelativeTimeFormatUnit, object?]} */
          [opts, extraOpts];
          extraOpts = _ref4[0];
          opts = _ref4[1];
          return new Intl.RelativeTimeFormat(locale, applyArgs({
            type: 'RELATIVE'
          })).format( /** @type {number} */value, extraOpts);

        // ListFormat (with Collator)
        case 'list':
          if (callback) {
            return sortList( /** @type {string} */locale, /** @type {string[]} */
            value, callback, applyArgs({
              type: 'LIST'
            }), applyArgs({
              type: 'LIST',
              options: extraOpts,
              checkArgOptions: true
            }));
          }
          return sortList( /** @type {string} */locale, /** @type {string[]} */
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
    if (typeof value === 'number' && (expectsDatetime || /^DATE(?:TIME)(?:\||$)/.test( /** @type {string} */arg))) {
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
    }))).formatRange.apply(_Intl$DateTimeFormat, _toConsumableArray( /** @type {[Date, Date]} */
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
 *   MessageStyleCallback} [cfg.messageStyle="richNested"]
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
  _inherits(LocalFormatter, _Formatter);
  var _super = _createSuper(LocalFormatter);
  /**
   * @param {import('./getMessageForKeyByStyle.js').LocalObject} locals
   */
  function LocalFormatter(locals) {
    var _this;
    _classCallCheck(this, LocalFormatter);
    _this = _super.call(this);
    _this.locals = locals;
    return _this;
  }
  /**
   * @param {string} key
   * @returns {string|Element}
   */
  _createClass(LocalFormatter, [{
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
      return (/** @type {typeof LocalFormatter} */this.constructor.isMatchingKey(key) && components.every(function (cmpt) {
          var result = (cmpt in parent);
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
        })
      );
    }
    /**
     * @param {string} key
     * @returns {boolean}
     */
  }], [{
    key: "isMatchingKey",
    value: function isMatchingKey(key) {
      return key.startsWith('-');
    }
  }]);
  return LocalFormatter;
}(Formatter);

/**
 * Formatter for regular variables.
 */
var RegularFormatter = /*#__PURE__*/function (_Formatter2) {
  _inherits(RegularFormatter, _Formatter2);
  var _super2 = _createSuper(RegularFormatter);
  /**
   * @param {import('./defaultLocaleResolver.js').SubstitutionObject
   * } substitutions
   */
  function RegularFormatter(substitutions) {
    var _this2;
    _classCallCheck(this, RegularFormatter);
    _this2 = _super2.call(this);
    _this2.substitutions = substitutions;
    return _this2;
  }
  /**
   * @param {string} key
   * @returns {boolean}
   */
  _createClass(RegularFormatter, [{
    key: "isMatch",
    value: function isMatch(key) {
      return (/** @type {typeof RegularFormatter} */this.constructor.isMatchingKey(key) && key in this.substitutions
      );
    }
    /**
     * @param {string} key
     * @returns {boolean}
     */
  }], [{
    key: "isMatchingKey",
    value: function isMatchingKey(key) {
      return /^[0-9A-Z_a-z]/.test(key);
    }
  }]);
  return RegularFormatter;
}(Formatter);

/**
 * Formatter for switch variables.
 */
var SwitchFormatter = /*#__PURE__*/function (_Formatter3) {
  _inherits(SwitchFormatter, _Formatter3);
  var _super3 = _createSuper(SwitchFormatter);
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
    _this3 = _super3.call(this);
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
  _createClass(SwitchFormatter, [{
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
        var _objKey$split = objKey.split('|');
        var _objKey$split2 = _slicedToArray(_objKey$split, 3);
        type = _objKey$split2[1];
        opts = _objKey$split2[2];
      }
      if (!body) {
        missingSuppliedFormatters({
          key: key,
          formatter: this
        });
        return '\\{' + key + '}';
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
      var formatterValue = this.substitutions[/** @type {string} */keySegment];
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
              formatterValue[/** @type {"number"|"plural"} */singleKey]
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
          // eslint-disable-next-line default-case
          switch (type) {
            case 'NUMBER':
              match = getNumberFormat( /** @type {number} */value, /** @type {Intl.NumberFormatOptions} */
              options);
              break;
            case 'PLURAL':
              match = getPluralFormat( /** @type {number} */value, /** @type {Intl.PluralRulesOptions} */
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
        return s.replace(/\\/g, '\\\\').replace(/\./g, '\\.');
      };
      try {
        return _getSubstitution({
          messageStyle: messageStyle,
          key: match ? preventNesting( /** @type {string} */match) : arg,
          body: body,
          type: 'switch'
        });
      } catch (err) {
        try {
          return _getSubstitution({
            messageStyle: messageStyle,
            key: '*' + preventNesting( /** @type {string} */match),
            body: body,
            type: 'switch'
          });
        } catch (error) {
          var k = Object.keys(body).find(function (switchKey) {
            return switchKey.startsWith('*');
          });
          if (!k) {
            throw new Error("No defaults found for switch ".concat(ky));
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
       *   import('./defaultLocaleResolver.js').SwitchArray} obj
       * @param {string} k
       * @param {Integer} i
       * @throws {Error}
       * @returns {SwitchMatch|
       *   import('./defaultLocaleResolver.js').SwitchCaseArray|
       *   import('./defaultLocaleResolver.js').SwitchArray}
       */
      // @ts-expect-error It works
      function (obj, k, i) {
        if (i < ks.length - 1) {
          if (!(k in obj)) {
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
      }, this.switches);
      return (/** @type {SwitchMatch} */returnValue
      );
    }

    /**
     * @param {string} key
     * @returns {boolean}
     */
  }], [{
    key: "isMatchingKey",
    value: function isMatchingKey(key) {
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
      return (/** @type {string} */match && match[0]
      );
    }
  }]);
  return SwitchFormatter;
}(Formatter);

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
 * @param {string} [errorMessage="Reached end of values array."]
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

function _await$2(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }
  if (!value || !value.then) {
    value = Promise.resolve(value);
  }
  return then ? value.then(then) : value;
}
function _catch$1(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }
  if (result && result.then) {
    return result.then(void 0, recover);
  }
  return result;
}
function _settle(pact, state, value) {
  if (!pact.s) {
    if (value instanceof _Pact) {
      if (value.s) {
        if (state & 1) {
          state = value.s;
        }
        value = value.v;
      } else {
        value.o = _settle.bind(null, pact, state);
        return;
      }
    }
    if (value && value.then) {
      value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
      return;
    }
    pact.s = state;
    pact.v = value;
    var observer = pact.o;
    if (observer) {
      observer(pact);
    }
  }
}
var _Pact = /*#__PURE__*/function () {
  function _Pact() {}
  _Pact.prototype.then = function (onFulfilled, onRejected) {
    var result = new _Pact();
    var state = this.s;
    if (state) {
      var callback = state & 1 ? onFulfilled : onRejected;
      if (callback) {
        try {
          _settle(result, 1, callback(this.v));
        } catch (e) {
          _settle(result, 2, e);
        }
        return result;
      } else {
        return this;
      }
    }
    this.o = function (_this) {
      try {
        var value = _this.v;
        if (_this.s & 1) {
          _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
        } else if (onRejected) {
          _settle(result, 1, onRejected(value));
        } else {
          _settle(result, 2, value);
        }
      } catch (e) {
        _settle(result, 2, e);
      }
    };
    return result;
  };
  return _Pact;
}();
function _isSettledPact(thenable) {
  return thenable instanceof _Pact && thenable.s & 1;
}
function _for(test, update, body) {
  var stage;
  for (;;) {
    var shouldContinue = test();
    if (_isSettledPact(shouldContinue)) {
      shouldContinue = shouldContinue.v;
    }
    if (!shouldContinue) {
      return result;
    }
    if (shouldContinue.then) {
      stage = 0;
      break;
    }
    var result = body();
    if (result && result.then) {
      if (_isSettledPact(result)) {
        result = result.s;
      } else {
        stage = 1;
        break;
      }
    }
    if (update) {
      var updateValue = update();
      if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
        stage = 2;
        break;
      }
    }
  }
  var pact = new _Pact();
  var reject = _settle.bind(null, pact, 2);
  (stage === 0 ? shouldContinue.then(_resumeAfterTest) : stage === 1 ? result.then(_resumeAfterBody) : updateValue.then(_resumeAfterUpdate)).then(void 0, reject);
  return pact;
  function _resumeAfterBody(value) {
    result = value;
    do {
      if (update) {
        updateValue = update();
        if (updateValue && updateValue.then && !_isSettledPact(updateValue)) {
          updateValue.then(_resumeAfterUpdate).then(void 0, reject);
          return;
        }
      }
      shouldContinue = test();
      if (!shouldContinue || _isSettledPact(shouldContinue) && !shouldContinue.v) {
        _settle(pact, 1, result);
        return;
      }
      if (shouldContinue.then) {
        shouldContinue.then(_resumeAfterTest).then(void 0, reject);
        return;
      }
      result = body();
      if (_isSettledPact(result)) {
        result = result.v;
      }
    } while (!result || !result.then);
    result.then(_resumeAfterBody).then(void 0, reject);
  }
  function _resumeAfterTest(shouldContinue) {
    if (shouldContinue) {
      result = body();
      if (result && result.then) {
        result.then(_resumeAfterBody).then(void 0, reject);
      } else {
        _resumeAfterBody(result);
      }
    } else {
      _settle(pact, 1, result);
    }
  }
  function _resumeAfterUpdate() {
    if (shouldContinue = test()) {
      if (shouldContinue.then) {
        shouldContinue.then(_resumeAfterTest).then(void 0, reject);
      } else {
        _resumeAfterTest(shouldContinue);
      }
    } else {
      _settle(pact, 1, result);
    }
  }
}
function _continue(value, then) {
  return value && value.then ? value.then(then) : then(value);
}
function _async$1(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }
    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
var promiseChainForValues = function promiseChainForValues(values, errBack) {
  var errorMessage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Reached end of values array.';
  if (!Array.isArray(values)) {
    throw new TypeError('The `values` argument to `promiseChainForValues` must be an array.');
  }
  if (typeof errBack !== 'function') {
    throw new TypeError('The `errBack` argument to `promiseChainForValues` must be a function.');
  }
  return _async$1(function () {
    var _exit = false,
      _interrupt = false;
    var ret;
    var p = Promise.reject(new Error('Intentionally reject so as to begin checking chain'));
    var breaking;
    return _continue(_for(function () {
      return !(_interrupt || _exit);
    }, void 0, function () {
      var value = values.shift();
      return _catch$1(function () {
        // eslint-disable-next-line no-await-in-loop
        return _await$2(p, function (_p) {
          ret = _p;
          _interrupt = true;
        });
      }, function () {
        if (breaking) {
          throw new Error(errorMessage);
        }
        // We allow one more try
        if (!values.length) {
          breaking = true;
        }
        // // eslint-disable-next-line no-await-in-loop
        p = errBack(value);
      });
    }), function (_result2) {
      return ret;
    });
  })();
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
 * @typedef {Object<string, SwitchCaseArray>} SwitchArray
 */

/**
 * @typedef {Object<string, SwitchArray>} SwitchArrays
 */

/**
 * @typedef {object} SwitchCase
 * @property {string} message The locale message with any formatting
 *   place-holders; defaults to use of any single conditional
 * @property {string} [description] A description to add for translators
 */

/**
 * @typedef {Object<string, SwitchCase>} Switch
 */

/**
 * @typedef {Object<string, Switch>} Switches
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
  var localFormatter = new LocalFormatter( /** @type {import('./getMessageForKeyByStyle.js').LocalObject} */locals);
  var regularFormatter = new RegularFormatter(substitutions);
  var switchFormatter = new SwitchFormatter( /** @type {import('./defaultLocaleResolver.js').Switches} */
  switches, {
    substitutions: substitutions
  });

  // eslint-disable-next-line max-len
  // eslint-disable-next-line prefer-named-capture-group, unicorn/no-unsafe-regex
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
        // eslint-disable-next-line object-shorthand -- TS casting
        locale: /** @type {string} */locale,
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
        key: key,
        locale: locale
      });
    }

    // Change this and return type if other substitutions possible
    return (/** @type {string|Node} */substitution
    );
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
      if ( /** @type {typeof import('./Formatter.js').LocalFormatter} */localFormatter.constructor.isMatchingKey(ky)) {
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
      } else if ( /** @type {typeof import('./Formatter.js').SwitchFormatter} */
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
    var replace = function replace(_ref6) {
      var str = _ref6.str,
        _ref6$substs = _ref6.substs,
        substs = _ref6$substs === void 0 ? substitutions : _ref6$substs,
        _ref6$formatter = _ref6.formatter,
        formatter = _ref6$formatter === void 0 ? regularFormatter : _ref6$formatter;
      return str.replace(formattingRegex,
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
          processSubsts: replace
        });
        returnsDOM = returnsDOM || substitution !== null && _typeof(substitution) === 'object' && 'nodeType' in substitution;
        usedKeys.push(ky);
        return esc + substitution;
      });
    };
    var ret = replace({
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
  var processSubstitutions = function processSubstitutions(_ref7) {
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
    var regex = new RegExp(formattingRegex, 'gu');

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
            processSubsts: processSubstitutions
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
            push( /** @type {string} */substitution);
          }
        }
        usedKeys.push(ky);
      }
    });
    return nodes;
  };
  var nodes = processSubstitutions({
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
function defaultKeyCheckerConverter(key, messageStyle) {
  if (Array.isArray(key) && key.every(function (k) {
    return typeof k === 'string';
  }) && typeof messageStyle === 'string' && messageStyle.endsWith('Nested')) {
    return key.map(function (k) {
      return k.replace( /*#__PURE__*/_wrapRegExp(/(\\+)/g, {
        backslashes: 1
      }), '\\$<backslashes>').replace(/\./g, '\\.');
    }).join('.');
  }
  if (typeof key !== 'string') {
    throw new TypeError('`key` is expected to be a string (or array of strings for nested style)');
  }
  return key;
}

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
* @returns {false|MessageStyleCallbackResult} If `false`, will resort to default
*/

/* eslint-disable max-len */
/**
 * @param {object} [cfg]
 * @param {"richNested"|"rich"|"plain"|"plainNested"|MessageStyleCallback} [cfg.messageStyle="richNested"]
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
    // eslint-disable-next-line prefer-named-capture-group
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
    keysUnescaped.some(function (ky, i, kys) {
      if (!currObj || _typeof(currObj) !== 'object') {
        return true;
      }
      if (
      // If specified key is too deep, we should fail
      i === kys.length - 1 && ky in currObj && currObj[ky] && _typeof(currObj[ky]) === 'object' && 'message' in currObj[ky] &&
      // NECESSARY FOR SECURITY ON UNTRUSTED LOCALES
      typeof currObj[ky].message === 'string') {
        ret = {
          value: /** @type {string} */currObj[ky].message,
          info:
          /**
           * @type {import('./defaultLocaleResolver.js').
           *   RichLocaleStringSubObject}
           */
          currObj[ky]
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
    if (obj && _typeof(obj) === 'object' && key in obj && obj[key] && _typeof(obj[key]) === 'object' && 'message' in obj[key] &&
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
    if (obj && _typeof(obj) === 'object' && key in obj && obj[key] && typeof obj[key] === 'string') {
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
 * } [cfg.messageStyle="richNested"]
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
  } else if (defaults === false || defaults === undefined || defaults === null) {
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
 * @param {Integer} [cfg.maximumLocalNestingDepth=3]
 * @param {?(import('./defaultAllSubstitutions.js').AllSubstitutionCallback|
 *   import('./defaultAllSubstitutions.js').AllSubstitutionCallback[])
 * } [cfg.allSubstitutions=[defaultAllSubstitutions]]
 * @param {import('./defaultInsertNodes.js').InsertNodesCallback
 * } [cfg.insertNodes=defaultInsertNodes]
 * @param {false|import('./defaultLocaleResolver.js').SubstitutionObject
 * } [cfg.substitutions=false]
 * @param {boolean} [cfg.dom=false]
 * @param {boolean} [cfg.forceNodeReturn=false]
 * @param {boolean} [cfg.throwOnMissingSuppliedFormatters=true]
 * @param {boolean} [cfg.throwOnExtraSuppliedFormatters=true]
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
    if (
    /**
     * @type {typeof import('./Formatter.js').LocalFormatter|
     *       typeof import('./Formatter.js').RegularFormatter|
     *       typeof import('./Formatter.js').SwitchFormatter}
     */
    formatter.constructor.isMatchingKey(key) && !matching) {
      if (throwOnMissingSuppliedFormatters) {
        throw new Error("Missing formatting key: ".concat(key));
      }
      return true;
    }
    return false;
  };
  if (!substitutions && !allSubstitutions && !throwOnMissingSuppliedFormatters) {
    return stringOrTextNode(string);
  }
  if (!substitutions) {
    substitutions = {};
  }
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

function _await$1(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }
  if (!value || !value.then) {
    value = Promise.resolve(value);
  }
  return then ? value.then(then) : value;
} /**
   * Takes a locale and returns a new locale to check.
   * @callback LocaleMatcher
   * @param {string} locale The failed locale
   * @throws {Error} If there are no further hyphens left to check
   * @returns {string|Promise<string>} The new locale to check
  */

/**
 * @type {LocaleMatcher}
 */

function _async(f) {
  return function () {
    for (var args = [], i = 0; i < arguments.length; i++) {
      args[i] = arguments[i];
    }
    try {
      return Promise.resolve(f.apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  };
}
function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }
  if (result && result.then) {
    return result.then(void 0, recover);
  }
  return result;
}
var defaultLocaleMatcher = function defaultLocaleMatcher(locale) {
  if (!locale.includes('-')) {
    throw new Error('Locale not available');
  }
  // Try without hyphen, i.e., the "lookup" algorithm:
  // See https://tools.ietf.org/html/rfc4647#section-3.4 and
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
  return locale.replace(/\x2D(?:[\0-,\.-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*$/, '');
};

/**
 * @param {object} cfg
 * @param {string} cfg.locale
 * @param {string[]} cfg.locales
 * @param {LocaleMatcher} [cfg.localeMatcher=defaultLocaleMatcher]
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
  return (/** @type {Promise<LocaleObjectInfo>} */_findLocale({
      locales: locales,
      defaultLocales: defaultLocales,
      localeResolver: localeResolver,
      localesBasePath: localesBasePath,
      localeMatcher: localeMatcher
    })
  );
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
  return (/** @type {Promise<string>} */_findLocale({
      locales: locales,
      defaultLocales: defaultLocales,
      localeResolver: localeResolver,
      localesBasePath: localesBasePath,
      localeMatcher: localeMatcher,
      headOnly: true
    })
  );
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
var _findLocale = _async(function (_ref4) {
  /**
   * @callback getLocale
   * @throws {SyntaxError|TypeError|Error}
   * @param {string} locale
   * @returns {Promise<LocaleObjectInfo|string>}
   */
  var getLocale = _async(function (locale) {
    if (typeof locale !== 'string') {
      throw new TypeError('Non-string locale type');
    }
    var url = localeResolver(localesBasePath, locale);
    if (typeof url !== 'string') {
      throw new TypeError('`localeResolver` expected to resolve to (URL) string.');
    }
    return _catch(function () {
      var _fetch = /** @type {import('./shared.js').Fetch} */getFetch();
      return _await$1(headOnly ? _fetch(url, {
        method: 'HEAD'
      }) : _fetch(url), function (resp) {
        if (resp.status === 404) {
          // Don't allow browser (tested in Firefox) to continue
          //  and give `SyntaxError` with missing file or we won't be
          //  able to try without the hyphen
          throw new Error('Trying again');
        }
        return headOnly ? locale : _await$1(resp.json(), function (strings) {
          return {
            locale: locale,
            strings: strings
          };
        });
      });
    }, function (err) {
      if ( /** @type {Error} */err.name === 'SyntaxError') {
        throw err;
      }
      return _await$1( /** @type {LocaleMatcher} */localeMatcher(locale), getLocale);
    });
  });
  var _ref4$locales = _ref4.locales,
    locales = _ref4$locales === void 0 ? typeof intlDomLocale !== 'undefined' ? [intlDomLocale] : typeof navigator === 'undefined' ? [] : navigator.languages : _ref4$locales,
    _ref4$defaultLocales = _ref4.defaultLocales,
    defaultLocales = _ref4$defaultLocales === void 0 ? ['en-US'] : _ref4$defaultLocales,
    _ref4$localeResolver = _ref4.localeResolver,
    localeResolver = _ref4$localeResolver === void 0 ? defaultLocaleResolver : _ref4$localeResolver,
    _ref4$localesBasePath = _ref4.localesBasePath,
    localesBasePath = _ref4$localesBasePath === void 0 ? '.' : _ref4$localesBasePath,
    _ref4$localeMatcher = _ref4.localeMatcher,
    localeMatcher = _ref4$localeMatcher === void 0 ? 'lookup' : _ref4$localeMatcher,
    _ref4$headOnly = _ref4.headOnly,
    headOnly = _ref4$headOnly === void 0 ? false : _ref4$headOnly;
  if (localeMatcher === 'lookup') {
    localeMatcher = defaultLocaleMatcher;
  } else if (typeof localeMatcher !== 'function') {
    throw new TypeError('`localeMatcher` must be "lookup" or a function!');
  }
  return promiseChainForValues([].concat(_toConsumableArray(locales), _toConsumableArray(defaultLocales)), getLocale, 'No matching locale found for ' + [].concat(_toConsumableArray(locales), _toConsumableArray(defaultLocales)).join(', '));
});

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
 *     MessageStyleCallback} [cfg.messageStyle="richNested"]
 * @param {?import('./defaultAllSubstitutions.js').AllSubstitutionCallback|
 *   import('./defaultAllSubstitutions.js').
 *     AllSubstitutionCallback[]} [cfg.allSubstitutions]
 * @param {import('./defaultInsertNodes.js').
 *   InsertNodesCallback} [cfg.insertNodes=defaultInsertNodes]
 * @param {import('./defaultKeyCheckerConverter.js').
 *   KeyCheckerConverterCallback} [cfg.keyCheckerConverter]
 * @param {false|null|undefined|
 *   import('./getMessageForKeyByStyle.js').LocaleObject} [cfg.defaults]
 * @param {false|import('./defaultLocaleResolver.js').
 *   SubstitutionObject} [cfg.substitutions={}]
 * @param {Integer} [cfg.maximumLocalNestingDepth=3]
 * @param {boolean} [cfg.dom=false]
 * @param {boolean} [cfg.forceNodeReturn=false]
 * @param {boolean} [cfg.throwOnMissingSuppliedFormatters=true]
 * @param {boolean} [cfg.throwOnExtraSuppliedFormatters=true]
 * @returns {I18NCallback} Rejects if no suitable locale is found.
 */

function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }
  if (!value || !value.then) {
    value = Promise.resolve(value);
  }
  return then ? value.then(then) : value;
}

/**
 * @typedef {number} Integer
 */

/**
 * @param {object} [cfg={}]
 * @param {string[]} [cfg.locales=navigator.languages] BCP-47 language strings
 * @param {string[]} [cfg.defaultLocales=["en-US"]]
 * @param {import('./findLocaleStrings.js').
 *   LocaleStringFinder} [cfg.localeStringFinder=findLocaleStrings]
 * @param {string} [cfg.localesBasePath="."]
 * @param {import('./defaultLocaleResolver.js').
 *   LocaleResolver} [cfg.localeResolver=defaultLocaleResolver]
 * @param {"lookup"|import('./findLocaleStrings.js').
 *   LocaleMatcher} [cfg.localeMatcher="lookup"]
 * @param {"richNested"|"rich"|"plain"|"plainNested"|
 *   import('./getMessageForKeyByStyle.js').
 *     MessageStyleCallback} [cfg.messageStyle="richNested"]
 * @param {?(import('./defaultAllSubstitutions.js').AllSubstitutionCallback|
 *   import('./defaultAllSubstitutions.js').
 *     AllSubstitutionCallback[])} [cfg.allSubstitutions]
 * @param {import('./defaultInsertNodes.js').
 *   InsertNodesCallback} [cfg.insertNodes=defaultInsertNodes]
 * @param {import('./defaultKeyCheckerConverter.js').
 *   KeyCheckerConverterCallback} [cfg.keyCheckerConverter]
 * @param {false|null|undefined|
 *   import('./getMessageForKeyByStyle.js').LocaleObject} [cfg.defaults]
 * @param {false|
 *   import('./defaultLocaleResolver.js').
 *     SubstitutionObject} [cfg.substitutions={}]
 * @param {Integer} [cfg.maximumLocalNestingDepth=3]
 * @param {boolean} [cfg.dom=false]
 * @param {boolean} [cfg.forceNodeReturn=false]
 * @param {boolean} [cfg.throwOnMissingSuppliedFormatters=true]
 * @param {boolean} [cfg.throwOnExtraSuppliedFormatters=true]
 * @returns {Promise<I18NCallback>} Rejects if no suitable locale is found.
 */

function _invoke(body, then) {
  var result = body();
  if (result && result.then) {
    return result.then(then);
  }
  return then(result);
}
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
var i18n = function i18n() {
  var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    locales = _ref3.locales,
    defaultLocales = _ref3.defaultLocales,
    _ref3$localeStringFin = _ref3.localeStringFinder,
    localeStringFinder = _ref3$localeStringFin === void 0 ? findLocaleStrings : _ref3$localeStringFin,
    localesBasePath = _ref3.localesBasePath,
    localeResolver = _ref3.localeResolver,
    localeMatcher = _ref3.localeMatcher,
    messageStyle = _ref3.messageStyle,
    allSubstitutions = _ref3.allSubstitutions,
    insertNodes = _ref3.insertNodes,
    keyCheckerConverter = _ref3.keyCheckerConverter,
    defaults = _ref3.defaults,
    substitutions = _ref3.substitutions,
    maximumLocalNestingDepth = _ref3.maximumLocalNestingDepth,
    dom = _ref3.dom,
    forceNodeReturn = _ref3.forceNodeReturn,
    throwOnMissingSuppliedFormatters = _ref3.throwOnMissingSuppliedFormatters,
    throwOnExtraSuppliedFormatters = _ref3.throwOnExtraSuppliedFormatters;
  try {
    return _await(localeStringFinder({
      locales: locales,
      defaultLocales: defaultLocales,
      localeResolver: localeResolver,
      localesBasePath: localesBasePath,
      localeMatcher: localeMatcher
    }), function (_ref4) {
      var strings = _ref4.strings,
        resolvedLocale = _ref4.locale;
      return _invoke(function () {
        if (!defaults && defaultLocales) {
          var defaultLocale;
          return _await(localeStringFinder({
            locales: defaultLocales,
            defaultLocales: [],
            localeResolver: localeResolver,
            localesBasePath: localesBasePath,
            localeMatcher: localeMatcher
          }), function (_localeStringFinder) {
            defaults = _localeStringFinder.strings;
            defaultLocale = _localeStringFinder.locale;
            if (defaultLocale === resolvedLocale) {
              defaults = null; // No need to fall back
            }
          });
        }
      }, function () {
        return i18nServer({
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
        });
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export { Formatter, LocalFormatter, RegularFormatter, SwitchFormatter, defaultAllSubstitutions, defaultInsertNodes, defaultKeyCheckerConverter, defaultLocaleMatcher, defaultLocaleResolver, findLocale, findLocaleStrings, getDOMForLocaleString, getDocument, getFetch, getMatchingLocale, getMessageForKeyByStyle, getStringFromMessageAndDefaults, i18n, i18nServer, parseJSONExtra, processRegex, promiseChainForValues, setDocument, setFetch, setJSONExtra, unescapeBackslashes };
