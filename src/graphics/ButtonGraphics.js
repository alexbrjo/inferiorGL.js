/**
 * The graphics for drawing a button
 * 
 * @param {Image} img The background image of the button
 * @param {Number} x The x coordinate of the button relative to the anchor point
 * @param {Number} y The y coordinate of the button relative to the anchor point 
 */
function ButtonGraphics (img, x, y) {
    
    /** The background img of the button */
    this.img = img;
    
    /** The x coordinate of the button relative to the anchor point */
    this.x = x | 0;
    
    /** The y coordinate of the button relative to the anchor point  */
    this.y = y | 0; 

    /** The current state of the button */
    this.state = "";
    
    /**
     * Sets the current state and position of the button
     * 
     * @param {String} state The state of the button
     * @param {Object} pos The position of the button
     */
    this.set = function (state, pos) {
        this.state = state;
        this.x = pos.x;
        this.y = pos.y;
    };
    
    /**
     * Prints the button based on state
     * 
     * @param {Universe} world The entire Universe
     * @param {RenderingContext2D} c The rendering context
     */
    this.print = function (world, c) {
        // determine which version of the button to print based on the state
        if (this.state === "clicked") {
            this.printClicked(c);
        } else  if (this.state === "hover") {
            this.printHover(c);
        } else if (this.state === "default"){
            this.printDefault(c);
        }
    };
    
    /**
     * Draws the default button graphics
     * 
     * @param {RenderingContext2D} c The rendering context
     */
    this.printDefault = function (c) {
        c.drawImage(this.img, this.x, this.y);
    };
    
    /**
     * Draws the button graphics in the hover state
     * 
     * @param {RenderingContext2D} c The rendering context
     */
    this.printHover = function (c) {
        c.globalAlpha = 0.8;
        c.drawImage(this.img, this.x, this.y);
        c.globalAlpha = 1.0;
    };
    
    /**
     * Draws the button graphics in the clicked state
     * 
     * @param {RenderingContext2D} c The rendering context
     */
    this.printClicked = function (c) {
        c.globalAlpha = 0.6;
        c.drawImage(this.img, this.x, this.y);
        c.globalAlpha = 1.0;
    };
}
