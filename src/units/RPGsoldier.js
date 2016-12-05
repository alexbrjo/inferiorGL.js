/* Copyright Alex Johnson 2016 */

var setRPGsoldier = function (e) {
    /** Essential Unit Properties */
    e.width = 15;
    e.height = 25;
    
    /** Sprite Properties */
    e.img = "rpgsoldier.png";
    e.imgSize = 40;
    e.imgDisplacement = [12,12];

    e.update = function (world) {
        this.tick++;
        if (this.tick > 200)
            this.tick = 0;

        this.vx = 0;
        if (this.tick > 50 && this.tick < 100) {
            this.vx = -this.speed;
            this.direction = 0;
        }

        if (this.tick > 150 && this.tick < 200) {
            this.vx = this.speed;
            this.direction = 1;
        }

        var previous = this.aabb();
        this.vy += 0.5;

        this.x += this.vx;
        this.y += this.vy;

        for (var i = 0; i < this.points.length; i++) {
            var point = this.points[i]();
            var block = world.level.getBlockObject(point.x, point.y).AABB;
            if (block.s(point.x, point.y)) {
                // grounded
                if (previous.y + previous.h <= block.y) {
                    this.y = block.y - this.height;
                    this.vy = 0;
                    this.airbourne = false;
                }
                // hit head
                if (previous.y >= block.y + block.h) {
                    this.y = block.y + block.h;
                    this.vy = 0;
                }

                var check = this.points[i]();
                if (block.s(check.x, check.y)) {
                    // wall right
                    if (previous.x + previous.w <= block.x) {
                        this.x = block.x - this.width;
                        this.vx = 0;
                    }
                    // wall left
                    if (previous.x >= block.x + block.w) {
                        this.x = block.x + block.w;
                        this.vx = 0;
                    }
                }
            }
        }
    };
    return e;
}


