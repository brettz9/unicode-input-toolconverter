/* eslint-disable no-empty-function -- Not yet finished */
// TO-DO: make in-place context-menu-activated textbox conversions
// To-do: move at least this file into module, and move as much
//   of uresults.js too
// Todo: Review `fromCharCode`, `charCodeAt`, and `charAt` on whether
//   need modern substitutions

// Todo: Switch to IndexedDB

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
   * @param {boolean} [cfg.writable]
   * @returns {void}
   */
  connect ({writable} = {}) {
    // Todo: Complete
    const req = indexedDB.open(this.name, this.version);
    if (writable) {
      req.addEventListener('upgradeneeded', (e) => {
        const {db} = e.target;
        this.db = db;
        this.upgradeneeded();
      });
    }
    req.addEventListener('success', ({target}) => {
      this.db = target.result;
      this.db.addEventListener('versionchange', () => {});
    });
    req.addEventListener('error', () => {});
    req.addEventListener('blocked', () => {});
  }
}

/**
 *
 */
export class UnihanDatabase extends UnicodeDB {
  /* eslint-disable class-methods-use-this -- Abstract */
  /**
  * @param {string} searchValue
  * @throws {Error}
  * @returns {string[]}
  */
  getUnicodeFields (searchValue) {
    const results = [];
    // const stmt = charrefunicodeDb.dbConnUnihan.createStatement(
    //   'SELECT * FROM Unihan WHERE code_pt = "' + khextemp + '"'
    // );
    if (!results) {
      throw new Error('Not present');
    }
    return results;
  }
  /* eslint-enable class-methods-use-this -- Abstract */
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
    super({name: 'unicode', version});
  }

  /**
   * @returns {void}
   */
  upgradeneeded () {
    this.db.createObjectStore();
  }

  // Todo: Uncomment and implement
  /* eslint-disable class-methods-use-this -- Abstract */
  /**
   * @param {string} entity
   * @param {PositiveInteger} currentStartCharCode
   * @returns {void}
   */
  getUnicodeDescription (entity, currentStartCharCode) {
    // const entityInParentheses = '(' + entity + ') ';
    // Todo: Should this not be padded to 6??
    // const currentStartCharCodeUpperCaseHexPadded =
    //   currentStartCharCode.toString(16).toUpperCase().padStart(4, '0');
    // Todo:
  }

  /**
  * @param {string} searchValue
  * @returns {string[]}
  */
  getUnicodeFields (searchValue) {
    const results = [];
    /*
    const statement = charrefunicodeDb.dbConn.createStatement(
      'SELECT * FROM Unicode WHERE Code_Point = "' + searchValue + '"'
    );
    */
    // $('#displayUnicodeDesc').value = _('retrieving_description');
    return results;
  }
  /* eslint-enable class-methods-use-this -- Abstract */
}

// Todo: Reimplement
/**
 *
 */
export class Jamo extends UnicodeDB {
  /**
   * @param {PlainObject} [cfg={}]
   * @param {PositiveInteger} cfg.version
   */
  constructor ({version} = {}) {
    super({name: 'jamo', version});
  }

  /**
   * @param {number|string} code // Expects decimal string or number
   * @returns {string}
   */
  getJamo (code) {
    const codePt = typeof code === 'number'
      ? Math.round(code).toString(16)
      : code;
    try {
      const stmt = this.db.createStatement(
        'SELECT `jamo_short_name` FROM Jamo WHERE `code_pt` = "' +
          codePt.toUpperCase() + '"'
      );
      stmt.executeStep();
      return stmt.getUTF8String(0);
    } catch (e) {
      throw new Error(codePt.toUpperCase() + e);
    }
  }
}

const charrefunicodeDb = new UnicodeDatabase();
/*
const unihanDb = new UnihanDatabase();
*/

export default charrefunicodeDb;
