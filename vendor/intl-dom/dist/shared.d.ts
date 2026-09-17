export type Fetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
/**
 * @param {Fetch} f
 * @returns {void}
 */
export declare const setFetch: (f: Fetch) => void;
/**
 * @returns {Fetch|null}
 */
export declare const getFetch: () => Fetch | null;
/**
 * @param {Document} doc
 * @returns {void}
 */
export declare const setDocument: (doc: Document) => void;
/**
 * @returns {Document|null}
 */
export declare const getDocument: () => Document | null;
//# sourceMappingURL=shared.d.ts.map