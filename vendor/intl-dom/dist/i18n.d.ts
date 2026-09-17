export type Sort = import('./index.js').Sort;
export type SortList = import('./index.js').SortList;
export type List = import('./index.js').List;
export type I18NCallback = import('./index.js').I18NCallback;
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
export declare const i18nServer: ({ strings, resolvedLocale, messageStyle, allSubstitutions: defaultAllSubstitutionsValue, insertNodes, keyCheckerConverter, defaults: defaultDefaults, substitutions: defaultSubstitutions, maximumLocalNestingDepth, dom: domDefaults, forceNodeReturn: forceNodeReturnDefault, throwOnMissingSuppliedFormatters: throwOnMissingSuppliedFormattersDefault, throwOnExtraSuppliedFormatters: throwOnExtraSuppliedFormattersDefault }: {
    strings: import('./getMessageForKeyByStyle.js').LocaleObject;
    resolvedLocale: string;
    messageStyle?: "richNested" | "rich" | "plain" | "plainNested" | import('./getMessageForKeyByStyle.js').MessageStyleCallback;
    allSubstitutions?: (import('./defaultAllSubstitutions.js').AllSubstitutionCallback | null) | import('./defaultAllSubstitutions.js').AllSubstitutionCallback[];
    insertNodes?: import('./defaultInsertNodes.js').InsertNodesCallback;
    keyCheckerConverter?: import('./defaultKeyCheckerConverter.js').KeyCheckerConverterCallback;
    defaults?: false | null | undefined | import('./getMessageForKeyByStyle.js').LocaleObject;
    substitutions?: false | import('./defaultLocaleResolver.js').SubstitutionObject;
    maximumLocalNestingDepth?: Integer;
    dom?: boolean;
    forceNodeReturn?: boolean;
    throwOnMissingSuppliedFormatters?: boolean;
    throwOnExtraSuppliedFormatters?: boolean;
}) => I18NCallback;
export type Integer = number;
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
export declare const i18n: ({ locales, defaultLocales, localeStringFinder, localesBasePath, localeResolver, localeMatcher, messageStyle, allSubstitutions, insertNodes, keyCheckerConverter, defaults, substitutions, maximumLocalNestingDepth, dom, forceNodeReturn, throwOnMissingSuppliedFormatters, throwOnExtraSuppliedFormatters }?: {
    locales?: string[];
    defaultLocales?: string[];
    localeStringFinder?: import('./findLocaleStrings.js').LocaleStringFinder;
    localesBasePath?: string;
    localeResolver?: import('./defaultLocaleResolver.js').LocaleResolver;
    localeMatcher?: "lookup" | import('./findLocaleStrings.js').LocaleMatcher;
    messageStyle?: "richNested" | "rich" | "plain" | "plainNested" | import('./getMessageForKeyByStyle.js').MessageStyleCallback;
    allSubstitutions?: (import('./defaultAllSubstitutions.js').AllSubstitutionCallback | import('./defaultAllSubstitutions.js').AllSubstitutionCallback[]) | null;
    insertNodes?: import('./defaultInsertNodes.js').InsertNodesCallback;
    keyCheckerConverter?: import('./defaultKeyCheckerConverter.js').KeyCheckerConverterCallback;
    defaults?: false | null | undefined | import('./getMessageForKeyByStyle.js').LocaleObject;
    substitutions?: false | import('./defaultLocaleResolver.js').SubstitutionObject;
    maximumLocalNestingDepth?: Integer;
    dom?: boolean;
    forceNodeReturn?: boolean;
    throwOnMissingSuppliedFormatters?: boolean;
    throwOnExtraSuppliedFormatters?: boolean;
}) => Promise<I18NCallback>;
//# sourceMappingURL=i18n.d.ts.map