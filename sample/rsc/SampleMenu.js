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
        c.fillStyle = "black";
        c.fillText("Main menu: Press space to start", -50 - c.camera.x, 0 - c.camera.y);
    };
}
