/**
 * Simplified factory for `SimplePrefsDefaults`
 * @param {Defaults} [defaults]
 * @returns {SimplePrefsDefaults}
 */
export function simplePrefsDefaults(defaults?: Defaults): SimplePrefsDefaults;
/**
 * @typedef {{[key: string]: JSONValue}} Defaults
 */
/**
 * @typedef {null|boolean|number|string} JSONPrimitive
 */
/**
 * @typedef {JSONValue[]} JSONArray
 */
/**
 * @typedef {JSONPrimitive | JSONArray | {
 *   [key in string]: JSONValue
 * }} JSONValue
 */
/**
 * Preferences storage.
 */
export class SimplePrefs {
    /**
     * @param {object} cfg
     * @param {string} [cfg.namespace] Avoid clashes with other apps
     * @param {Defaults} [cfg.defaults]
     * @param {SimplePrefsDefaults} [cfg.prefDefaults]
     */
    constructor(cfg: {
        namespace?: string | undefined;
        defaults?: Defaults | undefined;
        prefDefaults?: SimplePrefsDefaults | undefined;
    });
    /** @type {((e: StorageEvent) => void)[]} */
    listeners: ((e: StorageEvent) => void)[];
    /**
     * @param {object} cfg
     * @param {string} [cfg.namespace] Avoid clashes with other apps
     * @param {Defaults} [cfg.defaults]
     * @param {SimplePrefsDefaults} [cfg.prefDefaults]
     * @returns {void}
     */
    configurePrefs({ namespace, defaults, prefDefaults }: {
        namespace?: string | undefined;
        defaults?: Defaults | undefined;
        prefDefaults?: SimplePrefsDefaults | undefined;
    }): void;
    namespace: string | undefined;
    prefDefaults: SimplePrefsDefaults | undefined;
    getPref(key: string): Promise<JSONValue>;
    setPref(key: string, val: JSONValue): Promise<void>;
    /**
    * @typedef {object} GetPrefSetPref
    * @property {GetPref} getPref
    * @property {SetPref} setPref
    */
    /**
     * Convenience utility to return two main methods `getPref` and
     *   `setPref` bound to the current object.
     * @returns {GetPrefSetPref}
     */
    bind(): {
        getPref: (key: string) => Promise<JSONValue>;
        setPref: (key: string, val: JSONValue) => Promise<void>;
    };
    /**
    * @callback PreferenceCallback
    * @param {StorageEvent} e
    * @returns {void}
    */
    /**
    * @param {string|PreferenceCallback|undefined} key
    * @param {PreferenceCallback} cb
    * @returns {PreferenceCallback}
    */
    listen(key: string | ((e: StorageEvent) => void) | undefined, cb: (e: StorageEvent) => void): (e: StorageEvent) => void;
    /**
     * @param {EventListener} listener
     * @returns {void}
     */
    unlisten(listener: EventListener): void;
}
/**
 * Defaults for SimplePrefs.
 */
export class SimplePrefsDefaults {
    /**
     *
     * @param {{defaults: Defaults}} defaults
     */
    constructor({ defaults }: {
        defaults: Defaults;
    });
    defaults: Defaults;
    /**
     * Get parsed default value for a preference.
     * @param {string} key Preference key
     * @returns {Promise<JSONValue>}
     */
    getPrefDefault(key: string): Promise<JSONValue>;
    /**
     * Set parsed default value for a preference.
     * @param {string} key Preference key
     * @param {JSONValue} value
     * @returns {Promise<JSONValue>} The old value
     */
    setPrefDefault(key: string, value: JSONValue): Promise<JSONValue>;
}
export type Defaults = {
    [key: string]: JSONValue;
};
export type JSONPrimitive = null | boolean | number | string;
export type JSONArray = JSONValue[];
export type JSONValue = JSONPrimitive | JSONArray | { [key in string]: JSONValue; };
//# sourceMappingURL=simple-prefs.d.ts.map