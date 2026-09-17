export { setDocument, getDocument } from './shared.js';
export type Integer = number;
export type CheckExtraSuppliedFormattersCallback = (substs: import('./defaultLocaleResolver.js').SubstitutionObject | {
    substitutions: import('./defaultLocaleResolver.js').SubstitutionObject;
}) => any;
export type MissingSuppliedFormattersCallback = (cfg: {
    key: string;
    formatter: import('./Formatter.js').LocalFormatter | import('./Formatter.js').RegularFormatter | import('./Formatter.js').SwitchFormatter;
}) => boolean;
/**
 * @typedef {number} Integer
 */
/**
 * @callback CheckExtraSuppliedFormattersCallback
 * @param {import('./defaultLocaleResolver.js').SubstitutionObject|{
 *   substitutions: import('./defaultLocaleResolver.js').SubstitutionObject
 * }} substs (Why is an arg. of `substitutions` being passed in?)
 * @throws {Error} Upon an extra formatting key being found
 * @returns {void}
 */
/**
 * @typedef {(
 *   cfg: {
 *     key: string,
 *     formatter: import('./Formatter.js').LocalFormatter|
 *       import('./Formatter.js').RegularFormatter|
 *       import('./Formatter.js').SwitchFormatter
 *   }
 * ) => boolean} MissingSuppliedFormattersCallback
 */
/**
 *
 * @param {object} cfg
 * @param {string} cfg.string
 * @param {string} [cfg.locale] The (possibly already resolved) locale
 *   for use by configuring formatters
 * @param {import('./getMessageForKeyByStyle.js').LocalObject} [cfg.locals]
 * @param {import('./defaultLocaleResolver.js').Switches} [cfg.switches]
 * @param {Integer} [cfg.maximumLocalNestingDepth]
 * @param {?(import('./defaultAllSubstitutions.js').AllSubstitutionCallback|
 *   import('./defaultAllSubstitutions.js').AllSubstitutionCallback[])
 * } [cfg.allSubstitutions]
 * @param {import('./defaultInsertNodes.js').InsertNodesCallback
 * } [cfg.insertNodes]
 * @param {false|import('./defaultLocaleResolver.js').SubstitutionObject
 * } [cfg.substitutions]
 * @param {boolean} [cfg.dom]
 * @param {boolean} [cfg.forceNodeReturn]
 * @param {boolean} [cfg.throwOnMissingSuppliedFormatters]
 * @param {boolean} [cfg.throwOnExtraSuppliedFormatters]
 * @returns {string|Text|DocumentFragment}
 */
export declare const getDOMForLocaleString: ({ string, locale, locals, switches, maximumLocalNestingDepth, allSubstitutions, insertNodes, substitutions, dom, forceNodeReturn, throwOnMissingSuppliedFormatters, throwOnExtraSuppliedFormatters }: {
    string: string;
    locale?: string;
    locals?: import('./getMessageForKeyByStyle.js').LocalObject;
    switches?: import('./defaultLocaleResolver.js').Switches;
    maximumLocalNestingDepth?: Integer;
    allSubstitutions?: (import('./defaultAllSubstitutions.js').AllSubstitutionCallback | import('./defaultAllSubstitutions.js').AllSubstitutionCallback[]) | null;
    insertNodes?: import('./defaultInsertNodes.js').InsertNodesCallback;
    substitutions?: false | import('./defaultLocaleResolver.js').SubstitutionObject;
    dom?: boolean;
    forceNodeReturn?: boolean;
    throwOnMissingSuppliedFormatters?: boolean;
    throwOnExtraSuppliedFormatters?: boolean;
}) => string | Text | DocumentFragment;
//# sourceMappingURL=getDOMForLocaleString.d.ts.map