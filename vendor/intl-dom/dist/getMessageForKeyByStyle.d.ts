export function getMessageForKeyByStyle({ messageStyle }?: {
    messageStyle?: MessageStyleCallback | "richNested" | "rich" | "plain" | "plainNested" | undefined;
} | undefined): MessageStyleCallback;
export type LocalObject = LocaleBody;
/**
 * May also contain language code and direction, translator name and
 * contact, etc., but no defaults currently apply besides reserving `locals`
 */
export type LocaleHead = {
    locals?: LocaleBody | undefined;
    switches?: {
        [x: string]: {
            [x: string]: import("./defaultLocaleResolver.js").SwitchCase;
        };
    } | undefined;
};
export type LocaleBody = import('./defaultLocaleResolver.js').RichNestedLocaleStringBodyObject | import('./defaultLocaleResolver.js').RichLocaleStringBodyObject | import('./defaultLocaleResolver.js').PlainLocaleStringBodyObject | import('./defaultLocaleResolver.js').PlainNestedLocaleStringBodyObject | object;
export type LocaleObject = {
    head?: LocaleHead | undefined;
    body: LocaleBody;
};
export type MessageStyleCallbackResult = {
    /**
     * Regardless of message style, will contain
     * the string result
     */
    value: string;
    /**
     * Full info on the localized item
     * (for rich message styles only)
     */
    info?: import("./defaultLocaleResolver.js").RichLocaleStringSubObject | undefined;
};
export type MessageStyleCallback = (obj: LocaleObject, key: string) => false | MessageStyleCallbackResult;
//# sourceMappingURL=getMessageForKeyByStyle.d.ts.map