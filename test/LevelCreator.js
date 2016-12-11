/**
 * Stores data for how the screen is drawn.
 */
function Camera(){
    this.x = 0;
    this.y = 0,
    this.focusObj = null;
    this.scale = 1.0;
    this.maxScale = 6;
    this.edgeBuffer = 2;
    this.range = {x:0, y:0};
    var bounds = {areSet: false, left: null, right: null, top: null, bottom: null};
    this.zoom = function(factor) {
        this.scale *= factor;
        if (this.scale > this.maxScale) this.scale = this.maxScale;
    };
    
    /** The size of a board tile */ 
    var tileSize = 16;
    
    /**
     * Updates the position of the camera.
     * 
     * @param {Number} display_width The width of the display.
     * @param {Number} display_height The height of the display.
     */
    this.update = function (display_width, display_height) {
         
        if (!this.zoomed) {this.resize(display_width, display_height);}
         
        /**
         * Centers Camera on the focusobj and prevents from moving out of 
         * bounds
         */
        var half_width = display_width / (2 * this.scale);
        var half_height = display_height / (2 * this.scale);
        this.x = Math.round(Math.round(this.focusObj.x) - half_width);
        this.y = Math.round(Math.round(this.focusObj.y) - half_height);
         
        /** 
         * Prevents Camera from moving out of bounds
         */
        if (bounds.areSet) { 
            if(this.x < bounds.left) this.x = bounds.left;
            if(this.x + display_width > bounds.right) this.x = bounds.right;
            if(this.y < bounds.top) this.y = bounds.top;
            if(this.y + display_height > bounds.bottom) this.y = bounds.bottom;
        }
    };
    
    /**
     * Resizes Camera range
     * 
     * @param {Number} display_width The width of the display.
     * @param {Number} display_height The height of the display.
     */
    this.resize = function(display_width, display_height) {
        this.range.x = Math.round( display_width / (tileSize * this.scale));
        this.range.y = Math.round(display_height / (tileSize * this.scale));
        this.zoomed = true;
    };
    
    this.setBounds = function (left, right, top, bottom, disable) {
        if (typeof left   !== "null" && typeof left   !== "number" &&
            typeof right  !== "null" && typeof right  !== "number" && 
            typeof top    !== "null" && typeof top    !== "number" &&
            typeof bottom !== "null" && typeof bottom !== "number") {
            throw TypeError("4 arguements of {Null|Number} required");
        }
        
        bounds.left = left;
        bounds.right = right;
        bounds.top = top;
        bounds.bottom = bottom;
        
        if (disable !== true) {
            bounds.areSet = true;
        }
    };
    this.enableBounds = function () {bounds.areSet = true;};
    this.disableBounds = function () {bounds.areSet = false;};
    
    this.setFocusObj = function (o) {
        this.focusObj = o;
    };
}
;/** 
 * Handles all time calculations including delta time and iterations per second. 
 *
 *	@author Alex Johnson
 */
 var Clock = function() {
    this.started = -1;          // time stamp of first game loop
    this.now = 		0;      // time of current frame
    this.last = 	0;      // time of last frame
    this.dt = 		0;      // delta time
    this.secLoop = 	0;      // second loop
    this.sec = 		false;  // is it a second?
    this.nextsec = 	0;      // time of the next second
    this.frames = 	0;      // frames to calculate fps
    this.fps = 		0;      // fps (refresh loops per second)
    this.it_10 = 	0;      //10 iterations per second 0,1,2,3,4,5,6,7,8,9
    this.it_12 = 	0;      //12 iterations per second
    this.it_16 = 	0;      //16 iterations per second
    this.it_24 = 	0;      //24 iterations per second
    
    var min_spf = 0.032; // minimum seconds per frame
    
    /**
     * Determines when to use delta_t. If the framerate is low then delta_t
     * shouldn't be used.
     * 
     * @returns {Number} The number to be used as delta_t in game logic 
     *      calculations
     */
    this.getSPF = function(){ return (this.dt < min_spf) ? this.dt : min_spf; };
                
    /**
     * Updates iterations, current time and delta_t. 
     */
    this.update = function(){
        this.last = this.now;
        this.now = Date.now();
        if(this.started < 0) this.started = this.now;
        this.secLoop = 0;
        this.dt = (this.now - this.last) / 1000;
        this.frames++;
                  
        this.sec = (this.now >= this.nextsec);
        if(this.sec){
            this.nextsec = this.now + 1000;
            this.fps = this.frames;
            this.frames = 0;
        }
                  
        var n = this.now/1000;
        this.it_10 = Math.round( (n - Math.trunc(n) )* 10-0.5);
        this.it_12 = Math.round( (n - Math.trunc(n) )* 12-0.5);
        this.it_16 = Math.round( (n - Math.trunc(n) )* 16-0.5);
        this.it_24 = Math.round( (n - Math.trunc(n) )* 24-0.5);
    }
}
;function Control () {
    
    /** If the space bar is pressed down*/
    this.space = false;

    /**
     * 
     * @param {Number} which The char code of the key that is down
     * @param {Boolean} down If the key is down
     */
    this.setKey = function (which, down) {
        if (which >= 65 && which <= 90) {
            var key = String.fromCharCode(which);
            this[key.toLowerCase()] = down;
        } else {
            if (which === 32) this.space = down;
        }
    };
    
    /**
     * Sets all keys a to z to false
     */
    for (var i = 65; i <= 90; i++) {
        this.setKey(i, false);
    }
    
    /**
     * Makes key listeners callback here
     */
    var t = this;
    window.onkeydown = function (x) {
        t.setKey(x.which, true);
    };
    window.onkeyup = function (x) {
        t.setKey(x.which, false);
    };
}
;/** 
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
    var display = document.getElementById('alexjo-ninja');
    var graphics = display.getContext('2d');
    
    /** canvas object to draw frame on */              
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');  
    
    this.camera = camera;
    
    /** Whether the canvas has been zoomed */
    this.zoomed = false;
    
    /** The size of a board tile */ 
    var tileSize = 16;
    
    /** 
     * Truncates a position to a block location
     *  
     * @param {Number} x Position to truncate to tile postition.
     */
    var trunc = function(x) { return Math.trunc(x/tileSize, 2); };
    
    /** The number of blocks rendered during the last update */
    this.blocks_rendered = 0;
    
    /** The number of entities rendered during the last update */
    this.entities_rendered = 0;
    
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
    	
        this.printTerrain(world);
    	this.printUnits(world);
        this.printHUD(world);     

	graphics.mozImageSmoothingEnabled = false;
        graphics.webkitImageSmoothingEnabled = false;
        graphics.msImageSmoothingEnabled = false;
        graphics.imageSmoothingEnabled = false;
		
        graphics.clearRect(0, 0, display.width, display.height);
        graphics.drawImage(canvas, 0,0, 
        	display.width  * this.camera.scale, 
        	display.height * this.camera.scale);
        this.printDebug(world, world.units);  
    };
    
    /**
     * Responsible for printing all objects in the Unit queue
     *	@param {Universe} world The entire universe
     */
    this.printUnits = function(world) {
	for (var i = 0; i < world.units.list.length; i++) {
            var u = world.units.list[i].obj(world.time);
            var img = u.sprite;
            var pos = u.pos;
            var aabb = u.AABB;
            ctx.save();
            if(world.units.list[i].invunerableUntil > world.time.now) ctx.globalAlpha = 0.7;
            ctx.drawImage(world.rsc.get(img.id),
                    img.x, img.y, img.w, img.h,
                    pos.x-this.camera.x, pos.y-this.camera.y, img.w, img.h);
            ctx.restore();
        }
        world.stats.addStat("er", world.units.list.length);
    };

    /**
     * Prints terrain
     * 
     * @param {Universe} world The entire universe
     */
    this.printTerrain = function(world) {
        for (var i = 0; i < 3; i++) {
            ctx.drawImage(world.rsc.get("bg.png"),
                0, 0, 240, 240,
                i*240, -50, 240, 240);
        }
                  
        this.blocks_rendered = 0;
        // the +2 try to change to a variable or integrate into camera.range.x
        
        for (var i = trunc(world.camera.x) - world.camera.range.x + 2; 
        		 i < trunc(world.camera.x) + world.camera.range.x + 2;
        		 i++) {
            for (var j = trunc(world.camera.y) - world.camera.range.y + 2; 
            		 j < trunc(world.camera.y) + world.camera.range.y + 2; 
            		 j++) {
                var block = world.level.getBlockObject(tileSize * i, tileSize * j);
                var pos = block.pos; // pos of tile in background
                var img = block.sprite; //pos of sprite on img file

                if (Math.random() < 0.0001 && false) {
                    console.log((pos.x + " " + world.camera.x) + " " +  (pos.y + " " + world.camera.y));
                }
                    
                if (img.id > 0) {
                    ctx.drawImage(world.rsc.get(world.level.sprite_sheet),
                            img.x * tileSize, img.y * tileSize, img.w, img.h,
                            pos.x - world.camera.x, pos.y - world.camera.y, pos.w, pos.h);
                    this.blocks_rendered++;
                }
            } // for j
        } // for i
        world.stats.addStat("br", this.blocks_rendered);
    };
    
    /**
     * Prints the HUD (heads up display)
     * TODO:
     *	- Design new health bar
     *	- Implement scoreboard
     *	
     *	@param {Universe} world The entire universe
     */
    this.printHUD = function(world) {
    	var p = world.units.p;
    	//last thing drawn is HUD
        for (var i = 0; i < p.maxHealth; i++) {
    	    if (i < p.health) {
        	    ctx.drawImage(world.rsc.get("hud.png"),
                        0, 0, 9, 9,
                	2, 30 + 9 * i, 9, 9);
            } else {
            	ctx.drawImage(world.rsc.get("hud.png"),
                        9, 0, 9, 9,
                	2, 30 + 9 * i, 9, 9);
            }
        }
    };
    
    /**
     * Prints the Debug console
     * 
     * @param {Universe} world The entire universe
     * @param {Array} units The array of all units
     * @BUG if array isn't defined graphs don't work
     */
    this.printDebug = function(world, units) {
    	var t = world.time;
    	var lines = [
    		"GameName in-dev v0.0.1 ("+ (Math.round(t.now / 1000) - 
    			Math.round(t.started / 1000)) +" seconds old)",
			t.dt*1000 + " ms / " + t.fps + " fps",
			units.list.length + " entities",
			this.blocks_rendered + "/" + 
        		(this.camera.range.x*2)*(this.camera.range.y*2)+ " Blocks rendered",
        	"camera x: " + this.camera.x + " y: "+ this.camera.y,
        	"( pos ) x: " + Math.round(units.p.x) + " y: " + Math.round(units.p.y),
        	"(Block) x: " + trunc(units.p.x) + " y: " + trunc(Math.round(units.p.y))
    	];
    	graphics.save(); //saves graphics settings without 'difference composition'
    	graphics.globalCompositeOperation = "difference";
		graphics.fillStyle = "white";
    	graphics.font="14px monospace";
        
        var xspace = 12;
        var yspace = 12;
        for (var i = 1; i <= lines.length; i++) {
        	graphics.fillText( lines[i - 1], xspace, yspace * (i + 1));
        }
		graphics.restore(); //restores graphics settings
		
		/** Print Stat Grpahic */
		var graphX = 0;
		var graphY = 400;
		var graphmag = 300;
		
		/** BLOCKS RENDERED GRAPH */
		var arr = world.stats.blocks_rendered;
		graphics.strokeStyle = "red"; // blocks rendered
		graphics.beginPath();
		graphics.moveTo(graphX, graphY - 
			((arr[i]/((this.camera.range.x * 2) * (this.camera.range.y * 2))) * graphmag));
		for(var i = 1; i < arr.length; i++){
			graphics.lineTo(graphX + i, graphY - 
				((arr[i] / ((this.camera.range.x * 2) * (this.camera.range.y * 2)))) * graphmag);
		}
		graphics.stroke();
		
		/** ENTITIES RENDERED GRAPH */
		arr = world.stats.entities_rendered;
		graphics.strokeStyle = "blue"; // entities rendered
				graphics.beginPath();
		graphics.moveTo(graphX, graphY - arr[0] / 6 * graphmag);
		for(var i = 1; i < arr.length; i++){
			graphics.lineTo(graphX + i, graphY - arr[i] / 6 * graphmag);
		}
		graphics.stroke();
		
		/** FRAMES PER SECOND GRAPH */
		arr = world.stats.frame_rate;
		graphics.strokeStyle = "green"; //fps
				graphics.beginPath();
		graphics.moveTo(graphX, graphY - arr[0] / 60 * graphmag);
		for(var i = 1; i < arr.length; i++){
			graphics.lineTo(graphX + i, graphY - arr[i] /60 * graphmag);
		}
		graphics.stroke();
    };
};;/** 
 * Handles all time calculations including delta time and iterations per second. 
 *
 *	TODO:
 * 		[+] Change from object to function
 *
 *	@author Alex Johnson
 */
var Level = function(w, h){
  this.h = 29;
  this.w = 150;
  this.tileSize = 16;
  this.trunc = function(x){ return Math.trunc(x/this.tileSize, 2); };
  this.sprite_sheet = "tiles.png";
  var sprite_index = [
    {sprite:{x:0, y:0, w: 16, h:16}, AABB:{x:0, y:0, w: 0, h: 0}}, // sky
    {sprite:{x:1, y:0, w: 16, h:16}, AABB:{x:0, y:0, w: 0, h: 0}}, // grass variant 1
    {sprite:{x:2, y:0, w: 16, h:16}, AABB:{x:0, y:0, w: 0, h: 0}}, // grass variant 2
    {sprite:{x:3, y:0, w: 16, h:16}, AABB:{x:0, y:0, w: 0, h: 0}}, // grass w/ flower
    {sprite:{x:4, y:0, w: 16, h:16}, AABB:{x:0, y:0, w: 0, h: 0}}, // grass for edge blocks
    {sprite:{x:5, y:0, w: 16, h:16}, AABB:{x:0, y:0, w: 0, h: 0}}, // stalagmight 1
    {sprite:{x:6, y:0, w: 16, h:16}, AABB:{x:0, y:0, w: 0, h: 0}}, // stalagmight 2
    {sprite:{x:7, y:0, w: 16, h:16}, AABB:{x:0, y:0, w: 0, h: 0}}, // stalagtight 1
    {sprite:{x:8, y:0, w: 16, h:16}, AABB:{x:0, y:0, w: 0, h: 0}}, // stalagtight 2
                      
    {sprite:{x:0, y:1, w: 16, h:16}, AABB:{x:0, y:0, w:16, h:16}}, // dirt
    {sprite:{x:1, y:1, w: 16, h:16}, AABB:{x:0, y:0, w:16, h:16}}, // dirt w/ grass top
    {sprite:{x:2, y:1, w: 16, h:16}, AABB:{x:0, y:0, w:16, h:16}}, // dirt top left corner w/ grass
    {sprite:{x:3, y:1, w: 16, h:16}, AABB:{x:0, y:0, w:16, h:16}}, // dirt top right corner w/ grass
    {sprite:{x:4, y:1, w: 16, h:16}, AABB:{x:0, y:0, w:16, h:16}}, // dirt bottom left corner
    {sprite:{x:5, y:1, w: 16, h:16}, AABB:{x:0, y:0, w:16, h:16}}, // dirt bottom left corner
    {sprite:{x:6, y:1, w: 16, h:16}, AABB:{x:0, y:0, w:16, h:16}}, // dirt w/ bones 1
    {sprite:{x:7, y:1, w: 16, h:16}, AABB:{x:0, y:0, w:16, h:16}}, // dirt w/ bones 2
                      
    {sprite:{x:0, y:0, w: 16, h:16}, AABB:{x:0, y:0, w:0, h:0}},
    {sprite:{x:0, y:0, w: 16, h:16}, AABB:{x:0, y:0, w:0, h:0}},
    {sprite:{x:0, y:0, w: 16, h:16}, AABB:{x:0, y:0, w:0, h:0}},
    {sprite:{x:0, y:0, w: 16, h:16}, AABB:{x:0, y:0, w:0, h:0}},
    {sprite:{x:0, y:0, w: 16, h:16}, AABB:{x:0, y:0, w:0, h:0}},
    {sprite:{x:0, y:0, w: 16, h:16}, AABB:{x:0, y:0, w:0, h:0}},
    {sprite:{x:0, y:0, w: 16, h:16}, AABB:{x:0, y:0, w:0, h:0}},
    {sprite:{x:0, y:0, w: 16, h:16}, AABB:{x:0, y:0, w:0, h:0}},
    {sprite:{x:0, y:0, w: 16, h:16}, AABB:{x:0, y:0, w:0, h:0}},
    {sprite:{x:0, y:0, w: 16, h:16}, AABB:{x:0, y:0, w:0, h:0}},
    {sprite:{x:0, y:0, w: 16, h:16}, AABB:{x:0, y:0, w:0, h:0}},
    {sprite:{x:0, y:0, w: 16, h:16}, AABB:{x:0, y:0, w:0, h:0}},
    {sprite:{x:0, y:0, w: 16, h:16}, AABB:{x:0, y:0, w:0, h:0}},
    {sprite:{x:0, y:0, w: 16, h:16}, AABB:{x:0, y:0, w:0, h:0}},
    {sprite:{x:0, y:0, w: 16, h:16}, AABB:{x:0, y:0, w:0, h:0}},
    {sprite:{x:0, y:0, w: 16, h:16}, AABB:{x:0, y:0, w:0, h:0}}
  ];

    var data = [[0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,2,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,3,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,1,10,9,9,9,16,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,4,12,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,4,12,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,4,12,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,10,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,20,19,1,10,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,2,10,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,1,10,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,20,0,19,2,10,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,2,10,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,1,10,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,2,10,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,2,10,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,11,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,10,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,10,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,12,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,29,0,0,0,0,0,4,12,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,29,0,0,0,0,0,0,4,12,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,29,20,0,0,0,0,0,0,0,4,12,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,29,0,0,0,0,0,0,0,0,0,19,1,10,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,29,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,29,20,0,0,0,0,0,0,0,0,0,3,10,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,29,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,29,0,0,0,0,0,0,0,0,0,0,2,10,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,29,20,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,29,0,0,0,0,0,0,0,0,0,4,11,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,29,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,29,20,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,29,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,11,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,15,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,11,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,10,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,12,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,10,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,11,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,11,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,16,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,10,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,10,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,12,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,12,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,12,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,0,0,0,0,2,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,20,0,0,0,4,11,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,11,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,20,4,11,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,4,11,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,20,2,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,4,11,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,4,11,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,4,11,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,4,11,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,2,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,4,12,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,19,3,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,2,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,4,12,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,4,12,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,3,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,3,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,4,11,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,2,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,4,12,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,2,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,3,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,4,12,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,2,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,4,12,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,19,1,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,19,4,12,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,12,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,12,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,12,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,12,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,1,10,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,10,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,10,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,10,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,10,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,11,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,0,0,0,1,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,0,2,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,11,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,11,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,11,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,10,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,4,11,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,1,10,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1],[0,0,0,0,0,0,0,0,0,0,0,0,0,13,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,1]];
    
    this.terrain_sprite_index = function(i){
        return sprite_index[i];
    }
    
    this.terrainSpritesNum = function(){
        return sprite_index.length;
    }
    
    this.terrain = function(x, y) {
        if(x > this.w || x < 0 || y < 0 || y > this.h || x == undefined || y == undefined) return 0;
        return data[x][y];
    }
    
    this.getHeight = function(){
        return this.h;
    }
    
    this.getWidth = function(){
        return this.w;
    }
    
    this.setData = function(x, y, n){
        if(x > this.w || x < 0 || y < 0 || y > this.h){
            return false;
        }else{
            data[x][y] = n;
            return true;
        }
    }
    
    this.getData = function(){
        return data;
    }
    
        // returns basic AABB object for x y
    this.getBlockObject = function(i, j){
        // i, j are both in pixels
        var pos = {x: this.trunc(i), y: this.trunc(j)};
        var _id = this.terrain(pos.x, pos.y);
        var b = this.terrain_sprite_index(_id);
        
        return{
            //position on img file
            sprite: {
                x: b.sprite.x,
                y: b.sprite.y,
                w: b.sprite.w,
                h: b.sprite.h,
                id: _id,
                    
            },
            //position on canvas
            pos: {
                x: pos.x*this.tileSize,
                y: pos.y*this.tileSize,
                w: b.sprite.w,
                h: b.sprite.h
            },
            // Axis-aligned bounding box
            AABB: {
                x: pos.x*this.tileSize + b.AABB.x,
                y: pos.y*this.tileSize + b.AABB.y,
                w: b.AABB.w,
                h: b.AABB.h,
                s: function(x, y){
                    if(x > this.x && x < this.x + this.w){
                        if(y > this.y && y < this.y + this.h){
                            return true;
                        }else{
                            return false;
                        }
                    }else{
                        return false;
                    }
                }
             }
         };
    };
};
;/**
 * Preloads and loads IMG and additional JS files.
 */
function ResourceLoader() {

    /** Object containing all loaded resources */
    var rscElements = {};
    
    /** Function to call when all files from queue have been loaded */
    var callback = function () {};
    
    /** The number of files currently in queue to be loaded */
    var inQueue = 0;

    /** Path to where IMG files are stored */
    var path_img = "rsc/img/";
    
    /** Path to where JS files are stored */
    var path_js = "";

    /** 
     * Loads a new file or series of files.
     * 
     * @param {String|Array} f File name or array of file names to load. 
     */
    this.load = function (f) {
        if (f instanceof Array) {
            inQueue += f.length;
            f.forEach(function (file) {
                doLoad(file);
            });
        } else {
            inQueue++;
            doLoad(f);
        }
    };

    /**
     * Determines file type and if the file has already been loaded.
     * 
     * @param {String} file Name of file to load.
     * @returns {HTMLelement} Returns file if it's already loaded.
     */
    function doLoad(file) {
        if (rscElements[file]) {
            return rscElements[file];
        } else {
            if (file.includes(".png")) {
                loadIMG(file);
            } else if (file.includes(".js")) {
                loadJS(file);
            }
        }
    }

    /**
     * Loads IMG and calls callback if queue is empty.
     * 
     * @param {String} file Path of the IMG to load
     * @throws {Error} if file doesn't exsist
     */
    function loadIMG(file) {
        var img = new Image();
        img.onload = function () {
            rscElements[file] = img;
            inQueue--;
            if (inQueue === 0) {
                callback();
            }
        };
        img.onerror = function () {
            console.log("file " + path_img + file + " doesn't exist");
            rscElements[file] = null;
            inQueue--;
            if (inQueue === 0) {
                callback();
            }
        };
        rscElements[file] = false;
        img.src = path_img + file;

    }

    /**
     * Loads JS file and calls callback if queue is empty.
     * 
     * @param {String} file Path of the JS file to load
     * @throws {Error} if file doesn't exsist
     */
    function loadJS(file) {
        var js = document.createElement("script");

        js.type = "text/javascript";
        js.src = path_js + file;


        document.body.appendChild(js);
        js.onload = function () {
            rscElements[file] = js;
            inQueue--;
            if (inQueue === 0) {
                callback();
            }
        };
        js.onerror = function () {
            console.log("file " + path_js + file + " doesn't exist");
            rscElements[file] = null;
            inQueue--;
            if (inQueue === 0) {
                callback();
            }
        };
        rscElements[file] = false;
        js.src = path_js + file;
    }

    /** 
     * Gets the reloaded image element for it's file path
     * 
     * @param {String} path The path of the img to load
     * @returns {object|img} element
     */
    this.get = function (path) {
        return rscElements[path];
    };

    /**
     * Sets the callback function.
     * 
     * @param {Function} f Function to call when all files are loaded.
     */
    this.whenReady = function (f) {
        callback = f;
    };

};/** 
 * Keeps track of game statistics. Mainly for debugging 
 *
 * @author Alex Johnson
 */
var Stats = function () {

    /** The history of the number of blocks rendered for the last 300 frames */
    this.blocks_rendered = new Array(300);

    /** The history of the number of entities rendered for the last 300 frames */
    this.entities_rendered = new Array(300);

    /** The history of the frame rate for the last 300 frames */
    this.frame_rate = new Array(300);

    /**
     * Adds a value to a statistic and returns the statistic array.
     * 
     * @param {String} stat The 2 char String that corresonds to a statistic.
     * @param {Number} value The value to add to the statistic array.
     * @returns {Array|Boolean} Array of stats or false if invalid stat param
     */
    this.addStat = function (stat, value) {
        if (stat == "blocks_rendered" || stat == "br") {
            this.blocks_rendered.unshift(this.blocks_rendered.pop());
            this.blocks_rendered[0] = value;
            return this.blocks_rendered;
        } else if (stat == "entities_rendered" || stat == "er") {
            this.entities_rendered.unshift(this.entities_rendered.pop());
            this.entities_rendered[0] = value;
            return this.entities_rendered;
        } else if (stat == "frame_rate" || stat == "fps") {
            this.frame_rate.unshift(this.frame_rate.pop());
            this.frame_rate[0] = value;
            return this.frame_rate;
        } else {
            return false;
        }
    }
}
;/**
 * Stores data for all the Units. Updates and manages them too.
 */
function UnitHandler() {

    /** The master list of unit objects */
    this.list = [];
    
    /** Handy reference to Player object */
    this.p = null;

    /**
     * Creates and adds a new Player object to the Unit array. 
     * 
     * @param {Number} x The x coordinate to create the Unit.
     * @param {Number} y The y coordinate to create the Unit.
     */
    this.newPlayer = function (x, y) {
        var e = Object.assign(new Unit(this.list.length, x, y), new Player());
        this.list.push(e);
        this.p = e;
    };
    
    /**
     * Creates and adds a new Soldier to the Unit array.
     * 
     * @param {Number} x The x coordinate to create the Unit.
     * @param {Number} y The y coordinate to create the Unit.
     */
    this.newSoldier = function (x, y) {
        var e = Object.assign(new Unit(this.list.length, x, y), new Soldier());
        this.list.push(e);
    };
    
    /**
     * Creates and adds a new RPG Soldier to the Unit array.
     * 
     * @param {Number} x The x coordinate to create the Unit.
     * @param {Number} y The y coordinate to create the Unit.
     */
    this.newRPGsoldier = function (x, y) {
        var e = Object.assign(new Unit(this.list.length, x, y), new RPGsoldier());
        this.list.push(e);
    };

    /**
     * Updates units and removes ref if scheduled to be deleted.
     * 
     * @param {Universe} world @TODO can't be passing the entire universe around like this smh
     */
    this.update = function (world) {
        if (this.list[0].x > 0) {
            var toDestroy = [];
            // move this.units and objects
            for (var i = 0; i < this.list.length; i++) {
                var u = this.list[i];
                u.update(world);
                if (u.destroy)
                    toDestroy.push(u.id);
            }
            for (var i = 0; i < toDestroy.length; i++) {
                for (var j = 0; i < this.list.length; j++) {
                    if (this.list[j].id === toDestroy[i]) {
                        this.list.splice(j, 1);
                        break;
                    }
                }
            }
        }
    };
};
;/**
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
    
    /** {Control} Keeps track of current user input */
    this.controller = new Control();
    
    /**
     * The main game loop. Called dt/1000 times a second. Must be implemented
     * by sub-Universe.
     */
    this.update = function () {};
    
    /**
     * The initialization of the universe presets.
     * Must be implemented by sub-universe;
     */
    this.init = function () {};
    
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
    ;/**
 * Ninja Level Builder
 * 
 */

document.addEventListener(
    "DOMContentLoaded",
    function () {
        var app = {rsc: null, universe: null};
        app.rsc = new ResourceLoader();
        app.rsc.load([
            "tiles.png", "rpgsoldier.png",
            "warrior.png", "enemy.png",
            "hud.png", "bg.png"
        ]);
        app.rsc.whenReady(function () {
            app.universe = new LevelCreator(16, true, app.rsc);
            app.universe.init();

            var main = function () {
                app.universe.update();
                aniFrame = window.requestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        window.oRequestAnimationFrame;
                aniFrame(main, app.universe.getCanvas());
            };
            main();
        });
    }
);

;/**
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
    ;function Wizard(x, y) {
    this.x = x;
    this.y = y;
    
    this.vx = 0;
    this.vy = 0;
   
   var ctrl = null;
   this.setController = function (c){
       ctrl = c;
   };
   
    this.update = function () {
        if (ctrl.a) this.x--;
        if (ctrl.d) this.x++;
        if (ctrl.w) this.y--;
        if (ctrl.s) this.y++;
    };
}
;/* Copyright Alex Johnson 2016 */

var Player = function () {

    this.width = 15;
    this.height = 25;

    this.speed = 180.0;
    this.img = "warrior.png";
    this.attackTick = -1;
    this.jumpPrimed = false;
    this.health = 10;
    this.maxHealth = 10;
    this.imgSize = 40;
    this.imgDisplacement = [12, 15];
    
    var ctrl;
    this.setController = function (controller) {
        ctrl = controller;
    };
    
    this.invunerableUntil = 0;

    this.damage = function (d, time) {
        this.health -= d;
        this.invunerableUntil = time.now + 500; // so damage isn't taken too quickly
        if (this.health <= 0) {
            console.log("dead");
        }
    };

    this.move = function (world) {
        var time = world.time;
        var t = time.getSPF();

        /*
         DO DAMAGE TO ENEMYS
         */
        if (!ctrl.k && this.attackTick === 0) { // if attack button isn't pressed
            this.attackTick = -1; // prime attack, this makes sure it doesn't jump loop attack animations
        } else if (ctrl.k && this.attackTick === -1) { // if attack button is pressed and
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
            if (ctrl.space && this.jumpPrimed && !this.airbourne) {
                this.vy = -8.0;
                this.airbourne = true;
                this.jumpPrimed = false;
            } else if (!ctrl.space) {
                this.jumpPrimed = true;
            }

            if (!ctrl.a && !ctrl.d)
                this.vx = 0;
            if (ctrl.d) { // right
                this.vx = this.speed * t;
                this.direction = 1;
            } else if (ctrl.a) { // left
                this.vx = -this.speed * t;
                this.direction = 0;
            }
        } else if (!this.airbourne) {
            this.vx = 0;
        }
    };

    /** 
     * This function returns the entity obj. Holds a lot of sprite sheet logic.
     * 
     * @param {Clock} time The world clock object.
     * @TODO this is 100 lines this needs to be condensed
     */
    this.obj = function (time) {
        var s = {x: 0, y: 0, w: 40, h: 40, id: this.img};
        var pos = this.aabb();
        var aabb = this.aabb();
        pos.x -= this.imgDisplacement[0];
        pos.y -= this.imgDisplacement[1];

        if (this.airbourne) { // jumping/falling
            if (!ctrl.k) { // just jumping/falling
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
                if (this.direction === 1) {
                    s.x = time.it_24 % 8 * 40;
                    s.y = 6 * 40;
                } else if (this.direction === 0) {
                    s.x = time.it_24 % 8 * 40;
                    s.y = 7 * 40;
                }
            }
        } else if (this.vx === 0) { // not moving horizontally
            if (this.attackTick > 0) {
                if (this.attackTick > 10) {
                    if (this.direction === 1) {
                        s.x = 3 * 40;
                        s.y = 0;
                    } else if (this.direction === 0) {
                        s.x = 3 * 40;
                        s.y = 1 * 40;
                    }
                } else {
                    if (this.direction === 1) {
                        s.x = 4 * 40;
                        s.y = 0;
                        pos.x += 10;
                    } else if (this.direction === 0) {
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
                if (this.direction === 1) { //standing still
                    s.x = 0;
                    s.y = 0;
                } else if (this.direction === 0) {
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
    };
};;/* Copyright Alex Johnson 2016 */

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


;var Soldier = function () {
    /** Essential Unit Properties */
    this.width = 15;
    this.height = 25;
    
    /** Sprite Properties */
    this.img = "enemy.png";
    this.imgSize = 25;
    this.imgDisplacement = [5,0];

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
}; 
;/**
 * The base unit class.
 * 
 * @param {Number} id ID of the unit, index of the object in the Unit array
 * @param {Number} x The starting x position of the Unit
 * @param {Number} y The startign y position of the Unit
 */
function Unit(id, x, y) {
    
    /** The id of the Unit */
    this.id = id;
    
    /** The x and y position of the Unit in the world */
    this.x = x, this.y = y;
    
    /** The width and height of a Unit */
    this.width = 0, this.height = 0;
    
    /** 
     * The tick displacement. This prevents multiple Units from having 
     * in-sync animations 
     */
    this.tick = Math.random() * 200;

    /** The direction left (0) and right (1) */
    this.direction = 0;
    
    /** The Unit's moving speed */
    this.speed = 1;
    
    /** Speed cap. Avoids really high velocities when falling. */
    this.maxSpeed = 10;
    
    /** If the Unit is airbourne */
    this.airbourne = false;
    
    /** The x and y components of the Unit's velocity */
    this.vx = 0, this.vy = 0;

    /** The Unit's spritesheet */
    this.img = "";
    
    /** 
     * The displacement of the unit's sprite on each space on the sprite
     * sheet. 
     */
    this.imgDisplacement = [0, 0];
    
    /** Whether the Unit can move or not */
    this.canMove = true;
    
    /** The hit points of the Unit */
    this.health = 1;
    
    /** The maximum number of hitPoints a Unit can ever have */
    this.maxHealth = 1;
    
    /** Is this Unit currently scheduled to be destoryed */
    this.destroy = false;

    /**
     * If the unit is currently pushing against a surface to the left, right
     * up or down.
     */
    this.contact = {left: false, right: false, up: false, down: false};

    /**
     * Generates the object's axis aligned bounding box
     * 
     * @returns {AABB} The objects axis aligned bounding box
     */
    this.aabb = function () {
        return {
            x: Math.round(this.x),
            y: Math.round(this.y),
            w: Math.round(this.width),
            h: Math.round(this.height),
            s: function (x, y) { // if a point in contained in the AABB
                if (x > this.x && x < this.x + this.w) {
                    if (y > this.y && y < this.y + this.h) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },
            c: function (c) { // if a second AABB is colliding with the AABB
                if (this.x < c.x + c.w &&
                        this.x + this.w > c.x &&
                        this.y < c.y + c.h &&
                        this.h + this.y > c.y) {
                    return true;
                } else {
                    return false;
                }
            }
        };
    };

    /**
     * Damages the unit a certain number of hitpoints.
     * 
     * @param {Number} d Ammount of damage in hitpoints to take
     */
        this.damage = function (d) {
        this.health -= d;
        if (this.health <= 0) {
            this.destroy = true;
        }
    };
    
    /**
     * This method creates point around the Unit that are used to check 
     * collisions with the world and other entities. 
     * 
     * @param {Number} i The point in to calculate.
     * @param {Point} o A object with and x and y value the translates the point.
     * @returns {Point} An object with an x and y value corresponding to an xy point.
     */
    this.points = function (i, o) {
        var x = 0;
        var y = 0;
        if (typeof o !== "undefined") {
            x = o.x;
            y = o.y;
        }
        switch (i) {
            case 0:
                return {x: x, y: y};
            case 1:
                return {x: x, y: y + this.height * 1 / 2};
            case 2:
                return {x: x, y: y + this.height};
            case 3:
                return {x: x + (this.width * 1 / 2), y: y};
            case 4:
                return {x: x + (this.width * 1 / 2), y: y + this.height};
            case 5:
                return {x: x + this.width, y: y};
            case 6:
                return {x: x + this.width, y: y + this.height * 1 / 2};
            case 7:
                return {x: x + this.width, y: y + this.height};
            default: 
                return 8;
        }
    };

    /**
     * Updates the players position and trying to move in requestioned 
     * direction. This function is kind of final, most units will never have to
     * override this.
     * 
     * @param {Universe} world The entire universe 
     */
    this.update = function (world) {
        this.move(world);
        this.vy += 0.5;
        // The xy plus the y velocity
        var next = {x: this.x, y: this.y + this.vy};
        for (var i = 0; i < this.points(); i++) {
            var point = this.points(i, next);
            var block = world.level.getBlockObject(point.x, point.y).AABB;
            if (block.s(point.x, point.y)) {
                // grounded
                if (this.y + this.height <= block.y) {
                    next.y = block.y - this.height;
                    this.vy = 0;
                    this.airbourne = false;
                    this.contact.down = true;
                    break;
                } else {
                    this.contact.down = false;
                }
                // hit head
                if (this.y >= block.y + block.h) {
                    next.y = block.y + block.h;
                    this.vy = 0;
                    this.contact.up = true;
                    break;
                } else {
                    this.contact.up = false;
                }
            }
        }
        this.y = next.y;
        
        // The xy plus the x velocity
        var next = {x: this.x + this.vx, y: this.y};        
        for (var i = 0; i < this.points(); i++) {
            var point = this.points(i, next);
            var block = world.level.getBlockObject(point.x, point.y).AABB;
            point = this.points(i, next);
            if (block.s(point.x, point.y)) {
                // wall right
                if (this.x + this.width <= block.x) {
                    next.x = block.x - this.width;
                    this.vx = 0;
                    this.contact.right = true;
                    break;
                } else {
                    this.contact.right = false;
                }
                // wall left
                if (this.x >= block.x + block.w) {
                    next.x = block.x + block.w;
                    this.vx = 0;
                    this.contact.left = true;
                    break;
                } else {
                    this.contact.left = false;
                }
            }

        }
        this.x = next.x;
            
    };
    
    /** 
     * This function returns the entity obj. Holds a lot of sprite sheet logic.
     * 
     * @param {Clock} time The world clock object.
     */
    this.obj = function (time) {
        var t = time.it_10 % 2;
        var s = {x: 0, y: 0, w: this.imgSize, h: this.imgSize, id: this.img};
        var pos = this.aabb();
        pos.x -= this.imgDisplacement[0];
        pos.y -= this.imgDisplacement[1];

        var aabb = this.aabb();

        if (this.vx === 0) { // not moving horizontally
            if (this.direction === 1) { //standing still
                s.x = 0;
                s.y = 0;
            } else if (this.direction === 0) {
                s.x = this.imgSize;
                s.y = 0;
            }
        } else if (this.vx > 0) { // running right
            s.x = time.it_12 % 3 * this.imgSize;
            s.y = this.imgSize * 1;
        } else if (this.vx < 0) { // running left
            s.x = time.it_12 % 3 * this.imgSize;
            s.y = this.imgSize * 2;
        }

        return{
            sprite: s, //position on img file
            pos: pos, // position on canvas (happens to be the same to AABB)
            AABB: aabb // Axis-aligned bounding box
        };
    };

}


