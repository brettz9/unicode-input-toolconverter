//var t = brettz9.trace; // For tracing purposes // Comment out after debugging!
// var a = function (str) {alert(str);}

// SET UP OUR OWN STRATEGY FOR HANDLING DISPLAY WITHIN COLUMNS
function XlinkColDisplayStrategy () {
}
XlinkColDisplayStrategy.prototype.addColumnEntryName = function (appendEl, colEl) {
    var title = brettz9.DOM.getAttributeNSWrapper(colEl, XlinkColDisplayStrategy.xlinkns, 'title');
    appendEl.innerHTML = title ? title : colEl.nodeName;
    /** Start to prepare for being able to open a file
    var href = brettz9.DOM.getAttributeNSWrapper(colEl, XlinkColDisplayStrategy.xlinkns, 'href');
    appendEl.onclick = function () {alert(href);};
     //*/
}
XlinkColDisplayStrategy.prototype.addColumnEntryTitle = function (appendEl, colEl) {
    var title = brettz9.DOM.getAttributeNSWrapper(colEl, XlinkColDisplayStrategy.xlinkns, 'title');
    if (title) {
        appendEl.title = title;
    }
    else {
        appendEl.title = XlinkColDisplayStrategy.MSIE ? colEl.text : colEl.textContent;
    }
//        return 'null';
}
XlinkColDisplayStrategy.xlinkns = 'http://www.w3.org/1999/xlink';
XlinkColDisplayStrategy.MSIE = navigator.userAgent.indexOf('MSIE') !== -1;


// CREATE SPECIFIC OBJECT(S) OF OWN FOR THIS PAGE
//brettz9.mycolbrowser1 = new brettz9.colbrowser('<root><dog/><cat/><fred>adfdfds</fred></root>', myMetaInfoStrategy);
brettz9.mycolbrowser1 = new brettz9.colbrowser(null, null, XlinkColDisplayStrategy);
brettz9.mycolbrowser1.colbrows_style_height = '350px';
// brettz9.mycolbrowser2.tabIndex = 2;
brettz9.DOM.addEvent(window, 'load', function(event){brettz9.mycolbrowser1.init(event);});

/**
//Works fine
brettz9.mycolbrowser2 = new brettz9.colbrowser();

// currently, one can only set these before the init() (as is most likely desired)
brettz9.mycolbrowser2.colbrows_style_height = '400px';
brettz9.mycolbrowser2.colbrows_style_position = 'relative';
brettz9.mycolbrowser2.colbrows_style_overflow = 'auto';
brettz9.mycolbrowser2.colbrows_style_width = '640px';
brettz9.mycolbrowser2.colbrows_style_top = '0px';
brettz9.mycolbrowser2.colbrows_style_left = '160px';

brettz9.mycolbrowser2.colbrows_prfx = 'colbrowsB_';
brettz9.mycolbrowser2.select_style_top = '130px';
brettz9.mycolbrowser2.select_style_width = '200px';
brettz9.mycolbrowser2.select_style_left = 30;
// brettz9.mycolbrowser2.tabIndex = false;

brettz9.DOM.addEvent(window, 'load', function(event){brettz9.mycolbrowser2.init(event, true);}); // 'true' for 2nd arg. ensures 'Go to column view' button has no handlers and thus won't override ability of first column browser to receive events (if remove this handler, the 2nd colbrowser will receive focus upon pushing the Go To Column View button)'
//*/