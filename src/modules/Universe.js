/**
 * Extends a Universe. Contains the game loop, level data, graphics and units. 
 * Responsible for updating Units, the game board and the screen.
 */  
function Universe(){
    
    /********************************************\
     *         Initializes Loaded Level         *
    \********************************************/
    
    // ensures a level has been properly loaded, doesn't validate.
    if (typeof JoResLevel !== "function") {
        throw new Error("Level not loaded");
    }
    
    this.name = "", this.author = "", this.desc = "";
    this.h = 0, this.w = 0, this.tileSize = 0, this.sliceSize = 0; 
    this.min_scale = 1, this.max_scale = 1;
    
    this.resources = []; // every image sprite used in the level
    this.terrain_sprite = []; // the sprite sheet for the terrain
    this.unit_index = []; // not implemented
    this.sprite_index = []; // <BLock data> LARGE ARRAY HOLDS TERRAIN SPRITE INFO
    this.data = [[[]]]; // <Level data> VERY LARGE ARRAY HOLDS ALL BLOCKS
    this.unit_data = []; // not implemented
    
    Object.assign(this, new JoResLevel());
    /********************************************/
    
    /** {Array} Keeps track of which slices are altered */
    var alter = new Array(this.data.length);
    for (var i = 0; i < alter.length; i++) {
        alter[i] = false;
    }
    
    /** {Array} Stores Units  */
    this.units = [];
    
    /** Graphics for the Universe */
    this.graphics = [];
    
    /**
     * Gets the player object.
     * 
     * @returns {Player} the player object
     * @throws {Error} if the player DNE
     */
    this.player = function () {
        if (this.units.length > 0) {
            return this.units[0];
        } else {
            throw new Error("No player found");
        }
    };
    
    /**
     * Initalizes the Universe
     * 
     * @param {Universe} world The getting of the world
     * @param {Graphics} graphics The core graphics object.
     */
    this.init = function (world, graphics) {
        // set up graphics
        this.graphics = [new LevelGraphics(world), new HudGraphics()];
        graphics.addTask(this);
        
        // set up camera
        world.getCamera().setBounds(0, 0, 
                this.w * this.tileSize, this.h * this.tileSize, true);
        world.getCamera().setScaleBounds(this.min_scale, this.max_scale);
        world.getCamera().setTileSize(this.tileSize);
        
        for (var i = 0; i < this.unit_data.length; i++) {
            if (this.unit_data[i] > 0) { 
                this.addUnit(this.unit_data[i] - 1, i * this.tileSize, i);
            }
        }
        world.getCamera().setFocusObj(this.player());
    };
    
    /**
     * The main game loop. Called dt/1000 times a second.
     * 
     * @param {World} world The getters for the Universe.
     */
    this.update = function(world){
        if (this.units.length > 0) {
            var toDestroy = [];
            // move this.units and objects
            for (var i = 0; i < this.units.length; i++) {
                var u = this.units[i];
                u.update(world);
                if (u.destroy)
                    toDestroy.push(u.id);
            }
            for (var i = 0; i < toDestroy.length; i++) {
                for (var j = 0; i < this.units.length; j++) {
                    if (this.units[j].id === toDestroy[i]) {
                        this.units.splice(j, 1);
                        break;
                    }
                }
            }
        }
    };
    
    /**
     * Prints the Universe
     * 
     * @param {Unniverse} world The entire Universe
     * @param {RenderingContext2D} c The graphical context
     */
    this.print = function (world, c) {
        for (var i = 0; i < this.graphics.length; i++) {
            this.graphics[i].print(world, c);
        } 
    };

    /**
     * Getters, setters and small math utility functions 
     */
    this.trunc = function (x) { return Math.trunc(x / this.tileSize, 2); };
    this.terrain_sprite_index = function (i) { return this.sprite_index[i]; };
    this.height = function () { return this.h; };
    this.width = function () { return this.w; };
    this.altered = function (n) { return alter[n]; };
    //this.getData = function () { return this.data; };

    /**
     * Creates and adds a new Unit to the Unit array. 
     * 
     * @param {Number} type The type of the unit
     * @param {Number} x The x coordinate to create the Unit.
     * @param {Number} y The y coordinate to create the Unit.
     */
    this.addUnit = function (type, x, y) {
        var unit = null;
        
        if (typeof this.unit_index[type] === "function") {
            unit = this.unit_index[type]();
        } else if (typeof this.unit_index[type] === "object") {
            unit = Object.assign(this.unit_index[type]);
        }
        
        if (typeof unit.move !== "function") {
            unit.move = BasicAI[unit.move];
        }
        
        this.units.push(Object.assign(new Unit(this.units.length, x, y), unit));
    };
    
    /**
     * Finds block data for valid coordinates
     * 
     * @param {Number} x The x coordinate of the data
     * @param {Number} y The y coordinate of the data
     * @returns {number} Block data
     */
    this.getBlock = function (x, y) {
        if (x > this.w || x < 0 || y < 0 || y > this.h ||
                typeof x === "undefined" || typeof y === "undefined")
            return 0;
        return this.data[Math.floor(x / this.sliceSize)][x % this.sliceSize][y];
    };
    
    /** 
     * Sets a block to a value if the coordinate is valid
     * 
     * @param {Number} x The x coordinate of the data
     * @param {Number} y The y coordinate of the data
     * @param {Number} n The value to set the block to
     * @returns {Boolean} if the coordinate was valid and block data was set
     */
    this.setBlock = function (x, y, n) {
        if (x > this.w || x < 0 || y < 0 || y > this.h) {
            return false;
        } else {
            var slice = Math.floor(x / this.sliceSize);
            alter[slice] = true;
            this.data[slice][x % this.sliceSize][y] = n;
            return true;
        }
    };
    
    /** 
     * Generates basic AABB object for a block
     * 
     * @param {Number} i The x coordinate of the block
     * @param {Number} j The y coordinate of the block
     * @returns {Object} with location of image on sprite sheet, position of
     *      the block on the canvas and the AABB of the block
     */
    this.generateBlockObject = function (i, j) {
        // i, j are both in pixels
        var pos = {x: this.trunc(i), y: this.trunc(j)};
        var id = this.getBlock(pos.x, pos.y);
        var b = this.terrain_sprite_index(id);

        return{
            //position on img file
            sprite: {
                x: b.sprite.x,
                y: b.sprite.y,
                w: b.sprite.w,
                h: b.sprite.h,
                id: id
            },
            //position on canvas
            pos: {
                x: pos.x * this.tileSize,
                y: pos.y * this.tileSize,
                w: b.sprite.w,
                h: b.sprite.h
            },
            // Axis-aligned bounding box
            AABB: {
                x: pos.x * this.tileSize + b.AABB.x,
                y: pos.y * this.tileSize + b.AABB.y,
                w: b.AABB.w,
                h: b.AABB.h,
                s: function (x, y) {
                    if (x > this.x && x < this.x + this.w) {
                        if (y > this.y && y < this.y + this.h) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
            }
        };
    };
}
