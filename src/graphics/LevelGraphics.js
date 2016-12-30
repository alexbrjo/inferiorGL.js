/**
 * The graphics for the terrian, units and entities. Divides up the level into 
 * slices to optimize drawing terrain.
 * 
 * @param {Universe} world The entire universe
 */
function LevelGraphics (world) {

    var slices = [];
    
    var level = world.getUniverse();
    var height = level.height();
    for (var i = 0; i < level.data.length; i ++) { //@TODO don't directly use level.data
        slices.push(new Slice(i, level.sliceSize, height, world));
    }
    
    /**
     * Prints the level
     * 
     * @param {Universe} world The entire Universe
     * @param {RenderingContext2D} c The context to draw on
     */
    this.print = function(world, c) {
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
     * Prints all units in the Unit queue
     * 
     * @param {Universe} world The entire universe
     * @param {RenderingContext2D} c The context to draw graphics
     */
    this.printUnits = function(world, c) {
        var units = world.getUniverse().units;
	for (var i = 0; i < units.length; i++) {
            units[i].print(world, c);
        }
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
        //var blocksWidth = Math.ceil(world.getCamera().canvasWidth / world.getUniverse().tileSize);
        //var slicesToDisplay = Math.ceil( blocksWidth / world.getUniverse().sliceSize) + 1;
        for (var i = 0; i < slices.length; i++) {
            var img = slices[i].getImage(world);
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
    
    this.altered = true;
    this.image.width = this.w * ts;
    this.image.height = this.h * ts;
    this.pos = {
        x: a * w * ts,
        y: 0
    };
    
    /**
     * Gets the slice image and generates a need one if the slice has been 
     * altered.
     * 
     * @param {Universe} world The entire Universe
     */
    this.getImage = function (world) {
        if (world.getUniverse().altered(this.number)) this.generateImage(world);
        return this.image;
    };
    
    /**
     * Generates the slice image
     * 
     * @param {Universe} world The entire Universe
     */
    this.generateImage = function(world) {
        for (var i = 0; i < this.w; i++) {
            for (var j = 0; j < this.h; j++) {
                var block = lvl.generateBlockObject(ts * (i + this.x), ts * j);
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
    };
    this.generateImage(world);
}
