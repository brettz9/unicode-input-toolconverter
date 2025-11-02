export function setFetch(f: Fetch): void;
export function getFetch(): Fetch | null;
export function setDocument(doc: Document): void;
export function getDocument(): Document | null;
export type Fetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
//# sourceMappingURL=shared.d.ts.map