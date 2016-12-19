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
    this.h = 0, this.w = 0, this.tileSize = 0; // height, width and tileSize of the level
    this.resources = []; // every image sprite used in the level
    this.terrain_sprite = []; // the sprite sheet for the terrain
    this.unit_index = []; // not implemented
    this.sprite_index = []; // <BLock data> LARGE ARRAY HOLDS TERRAIN SPRITE INFO
    this.data = [[]]; // <Level data> VERY LARGE ARRAY HOLDS ALL BLOCKS
    this.unit_data = []; // not implemented
    
    Object.assign(this, new JoResLevel());
    /********************************************/
    
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
        this.graphics = [new LevelGraphics(16), new HudGraphics()];
        graphics.addTask(this);
        world.getCamera().setBounds(0, 0, 
                this.w * this.tileSize, this.h * this.tileSize, true);
        world.getCamera().setScaleBounds(2.0, 4.0);
        
        for (var i = 0; i < this.unit_data.length; i++) {
            if (this.unit_data[i] === 1) {
                this.newPlayer(i * this.tileSize, 0);
            } else if (this.unit_data[i] === 2) {
                this.newSoldier(i * this.tileSize, 0);
            } else if (this.unit_data[i] === 3) {
                this.newRPGsoldier(i * this.tileSize, 0);
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
     * Creates and adds a new Player object to the Unit array. 
     * 
     * @param {Number} x The x coordinate to create the Unit.
     * @param {Number} y The y coordinate to create the Unit.
     */
    this.newPlayer = function (x, y) {
        var e = Object.assign(new Unit(this.units.length, x, y), new Player());
        this.units.push(e);
    };
    
    /**
     * Creates and adds a new Soldier to the Unit array.
     * 
     * @param {Number} x The x coordinate to create the Unit.
     * @param {Number} y The y coordinate to create the Unit.
     */
    this.newSoldier = function (x, y) {
        var e = Object.assign(new Unit(this.units.length, x, y), new Soldier());
        this.units.push(e);
    };
    
    /**
     * Creates and adds a new RPG Soldier to the Unit array.
     * 
     * @param {Number} x The x coordinate to create the Unit.
     * @param {Number} y The y coordinate to create the Unit.
     */
    this.newRPGsoldier = function (x, y) {
        var e = Object.assign(new Unit(this.units.length, x, y), new RPGsoldier());
        this.units.push(e);
    };
    
    this.trunc = function (x) {
        return Math.trunc(x / this.tileSize, 2);
    };
    
    this.terrain_sprite_index = function (i) {
        return this.sprite_index[i];
    };

    this.terrainSpritesNum = function () {
        return this.sprite_index.length;
    };

    this.terrain = function (x, y) {
        if (x > this.w || x < 0 || y < 0 || y > this.h ||
                typeof x === "undefined" || typeof y === "undefined")
            return 0;
        return this.data[x][y];
    };

    this.getHeight = function () {
        return this.h;
    };

    this.getWidth = function () {
        return this.w;
    };

    this.setData = function (x, y, n) {
        if (x > this.w || x < 0 || y < 0 || y > this.h) {
            return false;
        } else {
            this.data[x][y] = n;
            return true;
        }
    };

    this.getData = function () {
        return this.data;
    };

    // returns basic AABB object for x y
    this.getBlockObject = function (i, j) {
        // i, j are both in pixels
        var pos = {x: this.trunc(i), y: this.trunc(j)};
        var _id = this.terrain(pos.x, pos.y);
        var b = this.terrain_sprite_index(_id);

        return{
            //position on img file
            sprite: {
                x: b.sprite.x,
                y: b.sprite.y,
                w: b.sprite.w,
                h: b.sprite.h,
                id: _id
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
