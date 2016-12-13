/**
 * Prints information about the application that could be useful for debugging
 */
function DebugGraphics() {

    /** The size of a board tile */ 
    var tileSize = 16;
    
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
        if (typeof world.units !== "undefined" && world.units !== null) {
            this.printDebug(world, c);
        }
    };

    /**
     * Prints the Debug console
     * 
     * @param {Universe} world The entire universe
     * @param {RenderingContext2D} c The context to draw graphics
     * 
     * @fix world.time, world.units, world.camera, world.graphics
     */
    this.printDebug = function (world, c) {
        var t = world.time;
        var lines = [
            "GameName in-dev v0.0.1 (" + (Math.round(t.now / 1000) -
                    Math.round(t.started / 1000)) + " seconds old)",
            t.dt * 1000 + " ms / " + t.fps + " fps",
            world.units.list.length + " entities",
            world.graphics.blocks_rendered + "/" +
                    (world.camera.range.x * 2) * (world.camera.range.y * 2) + " Blocks rendered",
            "camera x: " + world.camera.x + " y: " + world.camera.y,
            "( pos ) x: " + Math.round(world.units.p.x) + " y: " + Math.round(world.units.p.y),
            "(Block) x: " + trunc(world.units.p.x) + " y: " + trunc(Math.round(world.units.p.y))
        ];
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
