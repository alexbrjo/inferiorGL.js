/**
 * The graphics for the terrian, units and entities.
 */
function LevelGraphics () {
    
    var tileSize = 16;
    var trunc = function(x) { return Math.trunc(x/tileSize, 2); };
    
    /**
     * Prints the level
     * 
     * @param {Universe} world The entire Universe
     * @param {RenderingContext2D} c The context to draw on
     */
    this.print = function(world, c) {
        this.printBackground(world, c);
        this.printTerrain(world, c);
    	this.printUnits(world, c);
    };
    
    /**
     * Responsible for printing all objects in the Unit queue
     * 
     * @param {Universe} world The entire universe
     * @param {RenderingContext2D} c The context to draw graphics
     */
    this.printBackground = function(world, c) {    
        for (var i = 0; i < 3; i++) {
            c.drawImage(world.get("bg.png"),
                0, 0, 240, 240,
                i*240, -50, 240, 240);
        }
    };
    
    /**
     * Responsible for printing all objects in the Unit queue
     * 
     * @param {Universe} world The entire universe
     * @param {RenderingContext2D} c The context to draw graphics
     */
    this.printUnits = function(world, c) {
        var units = world.getUniverse().units;
	for (var i = 0; i < units.length; i++) {
            var u = units[i].obj(world.getTime());
            var img = u.sprite;
            var pos = u.pos;
            c.save();
            if(units[i].invunerableUntil > world.getTime().now) c.globalAlpha = 0.7;
            c.drawImage(world.get(img.id),
                    img.x, img.y, img.w, img.h,
                    pos.x - c.camera.x, pos.y - c.camera.y, img.w, img.h);
            c.restore();
        }
    };

    /**
     * Prints terrain
     * 
     * @param {Universe} world The entire universe
     * @param {RenderingContext2D} c The context to draw graphics
     */
    this.printTerrain = function(world, c) {
        var lvl = world.getUniverse();
        this.blocks_rendered = 0;
        // the +2 try to change to a variable or integrate into camera.range.x

        for (var i = trunc(c.camera.x) - c.camera.range.x + 2; 
        		 i < trunc(c.camera.x) + c.camera.range.x + 2;
        		 i++) {
            for (var j = trunc(c.camera.y) - c.camera.range.y + 2; 
            		 j < trunc(c.camera.y) + c.camera.range.y + 2; 
            		 j++) {
                var block = lvl.getBlockObject(tileSize * i, tileSize * j);
                var pos = block.pos; // pos of tile in background
                var img = block.sprite; //pos of sprite on img file
                    
                if (img.id > 0) {
                    c.drawImage(world.get(lvl.terrain_sprite),
                            img.x * tileSize, img.y * tileSize, img.w, img.h,
                            pos.x - c.camera.x, pos.y - c.camera.y, pos.w, pos.h);
                    this.blocks_rendered++;
                }
            } // for j
        } // for i
    };
}
