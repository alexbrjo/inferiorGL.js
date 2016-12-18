/**
 * Prints the default loading screen graphic
 */
function JoResLoad () {
    
    /** Required screen functions */
    this.init = function(world){
        world.getCamera().setScale(1.0);
    };
    
    this.update = function(world, c){};
    
    /**
     * Prints the main menu
     * 
     * @param {Universe} world The entire universe
     * @param {RenderingContext2D} c The context to draw on
     */
    this.print = function (world, c) {
        c.fillStyle = "black";
        c.fillText("Load Screen", -50 - c.camera.x, 0 - c.camera.y);
    };
}
