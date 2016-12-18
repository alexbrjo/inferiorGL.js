/**
 * Splash logo for the initial loading screen
 * 
 * @param {function} f The callback function
 */
function JoResSplash (f) {
    
    /** Total time in milliseconds the splash is shown */
    var DIS_TIME = 1500;
    
    /** Time in milliseconds it takes the splash to fade in or out */
    var FADE_TIME = 250;
    
    /** The amount of time to pause after splash is faded out */
    var ANI_TIME =  DIS_TIME + 250;
    
    /** Function to callBack when animation is complete */
    var callBack = f;
    
    /** Start time of animation */
    var startTime = null;
    
    /** End time of animation */
    var endTime = null;
    
    /** The splash image */
    var splash = null;
    
    /** The alpha component of the splash image */
    var alpha = 1.0;
    
    /**
     * Initializes the screen
     * 
     * @param {Universe} world The entire world
     */
    this.init = function(world){
        startTime = world.getTime().now;
        endTime = startTime + ANI_TIME;
        splash = world.get("JoRes_logo");
        world.getCamera().setScale(2.0);
    };
    
    /**
     * Updates the screen
     * 
     * @param {Universe} world The entire world
     */
    this.update = function (world) {
        if (world.getTime().now > endTime) {
            callBack();
        } else {
            alpha = getAlpha(world.getTime().now);
        }
    };
    
    /**
     * Prints the splash screen
     * 
     * @param {Universe} world The entire universe
     * @param {RenderingContext2D} c The context to draw on
     */
    this.print = function (world, c) {
        c.globalAlpha = alpha;
        c.drawImage(splash, 
            -(splash.width/2) - c.camera.x, -(splash.height/2) - c.camera.y);
        c.globalAlpha = 1.0;
    };
    
    /**
     * Sets the function to be called on completion of the animation
     * 
     * @param {Function} f The function to callback
     */
    this.whenComplete = function (f) {
        callBack = f;
    };
    
    /**
     * Return the alpha for fading in and out the graphics
     * 
     * @param {Number} time The current time
     */
    var getAlpha = function (time) {
        var aniTime = time - startTime;
        if (aniTime < FADE_TIME) {
            return aniTime / FADE_TIME;
        } else if (aniTime > DIS_TIME - FADE_TIME) {
            return aniTime < DIS_TIME ? (DIS_TIME - aniTime) / FADE_TIME : 0;
        } else {
            return 1.0;
        }
    };
}
