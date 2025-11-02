export function getStringFromMessageAndDefaults({ message, defaults, messageStyle, messageForKey, key }: {
    message?: string | false | undefined;
    defaults?: false | null | undefined | import('./getMessageForKeyByStyle.js').LocaleObject;
    messageStyle?: import("./getMessageForKeyByStyle.js").MessageStyleCallback | "richNested" | "rich" | "plain" | "plainNested" | undefined;
    messageForKey?: import("./getMessageForKeyByStyle.js").MessageStyleCallback | undefined;
    key: string;
}): string;
//# sourceMappingURL=getStringFromMessageAndDefaults.d.ts.map