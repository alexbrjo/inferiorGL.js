/** 
 * Contains canvas objects and handles all rendering. Graphics were chosen to not be 
 * drawn in entity classes. All 
 *
 * The parent of Graphics is responsible for adding all objects it wants drawn to the 
 * queue. This variable that contains the 1 instance of this object is named 'g'. The  
 * actual graphical context is referred to as 'c' inside this function.
 *
 * @author Alex Johnson
 * 
 * @param {Camera} camera What part of the level to paint.
 */
var Graphics = function(camera) {

    /** canvas and context for the <canvas> displayed */  
    var display = document.getElementById('JoRes-target');
    var graphics = display.getContext('2d');
    
    /** canvas object to draw frame on */              
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');  
    
    /** 
     * Any function that has the ctx variable also needs the camera so I went
     * ahead and added a ref directly to the context.
     */
    ctx.camera = camera;

    /** The number of blocks rendered during the last update */
    this.blocks_rendered = 0;
    
    /** The number of entities rendered during the last update */
    this.entities_rendered = 0;
    
    /** Components to print */
    var printTasks = [];
    
    /**
     * Adds a task to the printTasks list
     * 
     * @param {TaskGraphics} t An object with a .print() function 
     */
    this.addTask = function (t) {
        printTasks.push(t);
    };
    
    /**
     * Clears the prinkTasks list
     */
    this.clearTasks = function () {
        printTasks = [];
    };
    
    /**
     * If the debug console is enabled
     */
    var debug = null;
    
    /**
     * Enables the debug console
     */
    this.enableDebug = function () {
        debug = new DebugGraphics();
    };
    
    /**
     * The master print function called once (1) an update loop. Is responsible for
     * dispatching functions for drawing all items in the queue
     *
     *	@param {Universe} world The entire universe
     */
    this.print = function(world) {
	
        // clear the edit_ctx for a new frame
        canvas.width = display.width = window.innerWidth;
        canvas.height = display.height = window.innerHeight;
    	
        for (var task in printTasks) {
            printTasks[task].print(world, ctx);
        }     

	graphics.mozImageSmoothingEnabled = false;
        graphics.webkitImageSmoothingEnabled = false;
        graphics.msImageSmoothingEnabled = false;
        graphics.imageSmoothingEnabled = false;
		
        graphics.clearRect(0, 0, display.width, display.height);
        graphics.drawImage(canvas, 0,0, 
        	display.width  * ctx.camera.getScale(), 
        	display.height * ctx.camera.getScale());
        if (debug !== null) {
            debug.print(world, graphics);
        }
    };
};
