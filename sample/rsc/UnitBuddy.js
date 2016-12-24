/** 
 * Sample Player: Buddy
 */
function UnitBuddy() {

    this.width = 14;
    this.height = 10;

    this.speed = 120.0;
    this.img = "dog.png";
    this.jumpPrimed = false;
    this.health = 10;
    this.maxHealth = 10;
    this.frames = 3;
    this.imgSize = 16;
    this.imgDisplacement = [1, 5];

    var ctrl;
    this.setController = function (controller) {
        ctrl = controller;
    };

    this.invunerableUntil = 0;

    /**
     * Do damage to the player
     * 
     * @param {Number} d The ammount of damage
     * @param {Clock} time The world's instance of clock
     */
    this.damage = function (d, time) {
        if (time.now > this.invunerableUntil) {
            this.health -= d;
            this.invunerableUntil = time.now + 500; // so damage isn't taken too quickly
        }
        if (this.health <= 0) {
            console.log("dead");
        }
    };

    this.move = function (world) {
        var time = world.getTime();
        var t = time.getSPF();
        var units = world.getUniverse().units;
        var ctrl = world.getController();

        /*
         DO DAMAGE TO PLAYER
         */
        if (time.now > this.invunerableUntil) {
            for (var i = 1; i < units.length; i++) {
                var u = units[i].aabb();
                if (u.c(this.aabb())) {
                    this.damage(1, world.getTime());
                }
            }
        }

        /*
         GIVE PLAYER DESIRED DIRECTION (VELOCITIES)
         */
        if (this.canMove) {
            if (ctrl.space && this.jumpPrimed && !this.airbourne) {
                this.vy = -6.0;
                this.airbourne = true;
                this.jumpPrimed = false;
            } else if (!ctrl.space) {
                this.jumpPrimed = true;
            }

            if (!ctrl.a && !ctrl.d)
                this.vx = 0;
            if (ctrl.d) { // right
                this.vx = this.speed * t;
                this.direction = 1;
            } else if (ctrl.a) { // left
                this.vx = -this.speed * t;
                this.direction = 0;
            }
        } else if (!this.airbourne) {
            this.vx = 0;
        }
    };

    /** 
     * This function returns the entity obj. Holds a lot of sprite sheet logic.
     * 
     * @param {Clock} time The world clock object.
     * @TODO this is 100 lines this needs to be condensed
     */
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
                s.x = 0;
                s.y = 0;
            }
        } else if (this.vx > 0) { // running right
            s.x = t * this.imgSize;
            s.y = this.imgSize * 1;
        } else if (this.vx < 0) { // running left
            s.x = t * this.imgSize;
            s.y = this.imgSize * 2;
        }

        return{
            sprite: s, //position on img file
            pos: pos, // position on canvas (happens to be the same to AABB)
            AABB: aabb // Axis-aligned bounding box
        };
    };
}
