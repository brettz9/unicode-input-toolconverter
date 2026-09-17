export type LocalObject = LocaleBody;
export type LocaleHead = {
    locals?: LocalObject;
    switches?: import('./defaultLocaleResolver.js').Switches;
};
export type LocaleBody = import('./defaultLocaleResolver.js').RichNestedLocaleStringBodyObject | import('./defaultLocaleResolver.js').RichLocaleStringBodyObject | import('./defaultLocaleResolver.js').PlainLocaleStringBodyObject | import('./defaultLocaleResolver.js').PlainNestedLocaleStringBodyObject | object;
export type LocaleObject = {
    head?: LocaleHead;
    body: LocaleBody;
};
export type MessageStyleCallbackResult = {
    /**
     * Regardless of message style, will contain
     * the string result
     */
    value: string;
    /**
     * Full info on the localized item
     * (for rich message styles only)
     */
    info?: import('./defaultLocaleResolver.js').RichLocaleStringSubObject;
};
export type MessageStyleCallback = (obj: LocaleObject, key: string) => false | MessageStyleCallbackResult;
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
/**
 * @param {object} [cfg]
 * @param {"richNested"|"rich"|"plain"|"plainNested"|MessageStyleCallback} [cfg.messageStyle]
 * @returns {MessageStyleCallback}
 */
export declare const getMessageForKeyByStyle: ({ messageStyle }?: {
    messageStyle?: "richNested" | "rich" | "plain" | "plainNested" | MessageStyleCallback;
}) => MessageStyleCallback;
//# sourceMappingURL=getMessageForKeyByStyle.d.ts.map