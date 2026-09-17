export type Integer = number;
/**
 * @typedef {number} Integer
 */
/**
 * @param {{
 *   object: import('./defaultLocaleResolver.js').DateRangeValueArray|
 *     import('./defaultLocaleResolver.js').ListValueArray|
 *     import('./defaultLocaleResolver.js').RelativeValueArray|
 *     import('./defaultLocaleResolver.js').ValueArray
 * }} cfg
 * @returns {{
 *   value: number|string|string[]|Date,
 *   options?: Intl.NumberFormatOptions|Intl.PluralRulesOptions|
 *     string|Date|number,
 *   extraOpts?: object,
 *   callback?: (item: string, i: Integer) => Element
 * }}
 */
export declare const getFormatterInfo: ({ object }: {
    object: import('./defaultLocaleResolver.js').DateRangeValueArray | import('./defaultLocaleResolver.js').ListValueArray | import('./defaultLocaleResolver.js').RelativeValueArray | import('./defaultLocaleResolver.js').ValueArray;
}) => {
    value: number | string | string[] | Date;
    options?: Intl.NumberFormatOptions | Intl.PluralRulesOptions | string | Date | number;
    extraOpts?: object;
    callback?: (item: string, i: Integer) => Element;
};
export type AllSubstitutionCallback = (info: {
    value: import('./defaultLocaleResolver.js').SubstitutionObjectValue;
    arg?: string;
    key?: string;
    locale?: string;
}) => string | Node;
/**
 * Callback to give replacement text based on a substitution value.
 *
 * `value` - contains the value returned by the individual substitution.
 * `arg` - See `cfg.arg` of {@link SubstitutionCallback}.
 * `key` - The substitution key Not currently in use
 * `locale` - The locale.
 * @typedef {(info: {
 *   value: import('./defaultLocaleResolver.js').SubstitutionObjectValue
 *   arg?: string,
 *   key?: string,
 *   locale?: string
 * }) => string|Node} AllSubstitutionCallback
 */
/**
 * @type {AllSubstitutionCallback}
 */
export declare const defaultAllSubstitutions: AllSubstitutionCallback;
//# sourceMappingURL=defaultAllSubstitutions.d.ts.map