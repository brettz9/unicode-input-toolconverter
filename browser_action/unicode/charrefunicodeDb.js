// Todo: Review `fromCharCode`, `charCodeAt`, and `charAt` on whether
//   need modern substitutions

/**
 *
 */
class UnicodeDB {
  /**
   * @param {PlainObject} cfg
   * @param {string} cfg.name
   * @param {PositiveInteger} [cfg.version=1]
   */
  constructor ({name = 'unicode', version = 1} = {}) {
    Object.assign(this, {name, version});
    this.db = null;
  }

  /**
  * @returns {void}
  */
  close () {
    this.db.close();
  }

  /**
   * @param {string} storeName
   * @param {string} key
   * @returns {Promise<object>}
   */
  getAll (storeName, key) {
    const tx = this.db.transaction(storeName, 'readonly');
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
   */
  upgradeneeded () {
    throw new Error('`UnicodeDB.upgradeneeded` is an abstract method');
  }
  /* eslint-enable class-methods-use-this -- Abstract */

  /**
   * @param {PlainObject} [cfg={}]
   * @param {JSON} [cfg.updateUnicodeData]
   * @param {GenericFunction} [cfg.versionchange]
   * @returns {Promise<void>}
   */
  connect ({updateUnicodeData, versionchange} = {}) {
    /* eslint-disable promise/avoid-new -- No Promise API */
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(
        this.name, updateUnicodeData ? this.version : undefined
      );
      if (updateUnicodeData) {
        req.addEventListener('upgradeneeded', (e) => {
          const {result: db} = e.target;
          this.db = db;
          this.upgradeneeded({updateUnicodeData});
        });
      }
      req.addEventListener('success', ({target}) => {
        this.db = target.result;
        if (versionchange) {
          this.db.addEventListener('versionchange', (ev) => {
            versionchange(ev);
          });
        }
        resolve(this.db);
      });
      req.addEventListener('error', (ev) => {
        reject(req.error);
      });
      req.addEventListener('blocked', (ev) => {
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
   * @param {PlainObject} cfg
   * @param {PositiveInteger} cfg.version
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
    const tx = this.db.transaction(['Unihan'], 'readonly');
    const store = tx.objectStore('Unihan');

    const request = store.get(codePoint);
    // eslint-disable-next-line promise/avoid-new -- No Promise API
    return new Promise((resolve, reject) => {
      request.addEventListener('success', () => {
        resolve(request.result?.columns);
      });
      request.addEventListener('error', (ev) => {
        reject(request.error);
      });
    });
  }

  /**
   * @param {string} key
   * @returns {Promise<object>}
   */
  getAll (key) {
    return super.getAll('Unihan', key);
  }

  /**
   * @param {JSON} updateUnicodeData
   * @returns {void}
   */
  upgradeneeded ({updateUnicodeData}) {
    const store = this.db.createObjectStore('Unihan', {
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
   * @param {PlainObject} cfg
   * @param {PositiveInteger} cfg.version
   */
  constructor ({version} = {}) {
    super({name: 'unicode-input-toolconverter', version});
  }

  /**
   * @param {string} key
   * @returns {Promise<object>}
   */
  getAll (key) {
    return super.getAll('UnicodeData', key);
  }

  /**
   * @param {JSON} updateUnicodeData
   * @returns {void}
   */
  upgradeneeded ({updateUnicodeData}) {
    const store = this.db.createObjectStore('UnicodeData', {
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
      const {groups: {
        decompositionType,
        decompositionMapping
      }} = (
        /<(?<decompositionType>[^>]*)>\s+(?<decompositionMapping>.*)/u
      ).exec(
        decomposition
      ) ?? {groups: {}};
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
  * @returns {Promise<string[]>}
  */
  getUnicodeFields (codePoint) {
    // const entityInParentheses = '(' + entity + ') ';
    // Todo: Should this not be padded to 6??
    // const currentStartCharCodeUpperCaseHexPadded =
    //   currentStartCharCode.toString(16).toUpperCase().padStart(4, '0');
    const tx = this.db.transaction(['UnicodeData'], 'readonly');
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
      request.addEventListener('error', (ev) => {
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
