/* Copyright Alex Johnson 2016 */

var Player = function () {

    this.width = 15;
    this.height = 25;

    this.speed = 180.0;
    this.img = "warrior.png";
    this.attackTick = -1;
    this.jumpPrimed = false;
    this.health = 10;
    this.maxHealth = 10;
    this.imgSize = 40;
    this.imgDisplacement = [12, 15];
    
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
         DO DAMAGE TO ENEMYS
         */
        if (!ctrl.k && this.attackTick === 0) { // if attack button isn't pressed
            this.attackTick = -1; // prime attack, this makes sure it doesn't jump loop attack animations
        } else if (ctrl.k && this.attackTick === -1) { // if attack button is pressed and
            this.attackTick = 12;
        }
        if (this.attackTick > 0) {
            this.attackTick--;
            this.canMove = false;
            if (this.attackTick === 5) {
                for (var i = 1; i < units.length; i++) {
                    var u = units[i];
                    if (this.direction === 1) {
                        if (u.aabb().s(this.x + this.width + 25, this.y + this.height / 2) ||
                                u.aabb().s(this.x + this.width + 15, this.y + this.height / 2) ||
                                u.aabb().s(this.x + this.width + 5, this.y + this.height / 2))
                            u.damage(1);
                    } else if (this.direction === 0) {
                        if (u.aabb().s(this.x - 25, this.y + this.height / 2) ||
                                u.aabb().s(this.x - 15, this.y + this.height / 2) ||
                                u.aabb().s(this.x - 5, this.y + this.height / 2))
                            u.damage(1);
                    }
                } // for i
            }
        } else {
            this.canMove = true;
        }

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
                this.vy = -8.0;
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
        var s = {x: 0, y: 0, w: 40, h: 40, id: this.img};
        var pos = this.aabb();
        var aabb = this.aabb();
        pos.x -= this.imgDisplacement[0];
        pos.y -= this.imgDisplacement[1];

        if (this.airbourne) { // jumping/falling
            if (this.attackTick > 0) { // if attacking
                if (this.direction === 1) {
                    //s.x = time.it_24 % 8 * 40;
                    //s.y = 6 * 40;
                } else if (this.direction === 0) {
                    //s.x = time.it_24 % 8 * 40;
                    //s.y = 7 * 40;
                }
                s.x = 3 * 40;
                s.y = (5 - this.direction) * 40;
                pos.x += (this.direction === 1) ? 10 : -10;
            } else { // just airbourne
                if (Math.abs(this.vy) > 3) {
                    s.x = 0;
                    s.y = (5 - this.direction) * 40;
                } else if (Math.abs(this.vy) <= 3 || Math.abs(this.vy) > 1) {
                    s.x = 1 * 40;
                    s.y = (5 - this.direction) * 40;
                } else if (Math.abs(this.vy) <= 1) {
                    s.x = 2 * 40;
                    s.y = (5 - this.direction) * 40;
                }
            }
        } else if (this.vx === 0) { // not moving horizontally
            if (this.attackTick > 0) {
                if (this.attackTick > 10) {
                    if (this.direction === 1) {
                        s.x = 3 * 40;
                        s.y = 0;
                    } else if (this.direction === 0) {
                        s.x = 3 * 40;
                        s.y = 1 * 40;
                    }
                } else {
                    if (this.direction === 1) {
                        s.x = 4 * 40;
                        s.y = 0;
                        pos.x += 10;
                    } else if (this.direction === 0) {
                        s.x = 4 * 40;
                        s.y = 1 * 40;
                        pos.x -= 10;
                    }
                }
            } else if (!this.contact.down) {
                if (this.contact.left) {
                    s.x = 5 * 40;
                    s.y = 4 * 40;
                } else if (this.contact.right) {
                    s.x = 5 * 40;
                    s.y = 5 * 40;
                }
            } else {
                if (this.direction === 1) { //standing still
                    s.x = 0;
                    s.y = 0;
                } else if (this.direction === 0) {
                    s.x = 0;
                    s.y = 1 * 40;
                }
            }
        } else if (this.vx > 0) { // running right
            s.x = time.it_12 % 6 * 40;
            s.y = 2 * 40;
        } else if (this.vx < 0) { // running left
            s.x = time.it_12 % 6 * 40;
            s.y = 3 * 40;
        }

        return {
            //position on img file
            sprite: s,
            pos: pos, // position on canvas (happens to be the same to AABB)
            AABB: aabb // Axis-aligned bounding box
        };
    };
};