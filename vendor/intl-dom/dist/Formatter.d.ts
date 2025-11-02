/**
 * Base class for formatting.
 */
export class Formatter {
}
/**
 * Formatter for local variables.
 */
export class LocalFormatter extends Formatter {
    /**
     * @param {string} key
     * @returns {boolean}
     */
    static isMatchingKey(key: string): boolean;
    /**
     * @param {import('./getMessageForKeyByStyle.js').LocalObject} locals
     */
    constructor(locals: import('./getMessageForKeyByStyle.js').LocalObject);
    locals: import("./getMessageForKeyByStyle.js").LocaleBody;
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
export class RegularFormatter extends Formatter {
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
    substitutions: import("./defaultLocaleResolver.js").SubstitutionObject;
    /**
     * @param {string} key
     * @returns {boolean}
     */
    isMatch(key: string): boolean;
}
/**
 * Formatter for switch variables.
 */
export class SwitchFormatter extends Formatter {
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
    switches: {
        [x: string]: {
            [x: string]: import("./defaultLocaleResolver.js").SwitchCase;
        };
    };
    substitutions: import("./defaultLocaleResolver.js").SubstitutionObject;
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
    getMatch(ky: string): [objKey?: string | undefined, body?: import("./getMessageForKeyByStyle.js").LocaleBody | undefined, keySegment?: string | undefined];
}
//# sourceMappingURL=Formatter.d.ts.map