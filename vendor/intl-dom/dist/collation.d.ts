export function sort(locale: string, arrayOfItems: string[], options: Intl.CollatorOptions | undefined): string[];
export function list(locale: string, arrayOfItems: string[], options?: Intl.ListFormatOptions | undefined): string;
export function sortListSimple(locale: string, arrayOfItems: string[], listOptions?: Intl.ListFormatOptions | undefined, collationOptions?: Intl.CollatorOptions | undefined): string;
export function sortList(locale: string, arrayOfItems: string[], map: Intl.ListFormatOptions | ((str: string, idx: Integer) => any) | undefined, listOptions?: Intl.ListFormatOptions | undefined, collationOptions?: Intl.CollatorOptions | undefined): DocumentFragment | string;
export type Integer = number;
export { setDocument, getDocument } from "./shared.js";
//# sourceMappingURL=collation.d.ts.map