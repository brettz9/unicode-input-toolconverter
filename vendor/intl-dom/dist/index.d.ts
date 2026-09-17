/**
 * @callback Sort
 * @param {string[]} arrayOfItems
 * @param {Intl.CollatorOptions|undefined} options
 * @returns {string[]}
 */
export type Sort = (arrayOfItems: string[], options: Intl.CollatorOptions | undefined) => string[];
export type SortListMapper = (str: string, idx: number) => any;
export type SortList = (arrayOfItems: string[], map: SortListMapper, listOptions?: Intl.ListFormatOptions | undefined, collationOptions?: Intl.CollatorOptions | undefined) => string | DocumentFragment;
export type List = (arrayOfItems: string[], options?: Intl.ListFormatOptions | undefined) => string;
export type I18NCallback<T = string | DocumentFragment | Text> = ((key: string | string[], substitutions?: false | null | undefined | import('./defaultLocaleResolver.js').SubstitutionObject, cfg?: {
    allSubstitutions?: (import('./defaultAllSubstitutions.js').AllSubstitutionCallback | null) | import('./defaultAllSubstitutions.js').AllSubstitutionCallback[];
    defaults?: false | null | undefined | import('./getMessageForKeyByStyle.js').LocaleObject;
    dom?: boolean;
    forceNodeReturn?: boolean;
    throwOnMissingSuppliedFormatters?: boolean;
    throwOnExtraSuppliedFormatters?: boolean;
}) => T) & {
    resolvedLocale: string;
    strings: import('./getMessageForKeyByStyle.js').LocaleObject;
    sort: Sort;
    sortList: SortList;
    list: List;
};
/**
 * @typedef {(str: string, idx: number) => any} SortListMapper
 */
/**
 * @callback SortList
 * @param {string[]} arrayOfItems
 * @param {SortListMapper} map
 * @param {Intl.ListFormatOptions|undefined} [listOptions]
 * @param {Intl.CollatorOptions|undefined} [collationOptions]
 * @returns {string|DocumentFragment}
 */
/**
 * @callback List
 * @param {string[]} arrayOfItems
 * @param {Intl.ListFormatOptions|undefined} [options]
 * @returns {string}
 */
/**
 * Checks a key (against an object of strings). Optionally
 *  accepts an object of substitutions which are used when finding text
 *  within curly brackets (pipe symbol not allowed in its keys); the
 *  substitutions may be DOM elements as well as strings and may be
 *  functions which return the same (being provided the text after the
 *  pipe within brackets as the single argument).) Optionally accepts a
 *  config object, with the optional key "dom" which if set to `true`
 *  optimizes when DOM elements are (known to be) present.
 * `key` - Key to check against object of strings.
 * `substitutions` - Defaults to `false`.
 * `cfg.dom` - Defaults to `false`.
 * @typedef {((
 *   key: string|string[],
 *   substitutions?: false|null|undefined|
 *     import('./defaultLocaleResolver.js').SubstitutionObject,
 *   cfg?: {
 *     allSubstitutions?: ?import('./defaultAllSubstitutions.js').
 *         AllSubstitutionCallback|
 *       import('./defaultAllSubstitutions.js').
 *         AllSubstitutionCallback[],
 *     defaults?: false|null|undefined|
 *       import('./getMessageForKeyByStyle.js').LocaleObject,
 *     dom?: boolean,
 *     forceNodeReturn?: boolean,
 *     throwOnMissingSuppliedFormatters?: boolean,
 *     throwOnExtraSuppliedFormatters?: boolean
 *   }
 * ) => T) & {
 *   resolvedLocale: string,
 *   strings: import('./getMessageForKeyByStyle.js').LocaleObject,
 *   sort: Sort,
 *   sortList: SortList,
 *   list: List
 * }} I18NCallback<T>
 * @template [T=string|DocumentFragment|Text]
 */
export { Formatter, LocalFormatter, RegularFormatter, SwitchFormatter } from './Formatter.js';
export { unescapeBackslashes, parseJSONExtra, processRegex, setJSONExtra } from './utils.js';
export { promiseChainForValues } from './promiseChainForValues.js';
export { defaultLocaleResolver } from './defaultLocaleResolver.js';
export { defaultAllSubstitutions } from './defaultAllSubstitutions.js';
export { defaultInsertNodes } from './defaultInsertNodes.js';
export { defaultKeyCheckerConverter } from './defaultKeyCheckerConverter.js';
export { getMessageForKeyByStyle } from './getMessageForKeyByStyle.js';
export { getStringFromMessageAndDefaults } from './getStringFromMessageAndDefaults.js';
export { getDOMForLocaleString } from './getDOMForLocaleString.js';
export { findLocaleStrings, defaultLocaleMatcher, findLocale, getMatchingLocale } from './findLocaleStrings.js';
export { setFetch, getFetch, setDocument, getDocument } from './shared.js';
export { i18n, i18nServer } from './i18n.js';
//# sourceMappingURL=index.d.ts.map