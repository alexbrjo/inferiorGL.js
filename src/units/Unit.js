/** Incomplete */
function devUnit(_id, _x, _y) {
    var id = _id;
    var x = _x, y = _y;
    var width = 0, height = 0;
    var tick = Math.random() * 200; 

        // velocity
        e.direction = 0;
        e.speed = 1;
        e.maxSpeed = 10;
        e.airbourne = false;
        e.vx = 0;
        e.vy = 0;

    // img file
    var img = "";

    // controller
    var canMove = true;
    var jump = false;
    var attack = false;
    var up = false, left = false, down = false, right = false;
    var health = 1;
    var maxHealth = 1;
    var invunerableUntil = 0;
    var destroy = false;
    var imgDisplacement = [0,0]; 
        
        // aabb
        e.aabb = function () {
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



        e.contact = {left: false, right: false, up: false, down: false};


        e.damage = function (d) {
            this.health -= d;
            if (this.health <= 0) {
                this.destroy = true;
            }
        }

        e.points = [
            // left side
            function () {
                return {x: e.x, y: e.y}
            },
            function () {
                return {x: e.x, y: e.y + e.height * 1 / 2}
            },
            function () {
                return {x: e.x, y: e.y + e.height}
            },
            // middle
            function () {
                return {x: e.x + (e.width * 1 / 2), y: e.y}
            },
            function () {
                return {x: e.x + (e.width * 1 / 2), y: e.y + e.height}
            },
            // right side
            function () {
                return {x: e.x + e.width, y: e.y}
            },
            function () {
                return {x: e.x + e.width, y: e.y + e.height * 1 / 2}
            },
            function () {
                return {x: e.x + e.width, y: e.y + e.height}
            }
        ];


        e.update = function () {
            return false;
        }


        e.obj = function (time) {
            var t = time.it_10 % 2;
            var s = {x: 0, y: 0, w: e.imgSize, h: e.imgSize, id: this.img};
            var pos = this.aabb();
            pos.x -= this.imgDisplacement[0];
            pos.y -= this.imgDisplacement[1];;

            var aabb = this.aabb();

            if (this.vx === 0) { // not moving horizontally
                if (this.direction === 1) { //standing still
                    s.x = 0;
                    s.y = 0;
                } else if (this.direction === 0) {
                    s.x = e.imgSize;
                    s.y = 0;
                }
            } else if (this.vx > 0) { // running right
                s.x = time.it_12 % 3 * e.imgSize;
                s.y = e.imgSize * 1;
            } else if (this.vx < 0) { // running left
                s.x = time.it_12 % 3 * e.imgSize;
                s.y = e.imgSize * 2;
            }

            return{
                sprite: s, //position on img file
                pos: pos, // position on canvas (happens to be the same to AABB)
                AABB: aabb // Axis-aligned bounding box
            };
        };

}


