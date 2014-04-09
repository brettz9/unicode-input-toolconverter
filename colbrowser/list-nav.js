
var brows = {
    init : function (e) {
        var uls = brettz9.DOM.getElementsWrapper(this.htmlns, 'ul');
                for (var i=0; i < uls.length; i++) {
                        var bindings = {down: this.down}
                        var keymap = new Keymap(bindings);
                        keymap.install(uls[i]);                        
                }
    },
        
        down : function  (el, keyid, e, returnkey) {
              var targ = this.MSIE ? e.srcElement : e.target;
              alert(targ.nodeName.toLowerCase());
//        targ.style.backgroundColor='aqua';return false;
        },
    cycle : function (els) {
        var li = document.getElementById('too');
        li.focus();
    },
    htmlns : 'http://www.w3.org/1999/xhtml',
        MSIE : navigator.userAgent.indexOf('MSIE') !== -1
}
