/**
 * The graphics for drawing a button
 * 
 * @param {Image} img The background image of the button
 * @param {Number} x The x coordinate of the button relative to the anchor point
 * @param {Number} y The y coordinate of the button relative to the anchor point 
 * @param {Number} w The width of the button 
 * @param {Number} h The height of the button
 * @param {String} va The anchor point of the button
 * @param {String} ha The anchor point of the button
 * @param {Function} f The callBack function for the button
 */
function Button (img, x, y, w, h, va, ha, f) {
    
    /** The background img of the button */
    this.img = img;
    
    /** The x coordinate of the button relative to the anchor point */
    this.x = x;
    
    /** The y coordinate of the button relative to the anchor point  */
    this.y = y;
    
    /** The width of the button */
    this.width = w | img.width;
    
    /** The height of the button */
    this.height = h | img.height;
    
    /**
     * The vertical achor point of the button
     * top, bottom, center
     */
    this.verticalAnchor = va;
    
    /**
     * The horizontal achor point of the button
     * left, right, center
     */
    this.horizonalAnchor = ha;
    
    /**
     * The anchor point of the image
     */
    this.anchorPoint = {x: 0, y: 0};    
    
    /** The function to call when the button has been clicked */
    var callBack = f;
    
    /** 
     * Sets the callBack function 
     * 
     * @param {Function} f The function to callback
     */
    this.onClick = function (f) { callBack = f; };
    
    this.graphics = new ButtonGraphics(img);
    
    /** The curret state of the button default|hover|clicked */
    this.state = "none";
    
    this.update = function(world){
        var ca = world.getCamera();
        
        // update the Anchor point
        this.state = this.updateState(world);
        this.anchorPoint = this.updateAnchorPoint(
                Math.floor(world.getWidth()/ca.getScale()), 
                Math.floor(world.getHeight()/ca.getScale()));
        this.graphics.set(this.state, 
              { x: this.anchorPoint.x + this.x, 
                y: this.anchorPoint.y + this.y });
            
        return this.state === "clicked" ? callBack : null; 
    };
    
    
    /**
     * Determines the buttons location based on the anchor point
     * 
     * @param {Number} display_width The width of the display
     * @param {Number} display_height The height of the display 
     */
    this.updateAnchorPoint = function (display_width, display_height) {
        var x = 0, y = 0;
        // Updates the horizontal anchor point
        if (this.horizonalAnchor === "right") {
            x = display_width - this.width;
        } else if (this.horizonalAnchor === "center") {
            x = (display_width - this.width)/ 2;
        }
        
        // Updates the vertial anchor point
        if (this.verticalAnchor === "bottom") {
            y = display_height - this.height;
        } else if (this.verticalAnchor === "center") {
            y = (display_height - this.height)/ 2;
        }
        return {x: x, y: y};
    };
    
    /**
     * Determines the state of the button
     * 
     * @param {Universe} world The entire Universe
     * @returns {undefined}
     */
    this.updateState = function(world) {
        var m = world.getController().current;
        var c = world.getCamera();
        if (m !== null && 
                this.contains(m.offsetX/c.getScale(), m.offsetY/c.getScale())) {
            if (world.getController().isDown) {
                // This "claims" the mouse click, no other componenets will 
                // think the mouse has been clicked
                world.getController().isDown = false;
                return "clicked";
            } else {
                return "hover";
            }
        } else {
            return "default";
        }
    };
    
    /**
     * Checks if a point is contained in a button
     * 
     * @param {type} x The x coordinate to test for 
     * @param {type} y The y coordinate to test for
     * @return {Boolean} if the point is contained in the button
     */
    this.contains = function (x, y) {
        if (x > this.anchorPoint.x + this.x && 
                x < this.anchorPoint.x +  this.x + this.width) {
            if (y > this.anchorPoint.y + this.y && 
                    y < this.anchorPoint.y + this.y + this.height) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }; 
}
