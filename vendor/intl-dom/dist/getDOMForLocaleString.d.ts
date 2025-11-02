export function getDOMForLocaleString({ string, locale, locals, switches, maximumLocalNestingDepth, allSubstitutions, insertNodes, substitutions, dom, forceNodeReturn, throwOnMissingSuppliedFormatters, throwOnExtraSuppliedFormatters }: {
    string: string;
    locale?: string | undefined;
    locals?: import("./getMessageForKeyByStyle.js").LocaleBody | undefined;
    switches?: {
        [x: string]: {
            [x: string]: import("./defaultLocaleResolver.js").SwitchCase;
        };
    } | undefined;
    maximumLocalNestingDepth?: number | undefined;
    allSubstitutions?: import("./defaultAllSubstitutions.js").AllSubstitutionCallback | import("./defaultAllSubstitutions.js").AllSubstitutionCallback[] | null | undefined;
    insertNodes?: import("./defaultInsertNodes.js").InsertNodesCallback | undefined;
    substitutions?: false | import("./defaultLocaleResolver.js").SubstitutionObject | undefined;
    dom?: boolean | undefined;
    forceNodeReturn?: boolean | undefined;
    throwOnMissingSuppliedFormatters?: boolean | undefined;
    throwOnExtraSuppliedFormatters?: boolean | undefined;
}): string | Text | DocumentFragment;
export type Integer = number;
export type CheckExtraSuppliedFormattersCallback = (substs: import('./defaultLocaleResolver.js').SubstitutionObject | {
    substitutions: import('./defaultLocaleResolver.js').SubstitutionObject;
}) => any;
export type MissingSuppliedFormattersCallback = (cfg: {
    key: string;
    formatter: import('./Formatter.js').LocalFormatter | import('./Formatter.js').RegularFormatter | import('./Formatter.js').SwitchFormatter;
}) => boolean;
export { setDocument, getDocument } from "./shared.js";
//# sourceMappingURL=getDOMForLocaleString.d.ts.map