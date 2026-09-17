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
export type KeyCheckerConverterCallback = (key: string | string[], messageStyle: "plain" | "plainNested" | "rich" | "richNested" | import('./getMessageForKeyByStyle.js').MessageStyleCallback) => any;
/**
 * @type {KeyCheckerConverterCallback}
 */
export declare const defaultKeyCheckerConverter: KeyCheckerConverterCallback;
//# sourceMappingURL=defaultKeyCheckerConverter.d.ts.map