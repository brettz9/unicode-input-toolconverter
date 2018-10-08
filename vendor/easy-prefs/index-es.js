// Todo: Move to own library
let appNS, prefDefaults;
export const configurePrefs = ({appNamespace, prefDefaults: _prefDefaults}) => {
    appNS = appNamespace;
    prefDefaults = _prefDefaults;
};

/**
 * Get parsed preference value; returns `Promise` in anticipation of https://domenic.github.io/async-local-storage/
 * @param {string} key Preference key (for Chrome-Compatibility, only `\w+`)
 * @returns {Promise} Resolves to the parsed value (defaulting if necessary)
 */
export const getPref = async (key) => {
    const result = localStorage.getItem(appNS + key);
    return result === null ? prefDefaults.getPrefDefault(key) : JSON.parse(result);
};

/**
 * Set a stringifiable preference value; returns `Promise` in anticipation of https://domenic.github.io/async-local-storage/
 * @param {string} key Preference key (for Chrome-Compatibility, only `\w+`)
 * @param {boolean|number|string} val Stringifiable value
 * @returns {Promise} Resolves to result of setting the item (Not currently in use)
 */
export const setPref = async (key, val) => {
    return localStorage.setItem(appNS + key, JSON.stringify(val));
};

/**
 * Get parsed default value for a preference
 * @param {string} key Preference key
 * @returns {boolean|number|string}
 */
export class PrefDefaults {
    constructor ({_, defaults}) {
        this._ = _;
        this.defaults = defaults;
    }
    async getPrefDefault (key) {
        return this.defaults[key];
    }
}
