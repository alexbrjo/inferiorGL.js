/**
 * Keeps user input up to date
 */
function Control () {
    
    /** The current mouse event */
    this.current = null;
    
    /** List of last 10 mouseEvents */
    this.clickList = new Array(10);
    
    this.clickPos = function () {
        this.blocks_rendered.unshift(this.blocks_rendered.pop());
            this.blocks_rendered[0] = value;
    };
    
    /** If the mouse is clicked */
    this.isDown = false;
    
    /** If the space bar is pressed down*/
    this.space = false;

//         __ _     _                           
//        / /(_)___| |_ ___ _ __   ___ _ __   ___ 
//       / / | / __| __/ _ \ '_ \ / _ \ '_ \ / __|
//      / /__| \__ \ ||  __/ | | |  __/ | | |\__ \
//      \____/_|___/\__\___|_| |_|\___|_| | ||___/
//       KeyEvent Listeners, MouseEvent Listeners                                     

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
     * Starts a click
     * 
     * @param {MouseEvent} mouseEvent The mouse event from the HTML document
     */
    this.setMouseDown = function (mouseEvent) {
        this.setMouse(mouseEvent);
        this.clickList.unshift(this.clickList.pop());
        this.clickList[0] = mouseEvent;
    };
    
    /**
     * Ends a click
     * 
     * @param {MouseEvent} mouseEvent The mouse event from the HTML document
     */
    this.setMouseUp = function (mouseEvent) {
        this.setMouse(mouseEvent);
    };
    
    /**
     * Sets the position of the mouse
     * 
     * @param {MouseEvent} mouseEvent The mouse event from the HTML document
     */
    this.setMouse = function (mouseEvent) {
        this.current = mouseEvent;
        this.isDown = mouseEvent.buttons > 0;
    };
    
    /**
     * Set key listener functions here
     */
    var t = this;
    window.onkeydown = function (keyEvent) { t.setKey(keyEvent.which, true); };
    window.onkeyup = function (keyEvent) { t.setKey(keyEvent.which, false); };
    window.onmousedown = function (mouseEvent) { t.setMouseDown(mouseEvent); }; 
    window.onmouseup = function (mouseEvent) { t.setMouseUp(mouseEvent); }; 
    window.onmousemove = function (mouseEvent) { t.setMouse(mouseEvent); }; 
}
