/**
 * Splash logo for the initial loading screen
 * 
 * @param {Number} displayTime Total time in milliseconds the splash is shown
 * @param {Number} fadeSpeed Time in milliseconds it takes the splash to fade
 *                           in or out
 * @param {Number} pause The amount of time to pause after splash is faded out
 */
function SplashGraphics (displayTime, fadeSpeed, pause) {
    
    var DIS_TIME = displayTime || 0;
    
    var FADE_TIME = fadeSpeed || 0;
    
    var ANI_TIME =  DIS_TIME + (pause || 0);
    
    /** Function to callBack when animation is complete */
    var callBack;
    
    /** Start time of animation */
    var startTime = null;
    
    /** End time of animation */
    var endTime = null;
    
    var splash = new Image();
    splash.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAAlCAYAAAD7u09NAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AwOAQAtu6IdUgAAAiVJREFUaN7tWDGugzAMdb4ycQnmLFyhh6mYCluP0S1lqjjMv0IXZi6RNX8hyIQ4CXzgF/1YqoiCndgv2H4pQJIkSRYIc01+57mOtb30/eJNX89H9PpldT8UEE45U2fZzGmp1Dius0xLpVghBLy7brUDsmlnc/XtCgCgB/AOBebLNXnpe3h3HbN/ezlR364MAJz7yKbVAACFEH8HyH+WBEgCJAGSAEmAHMBDFkuAzJEkznCO4enkJ3gcIHUzzrJUn60Nus4ykEqx4TmZdxE5DAp2Egdrg2I7HGk32lD6ls1kj11SRirFbLAN83URLEPMyupuH5Bhq15CF0vkMAEsqzuTTQuyabVs2lH/42qIDcqeTBWx8PH6wT11YPXl7ROFqFWzGkIW1a0ub0cGaOqEeZbVnRVCaMLWpCR7PR8jKPysJ+66JeNTN4dIXEpxsdX17ToePD9xCpAdyNFlov9C4Na1n5k6MrRMLZUCyHM7nSZP0o7Q/03BRUHOOtDw1WgAYIUQWN/ZrewUI3mIK+9Cn2aE3UTf0g2t5bPd1K8kSZIkKYTQkXXQXVBcxrh/2+9d795dx/A4xtZXyI1ezN6+tZfae4PwbYABoO4J9jrUuj69mPEaG8qeU8EsacNmgxBIp/yDCAfkQ3JpTodSZone1vUG78l9n/qW12zsABVsrN6evnEDAFV8qPexm9m2riBj9UI2e/j2L1vtrO2eFYBQM0iSJMnu8gON3OByW0Ib0QAAAABJRU5ErkJggg==";
           
    /**
     * Prints the splash screen
     * 
     * @param {Universe} world The entire universe
     * @param {RenderingContext2D} c The context to draw on
     */
    this.print = function (world, c) {
        if (startTime === null) {
            startTime = world.time.now;
            endTime = startTime + ANI_TIME;
        } 
        
        if (world.time.now > endTime) {
            callBack();
        } else {
            c.globalAlpha = getAlpha(world.time.now);
            c.drawImage(splash, 
                -(splash.width/2) - world.camera.x, -(splash.height/2) - world.camera.y);
            c.globalAlpha = 1.0;
        }
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
