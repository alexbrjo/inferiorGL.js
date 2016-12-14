/**
 * Prints all the main menu graphics
 */
function JoResMainMenu () {
    
    /**
     * Prints the main menu
     * 
     * @param {Universe} world The entire universe
     * @param {RenderingContext2D} c The context to draw on
     */
    this.print = function (world, c) {
        c.fillStyle = "red";
        c.fillRect(-100 - world.camera.x, -25 - world.camera.y, 200, 50);
        c.fillStyle = "black";
        c.fillText("SPACE TO PLAY", -50 - world.camera.x, 0 - world.camera.y);
    };
}
