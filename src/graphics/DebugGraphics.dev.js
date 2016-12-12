function DebugGraphics() {

    /** The size of a board tile */ 
    var tileSize = 16;
    
    /** 
     * Truncates a position to a block location
     *  
     * @param {Number} x Position to truncate to tile postition.
     */
    var trunc = function(x) { return Math.trunc(x/tileSize, 2); };

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
     * @BUG if array isn't defined graphs don't work
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

        /** Print Stat Grpahic */
        var graphX = 0;
        var graphY = 400;
        var graphmag = 300;

        /** BLOCKS RENDERED GRAPH */
        this.addStat("br", this.blocks_rendered);
        var arr = this.blocks_rendered;
        c.strokeStyle = "red"; // blocks rendered
        c.beginPath();
        c.moveTo(graphX, graphY -
                ((arr[i] / ((world.camera.range.x * 2) * (world.camera.range.y * 2))) * graphmag));
        for (var i = 1; i < arr.length; i++) {
            c.lineTo(graphX + i, graphY -
                    ((arr[i] / ((world.camera.range.x * 2) * (world.camera.range.y * 2)))) * graphmag);
        }
        c.stroke();

        /** ENTITIES RENDERED GRAPH */
        this.addStat("er", world.units.list.length);
        arr = this.entities_rendered;
        c.strokeStyle = "blue"; // entities rendered
        c.beginPath();
        c.moveTo(graphX, graphY - arr[0] / 6 * graphmag);
        for (var i = 1; i < arr.length; i++) {
            c.lineTo(graphX + i, graphY - arr[i] / 6 * graphmag);
        }
        c.stroke();

        /** FRAMES PER SECOND GRAPH */
        this.addStat("fps", world.time.fps);
        arr = this.frame_rate;
        c.strokeStyle = "green"; //fps
        c.beginPath();
        c.moveTo(graphX, graphY - arr[0] / 60 * graphmag);
        for (var i = 1; i < arr.length; i++) {
            c.lineTo(graphX + i, graphY - arr[i] / 60 * graphmag);
        }
        c.stroke();
    };
    
    /** The history of the number of blocks rendered for the last 300 frames */
    this.blocks_rendered = new Array(300);

    /** The history of the number of entities rendered for the last 300 frames */
    this.entities_rendered = new Array(300);

    /** The history of the frame rate for the last 300 frames */
    this.frame_rate = new Array(300);

    /**
     * Adds a value to a statistic and returns the statistic array.
     * 
     * @param {String} stat The 2 char String that corresonds to a statistic.
     * @param {Number} value The value to add to the statistic array.
     * @returns {Array|Boolean} Array of stats or false if invalid stat param
     */
    this.addStat = function (stat, value) {
        
        if (stat === "blocks_rendered" || stat === "br") {
            this.blocks_rendered.unshift(this.blocks_rendered.pop());
            this.blocks_rendered[0] = value;
            return this.blocks_rendered;
            
        } else if (stat === "entities_rendered" || stat === "er") {
            this.entities_rendered.unshift(this.entities_rendered.pop());
            this.entities_rendered[0] = value;
            return this.entities_rendered;
            
        } else if (stat === "frame_rate" || stat === "fps") {
            this.frame_rate.unshift(this.frame_rate.pop());
            this.frame_rate[0] = value;
            return this.frame_rate;
            
        } else {
            return false;
        }
    };
}
