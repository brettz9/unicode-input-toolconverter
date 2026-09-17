/**
 * `arg` - By default, accepts the third portion of the
 *   `formattingRegex` within `insertNodes`, i.e., to allow the locale to
 *   supply arguments back to the calling script.
 * `key` - The substitution key.
 * @callback SubstitutionCallback
 * @param {{
 *   arg: string,
 *   key: string
 * }} cfg
 * @returns {string|Element} The replacement text or element
 */
export type SubstitutionCallback = (cfg: {
    arg: string;
    key: string;
}) => string | Element;
export type ValueArray = [string | number | Date, object?, object?];
export type Integer = number;
export type ListValueArray = [
    string[],
    (((item: string, i: Integer) => Element) | object)?,
    object?,
    object?
];
export type DateRangeValueArray = [
    Date | number,
    Date | number,
    Intl.DateTimeFormatOptions | undefined
];
export type RelativeValueArray = [number, Intl.RelativeTimeFormatUnit, object?];
export type RelativeTimeInfo = {
    relative: RelativeValueArray;
};
export type ListInfo = {
    list: ListValueArray;
};
export type NumberInfo = {
    number: ValueArray | number;
};
export type DateInfo = {
    date: ValueArray;
};
export type DateTimeInfo = {
    datetime: ValueArray;
};
export type DateRangeInfo = {
    dateRange: DateRangeValueArray;
};
export type DatetimeRangeInfo = {
    datetimeRange: DateRangeValueArray;
};
export type RegionInfo = {
    region: ValueArray;
};
export type LanguageInfo = {
    language: ValueArray;
};
export type ScriptInfo = {
    script: ValueArray;
};
export type CurrencyInfo = {
    currency: ValueArray;
};
export type PluralInfo = {
    plural: ValueArray;
};
export type PlainLocaleStringBodyObject = {
    [key: string]: string;
};
export type PlainNestedLocaleStringBodyObject = {
    [key: string]: string | PlainNestedLocaleStringBodyObject;
};
export type SwitchCaseInfo = {
    /**
     * Whether this conditional is the default
     */
    default?: boolean;
};
export type SwitchCaseArray = [string, string, SwitchCaseInfo?];
export type SwitchArray = Record<string, SwitchCaseArray>;
export type SwitchArrays = Record<string, SwitchArray>;
export type SwitchCase = {
    /**
     * The locale message with any formatting
     * place-holders; defaults to use of any single conditional
     */
    message: string;
    /**
     * A description to add for translators
     */
    description?: string;
};
export type SwitchGroup = Record<string, SwitchCase>;
export type Switch = Record<string, SwitchCase | SwitchGroup>;
export type Switches = Record<string, Switch>;
export type RichLocaleStringSubObject = {
    /**
     * The locale message with any formatting
     * place-holders; defaults to use of any single conditional
     */
    message: string;
    /**
     * A description to add for translators
     */
    description?: string;
    /**
     * Conditionals
     */
    switches?: Switches;
};
export type RichLocaleStringBodyObject = {
    [key: string]: RichLocaleStringSubObject;
};
export type RichNestedLocaleStringBodyObject = {
    [key: string]: RichLocaleStringSubObject | RichNestedLocaleStringBodyObject;
};
export type LocaleResolver = (localesBasePath: string, locale: string) => string | false;
export type DateRange = [
    Date | number,
    Date | number,
    (Intl.DateTimeFormatOptions | undefined)?
];
export type SubstitutionObjectValue = string | string[] | number | Date | DateRange | Element | Node | SubstitutionCallback | NumberInfo | PluralInfo | CurrencyInfo | LanguageInfo | ScriptInfo | DatetimeRangeInfo | DateRangeInfo | RegionInfo | DateTimeInfo | DateInfo | ListInfo | RelativeTimeInfo;
export type SubstitutionObject = {
    [key: string]: SubstitutionObjectValue;
};
/**
 * May have additional properties if supplying options to an underlying
 * formatter.
 * The first value is the main value.
 * The second are the options related to the main value.
 * The third are any additional options.
 * @typedef {[string|number|Date, object?, object?]} ValueArray
 */
/**
 * @typedef {number} Integer
 */
/**
 * @typedef {[
 *   string[],
 *   (((item: string, i: Integer) => Element)|object)?,
 *   object?,
 *   object?
 * ]} ListValueArray
 */
/**
 * @typedef {[
 *   Date|number, Date|number, Intl.DateTimeFormatOptions|undefined
 * ]} DateRangeValueArray
 */
/**
 * @typedef {[number, Intl.RelativeTimeFormatUnit, object?]} RelativeValueArray
 */
/**
 * @typedef {object} RelativeTimeInfo
 * @property {RelativeValueArray} relative
 */
/**
 * @typedef {object} ListInfo
 * @property {ListValueArray} list
 */
/**
 * @typedef {object} NumberInfo
 * @property {ValueArray|number} number
 */
/**
 * @typedef {object} DateInfo
 * @property {ValueArray} date
 */
/**
 * @typedef {object} DateTimeInfo
 * @property {ValueArray} datetime
 */
/**
 * @typedef {object} DateRangeInfo
 * @property {DateRangeValueArray} dateRange
 */
/**
 * @typedef {object} DatetimeRangeInfo
 * @property {DateRangeValueArray} datetimeRange
 */
/**
 * @typedef {object} RegionInfo
 * @property {ValueArray} region
 */
/**
 * @typedef {object} LanguageInfo
 * @property {ValueArray} language
 */
/**
 * @typedef {object} ScriptInfo
 * @property {ValueArray} script
 */
/**
 * @typedef {object} CurrencyInfo
 * @property {ValueArray} currency
 */
/**
 * @typedef {object} PluralInfo
 * @property {ValueArray} plural
 */
/**
 * @typedef {{[key: string]: string}} PlainLocaleStringBodyObject
 */
/**
 * @typedef {{
 *   [key: string]: string|PlainNestedLocaleStringBodyObject
 * }} PlainNestedLocaleStringBodyObject
 */
/**
 * @typedef {object} SwitchCaseInfo
 * @property {boolean} [default=false] Whether this conditional is the default
 */
/**
 * Contains the type, the message, and optional info about the switch case.
 * @typedef {[string, string, SwitchCaseInfo?]} SwitchCaseArray
 */
/**
 * @typedef {Record<string, SwitchCaseArray>} SwitchArray
 */
/**
 * @typedef {Record<string, SwitchArray>} SwitchArrays
 */
/**
 * @typedef {object} SwitchCase
 * @property {string} message The locale message with any formatting
 *   place-holders; defaults to use of any single conditional
 * @property {string} [description] A description to add for translators
 */
/**
 * @typedef {Record<string, SwitchCase>} SwitchGroup
 */
/**
 * @typedef {Record<string, SwitchCase|SwitchGroup>} Switch
 */
/**
 * @typedef {Record<string, Switch>} Switches
 */
/**
 * @typedef {object} RichLocaleStringSubObject
 * @property {string} message The locale message with any formatting
 *   place-holders; defaults to use of any single conditional
 * @property {string} [description] A description to add for translators
 * @property {Switches} [switches] Conditionals
 */
/**
 * @typedef {{
 *   [key: string]: RichLocaleStringSubObject
 * }} RichLocaleStringBodyObject
 */
/**
 * @typedef {{
 *   [key: string]: RichLocaleStringSubObject|RichNestedLocaleStringBodyObject
 * }} RichNestedLocaleStringBodyObject
 */
/**
 * Takes a base path and locale and gives a URL.
 * @callback LocaleResolver
 * @param {string} localesBasePath (Trailing slash optional)
 * @param {string} locale BCP-47 language string
 * @returns {string|false} URL of the locale file to be fetched
 */
/**
 * @typedef {[
 *   Date|number, Date|number, (Intl.DateTimeFormatOptions|undefined)?
 * ]} DateRange
 */
/**
 * @typedef {string|string[]|number|Date|DateRange|
 *     Element|Node|SubstitutionCallback|
 *     NumberInfo|PluralInfo|CurrencyInfo|LanguageInfo|ScriptInfo|
 *     DatetimeRangeInfo|DateRangeInfo|RegionInfo|DateTimeInfo|DateInfo|
 *     ListInfo|RelativeTimeInfo
 * } SubstitutionObjectValue
 */
/**
 * @typedef {{
 *   [key: string]: SubstitutionObjectValue
 * }} SubstitutionObject
 */
/**
 * @type {LocaleResolver}
 */
export declare const defaultLocaleResolver: LocaleResolver;
//# sourceMappingURL=defaultLocaleResolver.d.ts.map