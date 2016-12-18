/**
 * Stores data for how the screen is drawn.
 */
function Camera(){
    /** The x and y position of the camera */
    this.x = 0;
    this.y = 0,
            
    /** The object to center the camera on */        
    this.focusObj = {x:0, y:0};
      
    this.desiredSize = 16 * 16;
      
    /** How many times bigger pixels appear to be after zoomed */
    var scale = 1.0;
    
    /** This controls the scaling of the program */
    var rawScale = 1.0;
    
    /** Sets the zoom of the Camera */
    this.setScale = function (s) {
        scale = s;
    };
    
    /** Gets the entire scale of the program */
    this.getScale = function () {
        return scale * rawScale;
    }
   ;
    /** How many pixels the camera's image encompasses */
    this.range = {x:0, y:0};
    
    /** The limits, both near and far of the Camera */
    var bounds = {areSet: false, left: null, right: null, top: null, bottom: null};
    
    /** If the camera has been zoomed */
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
        var half_width = display_width / (2 * this.getScale());
        var half_height = display_height / (2 * this.getScale());
        
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
        rawScale = Math.floor(display_width / this.desiredSize);
        this.range.x = Math.round( display_width / (tileSize * this.getScale()));
        this.range.y = Math.round(display_height / (tileSize * this.getScale()));
        this.zoomed = true;
    };
    
    /**
     * Sets new bounds for the camera's position
     * 
     * @param {Number} left The left bound of the camera
     * @param {Number} right The right bound of the camera
     * @param {Number} top The upper bound of the camera
     * @param {Number} bottom The lower bound of the camera
     * @param {boolean} disable If the camera bounds are disabled after setting
     */
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
    
    /**
     * Disables camera bounds
     */
    this.enableBounds = function () {bounds.areSet = true;};
    
    /**
     * Enables camera bounds
     */
    this.disableBounds = function () {bounds.areSet = false;};
    
    /**
     * Sets the reference to the object for the camera to focus on.
     * 
     * @param {Object} o Object with x and y to focus camera on
     */
    this.setFocusObj = function (o) {
        this.focusObj = o;
    };
}
