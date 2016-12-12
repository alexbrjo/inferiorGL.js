/**
 * Stores data for how the screen is drawn.
 */
function Camera(){
    this.x = 0;
    this.y = 0,
    this.focusObj = null;
    this.scale = 1.0;
    this.maxScale = 6;
    this.edgeBuffer = 2;
    this.range = {x:0, y:0};
    var bounds = {areSet: false, left: null, right: null, top: null, bottom: null};
    this.zoomed = false;
    
    /** The size of a board tile */ 
    var tileSize = 16;
    
    /**
     * Updates the position of the camera.
     * 
     * @param {Number} display_width The width of the display.
     * @param {Number} display_height The height of the display.
     */
    this.update = function (display_width, display_height) {
         
        if (!this.zoomed) {this.resize(display_width, display_height);}
         
        /**
         * Centers Camera on the focusobj and prevents from moving out of 
         * bounds
         */
        var half_width = display_width / (2 * this.scale);
        var half_height = display_height / (2 * this.scale);
        this.x = Math.round(Math.round(this.focusObj.x) - half_width);
        this.y = Math.round(Math.round(this.focusObj.y) - half_height);
         
        /** 
         * Prevents Camera from moving out of bounds
         */
        if (bounds.areSet) { 
            if(this.x < bounds.left) this.x = bounds.left;
            if(this.x + display_width > bounds.right) this.x = bounds.right;
            if(this.y < bounds.top) this.y = bounds.top;
            if(this.y + display_height > bounds.bottom) this.y = bounds.bottom;
        }
    };
    
    /**
     * Resizes Camera range
     * 
     * @param {Number} display_width The width of the display.
     * @param {Number} display_height The height of the display.
     */
    this.resize = function(display_width, display_height) {
        this.range.x = Math.round( display_width / (tileSize * this.scale));
        this.range.y = Math.round(display_height / (tileSize * this.scale));
        this.zoomed = true;
    };
    
    this.setBounds = function (left, right, top, bottom, disable) {
        if (typeof left   !== "null" && typeof left   !== "number" &&
            typeof right  !== "null" && typeof right  !== "number" && 
            typeof top    !== "null" && typeof top    !== "number" &&
            typeof bottom !== "null" && typeof bottom !== "number") {
            throw TypeError("4 arguements of {Null|Number} required");
        }
        
        bounds.left = left;
        bounds.right = right;
        bounds.top = top;
        bounds.bottom = bottom;
        
        if (disable !== true) {
            bounds.areSet = true;
        }
    };
    this.enableBounds = function () {bounds.areSet = true;};
    this.disableBounds = function () {bounds.areSet = false;};
    
    this.setFocusObj = function (o) {
        this.focusObj = o;
    };
}
