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
        
    /** 
     * Holds variables that are used to figure out what part of the board
     * needs to be drawn 
     */
    this.camera = new Camera();

    /** {Graphics} */
    this.graphics = new Graphics(this.camera);
    
    /** {UnitHandler} Stores, manages and updates Units  */
    this.units = new UnitHandler();
    
    /** {Level} The data for the tiles, entites, and units in a level */
    this.level = new Level();
    
    /** {Stats} Runs statistics for analytics */
    this.stats = new Stats();

    /**
     * The main game loop. Called dt/1000 times a second. Must be implemented
     * by whenever Univererse extends this one.
     */
    this.update = function(){}
    
    /**
     * Access to all the units currently loaded.
     * 
     * @returns {Array} array of units in the UnitHandler
     */
    this.getUnits = function (){ 
        return this.units.list; 
    };
    
    /**
     * Returns an instance of the graphical drawing canvas
     */
    this.getCanvas = function () {
        return this.graphics.canvas;
    };
}
    