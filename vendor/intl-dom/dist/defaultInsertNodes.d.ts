/**
 * @typedef {number} Integer
 */
/**
 * @callback Replace
 * @param {{
 *   str: string,
 *   substs?: import('./defaultLocaleResolver.js').SubstitutionObject,
 *   formatter?: import('./Formatter.js').RegularFormatter|
 *     import('./Formatter.js').LocalFormatter|
 *     import('./Formatter.js').SwitchFormatter
 * }} cfg
 * @returns {string}
 */
/**
 * @callback ProcessSubstitutions
 * @param {{
 *   str: string,
 *   substs?: import('./defaultLocaleResolver.js').SubstitutionObject,
 *   formatter?: import('./Formatter.js').RegularFormatter|
 *     import('./Formatter.js').LocalFormatter|
 *     import('./Formatter.js').SwitchFormatter
 * }} cfg
 * @returns {(string|Node)[]}
 */
/**
 * Callback to return a string or array of nodes and strings based on
 *   a localized string, substitutions object, and other metadata.
 *
 * `string` - The localized string.
 * `dom` - If substitutions known to contain DOM, can be set
 *    to `true` to optimize.
 * `usedKeys` - Array for tracking which keys have been used. Defaults
 *   to empty array.
 * `substitutions` - The formatting substitutions object.
 * `allSubstitutions` - The
 *   callback or array composed thereof for applying to each substitution.
 * `locale` - The successfully resolved locale
 * `locals` - The local section.
 * `switches` - The switch section.
 * `maximumLocalNestingDepth` - Depth of local variable resolution to
 *   check before reporting a recursion error. Defaults to 3.
 * `missingSuppliedFormatters` - Callback
 *   supplied key to throw if the supplied key is present (if
 *   `throwOnMissingSuppliedFormatters` is enabled). Defaults to no-op.
 * `checkExtraSuppliedFormatters` - No
 *   argument callback to check if any formatters are not present in `string`
 *   (if `throwOnExtraSuppliedFormatters` is enabled). Defaults to no-op.
 * @typedef {(cfg: {
 *   string: string,
 *   dom?: boolean,
 *   usedKeys: string[],
 *   substitutions: import('./defaultLocaleResolver.js').SubstitutionObject,
 *   allSubstitutions?: ?(
 *     import('./defaultAllSubstitutions.js').AllSubstitutionCallback|
 *     import('./defaultAllSubstitutions.js').AllSubstitutionCallback[]
 *   )
 *   locale: string|undefined,
 *   locals?: import('./getMessageForKeyByStyle.js').LocalObject|undefined,
 *   switches: import('./defaultLocaleResolver.js').Switches|undefined,
 *   maximumLocalNestingDepth?: Integer,
 *   missingSuppliedFormatters: import('./getDOMForLocaleString.js').
 *     MissingSuppliedFormattersCallback,
 *   checkExtraSuppliedFormatters: import('./getDOMForLocaleString.js').
 *     CheckExtraSuppliedFormattersCallback
 * }) => string|(Node|string)[]} InsertNodesCallback
 */
/**
 * @type {InsertNodesCallback}
 */
export const defaultInsertNodes: InsertNodesCallback;
export type Integer = number;
export type Replace = (cfg: {
    str: string;
    substs?: import('./defaultLocaleResolver.js').SubstitutionObject;
    formatter?: import('./Formatter.js').RegularFormatter | import('./Formatter.js').LocalFormatter | import('./Formatter.js').SwitchFormatter;
}) => string;
export type ProcessSubstitutions = (cfg: {
    str: string;
    substs?: import('./defaultLocaleResolver.js').SubstitutionObject;
    formatter?: import('./Formatter.js').RegularFormatter | import('./Formatter.js').LocalFormatter | import('./Formatter.js').SwitchFormatter;
}) => (string | Node)[];
/**
 * Callback to return a string or array of nodes and strings based on
 *   a localized string, substitutions object, and other metadata.
 *
 * `string` - The localized string.
 * `dom` - If substitutions known to contain DOM, can be set
 *    to `true` to optimize.
 * `usedKeys` - Array for tracking which keys have been used. Defaults
 *   to empty array.
 * `substitutions` - The formatting substitutions object.
 * `allSubstitutions` - The
 *   callback or array composed thereof for applying to each substitution.
 * `locale` - The successfully resolved locale
 * `locals` - The local section.
 * `switches` - The switch section.
 * `maximumLocalNestingDepth` - Depth of local variable resolution to
 *   check before reporting a recursion error. Defaults to 3.
 * `missingSuppliedFormatters` - Callback
 *   supplied key to throw if the supplied key is present (if
 *   `throwOnMissingSuppliedFormatters` is enabled). Defaults to no-op.
 * `checkExtraSuppliedFormatters` - No
 *   argument callback to check if any formatters are not present in `string`
 *   (if `throwOnExtraSuppliedFormatters` is enabled). Defaults to no-op.
 */
export type InsertNodesCallback = (cfg: {
    string: string;
    dom?: boolean;
    usedKeys: string[];
    substitutions: import('./defaultLocaleResolver.js').SubstitutionObject;
    allSubstitutions?: (import('./defaultAllSubstitutions.js').AllSubstitutionCallback | import('./defaultAllSubstitutions.js').AllSubstitutionCallback[]) | null;
    locale: string | undefined;
    locals?: import('./getMessageForKeyByStyle.js').LocalObject | undefined;
    switches: import('./defaultLocaleResolver.js').Switches | undefined;
    maximumLocalNestingDepth?: Integer;
    missingSuppliedFormatters: import('./getDOMForLocaleString.js').MissingSuppliedFormattersCallback;
    checkExtraSuppliedFormatters: import('./getDOMForLocaleString.js').CheckExtraSuppliedFormattersCallback;
}) => string | (Node | string)[];
//# sourceMappingURL=defaultInsertNodes.d.ts.map