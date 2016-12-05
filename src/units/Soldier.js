var Soldier = function () {
    /** Essential Unit Properties */
    this.width = 15;
    this.height = 25;
    
    /** Sprite Properties */
    this.img = "enemy.png";
    this.imgSize = 25;
    this.imgDisplacement = [5,0];

    this.update = function (world) {
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

        for (var i = 0; i < this.points(); i++) {
            var point = this.points(i);
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

                var check = this.points(i);
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
}
