/**
 * The graphics for the terrian, units and entities.
 */
function LevelGraphics (world) {
    
    var tileSize = 0;
    var trunc = function(x) { return Math.trunc(x/tileSize, 2); };
    
    var slices = [];
    
    var slice_size = 8;
    
    var level = world.getUniverse();
    var height = level.data[0].length;
    for (var i = 0; i < level.data.length / slice_size; i ++) {
        slices.push(new Slice(i, slice_size, height, world));
    }
    
    /**
     * Prints the level
     * 
     * @param {Universe} world The entire Universe
     * @param {RenderingContext2D} c The context to draw on
     */
    this.print = function(world, c) {
        tileSize = world.getUniverse().tileSize;
        this.printBackground(world, c);
        this.printSlices(world, c);
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
                i * 240, -50, 240, 240);
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
    
    /**
     * Draws all the slices
     * Todo:
     *    + Draw only 3 or 4 slices closest to player
     *    + Clip slices images so only drawn inside canvas bounds
     * 
     * @param {Universe} world The entire Universe
     * @param {RenderingContext} c The rendering context of the canvas
     */
    this.printSlices = function (world, c) {
        for (var i = 0; i < slices.length; i++) {
            var img = slices[i].image;
            var pos = slices[i].pos;
            c.drawImage(img,
                0, 0, img.width, img.height,
                pos.x - c.camera.x, pos.y - c.camera.y, img.width, img.height);
        }
    };
}

/**
 * A slice of the world. Generates image for the slice to limit number of images
 * drawn per second.
 * 
 * @param {Number} a The slice id, also the 'slices' array idex
 * @param {Number} w Width of the slice
 * @param {Number} h Height of the slice
 * @param {Universe} world The entire Universe
 */
function Slice (a, w, h, world) {
    this.number = a;
    
    this.w = w;
    this.h = h;
    
    this.x = a * this.w;
    
    this.image = document.createElement('canvas');
    
    var ctx = this.image.getContext('2d');
    var lvl = world.getUniverse();
    var ts = lvl.tileSize;
    
    this.image.width = this.w * ts;
    this.image.height = this.h * ts;
    this.pos = {
        x: a * w * ts,
        y: 0
    };
    
    for (var i = 0; i < this.w; i++) {
        for (var j = 0; j < this.h; j++) {
            var block = lvl.getBlockObject(ts * (i + this.x), ts * j);
            var pos = block.pos; // pos of tile in background
            var img = block.sprite; //pos of sprite on img file

            if (img.id > 0) {
                ctx.drawImage(world.get(lvl.terrain_sprite),
                        img.x * ts, img.y * ts, img.w, img.h,
                        pos.x - (this.x * ts), pos.y, pos.w, pos.h);
                this.blocks_rendered++;
            }
        } // for j
    } // for i
    this.altered = false;
   
}
