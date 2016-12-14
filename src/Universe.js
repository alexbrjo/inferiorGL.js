/**
 * Contains the game loop, level data, graphics and units. Responsible for 
 * updating Units, the game board and the screen.
 * 
 * @param {Number} tileSize The pixel size of the square gird tiles 
 * @param {ResourceLoader} rsc 
 */  
function Universe(tileSize, rsc){
    
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
    var c = this.camera;
    window.onresize = function () {
        c.zoomed = false;
    };
    
    this.environment = null;

    /** {Graphics} */
    this.graphics = new Graphics(this.camera);
    
    if (typeof DebugGraphics === "function") {
        this.graphics.enableDebug();
    }

    /** {Control} Keeps track of current user input */
    this.controller = new Control();
    
    this.applicationStateChange = null;
    
    /**
     * The main game loop. Called dt/1000 times a second. Must be implemented
     * by sub-Universe.
     */
    this.update = function () {
        this.time.update(); // updates the time 
        this.camera.update(window.innerWidth, window.innerHeight);
        this.graphics.print(this);
    };
    
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
    
    /**
     * Returns the universe back to a blank slate
     */
    this.close = function () {
        this.units = null;
        this.wizard = null;
        this.level = null;
        this.graphics.clearTasks();
        this.camera.scale = 1.0;
        this.camera.zoomed = false;
    };
}
    