/** Incomplete */
function Unit(_id, _x, _y) {
    this.id = _id;
    this.x = _x, this.y = _y;
    this.width = 0, this.height = 0;
    this.tick = Math.random() * 200;

    // velocity
    this.direction = 0;
    this.speed = 1;
    this.maxSpeed = 10;
    this.airbourne = false;
    this.vx = 0;
    this.vy = 0;

    // img file
    this.img = "";

    // controller
    this.canMove = true;
    this.jump = false;
    this.attack = false;
    this.up = false, this.left = false, this.down = false, this.right = false;
    this.health = 1;
    this.maxHealth = 1;
    this.invunerableUntil = 0;
    this.destroy = false;
    this.imgDisplacement = [0, 0];

    // aabb
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



    this.contact = {left: false, right: false, up: false, down: false};


    this.damage = function (d) {
        this.health -= d;
        if (this.health <= 0) {
            this.destroy = true;
        }
    }
    this.points = function (i) {
        var th = this;
        switch (i) {
            case 0:
                return {x: th.x, y: th.y};
            case 1:
                return {x: th.x, y: th.y + th.height * 1 / 2}
            case 2:
                return {x: th.x, y: th.y + th.height}
            case 3:
                return {x: th.x + (th.width * 1 / 2), y: th.y}
            case 4:
                return {x: th.x + (th.width * 1 / 2), y: th.y + th.height}
            case 5:
                return {x: th.x + th.width, y: th.y}
            case 6:
                return {x: th.x + th.width, y: th.y + th.height * 1 / 2}
            case 7:
                return {x: th.x + th.width, y: th.y + th.height}
            default: 
                return 8;
        }
    };


    this.update = function () {
        var err = new Error();
        err.message("unit not init'ed");
        throw err;
    }


    this.obj = function (time) {
        var t = time.it_10 % 2;
        var s = {x: 0, y: 0, w: this.imgSize, h: this.imgSize, id: this.img};
        var pos = this.aabb();
        pos.x -= this.imgDisplacement[0];
        pos.y -= this.imgDisplacement[1];

        var aabb = this.aabb();

        if (this.vx === 0) { // not moving horizontally
            if (this.direction === 1) { //standing still
                s.x = 0;
                s.y = 0;
            } else if (this.direction === 0) {
                s.x = this.imgSize;
                s.y = 0;
            }
        } else if (this.vx > 0) { // running right
            s.x = time.it_12 % 3 * this.imgSize;
            s.y = this.imgSize * 1;
        } else if (this.vx < 0) { // running left
            s.x = time.it_12 % 3 * this.imgSize;
            s.y = this.imgSize * 2;
        }

        return{
            sprite: s, //position on img file
            pos: pos, // position on canvas (happens to be the same to AABB)
            AABB: aabb // Axis-aligned bounding box
        };
    };

}


