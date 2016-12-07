/**
 * Contains the game loop, level data, graphics and units. Responsible for 
 * updating Units, the game board and the screen.
 * 
 * @param {Number} tileSize The pixel size of the square gird tiles 
 * @param {Boolean} debug If the debug console is shown
 * @param {ResourceLoader} rsc 
 */  
function Universe(tileSize, debug, rsc){

    /** {Number} The height and width of the foreground tiles */
    this.tileSize = tileSize;

    /** {ResourceLoader} Loads separate files */
    this.rsc = rsc;

    /** {Clock} Manages dt and time analytics */
    this.time = new Clock();

    /** {Graphics} */
    var g = new Graphics(16);
    
    /** {UnitHandler} Stores, manages and updates Units  */
    this.units = new UnitHandler();
    
    /** {Level} The data for the tiles, entites, and units in a level */
    this.level = new Level();
    
    /** {Stats} Runs statistics for analytics */
    this.stats = new Stats();

    // ----- LevelData doesn't handle entities yet @TODO ----\\
    this.units.newPlayer(150, 70);
    this.units.newSoldier(14*16, 13*16);
    this.units.newSoldier(50*16, 13*16);
    this.units.newRPGsoldier(31*16, 13*16);
    this.units.newSoldier(84*16, 3*16);
    // ------------------------------------------------------//

    var units = this.units;
    
    /** @TODO Seperate object for user input */
    window.onkeydown = function(x){
             if(x.which === 48) units.p.inventory(1);
             if(x.which === 32) units.p.setMove(0, true); // SPACEBAR
             if(x.which === 65) units.p.setMove(4, true); //A
             if(x.which === 68) units.p.setMove(2, true); //D
             if(x.which === 83) units.p.setMove(3, true); //S
             if(x.which === 87) units.p.setMove(1, true); //W
             if(x.which === 74) units.p.setMove(5, true); //j
             if(x.which === 75) units.p.setMove(6, true); //k
    };
    window.onkeyup = function(x){
            if(x.which === 32) units.p.setMove(0, false); // SPACEBAR
            if(x.which === 65) units.p.setMove(4, false); //A
            if(x.which === 68) units.p.setMove(2, false); //D
            if(x.which === 83) units.p.setMove(3, false); //S
            if(x.which === 87) units.p.setMove(1, false); //W
            if(x.which === 74) units.p.setMove(5, false); //j
            if(x.which === 75) units.p.setMove(6, false); //k
    };
    window.onresize = function () {
        g.zoomed = false;
    }

    /**
     * The main game loop. Called dt/1000 times a second.
     */
    this.update = function(){
        this.stats.addStat("fps", this.time.fps);
	this.time.update(); // updates the time 
        this.units.update(this); // moves things
        g.print(this); // draws things
    }
    
    /**
     * Access to all the units currently loaded.
     * 
     * @returns {Array} array of units in the UnitHandler
     */
    this.getUnits = function (){ 
        return this.units.list; 
    };
    
    this.getCanvas = function () {
        return g.canvas;
    }
}
    