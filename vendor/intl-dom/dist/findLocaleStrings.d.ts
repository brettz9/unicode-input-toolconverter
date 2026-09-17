export { setFetch, getFetch } from './shared.js';
export type LocaleMatcher = (locale: string) => any;
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
export declare const defaultLocaleMatcher: LocaleMatcher;
/**
 * @param {object} cfg
 * @param {string} cfg.locale
 * @param {string[]} cfg.locales
 * @param {LocaleMatcher} [cfg.localeMatcher]
 * @returns {string|false}
 */
export declare const getMatchingLocale: ({ locale, locales, localeMatcher }: {
    locale: string;
    locales: string[];
    localeMatcher?: LocaleMatcher;
}) => string | false;
export type LocaleObjectInfo = {
    /**
     * The successfully retrieved locale strings
     */
    strings: import('./getMessageForKeyByStyle.js').LocaleObject;
    /**
     * The successfully resolved locale
     */
    locale: string;
};
export type LocaleStringArgs = {
    locales?: string[];
    defaultLocales?: string[];
    localesBasePath?: string;
    localeResolver?: import('./defaultLocaleResolver.js').LocaleResolver;
    localeMatcher?: "lookup" | LocaleMatcher;
};
export type LocaleStringFinder = (cfg?: LocaleStringArgs) => Promise<LocaleObjectInfo>;
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
export declare const findLocaleStrings: LocaleStringFinder;
export type LocaleFinder = (cfg?: LocaleStringArgs) => Promise<string>;
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
export declare const findLocale: LocaleFinder;
//# sourceMappingURL=findLocaleStrings.d.ts.map