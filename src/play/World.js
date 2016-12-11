/**
 * Extends a Universe. Contains the game loop, level data, graphics and units. Responsible for 
 * updating Units, the game board and the screen.
 * 
 * @param {Number} tileSize The pixel size of the square gird tiles 
 * @param {Boolean} debug If the debug console is shown
 * @param {ResourceLoader} rsc 
 */  
function World(tileSize, debug, rsc){
    
    var uni = new Universe(tileSize, debug, rsc);
    for (var variable in uni) {
        if (uni.hasOwnProperty(variable)) {
            this[variable] = uni[variable];
        }
    }
    
    /** {Level} The data for the tiles, entites, and units in a level */
    this.level = new Level();
    
    // ----- LevelData doesn't handle entities yet @TODO ----\\
    this.units.newPlayer(150, 70);
    this.units.newSoldier(14*16, 13*16);
    this.units.newSoldier(50*16, 13*16);
    this.units.newRPGsoldier(31*16, 13*16);
    this.units.newSoldier(84*16, 3*16);
    // ------------------------------------------------------//
    
    this.camera.setBounds(0, 0, 151 * 16, 30 * 16, true);
    this.camera.setFocusObj(this.units.p);

    /**
     * The main game loop. Called dt/1000 times a second.
     */
    this.update = function(){
        this.stats.addStat("fps", this.time.fps);
	this.time.update(); // updates the time 
        this.units.update(this); // moves things
        this.camera.update(window.innerWidth, window.innerHeight);
        this.graphics.print(this); // draws things
    }
    
    
    var p = this.units.p;
    var c = this.camera;
    /** @TODO Seperate object for user input */
    window.onkeydown = function(x){
             if(x.which === 48) p.inventory(1);
             if(x.which === 32) p.setMove(0, true); // SPACEBAR
             if(x.which === 65) p.setMove(4, true); //A
             if(x.which === 68) p.setMove(2, true); //D
             if(x.which === 83) p.setMove(3, true); //S
             if(x.which === 87) p.setMove(1, true); //W
             if(x.which === 74) p.setMove(5, true); //j
             if(x.which === 75) p.setMove(6, true); //k
    };
    window.onkeyup = function(x){
            if(x.which === 32) p.setMove(0, false); // SPACEBAR
            if(x.which === 65) p.setMove(4, false); //A
            if(x.which === 68) p.setMove(2, false); //D
            if(x.which === 83) p.setMove(3, false); //S
            if(x.which === 87) p.setMove(1, false); //W
            if(x.which === 74) p.setMove(5, false); //j
            if(x.which === 75) p.setMove(6, false); //k
    };
    window.onresize = function () {
        c.zoomed = false;
    };
}
    