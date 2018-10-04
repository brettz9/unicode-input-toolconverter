// Todo: Move to own library, bearing in mind need for path setting or change
/**
Example:

```js
promiseChainForValues(['a', 'b', 'c'], (val) => {
    return new Promise(function (resolve, reject) {
        if (val === 'a') {
            reject(new Error('missing'));
        }
        setTimeout(() => {
            resolve(val);
        }, 100);
    });
});
```
*/
/**
 * The given array will have its items processed in series; if the supplied
 *  callback, when passed the current item, returns a Promise or value that
 *  resolves, that value will be used for the return result of this function
 *  and no other items in the array will continue to be processed; if it rejects,
 *  however, the next item will be processed
 * Accept an array of values to pass to a callback which should return
 *  a promise (or final result value) which resolves to a result or which
 *  rejects so that the next item in the array can be checked in series
 * @param {Array} values Array of values
 * @param {Function} cb Accepts an item of the array as its single argument
 * @returns {Promise} Either resolves to a value derived from an item in the
 *  array or rejects if all items reject
 */
const promiseChainForValues = (values, cb) => {
    return values.reduce(async (p, value) => {
        try {
            return await p; // We'd short-circuit here instead if we could
        } catch (err) {
            const ret = cb(value);
            console.log('r', await ret);
            return ret;
        }
    }, Promise.reject(new Error('Intentionally reject so as to begin checking chain')));
};

/**
 * Get
 * @param {string[]} locales BCP-47 language strings
 * @returns {Promise} Promise that 1) resolves to a function which checks a key
 *  against an object of strings or 2) rejects if no strings are found
 */
export const i18n = async function getLocales ({locales, defaults}) {
    const strings = await promiseChainForValues(locales, async function getLocale (locale) {
        const url = `../_locales/${locale}/messages.json`;
        try {
            return (await fetch(url)).json();
        } catch (err) {
            if (!locale.includes('-')) {
                throw new Error('Locale not available');
            }
            // Try without hyphen
            return getLocale(locale.replace(/-.*$/, ''));
        }
    });
    return (key) => {
        return key in strings && strings[key] && 'message' in strings[key]
            ? strings[key].message
            : typeof defaults === 'function'
                ? defaults(key, strings)
                : defaults === false
                    ? (() => {
                        throw new Error();
                    })()
                    : defaults;
    };
};

export const replaceBrackets = function (_) {
    return function (key, replacements) {
        return _(key).replace(/\{([^}]*)\}/g, (_, bracketValue) => {
            return replacements[bracketValue];
        });
    };
};
