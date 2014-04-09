/*global HTTP, Keymap, Tooltip, XML */
// Check JS with jslint.com

//TODO: Change away from non-free O'Reilly code

// See references marked 'fix:' and in the other files written by originally by others, see references to 'Brett'
// "Deprecated comment" means I want to keep the comment in in case problems turn up with my having commented the 
//     code out (but they should be removed eventually)
// Might use alert(document.activeElement); for getting element for adding, deleting, modifying items but works in FF3 only
// Do class hierarchy for different types of column browsers (XML/JSON, file browsing/generic, etc.)
// See note in the tooltip-mouse.js file on the need to let the column browser work with static (default) positioning
//    as well as absolute, fixed, and relative positioning
// Fix: make positioning of input box perfect within scroll area
// Could make processing instructions broken up by name, pseudo-attribute names and pseudo-attribute values
// Fix: Caching requests in http.js file don't seem to work always
// Fix: change "rendered" metadata behavior not to imbed directly (as can interfere with DOCTYPE, etc.) but put as iframe
// The code might be sped up quite a bit with the finding of all processing instructions and comments removed, but 
//   keeping it in now for testing
// Fix rendering meta section to not show nodes which an XPath expression for an XLink or XInclude should avoid (but show the ones it should)

// IE BUGS
// Fix: xhtml and svg extensioned files don't work as XML in IE but pure xml works fine
// MOV code not working in IE
// To get local permissions to work from file:// to external sites, in IE go to: Tools->Internet Options->Security->Internet-> ( -> ) Miscellaneous -> Access data sources across domains


// Can use a different _MetaInfoStrategy (requires , e.g.,:
//    brettz9.mycolbrowser1 = new brettz9.colbrowser('<root><dog/><cat/><fred>adfdfds</fred></root>', myMetaInfoStrategy);
// Can use a different _ColDisplayStrategy too


var brettz9 = function () {

    // Class methods (but making private instead of attaching directly to _MetaInfoStrategy (for _getNodeInfo()) or _colbrowser. (like "_colbrowser.getNodeInfo"); also allows shorter reference

    var that = this;

    /**
     *@constructor
     */
    function _ColDisplayStrategy () {
    }
    _ColDisplayStrategy.prototype.addColumnEntryName = function (appendEl, colElement) {
            // Fix: Make the following (and that under 'title' (which should be tooltip) as private functions of this class (but only nodeName on by default; let its constructor and methods take arguments, etc., for attribute name)
            /* The following could add by attribute (let user opt for attribute if present (or text content) or make required and with optional namespace)
        if (thisitem.hasAttribute('abc')) {
            option.innerHTML = thisitem.getAttribute('abc');
                    }
        else
        */
           /* Works for showing all immediate text content
           var textoutput = '';
           var nodes = thisitem.childNodes;
        for (j = 0; j < nodes.length; j++) {
            if (nodes[j].nodeType === 3) { // TEXT_NODE
                if (!nodes[j].nodeValue.match(/^\s+$/)) {
                    textoutput += brettz9.XML.escapeString(nodes[j].nodeValue);
                }
            }
        }
        
                    if (textoutput) {
            option.innerHTML = textoutput;
            option.setAttribute('title', textoutput); // Could also put as tooltip
                    }
        else
        */
            appendEl.innerHTML = colElement.nodeName;
    }
    /**
     * Might do a tooltip that was JavaScript based (e.g., so Firefox could show tooltip in 2d plane)
     */
    _ColDisplayStrategy.prototype.addColumnEntryTitle = function (appendEl, colElement) {
            //var colElementTextContent = _colbrowser.MSIE ? colElement.text : colElement.textContent;
            // appendEl.title = colElementTextContent;
            return null;
    }
        

    // A UTILITY FUNCTION FOR POPULATE INFO METHODS
    function _getNodeInfo (nodes, spanclass) { // Builds meta info display for a node
        var commentsproc = ''; // Make sure it has something to overwrite as well for appending
        if (spanclass === undefined) {
            spanclass = 'colbrows_characteristic';
        }
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i]) { // Not sure why this would be blank, but it was
                switch (nodes[i].nodeType) {
                    case 1: // ELEMENT_NODE
                    // Ignore
                        break;
                    /*/
                    case 2: // ATTRIBUTE_NODE
                    break;
                    */
                    case 3: // TEXT_NODE
                        if (!nodes[i].nodeValue.match(/^\s+$/) && 1) {
                            commentsproc += '<span class="'+spanclass+'">Text:<\/span> '+brettz9.XML.escapeString(nodes[i].nodeValue)+'<br />';
                        }
                        break;
                    case 4: // CDATA_SECTION_NODE
                        commentsproc += '<span class="'+spanclass+'">CDATA section:<\/span> '+brettz9.XML.escapeString(nodes[i].nodeValue)+'<br />';
                        break;
                    /* These are already resolved by this time in FF's DOM
                    case 5: // ENTITY_REFERENCE_NODE
                        // alert('Entity: '+nodes[i].nodeName);
                        // Also cycle child nodes to get replacement text
                        break;
                    */
                    /* These are just added here if we need them later; but these would occur at a higher order level
                    case 6: // ENTITY_NODE
                        break;
                    */
                    case 7: // PROCESSING_INSTRUCTION_NODE
                        commentsproc += '<span class="'+spanclass+'">Proc Inst:<\/span> &lt;?'+nodes[i].nodeName +' '+ nodes[i].nodeValue+'?&gt;<br />';
                        break;
                    case 8: // COMMENT_NODE
                        commentsproc += '<span class="'+spanclass+'">Comment:<\/span> '+nodes[i].nodeValue+'<br />';
                        break;
                    /*
                    case 9: // DOCUMENT_NODE
                        break;
                    */
                    case 10: // DOCUMENT_TYPE_NODE
                        // Just ignore
                        break;
                    /*
                    case 11: // DOCUMENT_FRAGMENT_NODE
                        break;
                    case 12: // NOTATION_NODE
                        break;
                    */
                    default:
                        throw 'Unexpected element: '+nodes[i].nodeType;
                }
            }
        }
        return commentsproc;
    }
    
        /**
         *@constructor
         */
    function _MetaInfoStrategy (defaultXmlString) {
        // Constructor
//        this.xmlstring = defaultXmlString;
        }
    _MetaInfoStrategy.prototype.populateMetaInfo = function (thisitem) {
        if (!thisitem) {
            return;
        }
                

        // ATTRIBUTES OF NODE
        var attdisplay = '';
        if (thisitem.attributes) {
            var attrs = thisitem.attributes;
            if (attrs.length > 0) {
                attdisplay += '<table class="colbrows_att"><th class="colbrows_att">Name<\/th><th class="colbrows_att">Value<\/th>';
                for (var i = 0; i < attrs.length; i++) {
                    attdisplay += "<tr class='colbrows_att'><td class='colbrows_attrname'>"+attrs[i].nodeName+"<\/td>";
                    attdisplay += "<td class='colbrows_attrval'>"+brettz9.XML.escapeString(attrs[i].nodeValue)+"<\/td><\/tr>";
                }
                attdisplay += '<\/table>';
            }
        }

        var colbrows_attributes = document.getElementById('colbrows_attributes');
        colbrows_attributes.innerHTML = attdisplay;

        // FULL PLAIN TEXT CONTENT OF NODE
        var colbrows_text = document.getElementById('colbrows_text');
        var thisitemTextContent = _colbrowser.MSIE ? thisitem.text : thisitem.textContent;
        
        colbrows_text.innerHTML = '<textarea rows="5" cols="40">'+brettz9.XML.escapeString(thisitemTextContent)+'<\/textarea>';

        // Fix: report bug: Note that FF seems to mistakenly escape gt signs within attributes when serializing
        var renderedXML = XML.serialize(thisitem);


        // NODE'S FULL ESCAPED CONTENT (I.E., AS TEXT)
        var colbrows_textchild = document.getElementById('colbrows_textchild');
        colbrows_textchild.innerHTML = '<textarea rows="5" cols="40">'+brettz9.XML.escapeString(renderedXML)+'<\/textarea>';

        // NODE'S FULL UNESCAPED CONTENT (I.E., RENDERED)
        var colbrows_rendered = document.getElementById('colbrows_rendered');
        colbrows_rendered.innerHTML = renderedXML;

        // COMMENTS, PROCESSING INSTRUCTIONS, TEXT, AND CDATA WITHIN JUST THIS NODE
        var children = thisitem.childNodes;
        var commentsProcTextCdata = _getNodeInfo(children);
        var colbrows_commentsprocinst = document.getElementById('colbrows_commentsprocinst');
        colbrows_commentsprocinst.innerHTML = commentsProcTextCdata;
    };
    
    _MetaInfoStrategy.prototype.populateDocInfo = function (xml) {
        var docel = xml.documentElement ? xml.documentElement : xml.ownerDocument.documentElement; // Necessary for root node data (and what is before/after root)

        var colbrows_doc = document.getElementById('colbrows_document');

        
        // ROOT NODE AND DOCTYPE DATA
        colbrows_doc.innerHTML = '<span class="colbrows_characteristic">Root node:<\/span> '+docel.nodeName+', <span class="colbrows_rootns">Namespace<\/span>: '+docel.namespaceURI+'<br />'+ /* (xml.doctype)?xml.doctype.name */
            '<span class="colbrows_characteristic">Internal subset:<\/span> '+(xml.doctype ? brettz9.XML.escapeString(xml.doctype.internalSubset) : 'none')+'<br />'+
            '<span class="colbrows_characteristic">Public ID:<\/span> '+(xml.doctype ? brettz9.XML.escapeString(xml.doctype.publicId) : 'none') + '<br />'+
            '<span class="colbrows_characteristic">System ID:<\/span> '+(xml.doctype ? brettz9.XML.escapeString(xml.doctype.systemId) : 'none') + '<br />';


        // NODES BEFORE AND AFTER THE ROOT
        var nodedata;
        var i=0;
        var rootprevtemp = docel;
        var rootposttemp = docel;
        var rootpre = [];
        var rootpost = [];
        while (rootprevtemp) {
            rootpre[i] = rootprevtemp.previousSibling;
            i++;
            rootprevtemp = rootprevtemp.previousSibling;
        }

        rootpre = brettz9.PHP.array_reverse(rootpre);

        colbrows_doc.innerHTML += '<span class="colbrows_preroot">Before the root<\/span><br />';
        colbrows_doc.innerHTML += _getNodeInfo(rootpre, 'colbrows_prepostnodes');

        i=0;
        while (rootposttemp) {
            rootpost[i] = rootposttemp.nextSibling;
            i++;
            rootposttemp = rootposttemp.nextSibling;
        }
        colbrows_doc.innerHTML += '<span class="colbrows_postroot">After the root<\/span><br />';
        colbrows_doc.innerHTML += _getNodeInfo(rootpost, 'colbrows_prepostnodes');

        // UNIMPLEMENTED FEATURES
        // alert(document.domConfig); // Not implemented
        // alert(document.schemaTypeInfo); // 'undefined''
        //alert(document.setUserData()); // Not enough arguments
        //alert(DOMLocator); // Used by error // is not defined error

        // ADDITIONAL DOCUMENT METADATA FEATURES
        /**
        // From http://www.w3.org/TR/DOM-Level-2-Core/introduction.html#ID-Conformance for others
        var DOMFeatures = ['XML', 'HTML', 'Core', 'Views', 'StyleSheets', 'CSS', 'CSS2', 'Events', 'UIEvents', 'MouseEvents', 'MutationEvents', 'HTMLEvents', 'Range', 'Traversal'];
        for (var j=1; j <= 2; j++) {
            for (i=0; i < DOMFeatures.length; i++) {
                colbrows_doc.innerHTML += DOMFeatures[i]+" Lev. "+j+": ";
                colbrows_doc.innerHTML += document.implementation.hasFeature(DOMFeatures[i], j+".0");
                colbrows_doc.innerHTML += '<br />';
            }
        }
        */

        // NOT SUPPORTED:
        /*
        // ENTITIES
        colbrows_doc.innerHTML += '<span class="colbrows_characteristic">Entities:<\/span> ';
        for (i=0; i < xml.doctype.entities.length; i++) {
            colbrows_doc.innerHTML += xml.doctype.entities.item[i];
            colbrows_doc.innerHTML += '<br />';
        }
        // NOTATIONS
        colbrows_doc.innerHTML += '<span class="colbrows_characteristic">Notations:<\/span> ';
        for (i=0; i < xml.doctype.notations.length; i++) {
            colbrows_doc.innerHTML += xml.doctype.notations.item[i];
        }
        colbrows_doc.innerHTML += '<br />';
        */

        
        // ALL PROCESSING INSTRUCTIONS IN THE DOCUMENT
        var colbrows_procinsts = document.getElementById('colbrows_procinsts');
        // Proc. inst's and comments are not supposed to have namespaces: http://www.w3.org/TR/REC-xml-names/#Conformance
        var allprocinsts = XML.getNodes(xml, '//processing-instruction()', null, xml);

        var procinsts = '';
        for (i = 0; i < allprocinsts.length; i++) {
            procinsts += '&lt;?'+allprocinsts[i].nodeName+' '+allprocinsts[i].nodeValue+'?&gt;\n';
        }
        colbrows_procinsts.innerHTML = '<textarea rows="5" cols="40">'+procinsts+'<\/textarea>';

         // ALL COMMENTS IN THE DOCUMENT
        var colbrows_comments = document.getElementById('colbrows_comments');
        var allcomments = XML.getNodes(xml, '//comment()', null, xml);
        
        var comments = '';
        for (i = 0; i < allcomments.length; i++) {
            comments += '&lt;!--'+allcomments[0].nodeValue+'--&gt;\n';
        }
        colbrows_comments.innerHTML = '<textarea rows="5" cols="40">'+comments+'<\/textarea>';
    };
    _MetaInfoStrategy.prototype.populateAllInfo = function (targvalue, URLtoXMLDoc) {
        if (!targvalue) {
            return; // avoid if one has deleted all
        }
                
        var pattern = _colbrowser.XPathPlus;
        var doc = targvalue.match(pattern);
                var xml;
                if (doc) {
                        var docFileXLink = doc[1];
                        var fileXLinkAndXPath = doc[3]+(doc[4]?doc[4]:'');
                        var currentXPath = doc[6];
                        var fileXLink = doc[3];
                }

        if (doc && fileXLink) {
            if (fileXLink.match(/^this\./)) { // If it is a string stored locally
                                xml = URLtoXMLDoc[docFileXLink];
            }
            else if (URLtoXMLDoc[fileXLinkAndXPath]) {
                xml = URLtoXMLDoc[fileXLinkAndXPath]; // Grab XML in 'cache'/memory
            }
            targvalue = currentXPath;
        }

        targvalue = (targvalue === '') ? '/*' : targvalue;

        // var nsResolver = document.createNSResolver((xml.ownerDocument === null)?xml.documentElement:contextNode.ownerDocument.documentElement);
        var thislevel = XML.getNodes(xml, targvalue, null, xml);
        var thisitem = thislevel[0];
                
        this.populateMetaInfo(thisitem);

        this.populateDocInfo(xml); // Need to repopulate since
    };


        
        /**
         *@constructor
    * Private method to become public when returned
    * Advantage of being embedded here (though less modular and requires return code) is access to private functions above throughout even instance classes
        */
    function _colbrowser (/*optional*/ defaultXml, /*optional*/ UserMetaInfoStrat, /*optional*/ ColDisplayStrat) { // Fix: define this constructor to set some of the following values
        // Private should come first since nested should be first (though might be preced by 'var that = this;' if want access to instance vars'
        // See http://www.crockford.com/javascript/private.html

        // Should be private instance methods (require 'this')
        // Instance properties (if want any of these private, could declare getters/setters: JDG, p. 163 (using priv. methods; instance methods couldn't otherwise reach THESE private members); good for allowing redefinitions and extra processing)
        // Could compartmentalize the following into private functions with 'this' access (via 'that')'
        
        // INITIALIZE TRACKING VARS
        this.idCounter = 0;
        this.tabIndex = true;

        // DEFAULT CLASS NAME AFFIXES
        this.colbrows_prfx = 'colbrows_'; // Identify the column for internal use
                this.colbrows_suffix = 'colbrowser';
        this.css_prfx = 'colbrows_'; // Create the columns' class (for use with CSS); DIsabling this makes a very interesting wrapping column browser!
                
        
        // DEFAULT COLBROWSER STYLING
        this.colbrows_style_top = '50px';
        this.colbrows_style_left = '60px';
        this.colbrows_style_height = '250px';
        this.colbrows_style_width = '640px'; /* Should be somewhat larger than a multiple of the select widths to show new column */
        this.colbrows_style_position = 'relative';
        this.colbrows_style_overflow = 'auto'; // Can turn this off to allow the column to go beyond a predefined area

        // DEFAULT COLUMN STYLING
        this.select_size = '10';
        this.select_style_top = '80px';
        this.select_style_width = '200px';
        this.select_style_left = 0;
        this.select_start_selindex = 0;
                
                // REGULAR EXPRESSIONS FOR MEDIA FILES
                // These could be class methods but still might change per object
                this.pattern_img = /(.*\.js)(\?.*\.(jpg|jpeg|png|gif|bmp|ico))$/i;
                this.pattern_iframe = new RegExp ('(.*\\.js)(\\?.*\\.(html|htm|dhtml|svg|xml|xul|rdf'+(!this.MSIE ? '|xhtml':'')+'))$', 'i');
                this.pattern_text = /(.*\.js)(\?.*\.(txt|rtf|js|css|php|dtd|url|lrc|properties|htaccess|xsl))$/i;
                this.pattern_obj = /(.*\.js)(\?.*\.(mov))$/i;
                this.pattern_mp3 = /(.*\.js)(\?.*\.(mp3))$/i; 
                
        
                if (defaultXml === '' || defaultXml === null) {
                        defaultXml = undefined;
                }
        // DEFAULT XML DOCUMENT PASSED AS ARGUMENT OR SAMPLE IF NONE PRESENT
        switch (typeof defaultXml) {
            case 'undefined':
                    this.xmlstring = _colbrowser.sampleXml;
                    break;
            case 'string':
                this.xmlstring = defaultXml;
                break;
            case 'object':
                this.xmlstring = XML.parse(defaultXml);
                break;
            default:
                this.xmlstring = _colbrowser.sampleXml;
                break;
        }
                
        // Privileged methods (can access private and be called from public/outside); can
        //    be deleted or replaced but not alter or get its "secrets" (can get the declaration too, though not a instance variable inside)
        /* Works but not necessary (see setColbrowserStyle private method below)
        var that = this; // "that" actually doesn't seem that it needs to be referenced inside here for some reason'
        this.setColbrowserStyle = function (colbrows){
            // SET COLUMN BROWSER'S INITIAL STYLES
            colbrows.style.height = this.colbrows_style_height;
            colbrows.style.width = this.colbrows_style_width;
            colbrows.style.top = this.colbrows_style_top;
            colbrows.style.left = this.colbrows_style_left;
            colbrows.style.position = this.colbrows_style_position;
            colbrows.style.overflow = this.colbrows_style_overflow;
        }
        */
        this.origxmlstring = this.xmlstring; // Store if want to use for something (but doesn't resolve XInclude)
        // InfoStrategy Interface defined outside, but before instantiation here
                
       if (brettz9.JSClassUtil.classHasInterface(UserMetaInfoStrat, 'InfoStrategy')) { // If user submits valid interface, instantiate
            this.InfoStrategy = new UserMetaInfoStrat(this.xmlstring);
       }
       else {
            this.InfoStrategy = new _MetaInfoStrategy(this.xmlstring); // If user doesn't submit valid interface, create sample'
        }
        if (brettz9.JSClassUtil.classHasInterface(ColDisplayStrat, 'ColDisplayStrategy')) {
            this.colDisplayStrategy = new ColDisplayStrat();
        }
        else {
            this.colDisplayStrategy = new _ColDisplayStrategy();
        }                                
    }

    // Instance methods (changeable across instances)

    // To become public instance method
    _colbrowser.prototype.init = function (e, 
        /* boolean; set to true if want to allow an earlier colBrowser to pick up the focus*/ noColViewHandlers) { // Can refer to onload event object
        // Fix: Could have these specified via arguments
        
        var that = this; // If want private methods without access to instance methods/members, put those methods above this line
        
        function _setColbrowserStyle (colbrows) { // add private instance-aware function here just for compartmentalization; better than as privileged method since not needed publicly, though could just remove from function
            colbrows.style.height = that.colbrows_style_height;
            colbrows.style.width = that.colbrows_style_width;
            colbrows.style.top = that.colbrows_style_top;
            colbrows.style.left = that.colbrows_style_left;
            colbrows.style.position = that.colbrows_style_position;
            colbrows.style.overflow = that.colbrows_style_overflow;
        }

        // STORE INITIAL OBJECT VALUES (POSSIBLY ALTERED BY USER) TO BE ABLE TO RESET BACK TO LATER
        this.select_style_left_orig = this.select_style_left;
        this.idCounter_orig = this.idCounter;

        // RESOLVE XINCLUDES
        // Fix: Make this optional?
        this.xmlstring = XML.serialize(brettz9.DOM.resolveXIncludes(XML.parse(this.xmlstring)));
        
        this.URLtoXMLDoc = {'show^embed^doc^this.xmlstring^' : XML.parse(this.xmlstring)};
        // RESET THE CACHE WHEN THE USER CLICKS ON THE "Hide Hidden Files?" CHECKBOX, SO NEW VIEW WILL BE A
        //   VAILABLE AFTER LEAVING CURRENT VIEW
        function resetXMLCache () {
            that.URLtoXMLDoc = {'show^embed^doc^this.xmlstring^' : XML.parse(that.xmlstring)};
        }
        brettz9.DOM.addEvent('colbrowser_hide_hidden_files', 'click', resetXMLCache, false);

        // INCREMENT TOTAL COLBROWSER COUNT (E.G., FOR TABINDEX)
        _colbrowser.colbrowsCount++;

        // SET COLUMN BROWSER STYLES
        // Fix: could give a means to alter these styles and register the changes after initialization? (probably not useful though)
        var colbrows = document.getElementById(this.colbrows_prfx+this.colbrows_suffix);
        //this.setColbrowserStyle(colbrows); // Call privileged method (method content could be added here, but cleaner this way)
        _setColbrowserStyle(colbrows); // Call private method but which has access to 'this' instance variables
        
        // "GO TO COLUMN VIEW" BUTTON
        var colbrows_colview = document.getElementById('colbrows_colview');
        // Note that if multiple column browsers are used, a new button with the right id must be added to the HTML (Fix: do this dynamically?)
        function _goToColumnView (e) { // Use 'e'?'
            var count = 1,
                sel = document.getElementById(that.colbrows_prfx+count); // Go to first column
                        
            while(document.getElementById(that.colbrows_prfx+ (++count))) {
                sel = document.getElementById(that.colbrows_prfx+(count-1));
            }
                        
            if (sel.selectedIndex === -1 ||
                    (_colbrowser.MOZ &&
                        sel.selectedIndex === (sel.options.length-1)
                    )
                ) { // If none already selected or in Firefox and last (hidden) item selected, set to the preferred item (first by default)
                sel.selectedIndex = that.select_start_selindex;
            }
            sel.focus();
        }
        if (!noColViewHandlers) {
            brettz9.DOM.addEvent(colbrows_colview, 'click', _goToColumnView);
            brettz9.DOM.addEvent(colbrows_colview, 'keypress', _goToColumnView);
        }

        // CLICK ANYWHERE TO GET OFF OF A RENAME INPUT BOX
        // Allow user to click away from a generated input area without committing changes (by keyboard, one can click to undo(s) and then hit return)
        function _clickOffInputBox (e) { // event doesn't matter, so could drop 'e''
            var inputarea = Tooltip.tooltip.tooltip;
            if (inputarea.style.visibility === 'visible') {
                if (inputarea.parentNode) {
                    inputarea.parentNode.removeChild(inputarea); // Remove the input box
                }
            }
//                        _colbrowser.currFocus.focus(); // Doesn't seem to help in IE // Causes problems with textbox
        }
        brettz9.DOM.addEvent(document, 'click', _clickOffInputBox);


        // UPDATE COLUMN BROWSER WITH CHANGED XML TEXTBOX CONTENTS
        function _updateColbrowserFromXMLTextBox (e) {
            var targ = _colbrowser.MSIE ? e.srcElement : e.target;
            that.xmlstring = targ.value;
            while (colbrows.childNodes.length > 0) {
                colbrows.removeChild(colbrows.firstChild);
            }
            that.select_style_left = that.select_style_left_orig;
            that.idCounter = that.idCounter_orig;
            that.URLtoXMLDoc = {'show^embed^doc^this.xmlstring^' : XML.parse(that.xmlstring)};
            that._buildCol(colbrows, false, 'show^embed^doc^this.xmlstring^', targ.value); // Start with the root
            colbrows.firstChild.selectedIndex = 0; // this.select_start_selindex; // Since user is changing the contents, we can't assume the user wants the starting value (it might not even have that column)'
            colbrows.firstChild.focus(); // If user is changing, we can assume they want focus
        }
        brettz9.DOM.addEvent(
            document.getElementById('colbrows_xmldocbox'),
            'change',
            _updateColbrowserFromXMLTextBox
        );


        // FIX: Make these variable, so multiple newitems could be created depending on the column browser (do via static incrementor?)
        // CREATE NEW ELEMENT
        // Options for elements to create could ideally be available as dynamically-created ones based on the parsing of a DTD/schema
        function _newItem (e) {
            // Fix: !!!! creating new element shouldn't add hierarchy within it!
            // other todos: port newItem and deleteItem? for key command;
            // button for alter name;
            // reserialize and post

            var optval, targ = _colbrowser.MSIE ? e.srcElement : e.target;
            switch (targ.nodeName.toLowerCase()) {
                case 'option':
                    optval = targ.value; // 'dir';
                    break;
                case 'input': // i.e., if a button
                    var newitem = document.getElementById('newitem');
                    optval = newitem.options[newitem.selectedIndex].value; // 'dir';
                    break;
                default :
                    throw('Unexpected element');
            }

            // Start whole new document if nothing left since deleted everything (but not more than one root!)
            if (!document.getElementById(_colbrowser.currFocus.id)) { // Element doesn't even exist
                that.xmlstring = '<'+optval+'></'+optval+'>';
                try {
                    that._buildCol(colbrows, false, 'show^embed^doc^this.xmlstring^');                                        
                }
                catch (e) { 
                    alert(e.message?e.message:e);
                }
            }
            if (_colbrowser.currFocus.id.match(/_1$/)) { // On first element
                return; // Can't have more than one root
            }

            var option = _colbrowser.currFocus.options[_colbrowser.currFocus.selectedIndex];
            var option2 = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'option');


// Will need to submit and perform any action (e.g., create a file, update remote/local XML tree in file) and
//   refresh in cache and view (e.g., alphabetically if like directories, or as placed if regular XML), 
//   (with any filter/sort/search?--use XPath/XSL/XQuery for these?)
// Need to make action dependent on XML file--root or element namespace of parent or of 
//   new element????; parent probably better, since child can still have its own behaviors for its 
//   children e.g., have namespace for our dir. files
// that.URLtoXMLDoc[fileXLinkAndXPath];
 
            // _colbrowser.XPathPlus = /^(show\^([^\^]*)\^doc\^([^)#\^]*)(#xpath1\((.*)\))?\^)(.*)$/;
            var pattern = _colbrowser.XPathPlus;
            var doc = option.value.match(pattern);
            if (doc) {
                var docFileXLink = doc[1];
                var fileXLinkAndXPath = doc[3]+(doc[4]?doc[4]:''); // Caching key
                var currentXPath = doc[6]; // XPath to use for changing stored value
                var fileXLink = doc[3];
                // var showVal = doc[2];
                var newXPath = doc[5];
             }          
             var xml, key;
             if (doc && fileXLink) {
                if (fileXLink.match(/^this\./)) { // If it is a string stored locally
                    key = docFileXLink;
                    xml = that.URLtoXMLDoc[key];
                }
                else if (URLtoXMLDoc[fileXLinkAndXPath]) {
                    key = fileXLinkAndXPath;
                    xml = that.URLtoXMLDoc[fileXLinkAndXPath]; // Grab XML in 'cache'/memory
                }
            }
            
            var node = XML.getNode(xml, currentXPath, null, xml);

            var newEl = brettz9.DOM.createElementNSwrapper('', 'dir', xml);
            node.parentNode.insertBefore(newEl, node.nextSibling);
//                        alert(XML.serialize(that.URLtoXMLDoc[key]));
//                        that.URLtoXMLDoc[key] = xml;
//                        alert(key);


            if (optval === '') {return;}
            option2.innerHTML = optval;
            option2.value = '(null)';

//            option2.value = '';

            // If we are working with a non-sequence-alterable XML file (like directory listing), this should just append to end in view, or append to the right alphabetical position
            option.parentNode.insertBefore(option2, option.nextSibling); //i.e., insertAfter
                        

            if (option.value === '(null)') {// Now remote the text node if it was one (since we only show last text node)...
                option.parentNode.removeChild(option);
            }
            // that.xmlstring = '<'+optval+'></'+optval+'>';

            //that._buildCol(colbrows, false, 'show^embed^doc^this.xmlstring^');
            //_ctrlShiftN(el, keyid, e);
        }

        var newitem = document.getElementById('newitem');
        for (var i=0; i < newitem.options.length; i++) {
            brettz9.DOM.addCommandEvent(newitem.options[i], _newItem);
        }
        var createitem = document.getElementById('createitem');
        brettz9.DOM.addCommandEvent(createitem, _newItem);

        // DELETE ELEMENT
        function _deleteItem (e) { // Use 'e'?'
            // Fix: allow deleting of text nodes
            var option = _colbrowser.currFocus.options[_colbrowser.currFocus.selectedIndex];

            option.parentNode.removeChild(option);
//            alert(_colbrowser.currFocus.options.length);

            var currid = _colbrowser.currFocus.id.replace(new RegExp(that.colbrows_prfx), '');
            if (_colbrowser.currFocus.options.length === 1) {
                currid--; // If nothing left, make sure to delete the current column too
            }
            var origid = currid;
            var nextid;
            var nextcol = document.getElementById(that.colbrows_prfx + (++currid));
            var selwidth = that.select_style_width;

            while (nextcol) {
                nextcol.parentNode.removeChild(nextcol);
                nextcol = document.getElementById(that.colbrows_prfx + (++currid));
                that.select_style_left -= parseInt(selwidth.substr(0, selwidth.length-2), 10); // Don't grab pixels from width;
            }
            that.idCounter = origid;
            var currcol = document.getElementById(that.colbrows_prfx + (origid));

            if (currcol) { // currcol might not be left if deleting everything
                currcol.focus();
                _colbrowser.currFocus = currcol;
            }
        }
        var deleteitem = document.getElementById('deleteitem');
        brettz9.DOM.addCommandEvent(deleteitem, _deleteItem);

        
        // ADD DEFAULT XML DOCUMENT TO TEXTBOX
        document.getElementById('colbrows_xmldocbox').value = this.xmlstring;
        
        // BUILD METADATA FOR THE FIRST TIME
        // this.InfoStrategy.populateDocInfo(XML.parse(this.xmlstring));
                
        this.InfoStrategy.populateAllInfo('show^embed^doc^this.xmlstring^', this.URLtoXMLDoc);

        // BUILD COLUMN WITH INITIAL XML DOCUMENT
        this._buildCol(colbrows, false, 'show^embed^doc^this.xmlstring^'); // Start with the root

        // SET INDEX AT BEGINNING
        // Fix: Might find some way to start beyond the first column
        colbrows.firstChild.selectedIndex = this.select_start_selindex;
        
        // SET FOCUS ON LATEST COLUMN WITH VIEW HANDLERS (ASSUMED TO BE ONE TO SHOW -- if allowing other column views, this (and the above setting of selectedIndex) might not be desirable)
        if (!noColViewHandlers) { // DON'T FOCUS IF USER HAS OTHER COLBROWSERS IN THE WINDOW
            colbrows.firstChild.focus();
        }
    };

    // Wanted these as private (instance methods) but since wanted to access from both private and public, this seemed impossible;
    //    however, I could redo buildcol (after including makeOptions within it too) to be within init() and a different one within _selectClick (they might even ideally be slightly different anyways)
    // Could also do as privileged method inside _colbrowser constructor, but adds memory for each instance apparently
    _colbrowser.prototype._buildCol = function (colbrows, col2rmv, fullXPathText, xml) { // XPath, XML/DOM/JSON 
        var that = this;

        // BUILD REFERENCES FOR XML FILE (OUR OWN XML OR XLINK)
        var pattern = _colbrowser.XPathPlus; // Expect doc^^ for file delimiting (or local this.xmlstring if using a variable)
        var doc = fullXPathText.match(pattern);
        if (doc) {
            // var showVal = doc[2];
            var fileXLinkAndXPath = doc[3]+(doc[4]?doc[4]:'');
            var currentXPath = doc[6];
            var newXPath = doc[5];
            var fileXLink = doc[3];
            var jsmatch = fileXLink.match(/(.*\.js)(\?.*)?$/);
            if (jsmatch) {
                var jslink = jsmatch[0];
                var parsedfile = brettz9.URI.parse(jsmatch[2]).key.f;
            }
        }
        var hideHiddenFiles = false;
        if (document.getElementById('colbrowser_hide_hidden_files').checked) {
            hideHiddenFiles = true;
        }
        
        // PREPARATORY HANDLER FOR STORING XML FROM XLINK  (FUNCTIONS TO GET DATA ARE BELOW)
        // This function can't be within the else block below (the only place it would be needed)
        // Depends on doc/fullXPathText (specifically newXPath, fileXLinkAndXPath, jsmatch) just above
        function _storeXMLPreparer (xmldoc) { // This must be here to collect newXPath, fileXLinkAndXPath from above (and can't be declared in a block below)
            that._storeXML(xmldoc, newXPath, fileXLinkAndXPath, jsmatch);
        }

        // SET OR GRAB CACHING OF DATA FOR OUR OWN XML, THE USER'S XML, OR XLINKED/REMOTE XML
        // Fix: If supporting non-embed (new/replace), have to add that behavior here (not only in processXLinkShow() coming from processXLinkActuateOnLoad())
        
        if (doc && fileXLinkAndXPath) {
            if (this.URLtoXMLDoc[fileXLinkAndXPath]) {
                xml = this.URLtoXMLDoc[fileXLinkAndXPath]; // Grab XML in 'cache'/memory                              
            }
            else if (fileXLink.match(/^this\./)) { // If it is a string stored locally
                //xml = eval(fileXLink); // Uncomment if want flexibility to add other strings (but dangerous)
                xml = this.xmlstring;
                xml = XML.parse(xml);
                this.URLtoXMLDoc[fileXLinkAndXPath] = xml;
            }
            else {
                /*
                if (_colbrowser.MOZ) {
                    try {
                        netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect UniversalBrowserRead'); // Necessary with file:///-located files trying to reach external sites
                    }
                    catch (e) {
                        alert("Permission UniversalBrowserRead denied. You must install this file and its attached scripts "+
                                    "on your local drive and find 'file:///' references in the code and change to lead to XML "+
                                    "files you wish to try out; for Firefox, you could type about:config in the URL window and set "+
                                    "signed.applets.codebase_principal_support to true in Firefox or if in Explorer, go to Tools -> "+
                                    "Options -> Security -> Custom Level -> ActiveX Controls and Plugins ->  'Initialize and script "+
                                    "ActiveX control not marked as safe.' Miscellaneous -> 'Access data sources across domains' "+
                                    "should also be marked as 'prompt' or 'enable'. Note that this may be less secure for your system!");
                    }
                }
                */
                var fso, file, all;
                if (jsmatch) { // Need to grab JS as text and eval() for XML
                    if (fileXLink.match(/\.\w+$/)) {return;}
                    var fileXLinkFileURL;
                    if (_colbrowser.MSIE && fileXLink.indexOf('file://') === 0) {
                        fso = new ActiveXObject('Scripting.FileSystemObject');
                        fileXLink = jsmatch[1];
                        fileXLinkFileURL = fileXLink.replace(/file\:\/\/\//g, '')
                        if (_colbrowser.OS === 'Windows') {
                            fileXLinkFileURL = fileXLinkFileURL.replace(/\//g, '\\');
                        }
                        file = fso.OpenTextFile(fileXLinkFileURL, 1); // 1 is reading, 2 is writing, 8 is appending  per http://msdn.microsoft.com/en-us/library/314cz14s(VS.85).aspx 
                                                                                                // Third argument can be -2 sys default, -1 Unicode, 0 ASCII
                        all = file.ReadAll();
                        file.Close();
                        eval(all);
                        _storeXMLPreparer(XML.parse(brettz9.XML.XMLOutput)); // Explorer gave error with empty DOCTYPE parsed this way
                    }
                    else {
                        HTTP.getText(fileXLink, _storeXMLPreparer, false); // Synchronous call so that the XML doc is available in rest of function
                    }
                }
                else if (_colbrowser.MSIE && fileXLink.indexOf('file://') === 0) {
                    fso = new ActiveXObject('Scripting.FileSystemObject');
                    fileXLinkFileURL = fileXLink.replace(/file\:\/\/\//g, '')
                    if (_colbrowser.OS === 'Windows') {
                        fileXLinkFileURL = fileXLinkFileURL.replace(/\//g, '\\');
                    }
                    file = fso.OpenTextFile(fileXLinkFileURL, 1 ); // 1 is reading, 2 is writing, 8 is appending  per http://msdn.microsoft.com/en-us/library/314cz14s(VS.85).aspx 
                                                                                            // Third argument can be -2 sys default, -1 Unicode, 0 ASCII
                    all = file.ReadAll();
                    file.Close();
                    _storeXMLPreparer(XML.parse(all)); // Explorer gave error with empty DOCTYPE parsed this way
                }
                else {
                    HTTP.getXML(fileXLink, _storeXMLPreparer, false); // Synchronous call so that the XML doc is available in rest of function
                }

                xml = this.URLtoXMLDoc[fileXLinkAndXPath];
                // currentXPath = ''; // Deprecated comment
            }
        }
        // STORE THE USER'S SUBMITTED XML
        else if (typeof xml === 'string') { // Don't need to parse if it is already a DOM Document/Element
        //if (xml instanceof HTMLDocument || xml instanceof XMLDocument) { // how to test for element?
            xml = XML.parse(xml);
            this.URLtoXMLDoc['show^embed^doc^this.xmlstring^'] = xml;
        }

        // PREPARATORY HANDLER FOR RIGHT ARROW HANDLER (REPEATED HERE SO METHODS COULD BE BORROWED
        // Depends on that and xml (just above) (must be kept here
        function _rightHandle (el, keyid, e) {
            that._rightHandle(el, keyid, e, xml);
        }
        
        // All of the following only depend on that
        // Could therefore move these to the constructor and make as privileged methods, but takes up memory 
        //   and needs this call; but the advantage would be overriding this method would be easier (and overriding 
        //   the constructor more involved as  this one is now)
        function _ctrlShiftN (el, keyid, e) {
            that._ctrlShiftN(el, keyid, e);
        }
        function _deleteHandle (el, keyid, e) {
            that._deleteHandle(el, keyid, e);
        }
        function _endHandle (el, keyid, e) {
            that._endHandle(el, keyid, e);
        }
        function _homeHandle (el, keyid, e) {
            that._homeHandle(el, keyid, e);
        }
        function _pageDownHandle (el, keyid, e) {
            that._pageDownHandle(el, keyid, e);
        }
        function _pageUpHandle (el, keyid, e) {
            that._pageUpHandle(el, keyid, e);
        }
        function _returnHandle (el, keyid, e) {
            that._returnHandle(el, keyid, e);
        }
        function _downHandle (el, keyid, e) {
            that._downHandle(el, keyid, e);
        }
        function _upHandle (el, keyid, e) {
            that._upHandle(el, keyid, e);
        }
        function _leftHandle (el, keyid, e) {
            that._leftHandle(el, keyid, e);
        }
        
        var selwidth = this.select_style_width;
                
        // REMOVE OLD COLUMNS (IF GOING LEFTWARD OR VERTICALLY TO A NEW ONE)
        if (col2rmv) {
            var num0 = parseInt(col2rmv.id.substr(this.colbrows_prfx.length), 10);
            ++num0;
            var nextcolumn = document.getElementById(this.colbrows_prfx+num0);
            while (nextcolumn) {
                // Don't just change visibility, since the user might choose a different column next time
                nextcolumn.parentNode.removeChild(nextcolumn);
                // Decrement the id and the left setting so next item will be placed correctly:
                --this.idCounter;
                this.select_style_left -= parseInt(selwidth.substr(0, selwidth.length-2), 10); // Don't grab pixels from width;
                nextcolumn = document.getElementById(this.colbrows_prfx + (++num0));
            }
        }

// Deprecated comment
// (if it is actually necessary, try uncommenting just the first line instead of the text afterwards)                
//                this.InfoStrategy.populateMetaInfo(xml);
        /*
        // Could use a separate textbox for this "whole document" XML serialization
        var colbrows_textchild = document.getElementById('colbrows_textchild');

        if (colbrows_textchild.innerHTML === '') { // This would otherwise overwrite the existing data when the user should be seeing just that element's content
            colbrows_textchild.innerHTML = '<textarea rows="5" cols="40">'+brettz9.XML.escapeString(XML.serialize(xml))+'<\/textarea>';
        }
        */

                
        /*
         * Deprecated comment : block seems to have no effect
        var startNode;
        if (currentXPath === undefined) {
            alert('a');
            if (xml.documentElement) { // Might want firstChild instead if allowing comments, proc. inst., etc.
                alert('b');
                startNode = xml.documentElement;
                currentXPath = '//';
            }
        }
        else { // Perform XPath to find starting node (should always be a single node or make a constructed one if not????)
            // startNode = ;
        }
        */

        // CONFIGURE SELECT COLUMN'S STYLES AND DISPLAY PROPERTIES
        var selectCol = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'select');
        selectCol.style.width = selwidth;
        selectCol.style.top = this.select_style_top;
        selectCol.style.left = this.select_style_left + 'px';
        this.select_style_left += parseInt(selwidth.substr(0, selwidth.length-2), 10); // Don't grab pixels from width;

        selectCol.setAttribute('multiple', 'multiple'); // Fix: May wish to allow moving of items (could make this variable)
        if (this.select_size) { // Size attribute shouldn't be 'undefined' if none present
            selectCol.setAttribute('size', this.select_size);
        }
        selectCol.setAttribute(_colbrowser.CLASSATT, this.css_prfx+'col'); // Make the column a visible one

        // INCREMENT COLUMN ID
        // Does this need to be reset at any point, such as if going backwards?
        // Name of this id should be unique per instance of this object (not only numerically as that could cause one to lead into the other)

        selectCol.setAttribute('id', this.colbrows_prfx + (++this.idCounter)); // Give an id for referencing

        // RECORD FOCUS IF THE FIRST COLUMN (FOR THE SAKE OF HAVING SOMETHING TO DELETE)
        // Don't set this for subsequent selects
        if (this.idCounter === 1) {
            _colbrowser.currFocus = selectCol; // Enable to make sure there is something to delete if user tries 
                                                                                //   to delete root; otherwise, don't need to increment
        }

        // SET TABINDEX FOR COLUMN
        if (this.tabIndex === true) { // Allow auto-increment (default)  (if set to false, will not have any tabindex)
            // It is ok not to increment here, since that would interfere with chances to increment for a new column browser being added;
            //   It is also fine since tabindex's with the same value are not invalid and follow in document order (allows user to tab to next column)
            selectCol.setAttribute('tabindex', _colbrowser.colbrowsCount); // To get this to be even more accessible, one could set a document event handler to detect a keystroke and then highlight this box (then remove the handler)
            this.tabIndex = false; // Fix: This doesn't work to stop tabbing and there should be a tab handler anyways'
        }
        else if (this.tabIndex) { // Allow setting numeric
            selectCol.setAttribute('tabindex', this.tabIndex); // Fix: see fix just above
            this.tabIndex = false;
        }
        
        // ATTACH HANDLERS
        // Map key to handler
        var bindings = {ctrl_shift_n:_ctrlShiftN, "delete":_deleteHandle, end:_endHandle, 
                                    home:_homeHandle, pagedown:_pageDownHandle, 
                                    pageup:_pageUpHandle, returnname:_returnHandle, down:_downHandle, 
                                    up:_upHandle, left:_leftHandle, right:_rightHandle};
        var keymap = new Keymap(bindings);
        keymap.install(selectCol); // Attach to document (or input box, textarea apparently)

        // BUILD OPTIONS
        selectCol = this._makeOptions(selectCol, xml, currentXPath);
        if (!selectCol) {
//                        var xlinkEl = col2rmv.options[col2rmv.selectedIndex];
//                        alert(xlinkEl.value);
//                        alert(XML.serialize(xlinkEl));
//                        var href = brettz9.DOM.getAttributeNSWrapper(xlinkEl, _colbrowser.XLINKNS, 'href');
//                        alert(href);
            return;
        }
                
        // ADD FAKE OPTION IN COLUMN FOR SAKE OF MOZILLA BUG
        if (_colbrowser.MOZ) {
            // Due to a bug in FF Windows (see https://bugzilla.mozilla.org/show_bug.cgi?id=291082 ),
            // preventDefault will not work in a select menu, so we have to recompensate by having the left
            // arrow bumped one up (and there must be such an option for it to go to)
            var option2 = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'option');
            option2.setAttribute('style', 'display:none;');
            option2.setAttribute('value', 'null');
            selectCol.appendChild(option2);
        }                

        // CLICK AND CHANGE HANDLERS
        function _selectClickPreparer (e) {
            that._selectClick(e, xml);
        }
        brettz9.DOM.addEvent(selectCol, 'click', _selectClickPreparer);

        function _selectChangePreparer (e) {
            that._selectChange(e, xml);
        }
        brettz9.DOM.addEvent(selectCol, 'change', _selectChangePreparer);

        // ADD COLUMN TO COLUMN BROWSER
        colbrows.appendChild(selectCol);
/* Deprecated comment
        if (selectCol.options[0].value !== 'null') { // Note that this is different from '(null)'!!!
            colbrows.appendChild(selectCol);
        }
        else {
            // Bring the column back down
            --this.idCounter;
            this.select_style_left -= parseInt(selwidth.substr(0, selwidth.length-2), 10); // Don't grab pixels from width;
        }
*/
    };

    _colbrowser.prototype._makeOptions = function (select, xml, currentXPath) {

        var option;                
        // GET DATA FOR OPTION AND SET FOR XLINK TYPE (IF NOT JUST STARTING)
        if (currentXPath !== '') {
            // FIND OPTIONS WHICH DO NOT HAVE XLINKS
            var notXlinkPath = currentXPath + '[@*[not((local-name() = "href" or local-name() = "type") and namespace-uri() = "http://www.w3.org/1999/xlink")]]'; // Do separate processing for those with XLink
            var notXlinkEls = XML.getNodes(xml, notXlinkPath, null, xml);
            var notXlinkEl = notXlinkEls[0];
        
            // SET OPTIONS WHICH HAVE XLINKS (AND IF SO, RETURN)
            var xlinkPath = currentXPath + '[@*[(local-name() = "href" or local-name() = "type") and namespace-uri() = "http://www.w3.org/1999/xlink"]]'; // '[@xlink:href]';
            var xlinkEls = XML.getNodes(xml, xlinkPath, null, xml);        
            var xlinkEl = xlinkEls[0];
            //xlinkEl = _colbrowser.MSIE ? xlinkEl : xlinkEl.ownerElement; // Explorer before 8 didn't support ownerElement so changed XPath above'
            if (xlinkEl) {
                // GET OPTION ELEMENT UPON WHICH TO ADD DATA
                option = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'option');
                this.a++;
                // PROCESS XLINK DEPENDING ON TYPE (AND SHOW/ACTUATE)
                // Before calling show/actuate-related methods, could override depending on user preferences (this is fine with the XLink spec)
                var xlinkselect = this.processXLinkType(xlinkEl, select, option, xml);
                if (xlinkselect && xlinkselect.nodeName && xlinkselect.nodeName.toLowerCase() === 'select') {
                        return xlinkselect;
                }
                else if (xlinkselect) {
                        return false;
                }
                else {
                        alert('Unexpected error 7');
                }
            }
        }

        // GET ANY CHILDREN
        var thislevel = XML.getNodes(xml, currentXPath+'/*', null, xml);
        var thisitem = thislevel[0];
        var thisitemTextContent;

//                alert(thisitem);
//                if (notXlinkEl) {alert(notXlinkEl.childNodes);}
        
        // GET AND SET DATA FOR OPTION IF NO FURTHER ELEMENT CHILDREN AND ADD TO SELECT
        if (!thisitem) {
            // This section might be made optional or commented out if one only wishes to see text content (note that _selectClick tests for '(null)' as created here)
            if (notXlinkEl) {
                thisitem = notXlinkEl;
            }
            else { // IF OPENS UP TO TEXT
                if (!currentXPath) {currentXPath = '/*';}
                thislevel = XML.getNodes(xml, currentXPath, null, xml);
                thisitem = thislevel[0];
                // if (!thisitem) {return select;} // DEPRECATED COMMENT
            }
                        
            // Might allow an onclick as below? to show metadata...
            option = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'option');
            thisitemTextContent = _colbrowser.MSIE ? thisitem.text : thisitem.textContent;

            option.innerHTML = '('+brettz9.XML.escapeString(thisitemTextContent)+')';
            option.value = '(null)';

            // ADD OPTION TO SELECT COLUMN
            select.appendChild(option);

            return select;
        }

        // ADD OPTION DATA FOR REGULAR NON-XLINK ENTRY WITH CHILDREN
        for (var i = 0; i < thislevel.length; i++) {
            thisitem = thislevel[i];
            option = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'option');
                        
            // DISPLAY COLUMN INTERNAL DATA PER USER'S STRATEGY (FOR TEXT AND TOOLTIP)
            this.colDisplayStrategy.addColumnEntryName(option, thisitem);
            this.colDisplayStrategy.addColumnEntryTitle(option, thisitem);
            
            // ADD FILE/XPATH TO OPTION
            var xml_in_URLtoXML = brettz9.PHP.array_search(xml, this.URLtoXMLDoc);
            var docval = xml_in_URLtoXML ? xml_in_URLtoXML : 'this.xmlstring';
            var thisxpath = brettz9.XPath.getXPathForElement(thisitem, xml);
                        
            if (docval.match(/^show\^[^\^]*\^doc\^[^^]*\^$/)) { // Just test for doc^this.xmlstring^? // Fix: allow specification of @show (e.g,. show^new/replace/emed^) for this.xmlstring too 
//                option.value = docval+thisxpath;
            }
            else {
                option.value = 'show^embed^doc^'+docval+'^'+thisxpath; // 'this.xmlstring'
            }

            // ADD OPTION TO SELECT COLUMN
            select.appendChild(option);
        }
        return select;
    };
    // Fix: Could put each media display routine into its own method so it could be overridden
    _colbrowser.prototype.displayMedia = function (xlinkEl, attrs) {

            var href0 = brettz9.DOM.getAttributeNSWrapper(xlinkEl, _colbrowser.XLINKNS, 'href');
            
            var imgmatch = href0.match(this.pattern_img);
            var iframematch = href0.match(this.pattern_iframe);
            var textmatch = href0.match(this.pattern_text);
            var objmatch = href0.match(this.pattern_obj);
            var mp3match = href0.match(this.pattern_mp3);
            var parsedfile, addedEl, pfile, param, param2, param3, obj2;
            var holder = document.getElementById('colbrows_img_display');
            
            function getTextHandler (text) {
                  var textarea = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'textarea');
                  textarea.setAttribute('rows', 10);
                  textarea.setAttribute('cols', 40);
                  while (holder.childNodes.length > 0) {
                      holder.removeChild(holder.firstChild);
                  }
                  textarea.innerHTML = text;
                  holder.appendChild(textarea);
             }
             
             function parsedFileReplace(parsedfile) {
                var unslashed = parsedfile;
                if (_colbrowser.OS === 'Windows') {
                    unslashed = parsedfile.replace(/\\/g, '/');
                }                                               
                return (!parsedfile.match(/^file:\/\/\/?/)?'file://':'')+unslashed;
             }
             
            if (imgmatch) {
                parsedfile = brettz9.URI.parse(imgmatch[2]).key.f;
                addedEl = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'img');
                addedEl.setAttribute('src', parsedFileReplace(parsedfile));
                addedEl.setAttribute('height', 500*7/16);
                addedEl.setAttribute('width', 500*9/16);
            }
            else if (mp3match) {
                parsedfile = brettz9.URI.parse(mp3match[2]).key.f;
                pfile = parsedFileReplace(parsedfile);
                addedEl = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'object');
                addedEl.setAttribute('classid', 'clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B');
                addedEl.setAttribute('codebase', 'http://www.apple.com/qtactivex/qtplugin.cab');
                addedEl.setAttribute('width', '200');
                addedEl.setAttribute('height', '16');
                
                obj2 = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'object');
                obj2.setAttribute('data', pfile);
                obj2.setAttribute('type', 'audio/x-mpeg');
                obj2.setAttribute('width', '200');
                obj2.setAttribute('height', '16');
                // obj2.setAttribute('autoplay', 'false');
                // addedEl.setAttribute('title', '');
                param = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'param');
                param.setAttribute('name', 'autostart');
                param.setAttribute('value', '0');
                param2 = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'param');
                param2.setAttribute('name', 'autoplay');
                param2.setAttribute('value', 'false');
                param3 = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'param');
                param3.setAttribute('name', 'controller');
                param3.setAttribute('value', 'true');
                var param4 = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'param');
                param4.setAttribute('name', 'src');
                param4.setAttribute('value', pfile);
                var param5 = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'param');
                param5.setAttribute('name', 'pluginspage');
                param5.setAttribute('value', 'http://www.apple.com/quicktime/download');
                
                addedEl.appendChild(param);
                addedEl.appendChild(param2);
                addedEl.appendChild(param3);
                addedEl.appendChild(param4);
                addedEl.appendChild(param5);
            }
            else if (objmatch) {
                parsedfile = brettz9.URI.parse(objmatch[2]).key.f;

                pfile = parsedFileReplace(parsedfile);
//  pfile = 'P5170010.MOV';

                addedEl = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'object');
                addedEl.setAttribute('classid', 'clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B');
                addedEl.setAttribute('codebase', 'http://www.apple.com/qtactivex/qtplugin.cab');
                addedEl.setAttribute('width', 320);
                addedEl.setAttribute('height', 260);

                param = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'param');
                param.setAttribute('name', 'src');
                param.setAttribute('value', pfile);
                param2 = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'param');
                param2.setAttribute('name', 'controller');
                param2.setAttribute('value', 'true');
                param3 = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'param');
                param3.setAttribute('name', 'autoplay');
                param3.setAttribute('value', 'true');

                obj2 = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'embed');
                obj2.setAttribute('src', pfile);
                obj2.setAttribute('width', 320);
                obj2.setAttribute('height', 260);
                obj2.setAttribute('autoplay', 'true');
                obj2.setAttribute('controller', 'true');
                obj2.setAttribute('pluginspage', 'http://www.apple.com/quicktime/download/');

/*/
                var obj2 = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'object');
                obj2.setAttribute('type', 'video/quicktime');
                obj2.setAttribute('data', pfile);
                obj2.setAttribute('width', '320');
                obj2.setAttribute('height', '240');
                obj2.setAttribute(_colbrowser.CLASSATT, 'hiddenObjectForIE');
                var paramB1 = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'param');
                var paramB2 = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'param');
                paramB1.setAttribute('name', 'controller');
                paramB1.setAttribute('value', 'true');
                paramB2.setAttribute('name', 'autoplay');
                paramB2.setAttribute('value', 'false');
/*                                      var alink = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'a');
                alink.setAttribute('href', pfile);
                var title = attrs.title;
                alink.innerHTML = 'Movie '+title;
                paramB2.appendChild(alink)

                obj2.appendChild(paramB1);
                obj2.appendChild(paramB2);
                    */
                addedEl.appendChild(param);
                addedEl.appendChild(param2);
                addedEl.appendChild(param3);
                addedEl.appendChild(obj2);
            }
            else if (iframematch) {
                parsedfile = brettz9.URI.parse(iframematch[2]).key.f;
                addedEl = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'iframe');
                addedEl.setAttribute('src', parsedFileReplace(parsedfile));
                addedEl.setAttribute('height', 600*7/16);
                addedEl.setAttribute('width', 600*9/16);
            }
            else if (textmatch) {
                parsedfile = brettz9.URI.parse(textmatch[2]).key.f;
                /*
                if (_colbrowser.MOZ) {
                    try {
                        netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect UniversalBrowserRead'); // Necessary with file:///-located files trying to reach external sites
                    }
                    catch (e) {
                        alert("Permission UniversalBrowserRead denied. You must install this file and its attached scripts "+
                                    "on your local drive and find 'file:///' references in the code and change to lead to XML "+
                                    "files you wish to try out; for Firefox, you could type about:config in the URL window and set "+
                                    "signed.applets.codebase_principal_support to true in Firefox or if in Explorer, go to Tools -> "+
                                    "Options -> Security -> Custom Level -> ActiveX Controls and Plugins ->  'Initialize and script "+
                                    "ActiveX control not marked as safe.' Miscellaneous -> 'Access data sources across domains' "+
                                    "should also be marked as 'prompt' or 'enable'. Note that this may be less secure for your system!");
                    }
                }
                */
                
                var gettextfile = parsedFileReplace(parsedfile);
                if (_colbrowser.MSIE) {
                    try {
                        var fso = new ActiveXObject('Scripting.FileSystemObject');
                        var file = fso.OpenTextFile(parsedfile, 1 ); // 1 is reading, 2 is writing, 8 is appending  per http://msdn.microsoft.com/en-us/library/314cz14s(VS.85).aspx 
                                                                                                // Third argument can be -2 sys default, -1 Unicode, 0 ASCII
                                                                                                // had gettextfile.replace(/file\:\/\/\/?/g, '').replace(/\//g, '\\')
                        var all = file.ReadAll();
                        file.Close();
                        getTextHandler(all);
                    }
                    catch (e) { // Need a catch to ignore some errors
                    }
                }
                else {
                    HTTP.getText(gettextfile, getTextHandler, false); // Synchronous call so that text is not overwritten accidentally by moving
                }
            }
            if (addedEl) { // As in the (Ajax) routine to get text data to display,  will not return a holder but will return it in its own callback
                while (holder.childNodes.length > 0) { // This is also triggered in selectChange() (necessary here too)
                    holder.removeChild(holder.firstChild);
                }
                holder.appendChild(addedEl);
            }
    };
    
    _colbrowser.prototype.getXLinkAttributes = function (xlinkEl) {
            // GET XLINK ATTRIBUTES
            // See http://www.w3.org/TR/xlink11/#xlinkattusagepat
            var attrs = {};

            // simple or locator
            var href = brettz9.DOM.getAttributeNSWrapper(xlinkEl, _colbrowser.XLINKNS, 'href');
            attrs.href = href ? href : '';

            // All have a type unless there is an 'href' (only for simple type)
            //   The XPath leading to this xlinkEl should ensure that the element has an 'href'', but we'll check anyways
            // XLink 1.1 allows type to be unspecified (default type of 'simple')
            var type = brettz9.DOM.getAttributeNSWrapper(xlinkEl, _colbrowser.XLINKNS, 'type');
            if (!type && !href) {
                alert('The XLink element submitted to processXLinkType() must have a @type or an @href attribute.');
                return false;
            }
            attrs.type = type = type ? type : 'simple'; // Now we can overwrite the type since original tested just above
            if (href && type !== 'simple' && type !== 'locator') {
                alert('You cannot have an @href attribute on any XLink besides a simple or locator type one.');
                return false;
            }
            

            // The conditional checking below is to avoid the namespace wrapper which could be expensive in 
            //    needing to traverse all the way up a DOM tree to find a "namespace" in the case of 
            //    non-namespace-aware DOM processors (Explorer); also has the side-benefit of ensuring that
            //    a method doesn't try to use an attribute not allowed in that context
            // i.e., The type it is not a type 'title''
            if (type === 'simple' || type === 'extended' || type === 'locator' || type === 'resource' || type === 'arc') {
                var title = brettz9.DOM.getAttributeNSWrapper(xlinkEl, _colbrowser.XLINKNS, 'title');
                attrs.title = title ? title : '';
                if (type !== 'arc') {
                    // simple, extended, locator, resource
                    var role = brettz9.DOM.getAttributeNSWrapper(xlinkEl, _colbrowser.XLINKNS, 'role');
                    attrs.role = role ? role : '';
                }
                if (type === 'simple' || type === 'arc') {
                    var actuate = brettz9.DOM.getAttributeNSWrapper(xlinkEl, _colbrowser.XLINKNS, 'actuate');
                    attrs.actuate = actuate ? actuate : '';
                    var show = brettz9.DOM.getAttributeNSWrapper(xlinkEl, _colbrowser.XLINKNS, 'show');
                    attrs.show = show ? show : '';
                    var arcrole = brettz9.DOM.getAttributeNSWrapper(xlinkEl, _colbrowser.XLINKNS, 'arcrole');
                    attrs.arcrole = arcrole ? arcrole : '';
                    if (type === 'arc') {
                        var from = brettz9.DOM.getAttributeNSWrapper(xlinkEl, _colbrowser.XLINKNS, 'from');
                        attrs.from = from ? from : '';
                        var to = brettz9.DOM.getAttributeNSWrapper(xlinkEl, _colbrowser.XLINKNS, 'to');
                        attrs.to = to ? to : '';
                    }
                }
                else if (type === 'locator' || type === 'resource') {
                    var label = brettz9.DOM.getAttributeNSWrapper(xlinkEl, _colbrowser.XLINKNS, 'label');
                    attrs.label = label ? label : '';
                }
            }
            return attrs;
    };
    _colbrowser.prototype.processXLinkType = function (xlinkEl, select, option, xml) {
            var attrs = this.getXLinkAttributes(xlinkEl);
            var type = attrs.type;
            // Will always be a type here
            switch (type) {
                // http://www.w3.org/TR/xlink11/#xlinkattusagepat provides allowable attrs as commented below
                case 'simple': // Default set to simple if none present per XLink 1.1
                     // Allowable other atts:  href, role, arcrole, title, show, actuate (note, all including href! are not required)
                    return this.processXLinkTypeSimple(xlinkEl, attrs, select, option, xml);
                case 'arc': // Allowable other atts:  arcrole, title, show, actuate, from, to
                                    // @from and @to are defined here as they only pertain to 'arc'
                    return this.processXLinkTypeArc(xlinkEl, attrs, select, option, xml);
                case 'extended': // Allowable other atts:  role and title
                    // break;
                case 'title': // Allowable other atts:  NONE
                    // Fix: While using the DOM to import nodes seemed to add the nodes per the "view selected source", only innerHTML seems to actually allow styling, etc. inside of the option element when added in this way
//                                var toappend = brettz9.DOM.importNode(xlinkEl, true, document); // As title type should have no other attributes (including 'title'), 
                                                                          //    the element's contents should be used
                    var optionhtml = '';
                    for (var i=0; i < xlinkEl.childNodes.length; i++) {
                        optionhtml += XML.serialize(xlinkEl.childNodes.item(i));
                    }
                   if (_colbrowser.MSIE) { // Inclusion of certain tags (or all?) doesn't work in IE'
                       optionhtml = optionhtml.replace(/\<[^>]*\>/g, '');
                   }
                    // Can put tables, buttons, checkboxes, etc. (but not active, though menus inside menus work!)
                    option.innerHTML = optionhtml;
                    option.value = '(null)';
                    
                    // ADD OPTION TO SELECT COLUMN
                    select.appendChild(option);
//                                var opt2 = option.cloneNode(true);
//                                select.appendChild(opt2);

                    return select;
                case 'resource': // Allowable other atts:  role, title, label
                    // break;
                case 'locator': // Allowable other atts:  href (REQUIRED), role, title, label
                    // Note: need to also add 'arc' support even though there is a method for it above (see processXLinkActuateOnRequest())
                    alert('The '+type+' XLink link type is not currently supported but will be treated as a simple link');
                    break;
                default:
                    alert('Invalid XLink type value');
                    break;
            }
            return false;
    };
    _colbrowser.prototype.processXLinkTypeSimple = function (xlinkEl, attrs, select, option, xml) {
        return this.processXLinkActuate(xlinkEl, attrs, select, option, xml);
    };
    _colbrowser.prototype.processXLinkTypeArc = function (xlinkEl, attrs, select, option, xml) {
        // @from and @to are available here unlike other methods
        return this.processXLinkActuate(xlinkEl, attrs, select, option, xml);
    };
    _colbrowser.prototype.processXLinkActuate = function (xlinkEl, attrs, select, option, xml) {
        var actuate = attrs.actuate;
         // Fix: onLoad to be used to auto-load the root node?
        switch (actuate) {
            case 'onRequest':
                return this.processXLinkActuateOnRequest(xlinkEl, attrs, select, option);
            case 'other':
                 // use role/arcrole with 'other' or with user prefs?
                // Make provision for loading more than one--one resource might be onLoad, 
                //   another onRequest; e.g., attribute xle (our own "XLink Extension" 
                //   xle:actuate="onLoad onRequest") or better, rely on extended link to have data 
                //   embedded (e.g., let one resource lead to both say HTML display and HTML text view),
                //   but as 'extended'/'locator' doesn't allow actuate/show, its simple links might repeat the content;
                //   However, the 'locator' of an 'extended' link can include nested XLink (like simple or arc) though
                //     behavior is undefined. Use an arc instead?
                break;
            case undefined:
            case '': // Our default is onLoad so pass through
                // break;
            case 'none': // Our default is onLoad so pass through
                // break;
            case 'onLoad':
                    // Fix: The following line shouldn't be here but is here just temporarily to make things work
//                                this.processXLinkActuateOnRequest(xlinkEl, attrs, select, option);// just testing (can delete later)
                return this.processXLinkActuateOnLoad(xlinkEl, attrs, select, option, xml);
            default :
                alert('Invalid XLink actuate value');
                break;
        }
        return false;
    };
    _colbrowser.prototype.processXLinkActuateOnRequest = function (xlinkEl, attrs, select, option) {
          // PREPARE THE OPTION FOR LATER CLICKING (A SIMPLE OR ARC TYPE, XLINK BY NOW)
          var type = attrs.type,
                 href = attrs.href,
                 title = attrs.title,
                 role = attrs.role,
                 arcrole = attrs.arcrole,
                 show = attrs.show;
         
          if (type === 'arc') { // Arc itself does not have @href or @role (like simple), but does have the rest simple has and @from/@to
              alert('Arcs not supported yet');
              return false;
          }

          // PREPARE TEXTUAL ADDITIONS
          var introtitle = ((title === '') ? '' : ': '+ title);
          var introarcrole = arcrole ? 'Arcrole: '+arcrole : 'Arcrole: none';
          var introrole = role ? 'Role: '+role+';' : 'Role: none;';
          var introhref = href ? 'href: '+ href : 'href: none;';
          
          // MAKE PLACE HOLDER FOR XLINK
          option.innerHTML = '[['+type+' XLink'+introtitle+']]'; // If don't want link showing up (as might be large) // If enable this, then enable the following

          // ADD ANY ROLE AND ARCROLE TO TOOLTIP
          option.title = introhref+'; \n\n'+introrole+' \n\n'+introarcrole+ '; \n\nTitle'+ introtitle;
          option.setAttribute(_colbrowser.CLASSATT, 'xlink-'+type);

          // GET FULL LINK (INCLUDING XML:BASE)
          var fullxlink = brettz9.DOM.getXmlBaseLink (/* XLink sans xml:base */ href, 
                                                                                                /* Element to query from */ xlinkEl);
          option.value = 'show^'+show+'^doc^'+fullxlink+'^';
        
          // OVERPASS OUR TEMPORARY HOLDER ELEMENT
          if (fullxlink.match(/#xpath1\(/)) {
                  option.value += '/holder';
          }

          // ADD OPTION TO SELECT COLUMN
          select.appendChild(option);
          return select;
    };
    _colbrowser.prototype.processXLinkActuateOnLoad = function (xlinkEl, attrs, select, option, xml) {
               if (attrs.type === 'arc') { // Arc itself does not have @href or @role (like simple), but does have the rest simple has and @from/@to
                  alert('Arcs not supported yet');
                  return false;
              }
              return this.processXLinkShow(xlinkEl, attrs, select, option, xml);
    };

    _colbrowser.prototype.processXLinkShow = function (xlinkEl, attrs, select, option, xml) {
            var show = attrs.show;
            // Load in a new window (as columns?), replace this window (as columns?), or put within the document: new, replace, embed
            // Fix: could replace the following with an overloading type (exceptions for empty or other)
            switch (show) {
                case 'new':
                    this.processXLinkShowNew(xlinkEl, attrs);
                    break;
                case 'replace':
                    this.processXLinkShowReplace(xlinkEl, attrs);
                    break;
                case 'other': // use role/arcrole with 'other' or with user prefs?; add markup to express both (e.g., new and embed)
                    return this.processXLinkShowOther(xlinkEl, attrs, select, option);
                case undefined: // Should this be here?
                case '':
                    return this.processXLinkShowEMPTY(xlinkEl, attrs, select, option, xml);
                case 'none':
                    this.processXLinkShowNone(xlinkEl, attrs, select, option, xml);
                    break;
                case 'embed':
                    return this.processXLinkShowEmbed(xlinkEl, attrs, select, option, xml);
                default :
                    alert('Invalid XLink show value');
                    break;
            }
            return false;
    };
    _colbrowser.prototype.processXLinkShowNew = function (xlinkEl, attrs) {
        window.open(attrs.href);
    };
    _colbrowser.prototype.processXLinkShowReplace = function (xlinkEl, attrs) {
        window.location.href = attrs.href;
    };
    _colbrowser.prototype.processXLinkShowEmbed = function (xlinkEl, attrs, select, option, xml) {
        var href = attrs.href;
        var colbrows = document.getElementById(this.colbrows_prfx+this.colbrows_suffix);
        var selwidth = this.select_style_width;
        
        // If appropriate, display any media, text, etc. when focused on an XLinked file
        // GET FULL LINK (INCLUDING XML:BASE)
        var fullxlink = brettz9.DOM.getXmlBaseLink (/* XLink sans xml:base */ href, 
                                                                                              /* Element to query from */ xlinkEl);
        // FOR FILES, ADD A DUMMY COLUMN TO KEEP THE NAVIGATION STEADY (and possibly add functionality or text within later?)
        if (href.match(/\.\w+$/) && fullxlink.match(/file:\/\//)) { // // Might also create a column and data for XML files retrieved on the local system
            select.setAttribute('multiple', 'multiple'); // Fix: May wish to allow moving of items (could make this variable)
            if (this.select_size) { // Size attribute shouldn't be 'undefined' if none present
                select.setAttribute('size', this.select_size);
            }
            select.setAttribute(_colbrowser.CLASSATT, this.css_prfx+'col'); // Make the column a visible one

            select.style.width = selwidth;
            select.style.top = this.select_style_top;
            select.style.left = (this.select_style_left - parseInt(selwidth.substr(0, selwidth.length-2), 10) ) +'px';
            this.select_style_left += parseInt(selwidth.substr(0, selwidth.length-2), 10); // Don't grab pixels from width;
            select.setAttribute('id', this.colbrows_prfx + (this.idCounter)); // Give an id for referencing
            ++this.idCounter;

            option.innerHTML = '('+brettz9.XML.escapeString('File')+')';
            option.value = '(null)';
            select.appendChild(option);
        }

        var fullxlinkText = 'show^embed^doc^'+fullxlink+'^';
        
        if (fullxlinkText.match(/#xpath1\(/) || fullxlinkText.match(/dirGen\.js/)) {
            fullxlinkText += '/holder';
         }
        
        // Fix: uncertain of this
        // Bring the counter and left position down since we're already in one buildCol (?)
        --this.idCounter;
        this.select_style_left -= parseInt(selwidth.substr(0, selwidth.length-2), 10); // Don't grab pixels from width;

        if (!href.match(/\.\w+$/) || !fullxlink.match(/file:\/\//)) { // Brett added as don't seem to need to execute if just a file
            this._buildCol(colbrows, false, fullxlinkText, xml);
        }
        else {
            colbrows.appendChild(select);
        }
        // DISPLAY MEDIA AFTER COLUMNS ABOVE HAVE BEEN CREATED (MORE STEADY VIEW BY NOT WAITING ON MEDIA DISPLAY)
        this.displayMedia(xlinkEl, attrs);
        return true;
    };
    _colbrowser.prototype.processXLinkShowOther = function (xlinkEl, attrs, select, option) {
        // Could use to put as new and embed (should require other namespaced attributes since 
        //    could be some other combination)
        this.processXLinkShowNew(xlinkEl, attrs);
        return this.processXLinkShowEmbed(xlinkEl, attrs, select, option);
    };
    _colbrowser.prototype.processXLinkShowNone = function (xlinkEl, attrs, select, option, xml) {
        // Our default is embed, so pass through
        this.processXLinkShowEmbed(xlinkEl, attrs, select, option, xml);
    };
    _colbrowser.prototype.processXLinkShowEMPTY = function (xlinkEl, attrs, select, option, xml) {
        // Our default is embed, so pass through
        return this.processXLinkShowEmbed(xlinkEl, attrs, select, option, xml);
    };
                                            
    // STORE XLINK DATA
    // Depends on: doc (newXPath, fileXLinkAndXPath), that (actually, now 'this' again)
    _colbrowser.prototype._storeXML = function (xmldoc, newXPath, fileXLinkAndXPath, jsmatch) {
        var docu,
            hideHiddenFiles = false;
        if (document.getElementById('colbrowser_hide_hidden_files').checked) {
            hideHiddenFiles = true;
        }
        // Fix: Apply XPointer here based on #xpath1() ? (ensure XPath is available after the call to this function too)
        if (typeof xmldoc === 'number') {
            throw (new Error('HTTP Error code '+xmldoc));
        }
        else if (typeof xmldoc === 'string') {
            if (jsmatch) {
                var jslink = jsmatch[0];
                var parsedfile = brettz9.URI.parse(jsmatch[2]).key.f;
            }
            eval(xmldoc);
            xmldoc = XML.parse(brettz9.XML.XMLOutput);
        }
        /*
        else if (typeof xmldoc === 'string') {

                docu = XML.parse(xmldoc);
        }
        */
        if (newXPath) {
            // Need to import, since can't serialize newly retrieved xml above as it is a security error (from an external document)
            var xmlToImport = XML.getNodes(xmldoc, newXPath, null, xmldoc);
            if (document.implementation && document.implementation.createDocument) {
                docu = document.implementation.createDocument('', '', null);
//                                                docu = document.createDocumentFragment();
            }
            else {
                docu = new ActiveXObject("Microsoft.XMLDOM");
            }
            try {
                var holder = brettz9.DOM.createElementNSwrapper('', 'holder', docu); // This holder will be circumvented later
                for (var clone, i=0; i < xmlToImport.length; i++) {
//                                                clone = docu.importNode(xmlToImport[i], true); // Do a deep copy of these nodes 
                    clone = brettz9.DOM.importNode(xmlToImport[i], true, docu); // docu
                    holder.appendChild(clone); // docu.appendChild(clone);
                }
                docu.appendChild(holder);
            }
            catch (e) { 
                alert('4:'+e.message?e.message:e);
            }
        }
        else {
            docu = xmldoc;
        }
        
        docu = brettz9.DOM.resolveXIncludes(docu);
        
        this.URLtoXMLDoc[fileXLinkAndXPath] = docu;
    };
          
    
    // NAVIGATION HANDLERS
    // 
    // depends on that, xml, _scrollColItemIntoView(), _getCurrentColNum(), _getColByNum()
    _colbrowser.prototype._rightHandle = function (el, keyid, e, xml) { // Triggered in each case with _selectChange in FF
        var targ = _colbrowser.MSIE ? e.srcElement : e.target;

        // AVOID ACTING FURTHER ON FURTHERMOST RIGHT COLUMN
        if (targ.value === '(null)') {// Deprecated comment: el.options[el.selectedIndex].value === 'null') {
            return false; // catching 'null' (as opposed to '(null)') is not necessary if selectedIndex is set in buildCol since the option will not be the last hidden one (in FF)
        }

        // var column = new Column(el);
        // selectchange is insufficient since not triggered in beginning or at end
        var colbrows = document.getElementById(this.colbrows_prfx+this.colbrows_suffix);


        // BUILD COLUMN INTO WHICH RIGHT ARROW IS NOW MOVING
        try {
            this._buildCol(colbrows, el, el.value, xml);

            var num = _colbrowser._getCurrentColNum(this, el);
            ++num;
            var nextcol = _colbrowser._getColByNum(this, num);


            if (nextcol && 1) { // if it is a directory, go to the next column
                nextcol.setAttribute(_colbrowser.CLASSATT, this.css_prfx+'col');
                nextcol.selectedIndex = 0;
                nextcol.focus();
                // nextcol.scrollIntoView(true); // Causes jerky screen behavior (e.g., scrolls down)

                // The following was necessary in Explorer (needs testing), but since the "selectclick" onchange handler gets 
                //    calls in Firefox (not anymore, but still causes problems in FF when done here), so this is not necessary 
                //    for FF and causes the selectedIndex to go up unnecessarily
                // More recent note: I added "_colbrowser.MSIE" since Firefox doesn't seem to use the following at all (if IE doesn't use it, the view won't scroll into the next column)
                if (_colbrowser.MSIE && nextcol.options[0].value !== '(null)') { // Test needed (in IE only, but doesn't hurt FF) to avoid error when right-clicking item already on furthermost right text
                    try {
                        this._buildCol(colbrows, nextcol.options[0], nextcol.options[0].value, xml);
                    }
                    catch (e) {
                        /*
                         *alert(colbrows); // div
                        alert(nextcol.options[0]); // option
                        alert( nextcol.options[0].value); // ...
                        */
//                                                        alert(XML.serialize(xml));

                        alert('1:For '+nextcol.options[0].value+':\n\t'+(e.message?e.message:e));
                        return false;
                    }
                }

                if (_colbrowser.MOZ && 1) { // Only do this if the current item is a folder //  && !returnkey
                    --nextcol.selectedIndex; // Decrement position in select menu to anticipate unstoppable action in FF Windows
                }
                else if (_colbrowser.MSIE) { // Needed for some reason here in IE (_selectChange handles it for FF, but though _selectChange is called for IE too, doesn't work with IE)
                    // Fix: might be able to get it to trigger in IE too if get selectChange right
                    _colbrowser._scrollColItemIntoView(this, nextcol);
                    if (nextcol.options[0].value !== '(null)') { // Not triggered in IE otherwise
                        this.InfoStrategy.populateAllInfo(nextcol.options[0].value, this.URLtoXMLDoc);
                    }
                }
            }
        }
        catch (e) { 
            alert('2: For '+el.value+':\n\t'+(e.message?e.message:e));
        }
        return false;
    };

    // depends on that, _getCurrentColNum(), _getColByNum()
    _colbrowser.prototype._leftHandle = function (el, keyid, e) {
        // Note that _selectChange() will also be called (so repopulating metadata is not necessary here) (Fix: make sure that's true for IE once IE code is fixed)'

        var num2 = _colbrowser._getCurrentColNum(this, el);
        ++num2;
        var nextcol = document.getElementById(this.colbrows_prfx+num2);
        while (nextcol) {
            // Don't just change visibility, since the user might choose a different column next time
            nextcol.parentNode.removeChild(nextcol);
            // Decrement the id and the left setting so next item will be placed correctly:
            --this.idCounter;
            var selwidth = this.select_style_width;
            this.select_style_left -= parseInt(selwidth.substr(0, selwidth.length-2), 10); // Don't grab pixels from width;
            nextcol = document.getElementById(this.colbrows_prfx + (++num2));
        }

        var num = _colbrowser._getCurrentColNum(this, el);
        --num;
        var prevcol = _colbrowser._getColByNum(this, num);
        if (prevcol) { // if there is a previous column, go there (regardless of whether this is a file or not)
            el.selectedIndex = -1;
            prevcol.focus();

            // Fix:? If some browsers won't support this, could use anchors and window.location.hash
            //prevcol.scrollIntoView(true); // Needed by Firefox, but IE (incorrectly?) seems to assume this
            if ((prevcol.selectedIndex !== (prevcol.options.length-1)) && _colbrowser.MOZ) {
                ++prevcol.selectedIndex;
            }
            else {
                brettz9.DOM.stopEventFully(e);
            }
            if (_colbrowser.MSIE && prevcol.options[0].value !== '(null)') { // Not triggered in IE otherwise
                this.InfoStrategy.populateAllInfo(prevcol.options[0].value, this.URLtoXMLDoc);
            }
        }
        return false;
    };

    // Next two depend on _selectChange
    // Presence of these handles had earlier seemed to prohibit Explorer from taking its default actions
    _colbrowser.prototype._downHandle = function (el, keyid, e) {
        if (_colbrowser.MOZ && el.selectedIndex === el.options.length-2) {
            el.selectedIndex = el.options.length-3;
        }
        else if (_colbrowser.MSIE) {
            if (el.selectedIndex < el.length-1) {
                el.selectedIndex++; // This was necessary when inside the function but not when called here!
            }
            this._selectChange(e);
        }
    };
    _colbrowser.prototype._upHandle = function (el, keyid, e) {
        if (_colbrowser.MSIE) {
            if (el.selectedIndex > 0) {
                 el.selectedIndex--; // This was necessary when inside the function but not when called here!
            }
            this._selectChange(e);
        }
    };

    // Next 4 depend on that 
    // Fix: End doesn't work in FF2 or FF3 (but does in IE)
    // Fix: pagedown also doesn't work in FF3 for some reason
    // Fix: Page up/down behave like home/end (could fix by detecting column height and doubling unless over length)
    _colbrowser.prototype._pageDownHandle = function (el, keyid, e) {
        el.selectedIndex = el.length-1; // Taking into account invisible last option
        // Scroll to the bottom
        var id0 = document.getElementById(this.colbrows_prfx+this.colbrows_suffix);
        id0.scrollTop = id0.scrollHeight;
    };
    _colbrowser.prototype._pageUpHandle = function (el, keyid, e) {
        el.selectedIndex = _colbrowser.MSIE ? 0 : -1; // Setting to negative one since will be 'upped' next time.
        // Scroll to the bottom
        var id0 = document.getElementById(this.colbrows_prfx+this.colbrows_suffix);
        id0.scrollTop = 0;
    };

    _colbrowser.prototype._homeHandle = function (el, keyid, e) {
        el.selectedIndex = _colbrowser.MSIE ? 0 : -1; // Setting to negative one since will be 'upped' next time.
        // Scroll to the bottom
        var id0 = document.getElementById(this.colbrows_prfx+this.colbrows_suffix);
        id0.scrollTop = 0;
    };
    _colbrowser.prototype._endHandle = function (el, keyid, e) {
        el.selectedIndex = el.length-1; // Taking into account invisible last option
        // Scroll to the bottom
        var id0 = document.getElementById(this.colbrows_prfx+this.colbrows_suffix);
        id0.scrollTop = id0.scrollHeight;
    };

    // The next 2 depend on nothing (so far)
    // DELETE OR ADD ELEMENT HANDLERS
    _colbrowser.prototype._deleteHandle = function (el, keyid, e) {
        var option = el.options[el.selectedIndex];
        option.parentNode.removeChild(option);
    };
    _colbrowser.prototype._ctrlShiftN = function (el, keyid, e) {
        var option = el.options[el.selectedIndex];
        var option2 = brettz9.DOM.createElementNSwrapper(_colbrowser.HTMLNS, 'option');
        option2.innerHTML = 'dir';
        option2.value = '';

        option.parentNode.insertBefore(option2, option.nextSibling); //i.e., insertAfter

        // Fix: Recalculate subsequent options' values!!!!!
    };

    // Depends on that
    // RENAME HANDLER
    _colbrowser.prototype._returnHandle = function (el, keyid, e) {
        if (1) { // !this.editmode
            Tooltip.lastel = _colbrowser.MSIE ? e.srcElement : e.target;
            var startleft = this.colbrows_style_left.replace(/px$/, '');
            var starttop = this.colbrows_style_top.replace(/px$/, '');
            Tooltip.schedule(this.colbrows_prfx+this.colbrows_suffix, el, e, startleft, starttop);
        }
        else {
                // Remove the edit box and return focus

        }
        return false;
    };
    _colbrowser.prototype._selectClick = function (e, xml) { // CLICK AND CHANGE HANDLERS
        // local vars needed: 'that', 'xml'
        // GET SELECT
        // For IE, sometimes the click event is a SELECT and other times it is an OPTION (we only need (and for some reason in IE can only use) the SELECT)
        var selectCol = _colbrowser.MSIE ? e.srcElement : e.target.parentNode; // In FF, the event only occurs on an 'option' (though attached to 'select'), so grab its parent to get the 'select'

        // AVOID IE OPTION CLICK EVENTS
        if (selectCol.nodeName.toLowerCase() !== 'select') { // Need to convert to lower case since IE treats as HTML despite XHTML namespace
            return;
        }
        // AVOID STRAY CLICK PROBLEMS IN IE
        if (_colbrowser.MSIE) {
                // If clicked in corner of window, there were problems of extra column appearing (even if clicked on item which was selected, it still seemed to open an extra column briefly)
            if (selectCol.selectedIndex === undefined || selectCol.selectedIndex == -1) {return;}
        }
        // DO NOTHING WITH FURTHERMOST RIGHT ITEM
        if (selectCol.value === '(null)') { // We can refer to the option's value, even though 'targ' is a select'
            return;
        }
        // LET NEW/DELETE OPERATIONS KNOW THAT THIS COLUMN IS THE CURRENTLY FOCUSED ITEM
        _colbrowser.currFocus = selectCol;
        try {
            // REFRESH METADATA DISPLAY
            // _selectChange (which runs before a click if it runs) doesn't run if one clicks on an
            //    item already highlighted in an earlier column
            this.InfoStrategy.populateAllInfo(selectCol.value, this.URLtoXMLDoc);

            // BUILD VIEW OF NEXT COLUMN (BUT DON'T GO INTO IT YET)
            var colbrows = document.getElementById(this.colbrows_prfx+this.colbrows_suffix);
            this._buildCol(colbrows, selectCol, selectCol.value, xml);
        }
        catch (e) { 
            if (e.name !== 'NS_ERROR_ILLEGAL_VALUE') { // Don't repeat this error since there is already the HTTP one
                alert(e.message?e.message:e);
            }
        }
    };
    // local vars needed: 'that', 'xml', _scrollColItemIntoView()
    _colbrowser.prototype._selectChange = function (e, xml) {
         // ENSURE MEDIA DISPLAY WINDOW CHANGES
        var holder = document.getElementById('colbrows_img_display');
        while (holder.childNodes.length > 0) {
            holder.removeChild(holder.firstChild);
        }
        
        // Brett trying this
        var targ = _colbrowser.MSIE ? e.srcElement : e.target;
        _colbrowser.currFocus = targ; // Record latest for use with new item / delete item functions
        if (targ.value === '(null)') { // Can't do in click handler since in IE this happens first
            return;
        }
        else if (targ.value === 'null') { // If last item already
            targ.selectedIndex = 0; // This is required so right clicks will work
            return;
        }
        else if (targ.selectedIndex === undefined) { // In case one click on the edge of the select before an item is selected
            return;
        }

        var colbrows = document.getElementById(this.colbrows_prfx+this.colbrows_suffix);
        try { 
            this._buildCol(colbrows, targ, targ.value, xml);

            // SCROLL NEXT COLUMN INTO VIEW (AFTER CLICK OR RIGHT ARROW)
            _colbrowser._scrollColItemIntoView(this, targ);

            // REFRESH METADATA DISPLAY
            this.InfoStrategy.populateAllInfo(targ.value, this.URLtoXMLDoc);
        }
        catch (e) {
            alert('3: For '+targ.value+':\n\t'+(e.message?e.message:e));
        }
    };

        // CONSTANTS (NAMESPACE, BROWSER/PLATFORM)
    // Class property (not to be different across instances and can be called from the outside too)
    _colbrowser.HTMLNS = 'http://www.w3.org/1999/xhtml';
    _colbrowser.XLINKNS = 'http://www.w3.org/1999/xlink';
    _colbrowser.MOZ = navigator.userAgent.indexOf('Gecko/') !== -1 &&
                                        navigator.vendor.indexOf('Apple') === -1; // Testing only for Firefox will miss Seamonkey, etc.
    _colbrowser.MOZWIN = navigator.appVersion.indexOf('Win') !== -1 && _colbrowser.MOZ;
    _colbrowser.MSIE = navigator.userAgent.indexOf('MSIE') !== -1;
    _colbrowser.CLASSATT = _colbrowser.MSIE ? 'className' : 'class';
        
    // Adapted a portion of script from http://www.quirksmode.org/js/detect.html used here for OS detection
    _colbrowser.searchString = function (data) {
        for (var i=0;i<data.length;i++)    {
            var dataString = data[i].string;
            if (dataString) {
                if (dataString.indexOf(data[i].subString) !== -1) {
                    return data[i].identity;
                }
            }
        }
        return false;
    };
    _colbrowser.dataOS = [
        {
            string: navigator.platform,
            subString: "Win",
            identity: "Windows"
        },
        {
            string: navigator.platform,
            subString: "Mac",
            identity: "Mac"
        },
        {
            string: navigator.platform,
            subString: "Linux",
            identity: "Linux"
        }
    ];
 
    // Must come after the function above
    _colbrowser.OS = _colbrowser.searchString(_colbrowser.dataOS);
    _colbrowser.OSfile_slash = (_colbrowser.OS === 'Windows') ? '\\' : '/'; // The following doesn't seem to auto-convert forward slashes to backslashes, so this is needed (though why is there no problem in overlay.js for Windows? Probably since only being used there for Java)
    _colbrowser.XPathPlus = /^(show\^([^\^]*)\^doc\^([^)#\^]*)(#xpath1\((.*)\))?\^)(.*)$/; // Inside of xpath1 allows for parentheses since URL's do, but closing ^ (which is not allowed in URL's) should ensure the right parenthesis is grabbed

    var currFilePath = window.location.href.replace(/\/[\w\.]+$/, '/');
    _colbrowser.currFilePath = currFilePath; // Use in dirGen.js

    // DEFAULT XML DOCUMENT
    //this.xmlstring1 = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">'+
    //    '<html><body><\/body><\/html>'; /* Used for testing Public Doctype */
    // Note that in IE you cannot seem to ask for privs like in Firefox to work with local files (unless on a server as localhost).
    // Explorer also doesn't seem to be able to open a file with an extension (like .rdf) and treat it as XML (unless served presumably).
    _colbrowser.sampleXml = ''+ // "<!DOCTYPE orig [ <!ENTITY blah 'okeeee'> ]>\n"+ /* SYSTEM 'ABC.dtd' */
    "        <"+"?js pseudo2='attr'?><!-- mycomment2 -->"+
    "<Home:Base xmlns:xi='http://www.w3.org/2001/XInclude' xml:base='http://localhost/navbarcrumbs' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:Home='abcdef' dog='ca&amp;t' war='peace'>\n"+
    "            <"+"?js pseudo='attr'?><!-- mycomment1 -->blah;<someXML abc='ok'>\neee"+
    "                <anElement a='abc&amp;>&lt;'><Great-Grandparents><Grandparents>Joe &amp; Ellen<Parents>Harry &amp; Joan<Child>Steve<\/Child><Sibling>Sue<\/Sibling><\/Parents>Fred &amp; Mary<\/Grandparents><\/Great-Grandparents><Dog>Fritz<\/Dog>some Text<cat>Fifi<\/cat>moretext<\/anElement>\n"+
    "                <anotherElement><![CDATA[ abc<>def ]]"+"> blah; def<\/anotherElement>\n"+
    "                               <MoreXML><a>dog</a>\n"+
    "                                       <b>Some text 2<\/b>\n"+
    "                                       <otherMeaninglessJunk>ghi<\/otherMeaninglessJunk>\n"+
    "                               <\/MoreXML>\n"+
    "            <\/someXML>\n"+
    "                       <webXML xlink:href='http://bahai-library.com/zamir/chintest9.xml'></webXML>"+
    "                       <XLinkTitle xlink:type='title'><select size='2'><option>def</option><option>abc</option></select><input type='checkbox' checked='checked' /><table border='1'><tr><td>ab</td><td>cd</td></tr><tr><td>ef</td><td>gh</td></tr></table><input type='button' value='Hi!' onclick='alert(123);'  /><i style='color:red;'>Testing</i> now</XLinkTitle>";
    switch (_colbrowser.OS) {
        case 'Windows':
             _colbrowser.sampleXml += "<Windows_only xlink:title='Windows only (C:\\)' xlink:href='"+currFilePath+"dirGen.js?f=C:\\'></Windows_only>";
             break;
        case "Mac":
             _colbrowser.sampleXml += "<Mac_only xlink:title='Mac only (/Users)' xlink:href='"+currFilePath+"dirGen.js?f=/Users'></Mac_only>";
             // Todo: 3/18/2013: Is this a deliberate fall-through?
       case "Linux":
       default:
           _colbrowser.sampleXml += "<Other_OS xlink:title='Other OS (/)' xlink:href='"+currFilePath+"dirGen.js?f=/'></Other_OS>";
           break;
    }

/* Doesn't work from file:/// or localhost
        "                       <file xlink:href='http://localhost/brettz9/colbrowser/dirGen.js'></file>"+ */
 /* file:///C:/wamp/www/navbarcrumbs/sitemap.xml */
    // UTF-16 can work in IE but not in Firefox due to our configuration
    _colbrowser.sampleXml += "<tests xlink:title='Brett&apos;s tests'><TestLocalhost><name xlink:title='my xltitle (localhost)' xlink:href='http://localhost/standard-sitemap/stdsitemap-ff-ext/trunk/install.xml#xpath1(//*[local-name()=\"id\" and namespace-uri()=\"http://www.mozilla.org/2004/em-rdf#\"])'>directory1 and more<\/name>\n"+
    "            <_127.0.0.1 xlink:href='http://127.0.0.1/navbarcrumbs/sitemap.xml' abc='oka'>filea<\/_127.0.0.1></TestLocalhost>\n"+
"            <TestXPathId xlink:href='http://localhost/navbarcrumbs/sitemap.xml#xpath1(//pg[@id=&quot;pg1&quot;])' abc='ok'>file1<\/TestXPathId>\n"+
"            <TestXPath xlink:href='http://localhost/navbarcrumbs/sitemap.xml#xpath1(//pg)' abc='oka'>file2<\/TestXPath>\n"+
    "                       <TextXIncludeXML><xi:include parse='xml' xpointer='//node' href='file:///C:/Users/Brett/Documents/MindMaps-test.xml'><xi:fallback>Some text</xi:fallback></xi:include></TextXIncludeXML>"+
    "                       <TextXIncludeText><xi:include parse='text' encoding='GB2312' href='file:///C:/Users/Brett/Documents/MindMaps-test4.xml'><xi:fallback>Some text</xi:fallback></xi:include></TextXIncludeText>"+
    "                       </tests>\n<\/Home:Base><"+"?js pseudo3='attr'?><!-- mycomment3 --"+">";

    // STATIC (CHANGEABLE) VARS ACROSS ALL INSTANCES
    _colbrowser.colbrowsCount = 0;

    
    // UTILITY METHODS
    // These 4 only depend on 'that' (and the 3rd depends on the first two)
    // 'that' must be passed in here since we're avoiding crowding the _colbrowser class 
    //    with privileged methods and avoiding public ones (could also be class methods)
    // Fixed: will probably need to make as public or class methods (or privileged?) though in order to easily 
    //           and selectively borrow the methods that depend on these
    // Before: Had been as private functions (which had 'that' sent to them)
    // Now: Implemented as class methods just to indicate that these methods did not have side 
    //   effects (and can still be borrowed)

    _colbrowser._getCurrentColNum = function (that, col) {
        return parseInt(col.id.substr(that.colbrows_prfx.length), 10);
    };
    _colbrowser._getColByNum = function (that, num) {
        return document.getElementById(that.colbrows_prfx + num);
    };
    _colbrowser._getNextCol = function (that, col) {
        var num = _getCurrentColNum(that, col);
        num++;
        return _getColByNum(that, num);
    };
    _colbrowser._scrollColItemIntoView = function (that, targ) {
            
        // CAUSE CLICK OR RIGHT ARROW TO SCROLL NEXT COLUMN INTO VIEW
        var id0 = document.getElementById(that.colbrows_prfx+that.colbrows_suffix);
        var selwidth = that.select_style_width;

        // ADVANCE SCROLL TO THE RIGHT
        id0.scrollLeft = id0.scrollLeft +
                                    parseInt(    selwidth.substr(0, selwidth.length-2), 10    ); // Don't grab pixels from width

        if (!that.select_size) { // Not necessary to do this if the select size is fixed
            // ADVANCE SCROLL HIGHER OR LOWER AS NEEDED
            // Fix: Scroll top doesn't work in IE in select menus: (works in FF, not in IE7): see http://www.quirksmode.org/bugreports/archives/2006/02/scrollTop_in_select_list_in_IE_is_always_0.html ?
            // id0.scrollTop = id0.scrollTop + Tooltip.Y_MENUOFFSET * 2; // 15 * 2; // double it to show extra blank area at bottom too

            // Scroll down a little if option chosen is farther down than 3/5 the visible height, and scroll up if less than 2/5 (could change this formula, and the fractions wouldn't need to total either)
            //if (brettz9.STYLE.getY(targ.options[targ.selectedIndex]) > ...)
            if (targ.selectedIndex*16 >=
                    that.colbrows_style_height.replace(/px$/, '') * 50/100) {
            //    id0.scrollTop = id0.scrollTop + Tooltip.Y_MENUOFFSET * 1.5; // 15 * 2; // double it to show extra blank area at bottom too
            //    id0.scrollTop = brettz9.STYLE.getY(targ.options[targ.selectedIndex]);
                    id0.scrollTop = targ.selectedIndex*16 + 46;
            }
            else if (targ.selectedIndex*16 <
                    that.colbrows_style_height.replace(/px$/, '') * 50/100) { // Otherwise, bring it up
                    id0.scrollTop = targ.selectedIndex*16 - 26;
            //    id0.scrollTop = id0.scrollTop - Tooltip.Y_MENUOFFSET * 1.5; // 15 * 2; // double it to show extra blank area at bottom too
            //    id0.scrollTop = brettz9.STYLE.getY(targ.options[targ.selectedIndex]);
            }
                // id0.scrollTop = that.colbrows_style_height.replace(/px$/, '')*1/2;
        }
    };

    // MAKE ONE PRIVATE CONSTRUCTOR FUNCTION ABOVE PUBLIC
    var _public = {
        colbrowser : _colbrowser
    };
    return _public;
}();
