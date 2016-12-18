/**
 * Contains the game loop, level data, graphics and units. Responsible for 
 * updating Units, the game board and the screen.
 * 
 * Graphics
 *      Tasks
 *      Camera 
 * Level Data
 *      Terrain
 *      Units & Entities 
 * Time
 * Controller
 *      KeyListener
 *      MouseListener
 * 
 * @param {Number} tileSize The pixel size of the square gird tiles 
 * @param {ResourceLoader} rsc 
 */  
function CoreManager(tileSize, rsc){
    
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
    window.onresize = function () { c.zoomed = false; };

    /** {Graphics} */
    this.graphics = new Graphics(this.camera);
    
    if (typeof DebugGraphics === "function") {
        this.graphics.enableDebug();
    }

    /** {Control} Keeps track of current user input */
    this.controller = new Control();
    
    /** The state change the application is requesting */
    this.applicationStateChange = null;
    
    this.component = {update: function(){}};
    
    /**
     * The main game loop. Called dt/1000 times a second. 
     */
    this.update = function () {        
        var w = this.public();
        this.applicationStateChange = this.component.update(w);
        this.time.update(w); // updates the time 
        this.camera.update(window.innerWidth, window.innerHeight);
        this.graphics.print(w);
    };
    
    /**
     * Access to all the units currently loaded
     * 
     * @returns {Array} array of units in the UnitHandler
     */
    this.getUnits = function (){ return (this.units || {list:null}).list; };
    
    /**
     * Returns an instance of the graphical drawing canvas
     * 
     * @return {HTMLcanvas} The canvas element on screen
     */
    this.getCanvas = function () { return this.graphics.canvas; };
   
    /**
     * Creates a public verion of the universe of just getters
     * 
     * @return {Unvierse} A public version of the Universe
     */
    this.public = function () {
        var cam = this.camera;
        var ctl = this.controller;
        var gra = this.graphics;
        var com = this.component;
        var tim = this.time;
        var rsc = this.rsc;
        return { 
            get: function (a) { return rsc.get(a); },
            getBlocksRendered: function () { return gra.blocks_rendered; },
            getCamera: function () { return cam; },
            getController: function () { return ctl; },
            getUniverse: function () { return com; },
            getTime: function () { return tim; }
        };
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
    