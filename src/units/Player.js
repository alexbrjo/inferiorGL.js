10/* Copyright Alex Johnson 2016 */

var setPlayer = function (e) {

    e.width = 15;
    e.height = 25;

    e.speed = 180.0;
    e.img = "warrior.png";
    e.attackTick = -1;
    e.jumpPrimed = false;
    e.health = 10;
    e.maxHealth = 10;

    e.damage = function (d, time) {
        this.health -= d;
        e.invunerableUntil = time.now + 500; // so damage isn't taken too quickly
        if (this.health <= 0) {
            console.log("dead");
        }
    };

    e.update = function (world) {
        var time = world.time;
        var t = time.getSPF();

        /*
         DO DAMAGE TO ENEMYS
         */
        if (!this.attack && this.attackTick === 0) { // if attack button isn't pressed
            this.attackTick = -1 // prime attack, this makes sure it doesn't jump loop attack animations
        } else if (this.attack && this.attackTick === -1) { // if attack button is pressed and
            this.attackTick = 12;
        }
        if (this.attackTick > 0) {
            this.attackTick--;
            this.canMove = false;
            if (this.attackTick === 5) {
                var units = world.getUnits();
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
            var units = world.getUnits();
            for (var i = 1; i < units.length; i++) {
                var u = units[i].aabb();
                if (u.c(this.aabb())) {
                    this.damage(1, world.time);
                }
            }
        }

        /*
         GIVE PLAYER DESIRED DIRECTION (VELOCITIES)
         */
        if (this.canMove) {
            if (this.jump && this.jumpPrimed && !this.airbourne) {
                this.vy = -8.0;
                this.airbourne = true;
                this.jumpPrimed = false;
            } else if (!this.jump) {
                this.jumpPrimed = true;
            }

            if (!this.left && !this.right)
                this.vx = 0;
            if (this.left) { // left
                this.vx = this.speed * t;
                this.direction = 1;
            } else if (this.right) { // right
                this.vx = -this.speed * t;
                this.direction = 0;
            }
        } else if (!this.airbourne) {
            this.vx = 0;
        }

        /*
         MOVE PLAYER
         */

        // gravity always applied
        this.vy += 0.5;

        var previous = this.aabb();

        if ((this.vx < 0 && this.contact.left) || (this.vx > 0 && this.contact.right)) {

            if (this.vy > 0) {
                this.vx = 0;
                this.airbourne = false;
            }
        } else {
            this.x += this.vx;
        }
        this.y += this.vy;

        /*
         Check for collisions
         */
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
        } // for i
        /*
         UPDATE WHICH DIRECTIONS THE SPRITE IS COLLIDING FROM
         */
        this.contact.left = world.level.getBlockObject(this.x - 1, this.y).AABB.s(this.x - 1, this.y);
        this.contact.right = world.level.getBlockObject(this.x + this.width + 1, this.y).AABB.s(this.x + this.width + 1, this.y);
        this.contact.up = world.level.getBlockObject(this.x, this.y - 1).AABB.s(this.x, this.y - 1);
        this.contact.down = world.level.getBlockObject(this.x + this.width * (1 / 2), this.y + this.height + 1).AABB.s(this.x + this.width * (1 / 2), this.y + this.height + 1);
    }

    /** 
     * obj() is unique to "player"
     * This function returns the entity obj for the player
     * @OPT this is 100 lines this needs to be condensed
     */
    e.obj = function (time) {
        var s = {x: 0, y: 0, w: 40, h: 40, id: this.img};
        var pos = this.aabb();
        var aabb = this.aabb();
        pos.x -= 12;
        pos.y -= 15;

        if (this.airbourne) { // jumping/falling
            if (!this.attack) { // just jumping/falling
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
            } else { // attacking while in air
                if (this.direction == 1) {
                    s.x = time.it_24 % 8 * 40;
                    s.y = 6 * 40;
                } else if (this.direction == 0) {
                    s.x = time.it_24 % 8 * 40;
                    s.y = 7 * 40;
                }
            }
        } else if (this.vx == 0) { // not moving horizontally
            if (this.attackTick > 0) {
                if (this.attackTick > 10) {
                    if (this.direction == 1) {
                        s.x = 3 * 40;
                        s.y = 0;
                    } else if (this.direction == 0) {
                        s.x = 3 * 40;
                        s.y = 1 * 40;
                    }
                } else {
                    if (this.direction == 1) {
                        s.x = 4 * 40;
                        s.y = 0;
                        pos.x += 10;
                    } else if (this.direction == 0) {
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
                if (this.direction == 1) { //standing still
                    s.x = 0;
                    s.y = 0;
                } else if (this.direction == 0) {
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
    }

    e.setMove = function (key, pressed) {
        if (pressed) {
            if (key == 0) {
                this.jump = true;
            } else if (key == 1) {
                this.up = true;
            } else if (key == 2) {
                this.left = true;
            } else if (key == 3) {
                this.down = true;
            } else if (key == 4) {
                this.right = true;
            } else if (key == 5) {
                this.jump = true;
            } else if (key == 6) {
                this.attack = true;
            }
        } else if (!pressed) {
            if (key == 0) {
                this.jump = false;
            } else if (key == 1) {
                this.up = false;
            } else if (key == 2) {
                this.left = false;
            } else if (key == 3) {
                this.down = false;
            } else if (key == 4) {
                this.right = false;
            } else if (key == 5) {
                this.jump = false;
            } else if (key == 6) {
                this.attack = false;
            }
        }
    }
    return e;
}