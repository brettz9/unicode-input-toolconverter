// This code is from the book JavaScript: The Definitive Guide, 5th Edition,
// by David Flanagan. Copyright 2006 O'Reilly Media, Inc. (ISBN #0596101996)
// but it has been altered without comment (to be used for a mouse event) by Brett Zamir

var MouseEvent = {};

MouseEvent.send = function(target) {
    if (typeof target == "string") {
        target = document.getElementById(target);
    }

    // Create an event object. If we can't create one, return silently
    var e;
    if (document.createEvent) {            // DOM event model
        // Create the event, specifying the name of the event module.
        // For a mouse event, we'd use "MouseEvents".
        e = document.createEvent("MouseEvents");
        // Initialize the event object, using a module-specific init method.
        // Here we specify the event type, bubbling, and noncancelable.
        // See Event.initEvent, MouseEvent.initMouseEvent, and UIEvent.initUIEvent
        // Brett: needed to change 2nd argument to false since was getting triggered unintentionally
        e.initMouseEvent("click", false, false, null, null, null, null, null, null, null, null, null, null, null, null);
    }
    else if (document.createEventObject) { // IE event model
        // In the IE event model, we just call this simple method
        e = document.createEventObject( );
    }
    else {
        return;  // Do nothing in other browsers
    }

    // Dispatch the event to the specified target.
    if (target.dispatchEvent) {
        target.dispatchEvent(e); // DOM
    }
    else if (target.fireEvent) {
        target.fireEvent("onclick", e); // IE
    }
};
