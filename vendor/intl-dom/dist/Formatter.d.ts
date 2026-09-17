/**
 * Base class for formatting.
 */
export declare class Formatter {
}
/**
 * Formatter for local variables.
 */
export declare class LocalFormatter extends Formatter {
    locals: import("./getMessageForKeyByStyle.js").LocaleBody;
    /**
     * @param {string} key
     * @returns {boolean}
     */
    static isMatchingKey(key: string): boolean;
    /**
     * @param {import('./getMessageForKeyByStyle.js').LocalObject} locals
     */
    constructor(locals: import('./getMessageForKeyByStyle.js').LocalObject);
    /**
     * @param {string} key
     * @returns {string|Element}
     */
    getSubstitution(key: string): string | Element;
    /**
     * @param {string} key
     * @returns {boolean}
     */
    isMatch(key: string): boolean;
}
/**
 * Formatter for regular variables.
 */
export declare class RegularFormatter extends Formatter {
    substitutions: import("./defaultLocaleResolver.js").SubstitutionObject;
    /**
     * @param {string} key
     * @returns {boolean}
     */
    static isMatchingKey(key: string): boolean;
    /**
     * @param {import('./defaultLocaleResolver.js').SubstitutionObject
     * } substitutions
     */
    constructor(substitutions: import('./defaultLocaleResolver.js').SubstitutionObject);
    /**
     * @param {string} key
     * @returns {boolean}
     */
    isMatch(key: string): boolean;
}
export type SwitchMatch = [
    objKey?: string,
    body?: import('./getMessageForKeyByStyle.js').LocaleBody,
    keySegment?: string
];
export type Integer = number;
/**
 * Formatter for switch variables.
 */
export declare class SwitchFormatter extends Formatter {
    switches: import("./defaultLocaleResolver.js").Switches;
    substitutions: import("./defaultLocaleResolver.js").SubstitutionObject;
    /**
     * @param {string} key
     * @returns {boolean}
     */
    static isMatchingKey(key: string): boolean;
    /**
     * @param {string} key
     * @returns {string}
     */
    static getKey(key: string): string;
    /**
     * @param {import('./defaultLocaleResolver.js').Switches} switches
     * @param {object} cfg
     * @param {import('./defaultLocaleResolver.js').
     *   SubstitutionObject} cfg.substitutions
     */
    constructor(switches: import('./defaultLocaleResolver.js').Switches, { substitutions }: {
        substitutions: import('./defaultLocaleResolver.js').SubstitutionObject;
    });
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
    getSubstitution(key: string, { locale, usedKeys, arg, missingSuppliedFormatters }: {
        locale: string;
        usedKeys: (string | undefined)[];
        arg: string;
        missingSuppliedFormatters: import('./getDOMForLocaleString.js').MissingSuppliedFormattersCallback;
    }): string;
    /**
     * @param {string} key
     * @returns {boolean}
     */
    isMatch(key: string): boolean;
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
    getMatch(ky: string): SwitchMatch;
}
//# sourceMappingURL=Formatter.d.ts.map