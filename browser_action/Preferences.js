// Todo: Move to own library
let appNS, getPrefDefault;
export const configurePrefs = ({appNamespace, prefDefaultGetter}) => {
    appNS = appNamespace;
    getPrefDefault = prefDefaultGetter;
};

/**
 * Get parsed preference value; returns `Promise` in anticipation of https://domenic.github.io/async-local-storage/
 * @param {string} key Preference key (for Chrome-Compatibility, only `\w+`)
 * @returns {Promise} Resolves to the parsed value (defaulting if necessary)
 */
export const getPref = async (key) => {
    const result = localStorage.getItem(appNS + key);
    return result === null ? getPrefDefault(key) : JSON.parse(result);
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
