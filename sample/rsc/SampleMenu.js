/**
 * Prints all the main menu graphics
 */
function JoResMainMenu () {
    
    var logo = null;
    var start = null;
    var build = null;
    
    /**
     * Prints the main menu
     * 
     * @param {Universe} world The entire universe
     * @param {RenderingContext2D} c The context to draw on
     */
    this.print = function (world, c) {
        if (logo === null) logo = world.get("JoRes_logo");
        if (start === null) start = world.get("JoRes_start");
        if (build === null) build = world.get("JoRes_build");
        
        c.drawImage(logo, 
                -(logo.width/2) - c.camera.x, 
                -(logo.height/2) - c.camera.y - 32);
        c.drawImage(start, 
                -(start.width/2) - c.camera.x, 
                -(start.height/2) - c.camera.y);
        c.drawImage(build, 
                -(build.width/2) - c.camera.x, 
                -(build.height/2) - c.camera.y + 16);
    };
}
