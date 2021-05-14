var EXPORTED_SYMBOLS = [
    'getFile',
    'getProfFile',
    'getExtFile'
];

var Cc = Components.classes;
var Ci = Components.interfaces;


function getFile (ext_id, filename) {
    try {
        // Components.utils['import']("resource://gre/modules/AddonManager.jsm");
        var directoryService = Cc['@mozilla.org/file/directory_service;1'].getService(Ci.nsIProperties);
        var profileFolder = directoryService.get('ProfD', Components.interfaces.nsIFile);
        profileFolder.append('extensions');

        profileFolder.append(ext_id);

        var paths = filename.split(/[\/\\]/);
        for each (var path in paths) {
            profileFolder.append(path);
        }
        return profileFolder;
    }
    catch(e) { // Could formerly do this way (and more comprehensive as allows directed extensions or those not installed in profile dir.)
        var em = Cc['@mozilla.org/extensions/manager;1'].getService(Ci.nsIExtensionManager);
        return em.getInstallLocation(ext_id).getItemFile(ext_id, filename); // 'content/'+
    }
}

function getProfFile (filename) {
    var file = Cc['@mozilla.org/file/directory_service;1'].getService(Ci.nsIProperties).get('ProfD', Ci.nsILocalFile);
    file.append(filename);
    return file;
}

function getExtFile (filename) {
    var ios = Cc['@mozilla.org/network/io-service;1'].getService(Ci.nsIIOService);
    var chrome = ios.newURI(window.location, null, null);
    var cr = Cc['@mozilla.org/chrome/chrome-registry;1'].getService(Ci.nsIChromeRegistry);
    var crURL = cr.convertChromeURL(chrome);
    var profD = Cc['@mozilla.org/file/directory_service;1'].getService(Ci.nsIProperties).get('ProfD', Ci.nsILocalFile);
    var rel = crURL.path.replace(new RegExp('^/'+profD.target.replace(/\\/g, '/')+'/extensions/'), '');
    var idx = rel.indexOf('/');
    var ext_id = rel.substring(0, idx); // e.g., charrefunicode@brett.zamir
    // var relpath = rel.substring(rel.indexOf('/')+1); // e.g., content/sidebar.xul
    return getFile(ext_id, filename); // 'content/'+
}
