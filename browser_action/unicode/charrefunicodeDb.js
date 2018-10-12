// TO-DO: make in-place context-menu-activated textbox conversions
// To-do: move at least this file into module, and move as much of uresults.js too
// Todo: Review `fromCharCode`, `charCodeAt`, and `charAt` on whether need modern substitutions

// Todo: Switch to IndexedDB
class UnicodeDB {
    constructor ({name, version = 1}) {
        Object.assign(this, {name, version});
        this.db = null;
    }
    upgradeneeded () {
        throw new Error('`UnicodeDB.upgradeneeded` is an abstract method');
    }
    connect () {
        // Todo: Complete
        const req = indexedDB.open(this.name, this.version);
        req.addEventListener('upgradeneeded', (e) => {
            const {db} = e.target;
            this.db = db;
            this.upgradeneeded();
        });
        req.addEventListener('success', ({target}) => {
            this.db = target.result;
            this.db.addEventListener('versionchange', () => {});
        });
        req.addEventListener('error', () => {});
        req.addEventListener('blocked', () => {});
    }
}

export class UnihanDatabase extends UnicodeDB {

}

export class UnicodeDatabase extends UnicodeDB {
    constructor ({version} = {}) {
        super({name: 'unicode', version});
    }
    upgradeneeded () {
        this.db.createObjectStore();
    }
    // Todo: Uncomment and implement
    getUnicodeDescription (entity, currentStartCharCode) {
        // const entityInParentheses = '(' + entity + ') ';
        // Todo: Should this not be padded to 6??
        // const currentStartCharCodeUpperCaseHexPadded = currentStartCharCode.toString(16).toUpperCase().padStart(4, '0');
        // Todo:

    }
}

// Todo: Reimplement
export class Jamo extends UnicodeDB {
    constructor ({version} = {}) {
        super({name: 'jamo', version});
    }
    /**
     * @param {number|string} code // Expects decimal string or number
     * @returns {string}
     */
    getJamo (code) {
        const codePt = typeof code === 'number' ? Math.round(code).toString(16) : code;
        try {
            const stmt = this.db.createStatement(
                'SELECT `jamo_short_name` FROM Jamo WHERE `code_pt` = "' + codePt.toUpperCase() + '"'
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
