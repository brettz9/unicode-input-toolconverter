export type JSON6 = any;
export type AnyValue = any;
/**
 * @param {JSON6} __jsonExtra
 */
export declare const setJSONExtra: (__jsonExtra: JSON6) => void;
/**
 * @param {string} str
 * @returns {string}
 */
export declare const unescapeBackslashes: (str: string) => string;
/**
 * @param {string} args
 * @returns {AnyValue}
 */
export declare const parseJSONExtra: (args: string) => AnyValue;
export type BetweenMatches = (str: string) => void;
export type AfterMatch = (str: string) => void;
export type EscapeAtOne = (str: string) => void;
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
export declare const processRegex: (regex: RegExp, str: string, { onMatch, extra, betweenMatches, afterMatch, escapeAtOne }: {
    onMatch: (...arg0: string[]) => void;
    extra?: BetweenMatches | AfterMatch | EscapeAtOne;
    betweenMatches?: BetweenMatches;
    afterMatch?: AfterMatch;
    escapeAtOne?: EscapeAtOne;
}) => void;
//# sourceMappingURL=utils.d.ts.map