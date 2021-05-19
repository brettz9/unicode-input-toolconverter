function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
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
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
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
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
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

function _iterableToArrayLimit(arr, i) {
  var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]);

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
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

// We want it to work in the browser, so commenting out
// import jsonExtra from 'json5';
// import jsonExtra from 'json-6';
var _jsonExtra = globalThis.jsonExtra;
var setJSONExtra = function setJSONExtra(__jsonExtra) {
  _jsonExtra = __jsonExtra;
};
var unescapeBackslashes = function unescapeBackslashes(str) {
  return str.replace(/\\+/g, function (esc) {
    return esc.slice(0, esc.length / 2);
  });
};
var parseJSONExtra = function parseJSONExtra(args) {
  return _jsonExtra.parse( // Doesn't actually currently allow explicit brackets,
  //  but in case we change our regex to allow inner brackets
  '{' + (args || '').replace(/^\{/, '').replace(/\}$/, '') + '}');
}; // Todo: Extract to own library (RegExtras?)

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
var _fetch = typeof fetch !== 'undefined' // istanbul ignore next
? fetch : null;
/**
 * @param {fetch} f
 * @returns {void}
 */


var setFetch = function setFetch(f) {
  _fetch = f;
};
/**
 * @returns {fetch}
 */

var getFetch = function getFetch() {
  return _fetch;
};

var _doc = typeof document !== 'undefined' // istanbul ignore next
? document : null;
/**
 * @param {document} doc
 * @returns {void}
 */


var setDocument = function setDocument(doc) {
  _doc = doc;
};
/**
 * @returns {document}
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
  /* istanbul ignore next */

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

var sort = function sort(locale, arrayOfItems, options) {
  return arrayOfItems.sort(new Intl.Collator(locale, options).compare);
};
var list = function list(locale, arrayOfItems, options) {
  return new Intl.ListFormat(locale, options).format(arrayOfItems);
};
var sortListSimple = function sortListSimple(locale, arrayOfItems, listOptions, collationOptions) {
  sort(locale, arrayOfItems, collationOptions);
  return list(locale, arrayOfItems, listOptions);
};
var sortList = function sortList(locale, arrayOfItems, map, listOptions, collationOptions) {
  if (typeof map !== 'function') {
    return sortListSimple(locale, arrayOfItems, map, listOptions);
  }

  sort(locale, arrayOfItems, collationOptions);
  var randomId = generateUUID();

  var placeholderArray = _toConsumableArray(arrayOfItems).map(function (_, i) {
    return "<<".concat(randomId).concat(i, ">>");
  });

  var nodes = [];

  var push = function push() {
    nodes.push.apply(nodes, arguments);
  };

  processRegex( // // eslint-disable-next-line prefer-named-capture-group
  new RegExp("<<".concat(randomId, "(\\d)>>"), 'gu'), list(locale, placeholderArray, listOptions), {
    betweenMatches: push,
    afterMatch: push,
    onMatch: function onMatch(_, idx) {
      push(map(arrayOfItems[idx], idx));
    }
  });

  var _doc = getDocument();

  var container = _doc.createDocumentFragment();

  container.append.apply(container, nodes);
  return container;
};

var getFormatterInfo = function getFormatterInfo(_ref) {
  var object = _ref.object;

  if (Array.isArray(object)) {
    if (typeof object[1] === 'function') {
      var _object = _slicedToArray(object, 4),
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
/* eslint-disable max-len */

/**
 * Callback to give replacement text based on a substitution value.
 * @callback AllSubstitutionCallback
 * @param {PlainObject} cfg
 * @param {string|Node|number|Date|RelativeTimeInfo|ListInfo|NumberInfo|DateInfo} cfg.value Contains
 *   the value returned by the individual substitution
 * @param {string} cfg.arg See `cfg.arg` of {@link SubstitutionCallback}.
 * @param {string} cfg.key The substitution key Not currently in use
 * @param {string} cfg.locale The locale
 * @returns {string|Element} The replacement text or element
*/

/* eslint-enable max-len */

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

  var opts;

  var applyArgs = function applyArgs(_ref3) {
    var type = _ref3.type,
        _ref3$options = _ref3.options,
        options = _ref3$options === void 0 ? opts : _ref3$options,
        _ref3$checkArgOptions = _ref3.checkArgOptions,
        checkArgOptions = _ref3$checkArgOptions === void 0 ? false : _ref3$checkArgOptions;

    if (typeof arg === 'string') {
      var _arg$split = arg.split('|'),
          _arg$split2 = _slicedToArray(_arg$split, 3),
          userType = _arg$split2[0],
          extraArgs = _arg$split2[1],
          argOptions = _arg$split2[2]; // Alias


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

  if (value && _typeof(value) === 'object' && !Array.isArray(value)) {
    var singleKey = Object.keys(value)[0];

    if (['number', 'date', 'datetime', 'dateRange', 'datetimeRange', 'relative', 'region', 'language', 'script', 'currency', 'list', 'plural'].includes(singleKey)) {
      var extraOpts, callback;

      var _getFormatterInfo = getFormatterInfo({
        object: value[singleKey]
      });

      value = _getFormatterInfo.value;
      opts = _getFormatterInfo.options;
      extraOpts = _getFormatterInfo.extraOpts;
      callback = _getFormatterInfo.callback;

      switch (singleKey) {
        case 'dateRange':
        case 'datetimeRange':
          return new Intl.DateTimeFormat(locale, applyArgs({
            type: 'DATERANGE',
            options: extraOpts
          })).formatRange(value, opts);

        case 'region':
        case 'language':
        case 'script':
        case 'currency':
          return new Intl.DisplayNames(locale, _objectSpread2(_objectSpread2({}, applyArgs({
            type: singleKey.toUpperCase()
          })), {}, {
            type: singleKey
          })).of(value);

        case 'relative':
          // The second argument actually contains the primary options, so swap
          var _ref4 = [opts, extraOpts];
          extraOpts = _ref4[0];
          opts = _ref4[1];
          return new Intl.RelativeTimeFormat(locale, applyArgs({
            type: 'RELATIVE'
          })).format(value, extraOpts);
        // ListFormat (with Collator)

        case 'list':
          if (callback) {
            return sortList(locale, value, callback, applyArgs({
              type: 'LIST'
            }), applyArgs({
              type: 'LIST',
              options: extraOpts,
              checkArgOptions: true
            }));
          }

          return sortList(locale, value, applyArgs({
            type: 'LIST'
          }), applyArgs({
            type: 'LIST',
            options: extraOpts,
            checkArgOptions: true
          }));
      }
    }
  } // Numbers


  if (typeof value === 'number') {
    return new Intl.NumberFormat(locale, applyArgs({
      type: 'NUMBER'
    })).format(value);
  } // Dates


  if (value && _typeof(value) === 'object' && typeof value.getTime === 'function') {
    return new Intl.DateTimeFormat(locale, applyArgs({
      type: 'DATETIME'
    })).format(value);
  } // Date range


  if (Array.isArray(value)) {
    var _Intl$DateTimeFormat;

    var _extraOpts2 = value[2];
    return (_Intl$DateTimeFormat = new Intl.DateTimeFormat(locale, applyArgs({
      type: 'DATERANGE',
      options: _extraOpts2
    }))).formatRange.apply(_Intl$DateTimeFormat, _toConsumableArray(value.slice(0, 2)));
  } // console.log('value', value);


  throw new TypeError('Unknown formatter');
};

/**
 * Base class for formatting.
 */

var Formatter = function Formatter() {
  _classCallCheck(this, Formatter);
};
/**
 * @param {PlainObject} cfg
 * @param {string} cfg.key
 * @param {LocaleBody} cfg.body
 * @param {string} cfg.type
 * @param {"richNested"|"rich"|"plain"|MessageStyleCallback} cfg.messageStyle
 * @returns {string|Element}
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
  } // We don't allow a substitution function here or below as comes
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
   * @param {LocalObject} locals
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
      var parent = this.locals;
      return this.constructor.isMatchingKey(key) && components.every(function (cmpt) {
        var result = (cmpt in parent);
        parent = parent[cmpt];
        return result;
      });
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
   * @param {SubstitutionObject} substitutions
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
      return this.constructor.isMatchingKey(key) && key in this.substitutions;
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
   * @param {Switches} switches
   * @param {SubstitutionObject} substitutions
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
   * @param {PlainObject} cfg
   * @param {string} cfg.locale
   * @param {string[]} cfg.usedKeys
   * @param {string} cfg.arg
   * @param {MissingSuppliedFormattersCallback} cfg.missingSuppliedFormatters
   * @returns {string}
   */


  _createClass(SwitchFormatter, [{
    key: "getSubstitution",
    value: function getSubstitution(key, _ref3) {
      var locale = _ref3.locale,
          usedKeys = _ref3.usedKeys,
          arg = _ref3.arg,
          missingSuppliedFormatters = _ref3.missingSuppliedFormatters;
      var ky = this.constructor.getKey(key).slice(1); // Expression might not actually use formatter, e.g., for singular,
      //  the conditional might just write out "one"

      var _this$getMatch = this.getMatch(ky),
          _this$getMatch2 = _slicedToArray(_this$getMatch, 3),
          objKey = _this$getMatch2[0],
          body = _this$getMatch2[1],
          keySegment = _this$getMatch2[2];

      usedKeys.push(keySegment);
      var type, opts;

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


      var getNumberFormat = function getNumberFormat(value, defaultOptions) {
        var numberOpts = parseJSONExtra(opts);
        return new Intl.NumberFormat(locale, _objectSpread2(_objectSpread2({}, defaultOptions), numberOpts)).format(value);
      };

      var getPluralFormat = function getPluralFormat(value, defaultOptions) {
        var pluralOpts = parseJSONExtra(opts);
        return new Intl.PluralRules(locale, _objectSpread2(_objectSpread2({}, defaultOptions), pluralOpts)).select(value);
      };

      var formatterValue = this.substitutions[keySegment];
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
            object: formatterValue[singleKey]
          }),
              value = _getFormatterInfo.value,
              options = _getFormatterInfo.options;

          if (!type) {
            type = singleKey.toUpperCase();
          }

          var typeMatches = singleKey.toUpperCase() === type;

          if (!typeMatches) {
            throw new TypeError("Expecting type \"".concat(type.toLowerCase(), "\"; instead found \"").concat(singleKey, "\"."));
          } // eslint-disable-next-line default-case


          switch (type) {
            case 'NUMBER':
              match = getNumberFormat(value, options);
              break;

            case 'PLURAL':
              match = getPluralFormat(value, options);
              break;
          }
        }
      } // We do not want the default `richNested` here as that will split
      //  up the likes of `0.0`


      var messageStyle = 'richNested';

      var preventNesting = function preventNesting(s) {
        return s.replace(/\\/g, '\\\\').replace(/\./g, '\\.');
      };

      try {
        return _getSubstitution({
          messageStyle: messageStyle,
          key: match ? preventNesting(match) : arg,
          body: body,
          type: 'switch'
        });
      } catch (err) {
        try {
          return _getSubstitution({
            messageStyle: messageStyle,
            key: '*' + preventNesting(match),
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
      return key && this.constructor.isMatchingKey(key) && Boolean(this.getMatch(key.slice(1)).length);
    }
    /**
    * @typedef {GenericArray} SwitchMatch
    * @property {string} 0 objKey
    * @property {LocaleBody} 1 body
    * @property {string} 2 keySegment
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
      return ks.reduce(function (obj, k, i) {
        if (i < ks.length - 1) {
          if (!(k in obj)) {
            throw new Error("Switch key \"".concat(k, "\" not found (from \"~").concat(ky, "\")"));
          }

          return obj[k];
        } // Todo: Should throw on encountering duplicate fundamental keys (even
        //  if there are different arguments, that should not be allowed)


        var ret = Object.entries(obj).find(function (_ref4) {
          var _ref5 = _slicedToArray(_ref4, 1),
              switchKey = _ref5[0];

          return k === _this4.constructor.getKey(switchKey);
        });
        return ret ? [].concat(_toConsumableArray(ret), [k]) : [];
      }, this.switches);
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
      var match = key.match(/^(?:(?!\|)[\s\S])*/);
      return match && match[0];
    }
  }]);

  return SwitchFormatter;
}(Formatter);

/**
* @callback PromiseChainErrback
* @param {any} errBack
* @returns {Promise<any>|any}
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
        } // We allow one more try


        if (!values.length) {
          breaking = true;
        } // // eslint-disable-next-line no-await-in-loop


        p = errBack(value);
      });
    }), function (_result2) {
      return ret;
    });
  })();
};

/**
* @callback SubstitutionCallback
* @param {PlainObject} cfg
* @param {string} cfg.arg By default, accepts the third portion of the
*   `formattingRegex` within `insertNodes`, i.e., to allow the locale to
*   supply arguments back to the calling script.
* @param {string} cfg.key The substitution key
* @returns {string|Element} The replacement text or element
*/

/**
 * May have additional properties if supplying options to an underlying
 * formatter.
 * @typedef {GenericArray} ValueArray
 * @property {string|Node|number|Date} 0 The main value
 * @property {PlainObject} [1] The options related to the main value
 * @property {PlainObject} [2] Any additional options
*/

/**
* @typedef {PlainObject} RelativeTimeInfo
* @property {ValueArray} relative
*/

/**
* @typedef {PlainObject} ListInfo
* @property {ValueArray} list
*/

/**
* @typedef {PlainObject} NumberInfo
* @property {ValueArray} number
*/

/**
* @typedef {PlainObject} DateInfo
* @property {ValueArray} date
*/

/**
* @typedef {Object<string, string>} PlainLocaleStringBodyObject
*/

/**
* @typedef {PlainObject} SwitchCaseInfo
* @property {boolean} [default=false] Whether this conditional is the default
*/

/**
* @typedef {GenericArray} SwitchCase
* @property {string} 0 The type
* @property {string} 1 The message
* @property {SwitchCaseInfo} [2] Info about the switch case
*/

/**
* @typedef {PlainObject<string, SwitchCase>} Switch
*/

/**
* @typedef {PlainObject<{string, Switch}>} Switches
*/

/**
* @typedef {PlainObject} LocaleStringSubObject
* @property {string} [message] The locale message with any formatting
*   place-holders; defaults to use of any single conditional
* @property {string} [description] A description to add translators
* @property {Switches} [switches] Conditionals
*/

/**
* @typedef {PlainObject<string, LocaleStringSubObject>} LocaleStringBodyObject
*/

/**
 * Takes a base path and locale and gives a URL.
 * @callback LocaleResolver
 * @param {string} localesBasePath (Trailing slash optional)
 * @param {string} locale BCP-47 language string
 * @returns {string} URL of the locale file to be fetched
*/

/**
* @typedef {PlainObject<string, string|Element|
* SubstitutionCallback>} SubstitutionObject
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

/* eslint-disable max-len */

/**
 * Callback to return a string or array of nodes and strings based on a localized
 * string, substitutions object, and other metadata.
 * @callback InsertNodesCallback
 * @param {PlainObject} cfg
 * @param {string} cfg.string The localized string
 * @param {boolean} [cfg.dom] If substitutions known to contain DOM, can be set
 *   to `true` to optimize
 * @param {string[]} [cfg.usedKeys=[]] Array for tracking which keys have been used
 * @param {SubstitutionObject} cfg.substitutions The formatting substitutions object
 * @param {?(AllSubstitutionCallback|AllSubstitutionCallback[])} [cfg.allSubstitutions] The
 *   callback or array composed thereof for applying to each substitution.
 * @param {string} locale The successfully resolved locale
 * @param {Integer} [maximumLocalNestingDepth=3] Depth of local variable resolution to
 *   check before reporting a recursion error
 * @param {MissingSuppliedFormattersCallback} [cfg.missingSuppliedFormatters] Callback
 *   supplied key to throw if the supplied key is present (if
 *   `throwOnMissingSuppliedFormatters` is enabled). Defaults to no-op.
 * @param {CheckExtraSuppliedFormattersCallback} [cfg.checkExtraSuppliedFormatters] No
 *   argument callback to check if any formatters are not present in `string`
 *   (if `throwOnExtraSuppliedFormatters` is enabled). Defaults to no-op.
 * @returns {string|Array<Node|string>}
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
  var localFormatter = new LocalFormatter(locals);
  var regularFormatter = new RegularFormatter(substitutions);
  var switchFormatter = new SwitchFormatter(switches, {
    substitutions: substitutions
  }); // eslint-disable-next-line max-len
  // eslint-disable-next-line prefer-named-capture-group, unicorn/no-unsafe-regex

  var formattingRegex = /(\\*)\{((?:(?:(?!\})[\s\S])|\\\})*?)(?:(\|)((?:(?!\})[\s\S])*))?\}/g;

  if (allSubstitutions) {
    allSubstitutions = Array.isArray(allSubstitutions) ? allSubstitutions : [allSubstitutions];
  }

  var getSubstitution = function getSubstitution(_ref4) {
    var key = _ref4.key,
        arg = _ref4.arg,
        substs = _ref4.substs;
    var substitution;
    var isLocalKey = localFormatter.constructor.isMatchingKey(key);

    if (isLocalKey) {
      substitution = localFormatter.getSubstitution(key);
    } else if (switchFormatter.constructor.isMatchingKey(key)) {
      substitution = switchFormatter.getSubstitution(key, {
        locale: locale,
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
    } // Todo: Could support resolving locals within arguments
    // Todo: Even for `null` `allSubstitutions`, we could have
    //  a mode to throw for non-string/non-DOM (non-numbers?),
    //  or whatever is not likely intended as a target for `toString()`.


    if (allSubstitutions) {
      substitution = allSubstitutions.reduce(function (subst, allSubst) {
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

    return substitution;
  };

  var recursiveLocalCount = 1;

  var checkLocalVars = function checkLocalVars(_ref5) {
    var substitution = _ref5.substitution,
        ky = _ref5.ky,
        arg = _ref5.arg,
        processSubsts = _ref5.processSubsts;

    if (typeof substitution === 'string' && substitution.includes('{')) {
      if (recursiveLocalCount++ > maximumLocalNestingDepth) {
        throw new TypeError('Too much recursion in local variables.');
      }

      if (localFormatter.constructor.isMatchingKey(ky)) {
        var extraSubsts = substitutions;
        var localFormatters;

        if (arg) {
          localFormatters = parseJSONExtra(arg);
          extraSubsts = _objectSpread2(_objectSpread2({}, substitutions), localFormatters);
        }

        substitution = processSubsts({
          str: substitution,
          substs: extraSubsts,
          formatter: localFormatter
        });

        if (localFormatters) {
          checkExtraSuppliedFormatters({
            substitutions: localFormatters
          });
        }
      } else if (switchFormatter.constructor.isMatchingKey(ky)) {
        substitution = processSubsts({
          str: substitution
        });
      }
    }

    return substitution;
  }; // Give chance to avoid this block when known to contain DOM


  if (!dom) {
    // Run this block to optimize non-DOM substitutions
    var returnsDOM = false;

    var replace = function replace(_ref6) {
      var str = _ref6.str,
          _ref6$substs = _ref6.substs,
          substs = _ref6$substs === void 0 ? substitutions : _ref6$substs,
          _ref6$formatter = _ref6.formatter,
          formatter = _ref6$formatter === void 0 ? regularFormatter : _ref6$formatter;
      return str.replace(formattingRegex, function (_, esc, ky, pipe, arg) {
        if (esc.length % 2) {
          return _;
        }

        if (missingSuppliedFormatters({
          key: ky,
          formatter: formatter
        })) {
          return _;
        }

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
        returnsDOM = returnsDOM || substitution && _typeof(substitution) === 'object' && 'nodeType' in substitution;
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

  var processSubstitutions = function processSubstitutions(_ref7) {
    var str = _ref7.str,
        _ref7$substs = _ref7.substs,
        substs = _ref7$substs === void 0 ? substitutions : _ref7$substs,
        _ref7$formatter = _ref7.formatter,
        formatter = _ref7$formatter === void 0 ? regularFormatter : _ref7$formatter;
    var nodes = []; // Copy to ensure we are resetting index on each instance (manually
    // resetting on `formattingRegex` is problematic with recursion that
    // uses the same regex copy)

    var regex = new RegExp(formattingRegex, 'gu');

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
          } else if ( // Clone so that multiple instances may be added (and no
          // side effects to user code)
          substitution && _typeof(substitution) === 'object' && 'nodeType' in substitution) {
            push(substitution.cloneNode(true));
          } else {
            push(substitution);
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
* @typedef {LocaleBody} LocalObject
*/

/**
 * May also contain language code and direction, translator name and
 * contact, etc., but no defaults currently apply besides reserving `locals`
 * @typedef {PlainObject} LocaleHead
 * @property {LocalObject} locals
*/

/**
* @typedef {LocaleStringBodyObject|
* PlainLocaleStringBodyObject|PlainObject} LocaleBody
*/

/**
* @typedef {PlainObject} LocaleObject
* @property {LocaleHead} [head]
* @property {LocaleBody} body
*/

/**
* @typedef {PlainObject} MessageStyleCallbackResult
* @property {string} value Regardless of message style, will contain the
*   string result
* @property {LocaleStringSubObject} [info] Full info on the localized item
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
 * @param {PlainObject} [cfg]
 * @param {"richNested"|"rich"|"plain"|MessageStyleCallback} [cfg.messageStyle="richNested"]
 * @returns {MessageStyleCallback}
 */

var getMessageForKeyByStyle = function getMessageForKeyByStyle() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$messageStyle = _ref.messageStyle,
      messageStyle = _ref$messageStyle === void 0 ? 'richNested' : _ref$messageStyle;

  // Todo: Support `plainNested` style
  return typeof messageStyle === 'function' ? messageStyle : messageStyle === 'richNested' ? function (mainObj, key) {
    var obj = mainObj && _typeof(mainObj) === 'object' && mainObj.body;
    var keys = []; // eslint-disable-next-line prefer-named-capture-group

    var possiblyEscapedCharPattern = /(\\*)\./g;

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
    var ret = false;
    var currObj = obj;
    keysUnescaped.some(function (ky, i, kys) {
      if (!currObj || _typeof(currObj) !== 'object') {
        return true;
      }

      if ( // If specified key is too deep, we should fail
      i === kys.length - 1 && ky in currObj && currObj[ky] && _typeof(currObj[ky]) === 'object' && 'message' in currObj[ky] && // NECESSARY FOR SECURITY ON UNTRUSTED LOCALES
      typeof currObj[ky].message === 'string') {
        ret = {
          value: currObj[ky].message,
          info: currObj[ky]
        };
      }

      currObj = currObj[ky];
      return false;
    });
    return ret;
  } : messageStyle === 'rich' ? function (mainObj, key) {
    var obj = mainObj && _typeof(mainObj) === 'object' && mainObj.body;

    if (obj && _typeof(obj) === 'object' && key in obj && obj[key] && _typeof(obj[key]) === 'object' && 'message' in obj[key] && // NECESSARY FOR SECURITY ON UNTRUSTED LOCALES
    typeof obj[key].message === 'string') {
      return {
        value: obj[key].message,
        info: obj[key]
      };
    }

    return false;
  } : messageStyle === 'plain' ? function (mainObj, key) {
    var obj = mainObj && _typeof(mainObj) === 'object' && mainObj.body;

    if (obj && _typeof(obj) === 'object' && key in obj && obj[key] && typeof obj[key] === 'string') {
      return {
        value: obj[key]
      };
    }

    return false;
  } : function () {
    throw new TypeError("Unknown `messageStyle` ".concat(messageStyle));
  }();
};

/* eslint-disable max-len */

/**
 * @param {PlainObject} cfg
 * @param {string} [cfg.message] If present, this string will be the return value.
 * @param {false|null|undefined|LocaleObject} [cfg.defaults]
 * @param {"richNested"|"rich"|"plain"|MessageStyleCallback} [cfg.messageStyle="richNested"]
 * @param {MessageStyleCallback} [cfg.messageForKey] Defaults to getting `MessageStyleCallback` based on `messageStyle`
 * @param {string} cfg.key Key to check against object of strings; used to find a default if no string `message` is provided.
 * @returns {string}
 */

var getStringFromMessageAndDefaults = function getStringFromMessageAndDefaults() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      message = _ref.message,
      defaults = _ref.defaults,
      messageStyle = _ref.messageStyle,
      _ref$messageForKey = _ref.messageForKey,
      messageForKey = _ref$messageForKey === void 0 ? getMessageForKeyByStyle({
    messageStyle: messageStyle
  }) : _ref$messageForKey,
      key = _ref.key;

  if (typeof key !== 'string') {
    throw new TypeError('An options object with a `key` string is expected on ' + '`getStringFromMessageAndDefaults`');
  } // NECESSARY CHECK FOR SECURITY ON UNTRUSTED LOCALES


  var str;

  if (typeof message === 'string') {
    str = message;
  } else if (defaults === false || defaults === undefined || defaults === null) {
    str = false;
  } else if (defaults && _typeof(defaults) === 'object') {
    str = messageForKey({
      body: defaults
    }, key);

    if (str) {
      str = str.value;
    }
  } else {
    throw new TypeError("Default locale strings must resolve to `false`, " + "nullish, or an object!");
  }

  if (str === false) {
    throw new Error("Key value not found for key: (".concat(key, ")"));
  }

  return str;
};

/* eslint-disable max-len */

/**
 *
 * @param {PlainObject} cfg
 * @param {string} cfg.string
 * @param {string} cfg.locale The (possibly already resolved) locale for use by
 *   configuring formatters
 * @param {LocalObject} [cfg.locals]
 * @param {LocalObject} [cfg.switches]
 * @param {Integer} [cfg.maximumLocalNestingDepth=3]
 * @param {?(AllSubstitutionCallback|AllSubstitutionCallback[])} [cfg.allSubstitutions=[defaultAllSubstitutions]]
 * @param {InsertNodesCallback} [cfg.insertNodes=defaultInsertNodes]
 * @param {false|SubstitutionObject} [cfg.substitutions=false]
 * @param {boolean} [cfg.dom=false]
 * @param {boolean} [cfg.forceNodeReturn=false]
 * @param {boolean} [cfg.throwOnMissingSuppliedFormatters=true]
 * @param {boolean} [cfg.throwOnExtraSuppliedFormatters=true]
 * @returns {string|DocumentFragment}
 */

var getDOMForLocaleString = function getDOMForLocaleString() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      string = _ref.string,
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

  var stringOrTextNode = function stringOrTextNode(str) {
    var _doc = getDocument();

    return forceNodeReturn ? _doc.createTextNode(str) : str;
  };

  var usedKeys = [];
  /**
  * @callback CheckExtraSuppliedFormattersCallback
  * @param {SubstitutionObject} substs
  * @throws {Error} Upon an extra formatting key being found
  * @returns {void}
  */

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
  * @callback MissingSuppliedFormattersCallback
  * @param {string} key
  * @param {SubstitutionObject} substs
  * @throws {Error} If missing formatting key
  * @returns {boolean}
  */

  /**
   * @type {MissingSuppliedFormattersCallback}
   */


  var missingSuppliedFormatters = function missingSuppliedFormatters(_ref3) {
    var key = _ref3.key,
        formatter = _ref3.formatter;
    var matching = formatter.isMatch(key);

    if (formatter.constructor.isMatchingKey(key) && !matching) {
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

  var container = _doc.createDocumentFragment();

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
}
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
  } // Try without hyphen, i.e., the "lookup" algorithm:
  // See https://tools.ietf.org/html/rfc4647#section-3.4 and
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl


  return locale.replace(/\x2D(?:(?!\x2D)[\s\S])*$/, '');
};
/**
 * @param {PlainObject} cfg
 * @param {string} cfg.locale
 * @param {string[]} cfg.locales
 * @param {LocaleResolver} [cfg.localeResolver=defaultLocaleMatcher]
 * @returns {string|false}
 */

var getMatchingLocale = function getMatchingLocale(_ref) {
  var locale = _ref.locale,
      locales = _ref.locales,
      _ref$localeResolver = _ref.localeResolver,
      localeResolver = _ref$localeResolver === void 0 ? defaultLocaleMatcher : _ref$localeResolver;

  try {
    while (!locales.includes(locale)) {
      // Catch as `defaultLocaleMatcher` will throw if no hyphen found
      locale = localeResolver(locale);
    }
  } catch (err) {
    return false;
  }

  return locale;
};
/**
* @typedef {PlainObject} LocaleObjectInfo
* @property {LocaleObject} strings The successfully retrieved locale strings
* @property {string} locale The successfully resolved locale
*/

/**
 * @callback LocaleStringFinder
 * @param {PlainObject} [cfg={}]
 * @param {string[]} [cfg.locales=navigator.languages] BCP-47 language strings
 * @param {string[]} [cfg.defaultLocales=["en-US"]]
 * @param {string} [cfg.localesBasePath="."]
 * @param {LocaleResolver} [cfg.localeResolver=defaultLocaleResolver]
 * @param {"lookup"|LocaleMatcher} [cfg.localeMatcher]
 * @returns {Promise<LocaleObjectInfo>}
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

  return _findLocale({
    locales: locales,
    defaultLocales: defaultLocales,
    localeResolver: localeResolver,
    localesBasePath: localesBasePath,
    localeMatcher: localeMatcher
  });
};
/**
 * @callback LocaleFinder
 * @param {PlainObject} [cfg={}]
 * @param {string[]} [cfg.locales=navigator.languages] BCP-47 language strings
 * @param {string[]} [cfg.defaultLocales=["en-US"]]
 * @param {string} [cfg.localesBasePath="."]
 * @param {LocaleResolver} [cfg.localeResolver=defaultLocaleResolver]
 * @param {"lookup"|LocaleMatcher} [cfg.localeMatcher]
 * @returns {Promise<string>} Resolves to the successfully resolved locale
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

  return _findLocale({
    locales: locales,
    defaultLocales: defaultLocales,
    localeResolver: localeResolver,
    localesBasePath: localesBasePath,
    localeMatcher: localeMatcher,
    headOnly: true
  });
};
/**
 * @type {LocaleStringFinder|LocaleFinder} Also has a `headOnly` boolean
 *  property to determine whether to make a simple HEAD and resolve to
 *  the locale rather than locale and contents
 */

var _findLocale = _async(function (_ref4) {
  /**
   * @callback getLocale
   * @throws {SyntaxError|TypeError|Error}
   * @param {string} locale
   * @returns {Promise<LocaleObjectInfo>}
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
      var _fetch = getFetch();

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
      if (err.name === 'SyntaxError') {
        throw err;
      }

      return _await$1(localeMatcher(locale), getLocale);
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

  return promiseChainForValues([].concat(_toConsumableArray(locales), _toConsumableArray(defaultLocales)), getLocale, 'No matching locale found!');
});

/**
 * Checks a key (against an object of strings). Optionally
 *  accepts an object of substitutions which are used when finding text
 *  within curly brackets (pipe symbol not allowed in its keys); the
 *  substitutions may be DOM elements as well as strings and may be
 *  functions which return the same (being provided the text after the
 *  pipe within brackets as the single argument).) Optionally accepts a
 *  config object, with the optional key "dom" which if set to `true`
 *  optimizes when DOM elements are (known to be) present.
 * @callback I18NCallback
 * @param {string} key Key to check against object of strings
 * @param {false|SubstitutionObject} [substitutions=false]
 * @param {PlainObject} [cfg={}]
 * @param {boolean} [cfg.dom=false]
 * @returns {string|DocumentFragment}
*/

/* eslint-disable max-len */

/**
 * @param {PlainObject} cfg
 * @param {LocaleObject} cfg.strings
 * @param {string} cfg.resolvedLocale
 * @param {"richNested"|"rich"|"plain"|MessageStyleCallback} [cfg.messageStyle="richNested"]
 * @param {?AllSubstitutionCallback|AllSubstitutionCallback[]} [cfg.allSubstitutions]
 * @param {InsertNodesCallback} [cfg.insertNodes=defaultInsertNodes]
 * @param {false|null|undefined|LocaleObject} [cfg.defaults]
 * @param {false|SubstitutionObject} [cfg.substitutions={}]
 * @param {Integer} [cfg.maximumLocalNestingDepth=3]
 * @param {boolean} [cfg.dom=false]
 * @param {boolean} [cfg.forceNodeReturn=false]
 * @param {boolean} [cfg.throwOnMissingSuppliedFormatters=true]
 * @param {boolean} [cfg.throwOnExtraSuppliedFormatters=true]
 * @returns {Promise<I18NCallback>} Rejects if no suitable locale is found.
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
/* eslint-disable max-len */

/**
 * @param {PlainObject} [cfg={}]
 * @param {string[]} [cfg.locales=navigator.languages] BCP-47 language strings
 * @param {string[]} [cfg.defaultLocales=["en-US"]]
 * @param {LocaleStringFinder} [cfg.localeStringFinder=findLocaleStrings]
 * @param {string} [cfg.localesBasePath="."]
 * @param {LocaleResolver} [cfg.localeResolver=defaultLocaleResolver]
 * @param {"lookup"|LocaleMatcher} [cfg.localeMatcher="lookup"]
 * @param {"richNested"|"rich"|"plain"|MessageStyleCallback} [cfg.messageStyle="richNested"]
 * @param {?AllSubstitutionCallback|AllSubstitutionCallback[]} [cfg.allSubstitutions]
 * @param {InsertNodesCallback} [cfg.insertNodes=defaultInsertNodes]
 * @param {false|null|undefined|LocaleObject} [cfg.defaults]
 * @param {false|SubstitutionObject} [cfg.substitutions={}]
 * @param {Integer} [cfg.maximumLocalNestingDepth=3]
 * @param {boolean} [cfg.dom=false]
 * @param {boolean} [cfg.forceNodeReturn=false]
 * @param {boolean} [cfg.throwOnMissingSuppliedFormatters=true]
 * @param {boolean} [cfg.throwOnExtraSuppliedFormatters=true]
 * @returns {Promise<I18NCallback>} Rejects if no suitable locale is found.
 */


var i18nServer = function i18nServer(_ref) {
  var strings = _ref.strings,
      resolvedLocale = _ref.resolvedLocale,
      messageStyle = _ref.messageStyle,
      defaultAllSubstitutionsValue = _ref.allSubstitutions,
      insertNodes = _ref.insertNodes,
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

  formatter.sort = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return sort.apply(void 0, [resolvedLocale].concat(args));
  };

  formatter.sortList = function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return sortList.apply(void 0, [resolvedLocale].concat(args));
  };

  formatter.list = function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return list.apply(void 0, [resolvedLocale].concat(args));
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
      return i18nServer({
        strings: strings,
        resolvedLocale: resolvedLocale,
        messageStyle: messageStyle,
        allSubstitutions: allSubstitutions,
        insertNodes: insertNodes,
        defaults: defaults,
        substitutions: substitutions,
        maximumLocalNestingDepth: maximumLocalNestingDepth,
        dom: dom,
        forceNodeReturn: forceNodeReturn,
        throwOnMissingSuppliedFormatters: throwOnMissingSuppliedFormatters,
        throwOnExtraSuppliedFormatters: throwOnExtraSuppliedFormatters
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

export { Formatter, LocalFormatter, RegularFormatter, SwitchFormatter, defaultAllSubstitutions, defaultInsertNodes, defaultLocaleMatcher, defaultLocaleResolver, findLocale, findLocaleStrings, getDOMForLocaleString, getDocument, getFetch, getMatchingLocale, getMessageForKeyByStyle, getStringFromMessageAndDefaults, i18n, i18nServer, parseJSONExtra, processRegex, promiseChainForValues, setDocument, setFetch, setJSONExtra, unescapeBackslashes };
