/*global Geometry, Tooltip, _mouseout, setGeometry */

// // This code is from the book JavaScript: The Definitive Guide, 5th Edition,
// by David Flanagan. Copyright 2006 O'Reilly Media, Inc. (ISBN #0596101996)
// with any modifications by Brett Zamir noted by "Brett"

// The following values are used by the schedule() method below.
// They are used like constants but are writeable so that you can override
// these default values.
Tooltip.X_OFFSET = 12;  // Pixels to the right of the mouse pointer // was 25 (Brett)
Tooltip.Y_OFFSET = 20;  // Pixels below the mouse pointer // was 15 (Brett)
Tooltip.DELAY = 0;    // Milliseconds after mouseover
Tooltip.Y_MENUOFFSET = 15; // Multiple for pixels per menu item down (Brett)

/**
 * This method schedules a tooltip to appear over the specified target
 * element Tooltip.DELAY milliseconds from now. The argument e should
 * be the event object of a mouseover event. This method extracts the
 * mouse coordinates from the event, converts them from window
 * coordinates to document coordinates, and adds the offsets above.
 * It determines the text to display in the tooltip by querying the
 * "tooltip" attribute of the target element. This method
 * automatically registers and unregisters an onmouseout event handler
 * to hide the tooltip or cancel its pending display.
 */
 
// Adapted from 16.2.3 of JavaScript: The Definitive Guide, 5th Edition (pp. 361-362)
// Get the X coordinate of the element el
Tooltip.prototype._getX = function(element) {
    var x = 0;
    
    for (var el = element; el; el = el.offsetParent) { // iterate the offsetLefts
        x += el.offsetLeft;
        }
    
    for (el = element.parentNode; el && el != document.body; el = el.parentNode) {
        if (el.scrollLeft) {
                    x -= el.scrollLeft; // subtract scrollbar values
                }
        }
    // This it the X coordinate with document-internal scrolling accounted for.
    return x; // Return the total offsetLeft
};
// Get the X coordinate of the element el
Tooltip.prototype._getY = function(element) {
    var y = 0;
    
    for (var el = element; el; el = el.offsetParent) { // iterate the offsetTops
        y += el.offsetTop;
        }
    
    for (el = element.parentNode; el && el != document.body; el = el.parentNode) {
        if (el.scrollTop) {
                    y -= el.scrollTop; // subtract scrollbar values
                }
        }
    
    // This it the Y coordinate with document-internal scrolling accounted for.
    return y; // Return the total offsetTop
};

Tooltip.prototype._schedule = function(id, target, e, startleft, starttop) { // Brett added 'id'
    // Get the text to display.  If none, we don't do anything
    
    //Fix: This should be detected via an algorithm related to offsetLeft, offsetTop (Brett) (See JavaScript: The Definitive Guide, 5th ed., sec. 16.2.3, pp. 361-362 and errata about 16.2.3 at http://www.oreilly.com/catalog/jscript5/errata/jscript5.unconfirmed)
    
    // Brett added
    /*
    if (window.getComputedStyle) {
        var currtop = window.getComputedStyle(target, null).top; // Could grab coordinates if positioned absolutely
        var currleft = window.getComputedStyle(target, null).left;
    }
    else if (target.currentStyle) {
        var currtop = target.currentStyle.top;
        var currleft = target.currentStyle.left;
    }
    currtop = parseInt(currtop);
    currleft = parseInt(currleft);
    */
    
    var currleft = this._getX(target)-startleft;
    var currtop = this._getY(target)-starttop;
    
    
    var selindex = target.selectedIndex; // used for adjusting positioning
    target = target.options[target.selectedIndex];
    
    var text = target.innerHTML; // was target.getAttribute("tooltip"); Brett
    //if (!text) return;// Brett

    // The event object holds the mouse position in window coordinates
    // We convert these to document coordinates using the Geometry module
    
    setGeometry(); // Safe to add this here, since this will only be called after an onload handler
    var x = Geometry.getHorizontalScroll(); // e.clientX + 
    var y = Geometry.getVerticalScroll();// e.clientY + 

    if (!isNaN(currtop)) {
        y += currtop;
    }
    if (!isNaN(currleft)) {
        x += currleft;
    }
    
    
    var colbrows = document.getElementById(id);

//    y += parseInt(colbrows.style.top, 10);
    x += parseInt(colbrows.style.left, 10);
    
    
    // Add the offsets so the tooltip doesn't appear right under the mouse
    x += Tooltip.X_OFFSET;
    y += Tooltip.Y_OFFSET;
    
    y += (Tooltip.Y_MENUOFFSET * selindex);

    // Schedule the display of the tooltip
    var self = this;  // We need this for the nested functions below
    var timer = window.setTimeout(function() { self.show(text, x, y); },   Tooltip.DELAY);

    // Brett moved this before the reference to _mouseout to avoid JSLint errors
    // Here is the implementation of the event listener
    function _mouseout() {
        //self.hide();                // Hide the tooltip if it is displayed, // Brett
        window.clearTimeout(timer); // cancel any pending display,
        // and remove ourselves so we're called only once
        if (target.removeEventListener) {
            target.removeEventListener("mouseout", _mouseout, false);
        }
        else if (target.detachEvent) {
            target.detachEvent("onmouseout",_mouseout);
        }
        else {
            target.onmouseout = null;
        }
    }

    
    // Also, register an onmouseout handler to hide a tooltip or cancel
    // the pending display of a tooltip.
    if (target.addEventListener) {
        target.addEventListener("mouseout", _mouseout, false);
    }
    else if (target.attachEvent) {
        target.attachEvent("onmouseout", _mouseout);
    }
    else {
        target.onmouseout = _mouseout;
    }

};

// Define a single global Tooltip object for general use
Tooltip.tooltip = new Tooltip();

/*
 * This static version of the schedule() method uses the global tooltip
 * Use it like this:
 * 
 *   <a href="www.davidflanagan.com" tooltip="good Java/JavaScript blog"
 *      onmouseover="Tooltip.schedule(this, event)">David Flanagan's blog</a>
 */
Tooltip.schedule = function(id, target, e, startleft, starttop) { 
      Tooltip.tooltip._schedule(id, target, e, startleft, starttop); 
};
