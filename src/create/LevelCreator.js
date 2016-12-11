/**
 * Contains the game loop, level data, graphics and units. Responsible for 
 * updating Units, the game board and the screen.
 * 
 * @param {Number} tileSize The pixel size of the square gird tiles 
 * @param {Boolean} debug If the debug console is shown
 * @param {ResourceLoader} rsc 
 */  
function LevelCreator(tileSize, debug, rsc){

    var uni = new Universe(tileSize, debug, rsc);
    for (var variable in uni) {
        if (uni.hasOwnProperty(variable)) {
            this[variable] = uni[variable];
        }
    }

    this.units.newPlayer(150, 70);
    this.wizard = new Wizard(0, 0);
    this.wizard.setController(this.controller);
    this.camera.setFocusObj(this.wizard);
    this.camera.scale = 2.0;
    
    var g = this.graphics;

    window.onresize = function () {
        g.zoomed = false;
    };
    
    /**
     * The main game loop. Called dt/1000 times a second.
     */
    this.update = function(){
        this.stats.addStat("fps", this.time.fps);
	this.time.update(); // updates the time 
        this.camera.update(window.innerWidth, window.innerHeight);
        this.graphics.print(this, this.units.p); // draws things
        this.wizard.update();
    };
}
    