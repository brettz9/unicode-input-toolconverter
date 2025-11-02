// Todo: Review `fromCharCode`, `charCodeAt`, and `charAt` on whether
//   need modern substitutions

/**
 * @typedef {number} PositiveInteger
 */

/* eslint-disable jsdoc/reject-any-type -- Arbitrary */
/**
 * @typedef {any} AnyValue
 */
/* eslint-enable jsdoc/reject-any-type -- Arbitrary */

/**
 *
 */
class UnicodeDB {
  /**
   * @param {object} cfg
   * @param {string} [cfg.name]
   * @param {PositiveInteger} [cfg.version]
   */
  constructor ({name = 'unicode', version = 1} = {}) {
    this.name = name;
    this.version = version;
    this.db = null;
  }

  /**
  * @returns {void}
  */
  close () {
    this.db?.close();
  }

  /**
   * @param {string} storeName
   * @param {string} [key]
   * @returns {Promise<{
   *   codePoint: string, columns?: string[], [key: string]: string
   * }[]>}
   */
  getAll (storeName, key) {
    const tx = /** @type {IDBDatabase} */ (
      this.db
    ).transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);

    const req = store.getAll(key);
    // eslint-disable-next-line promise/avoid-new -- No API
    return new Promise((resolve, reject) => {
      req.addEventListener('success', () => {
        resolve(req.result);
      });

      req.addEventListener('error', () => {
        reject(req.error);
      });
    });
  }

  /* eslint-disable class-methods-use-this -- Abstract */
  /**
   * @abstract
   * @param {AnyValue} cfg
   */
  upgradeneeded (
    // eslint-disable-next-line no-unused-vars -- Needed as base method
    cfg
  ) {
    throw new Error('`UnicodeDB.upgradeneeded` is an abstract method');
  }
  /* eslint-enable class-methods-use-this -- Abstract */

  /**
   * @param {object} [cfg]
   * @param {AnyValue} [cfg.updateUnicodeData]
   * @param {(e: Event) => void} [cfg.versionchange]
   * @returns {Promise<IDBDatabase>}
   */
  connect ({updateUnicodeData, versionchange} = {}) {
    /* eslint-disable promise/avoid-new -- No Promise API */
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(
        this.name, updateUnicodeData ? this.version : undefined
      );
      if (updateUnicodeData) {
        req.addEventListener('upgradeneeded', (e) => {
          const db = /** @type {EventTarget & {result: IDBDatabase}} */ (
            e.target
          )?.result;
          this.db = db;
          this.upgradeneeded({updateUnicodeData});
        });
      }
      req.addEventListener('success', (e) => {
        const db = /** @type {EventTarget & {result: IDBDatabase}} */ (
          e.target
        )?.result;
        this.db = db;
        if (versionchange) {
          this.db.addEventListener('versionchange', (ev) => {
            versionchange(ev);
          });
        }
        resolve(this.db);
      });
      req.addEventListener('error', () => {
        reject(req.error);
      });
      req.addEventListener('blocked', () => {
        reject(new Error('blocked'));
      });
      /* eslint-enable promise/avoid-new -- No Promise API */
    });
  }
}

/**
 *
 */
export class UnihanDatabase extends UnicodeDB {
  /**
   * @param {object} [cfg]
   * @param {PositiveInteger} [cfg.version]
   */
  constructor ({version} = {}) {
    // We create a separate database so updates do not clobber both databases
    super({name: 'unicode-input-toolconverter-Unihan', version});
  }
  /**
  * @param {string} codePoint
  * @throws {Error}
  * @returns {Promise<string[]>}
  */
  getUnicodeFields (codePoint) {
    const tx = /** @type {IDBDatabase} */ (
      this.db
    ).transaction(['Unihan'], 'readonly');
    const store = tx.objectStore('Unihan');

    const request = store.get(codePoint);
    // eslint-disable-next-line promise/avoid-new -- No Promise API
    return new Promise((resolve, reject) => {
      request.addEventListener('success', () => {
        resolve(request.result?.columns);
      });
      request.addEventListener('error', () => {
        reject(request.error);
      });
    });
  }

  /**
   * @param {string} [key]
   * @returns {Promise<{
   *   codePoint: string, columns?: string[], [key: string]: string
   * }[]>}
   */
  getAll (key) {
    return super.getAll('Unihan', key);
  }

  /**
   * @param {AnyValue} cfg
   * @returns {void}
   */
  upgradeneeded (cfg) {
    // eslint-disable-next-line prefer-destructuring -- TS
    const updateUnicodeData =
      /**
       * @type {{
       *   updateUnicodeData: [codePoint: string, ...info: string[]][]
       * }}
       */ (cfg).updateUnicodeData;
    const store = /** @type {IDBDatabase} */ (
      this.db
    ).createObjectStore('Unihan', {
      keyPath: 'codePoint'
    });
    store.createIndex('code-point', 'codePoint', {
      unique: true
    });

    updateUnicodeData.forEach((
      [codePoint, ...codePointInfoRow]
    ) => {
      store.put({
        codePoint,
        columns: codePointInfoRow
      });
    });
  }
}

/**
 *
 */
export class UnicodeDatabase extends UnicodeDB {
  /**
   * @param {object} [cfg]
   * @param {PositiveInteger} [cfg.version]
   */
  constructor ({version} = {}) {
    super({name: 'unicode-input-toolconverter', version});
  }

  /**
   * @param {string} [key]
   * @returns {Promise<{
   *   codePoint: string, columns?: string[], [key: string]: string
   * }[]>}
   */
  getAll (key) {
    return super.getAll('UnicodeData', key);
  }

  /**
   * @param {AnyValue} cfg
   * @returns {void}
   */
  upgradeneeded (cfg) {
    // eslint-disable-next-line prefer-destructuring -- TS
    const updateUnicodeData =
      /**
       * @type {{
       *   updateUnicodeData: [codePoint: string, ...info: string[]][]
       * }}
       */ (cfg).updateUnicodeData;
    const store = /** @type {IDBDatabase} */ (
      this.db
    ).createObjectStore('UnicodeData', {
      keyPath: 'codePoint'
    });
    store.createIndex('code-point', 'codePoint', {
      unique: true
    });
    updateUnicodeData.forEach((codePointInfoRow) => {
      // http://www.unicode.org/reports/tr44/#UnicodeData.txt
      const [
        codePoint, name, generalCategory, canonicalCombiningClass, bidiClass,
        decomposition, numeric6, numeric7, numeric8,
        bidiMirrored, unicode1Name, isoComment,
        simpleUppercaseMapping, simpleLowercaseMapping, simpleTitlecaseMapping
      ] = codePointInfoRow;
      const groups = (
        /<(?<decompositionType>[^>]*)>\s+(?<decompositionMapping>.*)/v
      ).exec(
        decomposition
      )?.groups ?? {};

      const {decompositionType, decompositionMapping} = groups;

      let numericType = 'None';
      if (numeric6) {
        numericType = 'Decimal';
      } else if (numeric7) {
        numericType = 'Digit';
      } else if (numeric8) {
        numericType = 'Numeric';
      }
      const numericValue = numericType ? numeric8 : Number.NaN;

      store.put({
        codePoint, name, generalCategory, canonicalCombiningClass, bidiClass,
        decompositionType, decompositionMapping, numericType, numericValue,
        bidiMirrored, unicode1Name, isoComment,
        simpleUppercaseMapping, simpleLowercaseMapping, simpleTitlecaseMapping
      });
    });
  }

  /**
  * @param {string} codePoint
  * @returns {Promise<{
  *   name: string, unicode1Name: string, [key: string]: string
  * }>}
  */
  getUnicodeFields (codePoint) {
    // const entityInParentheses = '(' + entity + ') ';
    // Todo: Should this not be padded to 6??
    // const currentStartCharCodeUpperCaseHexPadded =
    //   currentStartCharCode.toString(16).toUpperCase().padStart(4, '0');
    const tx = /** @type {IDBDatabase} */ (
      this.db
    ).transaction(['UnicodeData'], 'readonly');
    const store = tx.objectStore('UnicodeData');
    const request = store.get(codePoint);
    // eslint-disable-next-line promise/avoid-new -- No Promise API
    return new Promise((resolve, reject) => {
      request.addEventListener('success', () => {
        if (!request.result) {
          reject(new Error('Unexpected code point'));
          return;
        }
        resolve(request.result);
      });
      request.addEventListener('error', () => {
        reject(request.error);
      });
    });
  }
}

const charrefunicodeDb = new UnicodeDatabase();
/*
const unihanDb = new UnihanDatabase();
*/

export default charrefunicodeDb;
