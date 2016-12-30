/**
 * Prints information about the application that could be useful for debugging
 */
function DebugGraphics() {

    /** The size of a board tile */ 
    var tileSize = 0;
    
    /** 
     * Truncates a position to a block location
     *  
     * @param {Number} x Position to truncate to tile postition.
     */
    var trunc = function(x) { return Math.trunc(x/tileSize, 2); };

    /**
     * Prints the debugger
     * 
     * @param {type} world
     * @param {type} c
     */
    this.print = function (world, c) {
        tileSize = world.getUniverse().tileSize;
        this.printAppDebug(world, c);
        if (typeof world.getUniverse().units !== "undefined" &&
            world.getUniverse().units.length > 0) this.printGameDebug(world, c);
    };

    /**
     * Prints the Debug console
     * 
     * @param {Universe} world The entire universe
     * @param {RenderingContext2D} c The context to draw graphics
     * 
     * @fix world.time, world.units, world.camera, world.graphics
     */
    this.printAppDebug = function (world, c) {
        var t = world.getTime();
        var lines = [
            "GameName in-dev v0.0.1 (" + (Math.round(t.now / 1000) -
                    Math.round(t.started / 1000)) + " seconds old)",
            t.dt * 1000 + " ms / " + t.fps + " fps"
        ];
        this.printInverseText(lines, c);
    };
    
    this.printGameDebug = function (world, c) {
        var u = world.getUniverse().units;
        var cam = world.getCamera();
        var lines = ["","",
            u.length + " entities",
            "camera x: " + cam.x + " y: " + cam.y,
            "( pos ) x: " + Math.round(u[0].x) + " y: " + Math.round(u[0].y),
            "(Block) x: " + trunc(u[0].x) + " y: " + trunc(Math.round(u[0].y))
        ];
        this.printInverseText(lines, c);
    };
    
    this.printInverseText = function (lines, c) {
        c.save(); //saves graphics settings without 'difference composition'
        c.globalCompositeOperation = "difference";
        c.fillStyle = "white";
        c.font = "14px monospace";

        var xspace = 12;
        var yspace = 12;
        for (var i = 1; i <= lines.length; i++) {
            c.fillText(lines[i - 1], xspace, yspace * (i + 1));
        }
        c.restore(); //restores graphics settings
    };
}
