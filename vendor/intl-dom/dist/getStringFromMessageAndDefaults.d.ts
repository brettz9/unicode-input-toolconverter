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
export declare const getStringFromMessageAndDefaults: ({ message, defaults, messageStyle, messageForKey, key }: {
    message?: string | false;
    defaults?: false | null | undefined | import('./getMessageForKeyByStyle.js').LocaleObject;
    messageStyle?: "richNested" | "rich" | "plain" | "plainNested" | import('./getMessageForKeyByStyle.js').MessageStyleCallback;
    messageForKey?: import('./getMessageForKeyByStyle.js').MessageStyleCallback;
    key: string;
}) => string;
//# sourceMappingURL=getStringFromMessageAndDefaults.d.ts.map