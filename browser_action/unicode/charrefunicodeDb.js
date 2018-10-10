// TO-DO: make in-place context-menu-activated textbox conversions
// To-do: move at least this file into module, and move as much of uresults.js too
// Todo: Review `fromCharCode`, `charCodeAt`, and `charAt` on whether need modern substitutions

// Todo: Switch to IndexedDB
class UnicodeDB {
    constructor () {
        this.dbConn = null;
        this.dbConnUnihan = null;
    }
    connect (dbfile, key) {
        /*
        // Todo: Reimplement
        if (typeof dbfile === 'string' && key !== 'unihan') {
            const tempfilename = dbfile; // Can have forward slashes for sub-directories
            // The following is what we normally want to use, but here we can put our data within the extension because
            //   it should not be edited by the user anyways (whereby they'd want their data to be retained after an update)
            // dbfile = Cc['@mozilla.org/file/directory_service;1'].getService(Ci.nsIProperties).get('ProfD', Ci.nsILocalFile);
            // dbfile.append(tempfilename);
            const MY_ID = 'charrefunicode@brett.zamir';
            dbfile = FileUtils.getFile(MY_ID, tempfilename);
        } else {
            dbfile = FileUtils.getProfFile(dbfile);
        }
        if (!dbfile.exists()) { // if it doesn't exist, create  // || !file.isDirectory()
            throw new Error(`Database ${dbfile.path} doesn't exist`);
            // dbfile.create(Ci.nsIFile.NORMAL_FILE_TYPE, 0777); // DIRECTORY_TYPE
        }
        const storageService = Cc['@mozilla.org/storage/service;1'].getService(Ci.mozIStorageService);
        if (key === 'unihan') {
            this.dbConnUnihan = storageService.openDatabase(dbfile);
        } else if (key === 'jamo') {
            this.dbJamo = storageService.openDatabase(dbfile);
        } else {
            this.dbConn = storageService.openDatabase(dbfile);
        }
        */
    }
}

export class UnicodeDatabase extends UnicodeDB {
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
    getJamo (code) { // expects decimal string or number
        const codePt = typeof code === 'number' ? Math.round(code).toString(16) : code;
        try {
            const stmt = this.dbConn.dbJamo.createStatement(
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

try {
    charrefunicodeDb.connect('data/Unicode.sqlite');
    charrefunicodeDb.connect('Unihan6.sqlite', 'unihan');
    charrefunicodeDb.connect('data/Jamo.sqlite', 'jamo');
} catch (e) {
}

export default charrefunicodeDb;
