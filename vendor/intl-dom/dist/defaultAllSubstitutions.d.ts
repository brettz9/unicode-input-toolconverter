export function getFormatterInfo({ object }: {
    object: import('./defaultLocaleResolver.js').DateRangeValueArray | import('./defaultLocaleResolver.js').ListValueArray | import('./defaultLocaleResolver.js').RelativeValueArray | import('./defaultLocaleResolver.js').ValueArray;
}): {
    value: number | string | string[] | Date;
    options?: string | number | Date | Intl.NumberFormatOptions | Intl.PluralRulesOptions | undefined;
    extraOpts?: object | undefined;
    callback?: ((item: string, i: Integer) => Element) | undefined;
};
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
export const defaultAllSubstitutions: AllSubstitutionCallback;
export type Integer = number;
/**
 * Callback to give replacement text based on a substitution value.
 *
 * `value` - contains the value returned by the individual substitution.
 * `arg` - See `cfg.arg` of {@link SubstitutionCallback }.
 * `key` - The substitution key Not currently in use
 * `locale` - The locale.
 */
export type AllSubstitutionCallback = (info: {
    value: import('./defaultLocaleResolver.js').SubstitutionObjectValue;
    arg?: string;
    key?: string;
    locale?: string;
}) => string | Node;
//# sourceMappingURL=defaultAllSubstitutions.d.ts.map