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
    
    // ----- LevelData doesn't handle entities yet @TODO ----\\
    this.units.newPlayer(150, 70);
    this.units.newSoldier(14*16, 13*16);
    this.units.newSoldier(50*16, 13*16);
    this.units.newRPGsoldier(31*16, 13*16);
    this.units.newSoldier(84*16, 3*16);
    // ------------------------------------------------------//

    this.camera.setBounds(0, 0, 151 * 16, 30 * 16, true);
    this.camera.setFocusObj(this.units.p);
    this.camera.scale = 4.0;

    this.units.p.setController(this.controller);
    var c = this.camera;

    window.onresize = function () {
        c.zoomed = false;
    };

    /**
     * The main game loop. Called dt/1000 times a second.
     */
    this.update = function(){
        this.stats.addStat("fps", this.time.fps);
	this.time.update(); // updates the time 
        this.units.update(this); // moves things
        this.camera.update(window.innerWidth, window.innerHeight);
        this.graphics.print(this); // draws things
    };
}
    