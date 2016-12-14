/** 
 * The Default components of a Level
 *
 * @author Alex Johnson
 */
function InitLevel() {

    if (typeof JoResLevel !== "function") {
        throw new Error("Level not loaded");
    }
    
    var level = Object.assign(
            {
                h: 0, w: 0, tileSize: 0,
                resources: [],
                terrain_sprite: [],
                sprite_index: [],
                data: []
            },
    new JoResLevel());

    level.trunc = function (x) {
        return Math.trunc(x / this.tileSize, 2);
    };
    
    level.terrain_sprite_index = function (i) {
        return this.sprite_index[i];
    };

    level.terrainSpritesNum = function () {
        return this.sprite_index.length;
    };

    level.terrain = function (x, y) {
        if (x > this.w || x < 0 || y < 0 || y > this.h ||
                typeof x === "undefined" || typeof y === "undefined")
            return 0;
        return this.data[x][y];
    };

    level.getHeight = function () {
        return this.h;
    };

    level.getWidth = function () {
        return this.w;
    };

    level.setData = function (x, y, n) {
        if (x > this.w || x < 0 || y < 0 || y > this.h) {
            return false;
        } else {
            this.data[x][y] = n;
            return true;
        }
    };

    level.getData = function () {
        return this.data;
    };

    // returns basic AABB object for x y
    level.getBlockObject = function (i, j) {
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
    
    return level;
};
