/*
Copyright 2007, 2008, 2009 Brett Zamir
    This file is part of Unicode Input Tool/Converter.

    Unicode Input Tool/Converter is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Unicode Input Tool/Converter is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with Unicode Input Tool/Converter.  If not, see <http://www.gnu.org/licenses/>.
*/

(function () {

function getExtFile (filename) {
    var ios = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);
    var chrome = ios.newURI(window.location, null, null);
    var cr = Cc['@mozilla.org/chrome/chrome-registry;1'].getService(Ci.nsIChromeRegistry);
    var crURL = cr.convertChromeURL(chrome);
    var profD = Cc['@mozilla.org/file/directory_service;1'].getService(Ci.nsIProperties).get('ProfD', Ci.nsILocalFile);
    var rel = crURL.path.replace(new RegExp('^/'+profD.target.replace(/\\/g, '/')+'/extensions/'), '');
    var idx = rel.indexOf('/');
    var ext_id = rel.substring(0, idx); // e.g., headrchat@headr.com
    // var relpath = rel.substring(rel.indexOf('/')+1); // e.g., content/sidebar.xul
    var em = Cc['@mozilla.org/extensions/manager;1'].getService(Ci.nsIExtensionManager);
    return em.getInstallLocation(ext_id).getItemFile(ext_id, filename); // 'content/'+
}


function file_put_contents (filename, data, charset) { // Fix: allow file to be placed outside of profile directory
    var file = getExtFile(filename); // 'content/'+

    charset = charset ? charset : 'UTF-8'; // Can be any character encoding name that Mozilla supports // Brett: Setting earlier, but even with a different setting, it still seems to save as UTF-8

    if( !file.exists() ) {   // if it doesn't exist, create  // || !file.isDirectory()
        file.create(Ci.nsIFile.NORMAL_FILE_TYPE, 0777); // DIRECTORY_TYPE
    }
    // file.createUnique(Ci.nsIFile.NORMAL_FILE_TYPE, 0664); // for temporary

    var foStream = Cc['@mozilla.org/network/file-output-stream;1'].createInstance(Ci.nsIFileOutputStream);
    foStream.init(file, 0x02 | 0x10, 0664, 0); // use 0x02 | 0x10 to open file for appending.
    // foStream.init(file, 0x02 | 0x08 | 0x20, 0664, 0); // write, create, truncate

    var os = Cc['@mozilla.org/intl/converter-output-stream;1'].createInstance(Ci.nsIConverterOutputStream);
    // This assumes that foStream is the nsIOutputStream you want to write to
    // 0x0000 instead of '?' will produce an exception: http://www.xulplanet.com/references/xpcomref/ifaces/nsIConverterOutputStream.html
    // If charset in xsl:output is ISO-8859-1, the file won't open--if it is GB2312, it will output as UTF-8--seems buggy or?
    os.init(foStream, charset, 0, 0x0000);
    os.writeString(data);
    os.close();
    foStream.close();
}

function file_get_contents (filename, charset) {
    var file = getExtFile(filename);
    charset = (!charset) ? 'UTF-8' : charset;

    // From http://developer.mozilla.org/en/docs/Reading_textual_data
    // First, get and initialize the converter
    var converter = Cc['@mozilla.org/intl/scriptableunicodeconverter'].createInstance(Ci.nsIScriptableUnicodeConverter);
    converter.charset =  charset; // 'UTF-8'; // The character encoding you want, using UTF-8 here

    // This assumes that 'file' is a variable that contains the file you want to read, as an nsIFile
    var fis = Cc['@mozilla.org/network/file-input-stream;1'].createInstance(Ci.nsIFileInputStream);
    fis.init(file, -1, -1, 0);
    var lis = fis.QueryInterface(Ci.nsILineInputStream);
    var lineData = {};
    var cont;
    var lines = '';
    do {
        cont = lis.readLine(lineData);
        var line = converter.ConvertToUnicode(lineData.value);
        // Now you can do something with line
        lines += line+'\n';
    } while (cont);
    fis.close();
    return lines;
}

function importUnihan () {

    /* IMPORTATION CODE (WORKED)*/
    var u = file_get_contents('data/Unihan.txt');
    var pattern = new RegExp('^U\\+([A-F0-9]*)\\t(.*?)\\t(.*)$', 'gm');
    var result, data = {};
    while ((result = pattern.exec(u)) != null) {
        if (!data[result[1]]) {
            data[result[1]] = {};
        }
        if (!data[result[1]][result[2]]) {
            data[result[1]][result[2]] = '';
        }
        data[result[1]][result[2]] += result[3];
    }
    //*/

    /**
    // Get unique column names
    var columnNames = {}, cols = [];
    for (var hex in data) {
            for (var col in data[hex]) {
                if (!columnNames[col]) {
                    columnNames[col] = col;
                    cols.push(col);
                }
            }
    }
    //alert(cols);
    //*/


    /** CONTINUE IMPORATION CODE (WORKED) */
    var table = 'Unihan';
    var sql = 'CREATE TABLE IF NOT EXISTS "Unihan" ("code_pt" , "kCangjie" , "kCantonese" , '+
                    '"kDefinition" , "kHanYu" , "kIRGHanyuDaZidian" , "kIRGKangXi" , "kIRG_GSource" , '+
                    '"kIRG_JSource" , "kIRG_TSource" , "kMandarin" , "kRSUnicode" , "kSemanticVariant" , '+
                    '"kTotalStrokes" , "kCihaiT" , "kIRG_KSource" , "kSBGY" , "kJIS0213" , "kNelson" , '+
                    '"kRSAdobe_Japan1_6" , "kCowles", "kMatthews", "kOtherNumeric", "kPhonetic", "kGSR", '+
                    '"kIRG_KPSource", "kIRG_VSource", "kKPS1", "kFenn", "kFennIndex", "kKarlgren", '+
                    '"kHKSCS", "kIRG_HSource", "kXHC1983", "kMeyerWempe", "kTraditionalVariant", '+
                    '"kVietnamese", "kSpecializedSemanticVariant", "kLau", "kCheungBauer", '+
                    '"kCheungBauerIndex", "kIICore", "kTang", "kZVariant", "kRSKangXi", "kJapaneseKun", '+
                    '"kJapaneseOn", "kSimplifiedVariant", "kKangXi", "kKPS0", "kBigFive", "kCCCII", '+
                    '"kCNS1986", "kCNS1992", "kDaeJaweon", "kEACC", "kFourCornerCode", "kFrequency", '+
                    '"kGB0", "kGB1", "kGradeLevel", "kHDZRadBreak", "kHKGlyph", "kHangul", "kHanyuPinlu", '+
                    '"kIRGDaeJaweon", "kIRGDaiKanwaZiten", "kJis0", "kKSC0", "kKorean", "kMainlandTelegraph", '+
                    '"kMorohashi", "kPrimaryNumeric", "kTaiwanTelegraph", "kXerox", "kGB5", "kJis1", '+
                    '"kPseudoGB1", "kGB3", "kGB8", "kKSC1", "kIBMJapan", "kRSKanWa", "kRSJapanese", '+
                    '"kAccountingNumeric", "kRSKorean", "kGB7", "kIRG_USource", "kCompatibilityVariant")';
    for (var hex in data) {
        var colNames = [], values = [];
        for (var col in data[hex]) {
            values.push(data[hex][col].replace('"', '""'));
            colNames.push(col);
        }
        sql += 'INSERT INTO "'+table+'" ("code_pt", "'+colNames.join('","')+'") VALUES ("'+hex+'", "'+values.join('","')+'");\n';
    }
    //alert(sql);
    file_put_contents('data/newfile.sql', sql);
    //*/
}

// EXPORTS
this.importUnihan = importUnihan;

}());