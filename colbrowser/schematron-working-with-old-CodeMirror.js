/*global window */
(function () {
    var schemaEditor, xmlEditor,
        targetObj = {},
        $_GET = targetObj;
    function import_request_variables () { // (MIT-style license)
        // http://kevin.vanzonneveld.net
        // +      original by: Jalal Berrami
        // (Simplified version)
        var i = 0, current = '', url = '', vars = '', arrayBracketPos = -1, arrName='', win = this.window, prefix = '';
        for(i = 0, url = win.location.href, vars = url.substring(url.lastIndexOf("?") + 1, url.length).split("&"); i < vars.length; i++){
            current = vars[i].split("=");
            current[1] = decodeURIComponent(current[1]);
            arrayBracketPos = current[0].indexOf('[');
            if (arrayBracketPos !== -1) {
                arrName = current[0].substring(0, arrayBracketPos);
                arrName = decodeURIComponent(arrName);
                if (!targetObj[prefix+arrName]) {
                    targetObj[prefix+arrName] = [];
                }
                targetObj[prefix+arrName].push(current[1] || null);
            }
            else {
                current[0] = decodeURIComponent(current[0]);
                targetObj[prefix+current[0]] = current[1] || null;
            }
        }
    }
    import_request_variables();

    function createHTMLElement (name) {
        return d.createElementNS(ns_xhtml, name);
    }
    
    function preg_quote (str, delimiter) {
        // http://kevin.vanzonneveld.net
        // +   original by: booeyOH
        // +   improved by: Ates Goral (http://magnetiq.com)
        // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
        // +   bugfixed by: Onno Marsman
        // +   improved by: Brett Zamir (http://brett-zamir.me)
        return str.replace(/'[.\\+*?\[\^\]$(){}=!<>|:\-]/g, '\\$&');
    }

    
    var ns_sch = 'http://www.ascc.net/xml/schematron',
        ns_svrl = 'http://purl.oclc.org/dsdl/svrl', // Fix: provide as output
        ns_xml = 'http://www.w3.org/XML/1998/namespace',
        ns_xhtml = 'http://www.w3.org/1999/xhtml';

    var queryBindings = {'xslt':{variable:'$'}}, queryBinding,
        d = document, doc, lastIndex, oldHref = window.location.href,
        namespaces = {},
        letValues, phaseExternal; // Configurable via interface

    function $ (id) {
        return d.getElementById(id);
    }
    function missingAtt (att) { // We accept the common but non-standard behavior of returning null when attribute does not exist
        return att === null || att === '';
    }
    
    function getFileAsXML( url ) {
        var req = window.ActiveXObject ? new window.ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
        if (!req) {throw new Error('XMLHttpRequest not supported');}
        req.open("GET", url, false);
        req.send(null);
        return req.responseXML; // Allow responseText and convert?
    }
    
    function parseToDomEl (str) {
        doc = new window.DOMParser().parseFromString(str, 'text/xml');
        return doc.documentElement;
    }
    function $$ (myID) {
        return doc.evaluate('//*[@id="'+myID+'"]', doc, null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    function innerReplace (dom, parent) { // like innerHTML
        if (typeof parent === 'string') {
            parent = $(parent);
        }
        if (typeof dom === 'string') {
            dom = parseToDomEl(dom);
        }
        var node = parent.firstChild;
        while (node) {
            parent.removeChild(node);
            node = parent.firstChild;
        }
        parent.appendChild(dom);
    }
    function ser (dom) {
        return new window.XMLSerializer().serializeToString(dom);
    }
    function a (str) { // debugging
        alert(ser(str));
    }
    function legendTextOrLink (fieldset, legend, richAtt, text) {
        fieldset.setAttribute('title', richAtt.getAttribute('fpi'));
        fieldset.setAttributeNS(ns_xml, 'lang', richAtt.getAttributeNS(ns_xml, 'lang'));
        // xmlspace = phases[i].getAttributeNS(ns_xml, 'space');

        if (!missingAtt(richAtt.getAttribute('see'))) {
            var a = createHTMLElement('a');
            a.setAttribute('href', richAtt.getAttribute('see'));
            a.textContent = text;
            legend.appendChild(a);
        }
        else {
            legend.textContent = text;
        }
        fieldset.appendChild(legend);

        var icon = richAtt.getAttribute('icon');
        var img = createHTMLElement('img');
        img.setAttribute('width', 20);
        img.setAttribute('height', 20);
        img.setAttribute('src', icon);
        fieldset.appendChild(img);
    }

    // Used JavaScript, though perhaps could just use XSLT template--more flexible for display
    function iterateChildren (parent, cb, contentHolder) {
        var node = parent.firstChild;
        while (node) {
            cb(node, contentHolder);
            node = node.nextSibling;
        }
    }

    // Fix: optimize by returning object of all children, then reference by key
    function getChildrenByName (ns, name, parent) {
        var node = parent.firstChild;
        var children = [];
        while (node) {
            if (node.nodeType === 1 && node.localName === name && node.namespaceURI === ns) {
                children.push(node);
            }
            node = node.nextSibling;
        }
        return children;
    }
    function getChildByName (ns, name, parent) {
        var node = parent.firstChild;
        while (node) {
            if (node.nodeType === 1 && node.localName === name && node.namespaceURI === ns) {
                return node;
            }
            node = node.nextSibling;
        }
        return null;
    }
    function _processInline (node, container) {
        if (node.nodeType === 1) { // Element 
            var localName = node.localName;
            switch(localName) {
                case 'dir':
                    var bdo = createHTMLElement('bdo');
                    bdo.setAttribute('dir', node.getAttribute('value')); // Only element expected is dir with value attribute
                    bdo.textContent = node.textContent;
                    container.appendChild(bdo);
                    break;
                case 'emph':
                    var em = createHTMLElement('em');
                    em.textContent = node.textContent;
                    container.appendChild(em);
                    break;
                case 'span':
                    var span = createHTMLElement('span');
                    span.setAttribute('class', node.getAttribute('class'));
                    span.textContent = node.textContent;
                    container.appendChild(span);
                    break;
                case 'p':
                    var p = createHTMLElement('p');
                    var psId = node.getAttribute('id');
                    if (psId) {
                        p.setAttribute('id', psId);
                    }
                    var psClass = node.getAttribute('class');
                    if (psClass) {
                        p.className = psClass;
                    }
                    var psIcon = node.getAttribute('icon');
                    if (psIcon) {
                        var img = createHTMLElement('img');
                        img.setAttribute('width', 20);
                        img.setAttribute('height', 20);
                        img.setAttribute('src', psIcon);
                    }
                    var pContent = d.createDocumentFragment();
                    iterateChildren(node, _processInline, pContent);
                    innerReplace(pContent, p);
                    if (psIcon) {
                        p.insertBefore(img, p.firstChild);
                    }
                    container.appendChild(p);
                    break;
                default:
                    break;
            }
        }
        else if (node.nodeType === 3) { // Text
            container.appendChild(node.cloneNode(true));
        }
    }

    function processPattern (abstractClass, params, delim) {
        var abstractPattern = $$(abstractClass);
        if (abstractPattern) {
            var abstractInst = abstractPattern.cloneNode(true);
            var els = abstractInst.getElementsByTagNameNS(ns_sch, '*');
            for (var i=0, ellength=els.length; i < ellength; i++) {
                for (var j=0, elAttLen=els[i].attributes.length; j < elAttLen; j++) {
                    var att = els[i].attributes[j];
                    for (var k=0; k < params.length; k++) {
                        var name = params[k].getAttribute('name');
                        var value = params[k].getAttribute('value');
                        // Fix: only need to replace in attributes?
                        // Don't substitute literals for which there is no replacement
                        att.value = att.value.replace(new RegExp(preg_quote(delim+name), 'g'), value); // will auto-escape
                    }
                }
            }
            return abstractInst;
        }
        return false;
    }

    function resolveIncludes (includes) {
        for (var i=0; i < includes.length; i++) {
            var include = includes[i];
            var href = include.getAttribute('href');
            
            if (!/^https?:/.test(href)) { // Allow references within or below the same directory (should fix to allow other relative references; could make dependent on parse_url())
                var pathPos = href.indexOf('/') === 0 ? oldHref.indexOf('/', 8)-1 : oldHref.lastIndexOf('/');
                href = oldHref.slice(0, pathPos+1)+href;
            }
            
            // untested
            if (!missingAtt(href)) {
                var includeReplace = getFileAsXML(href);
                include.parentNode.replaceChild(includeReplace, include);
            }
        }
    }

    function buildPatternElement (pattern) {

        if (pattern.getAttribute('abstract') === 'true') { // Could display at least, but will be resolved for use elsewhere
            return d.createDocumentFragment(); // just give an empty placeholder to append
        }

        // Resolve includes
        var includes = getChildrenByName(ns_sch, 'include', pattern);
        resolveIncludes(includes);

        // Add lets in scope (Fix: pass somewhere)
        var patternLetValues = {};
        var lets = getChildrenByName(ns_sch, 'let', pattern);
        if (lets.length) { // Store
            for (var i=0; i < lets.length; i++) {
                var name = lets[i].getAttribute('name');
                patternLetValues[name] = lets[i].getAttribute('value');
            }
        }

        // Resolve instance
        if (pattern.getAttribute('is-a')) {
            // process param children of pattern children and check for abstract attributes
            var delim = queryBindings[queryBinding].variable; // $ for xslt
            var converted = processPattern(pattern.getAttribute('is-a'), pattern.getElementsByTagNameNS(ns_sch, 'param'), delim);
            if (converted) {
                pattern.parentNode.replaceChild(converted, pattern);
            }
        }

        // Now build the content
        var patternFieldset = createHTMLElement('fieldset');
        patternFieldset.setAttribute('id', pattern.getAttribute('id'));
        var patternLegend = createHTMLElement('legend');
        legendTextOrLink (patternFieldset, patternLegend, pattern,
                                                'Pattern: '+(pattern.getAttribute('title') ? pattern.getAttribute('title') : ''));
        var patternContent = d.createDocumentFragment();
        iterateChildren(pattern, _processInline, patternContent);
        patternFieldset.appendChild(patternContent); // p

        return patternFieldset;
    }

    function displaySchemaElement () {
        var activePhases;
        
        try {
            var str = schemaEditor.getCode();
        }
        catch(e) {
            setTimeout(displaySchemaElement, 100);
        }

        var schema = parseToDomEl(str);
        queryBinding = schema.getAttribute('queryBinding');
        var schemaVersion = schema.getAttribute('schemaVersion'),
            defaultPhase = schema.getAttribute('defaultPhase'),
            // The following are part of "rich" declaration
            icon = schema.getAttribute('icon'),
            see = schema.getAttribute('see'), 
            fpi = schema.getAttribute('fpi'),
            id = schema.getAttribute('id'),
            xmllang = schema.getAttributeNS(ns_xml, 'lang'),
            xmlspace = schema.getAttributeNS(ns_xml, 'space'); // Not in use at present

        if (!queryBinding) {
            queryBinding = 'xslt';
        }
        if (!queryBindings[queryBinding]) {
            alert('Unrecognized queryBinding');
        }

        var img = createHTMLElement('img');
        img.setAttribute('width', 16);
        img.setAttribute('height', 16);
        img.src = icon;
        innerReplace(img, 'schemaImgSpan');
        
        $('schemaA').href = see;
        $('schematronDisplayResults').getElementsByTagName('div')[0].id = id;
        $('schemaA').title = 'PublicID: '+fpi+
                            '; version: '+ schemaVersion+
                            '; queryBinding: '+queryBinding+
                            '; defaultPhase: '+defaultPhase;
        $('schemaA').setAttributeNS(ns_xml, 'lang', xmllang);
        
        var includes = getChildrenByName(ns_sch, 'include', schema);
        resolveIncludes(includes);
        
        var title = getChildByName(ns_sch, 'title', schema);
        if (title) {
            var titleContent = d.createDocumentFragment();
            iterateChildren(title, _processInline, titleContent);
            innerReplace(titleContent, 'schematronDisplaySpan');
        }

        // var ps = getChildrenByName(ns_sch, 'p', schema);
        var df = d.createDocumentFragment();
        iterateChildren(schema, _processInline, df); // Will get 'p's
        innerReplace(df, 'schematronDisplay');

        var nss = getChildrenByName(ns_sch, 'ns', schema);
        namespaces = {};
        if (nss.length) { // Store
            for (i=0; i < nss.length; i++) {
                var prefix = nss[i].getAttribute('prefix');
                namespaces[prefix] = nss[i].getAttribute('uri');
            }
        }
        
        var lets = getChildrenByName(ns_sch, 'let', schema);
        var letsInDoc = [];
        if (lets.length) { // Store
            for (i=0; i < lets.length; i++) {
                var name = lets[i].getAttribute('name');
                letsInDoc.push(name);
                if (!letValues[name]) { // Only overwrite, if not supplied outside of the schema by the user already (can add to GUI)
                    letValues[name] = lets[i].getAttribute('value');
                }
            }
        }
        $('lets').value = ' ';
        for (var letv in letValues) {
            if (letsInDoc.indexOf(letv) !== -1) { // avoid user-supplied variables which are not defined in the document
                $('lets').value += letv+'='+letValues[letv]+' ';
            }
        }
        $('lets').value = $('lets').value.slice(1, -1);

        // Make all phases available visibly in GUI at least
        var phases = getChildrenByName(ns_sch, 'phase', schema);

        var node = $('DEFAULT').nextSibling;
        while (node) {
            node.parentNode.removeChild(node);
            node = $('DEFAULT').nextSibling;
        }
        

        if (missingAtt(defaultPhase)) {
            $('DEFAULT').textContent = 'DEFAULT';
        }
        else {
            $('DEFAULT').textContent = 'DEFAULT ('+defaultPhase+')';
        }

        // Fix: is activePhases necessary here?
        if (phaseExternal !== '#ALL' && !missingAtt(defaultPhase)) {
            if (phaseExternal === '#DEFAULT') {
                phaseExternal = defaultPhase;
            }
            // User wants to execute only one specific phase on schema (e.g., "defaultPhase" attribute)
            activePhases = [$$(phaseExternal)];
        }
        else {
            activePhases = phases;
        }

        
        for (i=0; i < phases.length; i++) { // Populate drop-down menu and show documentation elements
            
            var phaseLetValues = {};
            includes = getChildrenByName(ns_sch, 'include', phases[i]);
            resolveIncludes(includes);

            var phaseId = phases[i].getAttribute('id');
            var fieldset = createHTMLElement('fieldset');
            var legend = createHTMLElement('legend');
            fieldset.setAttribute('id', phaseId);

            if (phaseExternal === '#ALL' || phaseId === phaseExternal) {
                fieldset.className = 'activePhase';
                legendTextOrLink(fieldset, legend, phases[i], 'Active phase');
            }
            else {
                fieldset.className = 'passivePhase';
                legendTextOrLink(fieldset, legend, phases[i], 'Passive phase');
            }
            
            var phaseContent = d.createDocumentFragment();
            iterateChildren(phases[i], _processInline, phaseContent);
            fieldset.appendChild(phaseContent);

            lets = getChildrenByName(ns_sch, 'let', phases[i]);
            if (lets.length) { // Store
                for (i=0; i < lets.length; i++) {
                    name = lets[i].getAttribute('name');
                    phaseLetValues[name] = lets[i].getAttribute('value');
                }
            }

            var actives = getChildrenByName(ns_sch, 'active', phases[i]);
            for (var j=0; j < actives.length; j++) {

                var activeId = actives[j].getAttribute('id');
                var activeFieldset = createHTMLElement('fieldset');
                activeFieldset.setAttribute('id', activeId);
                var activeLegend = createHTMLElement('legend');
                activeLegend.textContent = 'Active element';
                activeFieldset.appendChild(activeLegend);
                
                var activeContent = d.createDocumentFragment();
                iterateChildren(actives[j], _processInline, activeContent);
                activeFieldset.appendChild(activeContent);
                
                if (fieldset.className === 'activePhase') {
                    var pattern = $$(actives[j].getAttribute('pattern'));
                    var patternFieldset = buildPatternElement(pattern);
                    activeFieldset.appendChild(patternFieldset);
                    // Todo: process let/rule of pattern children; pass on letValues, phaseLetValues, patternLetValues
                }
                fieldset.appendChild(activeFieldset);
            }


            // Also populate the menu
            $('schematronDisplay').appendChild(fieldset);
            var option = createHTMLElement('option');
            option.textContent = phaseId;
            option.value = phaseId;
            $('phaseExternal').appendChild(option);
        }
        if ($_GET['phaseExternal']) {
            for (var i=0, len = $('phaseExternal').options.length; i < len; i++) {
                if ($('phaseExternal').options[i].value === $_GET['phaseExternal']) {
                    $('phaseExternal').selectedIndex = i;
                    break;
                }
            }
        }
        else if ($('phaseExternal').options.length - 1 >= lastIndex) { // Need to set manually since had to delete to recreate above
            $('phaseExternal').selectedIndex = lastIndex;
        }

        if (!activePhases) { // No phases, so just go with the patterns
            var patterns = getChildrenByName(ns_sch, 'pattern', schema);
            // INCOMPLETE
        }        

        var diagnostics = getChildByName(ns_sch, 'diagnostics', schema);
        if (diagnostics) {
            var diagnosticIncludes = getChildrenByName(ns_sch, 'include', diagnostics);
            resolveIncludes(diagnosticIncludes);
            // use RICH attributes and content, etc. when display
            // var diagnostic_s = getChildrenByName(ns_sch, 'diagnostic', diagnostics); // Will probably just get it live
        }
        
        // a(schema)
    }
    function validateSchematron () {
        // Todo: Implement validation, using an schematron XML stored and hidden here against the user-supplied Schematron, and if invalid, return errors
        var errors = '<div>Schematron validation not implemented yet!</div>';
        return errors;
    }
    
    function displaySchematron () {
        var errors = validateSchematron();
        if (errors) {
            innerReplace(errors, 'schematronResults');
            // return false; // Can still allow form to be displayed
        }
        displaySchemaElement();
        return true;
    }
    
    function init (ev, textboxChange) {
        if ($_GET['lets'] && !textboxChange) {
            $('lets').value = $_GET['lets'].join(' ');
        }
        
        letValues = {}; // Will override those in schema

        if ($('lets').value) {
            var pairs = $('lets').value.replace(/\s\s+/g, ' ').split(' ');
            for (var i=0; i < pairs.length; i++) {
                var pair = pairs[i].split('=');
                letValues[pair[0]] = pair[1];
            }
        }
        
        if (ev) {
            var lets = [];
            for (var l in letValues) {
                lets.push(encodeURIComponent(l+'='+letValues[l]));
            }
            var noQMark = window.location.href.indexOf('?') !== -1 ? window.location.href.indexOf('?') : window.location.href.length;
            window.location.href = window.location.href.slice(0, noQMark)+'?phaseExternal='+
                                                                encodeURIComponent(
                                                                    $('phaseExternal').value
                                                                )+'&lets[]='+lets.join('&lets[]=');
        }

        // If passing in as URL argument, need to escape hash as %23, so %23DEFAULT or %23ALL or id
        // To avoid this problem we could check value of window.location.hash and overwrite GET, but that would encourage people to use this (and would interfere with any real ids)
        lastIndex = $('phaseExternal').selectedIndex;
        phaseExternal = $_GET['phaseExternal'] || $('phaseExternal').value;
        
        displaySchematron();
    }
    this.init = init;    
    
    
    window.addEventListener('load', function () {
        // SYNTAX COLORING
        schemaEditor = CodeMirror.fromTextArea('userSchematron', {
            height: "500px",
            stylesheet: "CodeMirror/css/xmlcolors.css",
            path: "CodeMirror/js/",
            parserfile: "parsexml.js",
            continuousScanning: 500,
            onChange : init
        });
        xmlEditor = CodeMirror.fromTextArea('userXML', {
            height: "500px",
            stylesheet: "CodeMirror/css/xmlcolors.css",
            path: "CodeMirror/js/",
            parserfile: "parsexml.js",
            continuousScanning: 500,
            onChange : init
        });
        
        // EVENTS
        $('phaseExternal').addEventListener('change', function (e) {
            init(e);
        }, false);
        $('lets').addEventListener('change', function (e) {
            init(e, true);
        }, false);

        // START
        init();
    }, false);
}());



/*
 Tutorial at http://www.dpawson.co.uk/schematron/running.html#ex3.2

 Start element:
 schematron-output = element schematron-output {
    attribute title { text }?,
    attribute phase { xsd:NMTOKEN }?,
    attribute schemaVersion { text }?,
    human-text*,
    ns-prefix-in-attribute-values*,
    (active-pattern,
    (fired-rule, (failed-assert | successful-report)*)+)+
}
# only namespaces from sch:ns need to be reported
ns-prefix-in-attribute-values = element ns-prefix-in-attribute-values {
    attribute prefix { xsd:NMTOKEN },
    attribute uri { text },
    empty
}
# only active patterns are reported
active-pattern = element active-pattern {
    attribute id { xsd:ID }?,
    attribute name { text }?,
    attribute role { xsd:NMTOKEN }?,
    empty
}
# only rules that are fired are reported,
fired-rule =
    element fired-rule {
    attribute id { xsd:ID }?,
    attribute context { text },
    attribute role { xsd:NMTOKEN }?,
    attribute flag { xsd:NMTOKEN }?,
    empty
}
# only references are reported, not the diagnostic
diagnostic-reference = element diagnostic-reference {
    attribute diagnostic { xsd:NMTOKEN },
    human-text
}
# only failed assertions are reported
failed-assert = element failed-assert {
    attlist.assert-and-report,
    diagnostic-reference*,
    human-text
}
# only successful asserts are reported
successful-report = element successful-report {
    attlist.assert-and-report,
    diagnostic-reference*,
    human-text
}

attlist.assert-and-report = attribute id { xsd:ID }?,
attribute location { text },
attribute test { text },
attribute role { xsd:NMTOKEN }?,
attribute flag { xsd:NMTOKEN }?
human-text = element text { text }

 **/