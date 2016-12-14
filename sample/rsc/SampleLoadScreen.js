/**
 * Prints all the main menu graphics
 */
function JoResLoadScreen () {
    
    /**
     * Prints the main menu
     * 
     * @param {Universe} world The entire universe
     * @param {RenderingContext2D} c The context to draw on
     */
    this.print = function (world, c) {
        c.fillStyle = "black";
        c.fillText("Load Screen", -50 - world.camera.x, 0 - world.camera.y);
    };
}
