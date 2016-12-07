/** 
 * Contains canvas objects and handles all rendering. Graphics were chosen to not be 
 * drawn in entity classes. All 
 *
 * The parent of Graphics is responsible for adding all objects it wants drawn to the 
 * queue. This variable that contains the 1 instance of this object is named 'g'. The  
 * actual graphical context is referred to as 'c' inside this function.
 *
 *	@author Alex Johnson
 */
var Graphics = function() {

    /** canvas and context for the <canvas> displayed */  
    var display = document.getElementById('alexjo-ninja');
    var graphics = display.getContext('2d');
    
    /** canvas object to draw frame on */              
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');  
    
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
     * Holds variables that are used to figure out what part of the board
     * needs to be drawn 
     */
    this.camera = {
    	x:0, y:0,
    	scale: 4.0,
    	maxScale: 6,
        edgeBuffer: 2,
        range: {x:0, y:0},
        zoom: function(factor) {
            this.scale *= factor;
            if (this.scale > this.maxScale) this.scale = this.maxScale;
        }
    };
         
    /**
     * Resizes graphical context and affected variables.
     */
    this.resize = function() {
        this.camera.range.x = Math.round(display.width/(tileSize*this.camera.scale));
        this.camera.range.y = Math.round(display.height/(tileSize*this.camera.scale));
        this.zoomed = true;
    };
    
    /**
     * The master print function called once (1) an update loop. Is responsible for
     * dispatching functions for drawing all items in the queue
     *
     *	@param {Universe} world The entire universe
     */
    this.print = function(world) {

	var window_width = window.innerWidth/(2*this.camera.scale);
        var window_height = window.innerHeight/(2*this.camera.scale);
        this.camera.x = Math.round(Math.round(world.units.p.x) - window_width);
        this.camera.y = Math.round(Math.round(world.units.p.y) - window_height);
        if(this.camera.x < 0) this.camera.x = 0;
        if(this.camera.x+window_width > 151*16) this.camera.x = 151*16;
        if(this.camera.y < 0) this.camera.y = 0;
        if(this.camera.y+window_height > 30*16) this.camera.y = 30*16;
	
         // clear the edit_ctx for a new frame
        canvas.width = display.width = window.innerWidth;
        canvas.height = display.height = window.innerHeight;
        if (!this.zoomed) {this.resize();}
    	
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
        for (var i = trunc(this.camera.x) - this.camera.range.x + 2; 
        		 i < trunc(this.camera.x) + this.camera.range.x + 2;
        		 i++) {
            for (var j = trunc(this.camera.y) - this.camera.range.y + 2; 
            		 j < trunc(this.camera.y) + this.camera.range.y + 2; 
            		 j++) {
                var block = world.level.getBlockObject(tileSize*i, tileSize*j);
                var pos = block.pos; // pos of tile in background
                var img = block.sprite; //pos of sprite on img file

                if (img.id > 0) {
                    ctx.drawImage(world.rsc.get(world.level.sprite_sheet),
                            img.x*tileSize, img.y*tileSize, img.w, img.h,
                            pos.x-this.camera.x, pos.y-this.camera.y, pos.w, pos.h);
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
                	2, 30+9*i, 9, 9);
            } else {
            	ctx.drawImage(world.rsc.get("hud.png"),
                    9, 0, 9, 9,
                	2, 30+9*i, 9, 9);
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
    		"GameName in-dev v0.0.1 ("+ (Math.round(t.now/1000) - 
    			Math.round(t.started/1000)) +" seconds old)",
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
        for (var i = 1; i<=lines.length; i++) {
        	graphics.fillText( lines[i-1], xspace, yspace*(i+1));
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
			((arr[i]/((this.camera.range.x*2)*(this.camera.range.y*2))) *graphmag));
		for(var i = 1; i < arr.length; i++){
			graphics.lineTo(graphX+i, graphY - 
				((arr[i]/((this.camera.range.x*2)*(this.camera.range.y*2)))) *graphmag);
		}
		graphics.stroke();
		
		/** ENTITIES RENDERED GRAPH */
		arr = world.stats.entities_rendered;
		graphics.strokeStyle = "blue"; // entities rendered
				graphics.beginPath();
		graphics.moveTo(graphX, graphY - arr[0]/6*graphmag);
		for(var i = 1; i < arr.length; i++){
			graphics.lineTo(graphX+i, graphY - arr[i]/6*graphmag);
		}
		graphics.stroke();
		
		/** FRAMES PER SECOND GRAPH */
		arr = world.stats.frame_rate;
		graphics.strokeStyle = "green"; //fps
				graphics.beginPath();
		graphics.moveTo(graphX, graphY - arr[0]/60*graphmag);
		for(var i = 1; i < arr.length; i++){
			graphics.lineTo(graphX+i, graphY - arr[i]/60*graphmag);
		}
		graphics.stroke();
    };
};