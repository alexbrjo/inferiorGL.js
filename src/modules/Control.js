/**
 * Keeps user input up to date
 */
function Control () {
    
    /** If the space bar is pressed down*/
    this.space = false;

    /**
     * 
     * @param {Number} which The char code of the key that is down
     * @param {Boolean} down If the key is down
     */
    this.setKey = function (which, down) {
        if (which >= 65 && which <= 90) {
            var key = String.fromCharCode(which);
            this[key.toLowerCase()] = down;
        } else {
            if (which === 32) this.space = down;
        }
    };
    
    /**
     * Sets all keys a to z to false
     */
    for (var i = 65; i <= 90; i++) {
        this.setKey(i, false);
    }
    
    /**
     * Makes key listeners callback here
     */
    var t = this;
    window.onkeydown = function (x) { t.setKey(x.which, true); };
    window.onkeyup = function (x) { t.setKey(x.which, false); };
}
