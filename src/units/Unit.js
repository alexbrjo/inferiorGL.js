/**
 * The base unit class.
 * 
 * @param {Number} id ID of the unit, index of the object in the Unit array
 * @param {Number} x The starting x position of the Unit
 * @param {Number} y The startign y position of the Unit
 */
function Unit(id, x, y) {
    
    /** The id of the Unit */
    this.id = id;
    
    /** The x and y position of the Unit in the world */
    this.x = x, this.y = y;
    
    /** The width and height of a Unit */
    this.width = 0, this.height = 0;
    
    /** 
     * The tick displacement. This prevents multiple Units from having 
     * in-sync animations 
     */
    this.tick = Math.random() * 200;

    /** The direction left (0) and right (1) */
    this.direction = 0;
    
    /** The Unit's moving speed */
    this.speed = 1;
    
    /** Speed cap. Avoids really high velocities when falling. */
    this.maxSpeed = 10;
    
    /** If the Unit is airbourne */
    this.airbourne = false;
    
    /** The x and y components of the Unit's velocity */
    this.vx = 0, this.vy = 0;

    /** The Unit img */
    this.img = null;
    
    /** The path to the unit's image */
    this.imgPath = "";
    
    /** The number of frames in sprite animations */
    this.frames = 1;
    
    /** 
     * The displacement of the unit's sprite on each space on the sprite
     * sheet. 
     */
    this.imgDisplacement = [0, 0];
    
    /** Whether the Unit can move or not */
    this.canMove = true;
    
    /** The hit points of the Unit */
    this.health = 1;
    
    /** The maximum number of hitPoints a Unit can ever have */
    this.maxHealth = 1;
    
    /** Is this Unit currently scheduled to be destoryed */
    this.destroy = false;

    /**
     * If the unit is currently pushing against a surface to the left, right
     * up or down.
     */
    this.contact = {left: false, right: false, up: false, down: false};

    /**
     * Generates the object's axis aligned bounding box
     * 
     * @returns {AABB} The objects axis aligned bounding box
     */
    this.aabb = function () {
        return {
            x: Math.round(this.x),
            y: Math.round(this.y),
            w: Math.round(this.width),
            h: Math.round(this.height),
            s: function (x, y) { // if a point in contained in the AABB
                if (x > this.x && x < this.x + this.w) {
                    if (y > this.y && y < this.y + this.h) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },
            c: function (c) { // if a second AABB is colliding with the AABB
                if (this.x < c.x + c.w &&
                        this.x + this.w > c.x &&
                        this.y < c.y + c.h &&
                        this.h + this.y > c.y) {
                    return true;
                } else {
                    return false;
                }
            }
        };
    };

    /**
     * Damages the unit a certain number of hitpoints.
     * 
     * @param {Number} d Ammount of damage in hitpoints to take
     */
        this.damage = function (d) {
        this.health -= d;
        if (this.health <= 0) {
            this.destroy = true;
        }
    };
    
    /**
     * This method creates point around the Unit that are used to check 
     * collisions with the world and other entities. 
     * 
     * @param {Number} i The point in to calculate.
     * @param {Point} o A object with and x and y value the translates the point.
     * @returns {Point} An object with an x and y value corresponding to an xy point.
     */
    this.points = function (i, o) {
        var x = 0;
        var y = 0;
        if (typeof o !== "undefined") {
            x = o.x;
            y = o.y;
        }
        switch (i) {
            case 0:
                return {x: x, y: y};
            case 1:
                return {x: x, y: y + this.height * 1 / 2};
            case 2:
                return {x: x, y: y + this.height};
            case 3:
                return {x: x + (this.width * 1 / 2), y: y};
            case 4:
                return {x: x + (this.width * 1 / 2), y: y + this.height};
            case 5:
                return {x: x + this.width, y: y};
            case 6:
                return {x: x + this.width, y: y + this.height * 1 / 2};
            case 7:
                return {x: x + this.width, y: y + this.height};
            default: 
                return 8;
        }
    };

    /**
     * Updates the players position and trying to move in requestioned 
     * direction. This function is kind of final, most units will never have to
     * override this.
     * 
     * @param {Universe} world The entire universe 
     */
    this.update = function (world) {
        if (this.img === null) this.img = world.get(this.imgPath);
        this.move(world);
        var lvl = world.getUniverse();
        this.vy += 0.5;
        // The xy plus the y velocity
        var next = {x: this.x, y: this.y + this.vy};
        for (var i = 0; i < this.points(); i++) {
            var point = this.points(i, next);
            var block = lvl.generateBlockObject(point.x, point.y).AABB;
            if (block.s(point.x, point.y)) {
                // grounded
                if (this.y + this.height <= block.y) {
                    next.y = block.y - this.height;
                    this.vy = 0;
                    this.airbourne = false;
                    this.contact.down = true;
                    break;
                } else {
                    this.contact.down = false;
                }
                // hit head
                if (this.y >= block.y + block.h) {
                    next.y = block.y + block.h;
                    this.vy = 0;
                    this.contact.up = true;
                    break;
                } else {
                    this.contact.up = false;
                }
            }
        }
        this.y = next.y;
        
        // The xy plus the x velocity
        var next = {x: this.x + this.vx, y: this.y};        
        for (var i = 0; i < this.points(); i++) {
            var point = this.points(i, next);
            var block = lvl.generateBlockObject(point.x, point.y).AABB;
            point = this.points(i, next);
            if (block.s(point.x, point.y)) {
                // wall right
                if (this.x + this.width <= block.x) {
                    next.x = block.x - this.width;
                    this.vx = 0;
                    this.contact.right = true;
                    break;
                } else {
                    this.contact.right = false;
                }
                // wall left
                if (this.x >= block.x + block.w) {
                    next.x = block.x + block.w;
                    this.vx = 0;
                    this.contact.left = true;
                    break;
                } else {
                    this.contact.left = false;
                }
            }

        }
        this.x = next.x;
            
    };
    
    /**
     * Prints the unit
     * 
     * @param {Universe} world The entire universe
     * @param {RenderingContext2d} c The rendering context
     */
    this.print = function (world,c ) {
        var img = this.sprite(world.getTime());
        c.drawImage(world.get(this.imgPath), img.x, img.y, img.w, img.h,
                this.aabb().x - this.imgDisplacement[0] - c.camera.x, 
                this.aabb().y - this.imgDisplacement[1] - c.camera.y, 
                img.w, img.h);
    };  
    
    /** 
     * Returns the units image's location on the sprite sheet.
     * 
     * @param {Clock} time The world clock object.
     */
    this.sprite = function (time) {
        var t = time.it_10 % this.frames;
        var s = {x: 0, y: 0, w: this.imgSize, h: this.imgSize};

        if (this.vx === 0) { // not moving horizontally
            s.y = 0;
            if (this.direction === 1) {
                s.x = this.img.width / 2;
            } else if (this.direction === 0) {
                s.x = 0;
            }
        } else { // moving horzionally
            s.y = this.imgSize;
            if (this.vx > 0) { // running right
                s.x = this.img.width / 2 + t * this.imgSize;
            } else if (this.vx < 0) { // running left
                s.x = t * this.imgSize;
            }
        } 

        return s;
    };

}
