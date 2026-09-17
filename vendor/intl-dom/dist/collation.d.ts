export { setDocument, getDocument } from './shared.js';
/**
 *
 * @param {string} locale
 * @param {string[]} arrayOfItems
 * @param {Intl.CollatorOptions|undefined} options
 * @returns {string[]}
 */
export declare const sort: (locale: string, arrayOfItems: string[], options: Intl.CollatorOptions | undefined) => string[];
/**
 *
 * @param {string} locale
 * @param {string[]} arrayOfItems
 * @param {Intl.ListFormatOptions|undefined} [options]
 * @returns {string}
 */
export declare const list: (locale: string, arrayOfItems: string[], options?: Intl.ListFormatOptions | undefined) => string;
/**
 *
 * @param {string} locale
 * @param {string[]} arrayOfItems
 * @param {Intl.ListFormatOptions|undefined} [listOptions]
 * @param {Intl.CollatorOptions|undefined} [collationOptions]
 * @returns {string}
 */
export declare const sortListSimple: (locale: string, arrayOfItems: string[], listOptions?: Intl.ListFormatOptions | undefined, collationOptions?: Intl.CollatorOptions | undefined) => string;
export type Integer = number;
/**
 * @typedef {number} Integer
 */
/**
 *
 * @param {string} locale
 * @param {string[]} arrayOfItems
 * @param {import('./index.js').SortListMapper|
 *   Intl.ListFormatOptions|undefined} map
 * @param {Intl.ListFormatOptions|undefined} [listOptions]
 * @param {Intl.CollatorOptions|undefined} [collationOptions]
 * @returns {DocumentFragment|string}
 */
export declare const sortList: (locale: string, arrayOfItems: string[], map: import('./index.js').SortListMapper | Intl.ListFormatOptions | undefined, listOptions?: Intl.ListFormatOptions | undefined, collationOptions?: Intl.CollatorOptions | undefined) => DocumentFragment | string;
//# sourceMappingURL=collation.d.ts.map