// Expects parsedfile, jslink, brettz9.XML.escapeString, brettz9.XML.XMLOutput, hideHiddenFiles
(function(){
    var pattern = /dirGen\.js\?f=.*$/,
        JSpath = jslink.match(pattern)[0],
        output = '<holder xmlns:x="http://www.w3.org/1999/xlink" xml:base="' + jslink.replace(pattern, '') + '">';

    if (_colbrowser.MOZ) {
        try {
            // netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead UniversalXPConnect');
            // var Cc = Components.classes, Ci = Components.interfaces;
            var array = [],
                file = Cc['@mozilla.org/file/local;1']
                                 .createInstance(Ci.nsILocalFile);
            //file.initWithPath("C:\\Program Files");
            file.initWithPath(parsedfile);

            // file is the given directory (nsIFile)
            
            if (file.isDirectory() && !file.isSpecial() && (!hideHiddenFiles || !file.isHidden())) { // && file.isReadable() 
                var entries = file.directoryEntries;
                while(entries.hasMoreElements()) {
                    var entry = entries.getNext();
                    entry.QueryInterface(Ci.nsIFile);
                    if ((!hideHiddenFiles || (!file.isHidden() && entry.leafName.indexOf('.') !== 0)) && (!file.isSpecial())) { // file.isReadable() &&
                        array.push(entry);
                        var elname = entry.isDirectory() ? 'd' : 'f';
                        output +=  '<'+elname+' fileSize="'+entry.fileSize+'"';
                        //if (entry.isDirectory()) { // Could allow files too if solve problem of script trying to act as though they had subfolders
                        output += 
                                          //' x:href="'+ jslink+_colbrowser.OSfile_slash+
                                         ' x:href="'+ JSpath+_colbrowser.OSfile_slash+                                                                          
                                          brettz9.XML.escapeString(entry.leafName)+'"';
                         //}
                        output += ' x:title="'+
                                          brettz9.XML.escapeString(entry.leafName)+'"></'+elname+'>';
                    }
                }
            }
        }
        catch (e) {
            alert(e);
        }
    }
    else if (_colbrowser.MSIE) {
        try {
            // See e.g., http://msdn.microsoft.com/en-us/library/18b41306(VS.85).aspx
            var fso = new ActiveXObject('Scripting.FileSystemObject');

            jslink = jslink.replace(/\\$/, '');
            var currDir = fso.GetFolder(parsedfile);
            // output += currDir.Name + "\n";

            for(var dirs = new Enumerator (currDir.SubFolders); !dirs.atEnd(); dirs.moveNext()) {
                // You have access to each file one at a time
                // in an entire directory tree. Here we grab
                // the files name and add to our message variable 
                /*if (dirs.item().Name.match(/\$/)) {
                      continue;
                }*/  
                try {
                    // See http://msdn.microsoft.com/en-us/library/5tx15443(VS.85).aspx
                    if (hideHiddenFiles && ((dirs.item().attributes & 2) || (dirs.item().attributes & 4) || dirs.item().Name.indexOf('.') === 0)) { // '2' is Hidden; '4' is system', but 2 doesn't catch all hidden files for some reason
                        continue;
                    }
                //                                      alert(dirs.item().Name + dirs.item().size);
                    output +=  '<d x:href="'+JSpath+_colbrowser.OSfile_slash+
                                          brettz9.XML.escapeString(dirs.item().Name)+'" x:title="'+
                                          brettz9.XML.escapeString(dirs.item().Name)+'"></d>'; // fileSize="'+dirs.item().size+'"  // rmvd since was too slow (in IE)
                }
                catch (e) {
                    // alert(dirs.item().Name);
                    continue;
                }
            }

            for(var files = new Enumerator (currDir.Files); !files.atEnd(); files.moveNext()) {
                // You have access to each file one at a time
                // in an entire directory tree. Here we grab
                // the files name and add to our message variable
                if (hideHiddenFiles && (files.item().attributes & 2 || (files.item().attributes & 4) || files.item().Name.indexOf('.') === 0)) { // Skip hidden files unless enabled
                    continue;
                }
                output +=  '<f fileSize="'+files.item().size+'" x:href="'+
                                        JSpath+_colbrowser.OSfile_slash+ brettz9.XML.escapeString(files.item().Name)+'" x:title="'+ brettz9.XML.escapeString(files.item().Name)+'"></f>';
                // Commenting out to avoid clicking link on file (might add back later if get around exceptions)
            }
        }
        catch (e) {
            alert(e);
        }
    }
    output += '</holder>';

    brettz9.XML.XMLOutput = output;
})();
