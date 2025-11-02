export function setJSONExtra(__jsonExtra: JSON6): void;
export function unescapeBackslashes(str: string): string;
export function parseJSONExtra(args: string): AnyValue;
export function processRegex(regex: RegExp, str: string, { onMatch, extra, betweenMatches, afterMatch, escapeAtOne }: {
    onMatch: (...arg0: string[]) => void;
    extra?: BetweenMatches | AfterMatch | EscapeAtOne | undefined;
    betweenMatches?: BetweenMatches | undefined;
    afterMatch?: AfterMatch | undefined;
    escapeAtOne?: EscapeAtOne | undefined;
}): void;
export type JSON6 = any;
export type AnyValue = any;
export type BetweenMatches = (str: string) => void;
export type AfterMatch = (str: string) => void;
export type EscapeAtOne = (str: string) => void;
//# sourceMappingURL=utils.d.ts.map