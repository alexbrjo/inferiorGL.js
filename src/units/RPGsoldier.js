/* Copyright Alex Johnson 2016 */

var RPGsoldier = function (e) {
    /** Essential Unit Properties */
    this.width = 15;
    this.height = 25;
    
    /** Sprite Properties */
    this.img = "rpgsoldier.png";
    this.imgSize = 40;
    this.imgDisplacement = [12,12];

    this.move = function (world) {
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
    };
}


