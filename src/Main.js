/**
 * InferiorGL.js indev 
 * 
 * @author Alex Johnson 2016 
 */  
function inferiorGL(){
    
    /** All the objects to render */
    var objects = [];
    
    /**
     * Adds a shape into the array.
     * 
     * @param {Shape} s The shape to add to the object list
     * @returns {Shape} The shape added to the object list.
     */
    this.addShape = function(s) {
        objects[objects.length] = s;
        return s;
    };
    
    /**
     * Adds an array of shapes to the object list.
     * 
     * @param {Array} arr Array of shapes to add to the object list.
     */
    this.addShapes = function(arr) {
        var th = this;
        arr.forEach(function(shape){
            th.addShape(shape);
        });
    };

    /**
     * Gets the shape at the given index.
     * 
     * @param {int} x The index of the shape to return.
     * @returns {Shape} The shape.
     */
    this.getShape = function(x){return objects[x];};
    
    /** The canvas to publish the rendered environment to */
    var canvas = null;
    var ctx = null;
    
    /** The canvas to prerender shapes to */    
    var edit_canvas = null;
    var edit_ctx = null;
            
    var smoothing = true;
    this.target_spf = 0.016;
      
    /** Loads extrnal resources */
    var rsc = new ResourceLoader();
    
    /** Updates current user input */
    var user = new DefaultController();
    
    /** The camera object required to in RenderingContext3D render */
    var camera = new Camera(0, 5, 17, 0, 0, 0);  
    
    /** Updates current time */
    this.time = new Clock();
    
    /**
     * Initalizes the Inferior graphics library framework.
     * 
     * @param {Canvas} canvasElement The html canvas object to render objects on.
     */
    this.init = function(canvasElement){

        canvas = canvasElement;
        ctx = canvas.getContext('2d');
              
        edit_canvas = document.createElement('canvas');
        edit_ctx = new RenderingContext3D(edit_canvas.getContext('2d'), camera);
         
        rsc.setPath("rsc/");
        rsc.load(['bg.png']);
        var th = this;
        rsc.whenReady(function(){
            var main = function() {
                th.time.update();
                th.update(th.time.dt);
                th.print();
                aniFrame = window.requestAnimationFrame  ||
                    window.mozRequestAnimationFrame    ||
                    window.webkitRequestAnimationFrame ||
                    window.msRequestAnimationFrame     ||
                    window.oRequestAnimationFrame;
                    aniFrame(main, canvas);
            };
            console.log("Welcome to InferiorGL.js indev\n\tby Alex Johnson\nAvailable functions:\n"+
            "\tgl.addShape(new Square(<x>, <y>, <z>)\n"
            +"Camera Controls:\n\tA - left\t\tW - forward\t\t\tQ - up\n"
            +"\tD - right\t\tS - backward\t\tE - down\n"
            );
            main();
        });
    };
    
    this.resize = function(){
        if (!smoothing){   
            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
        }
    };
    
    /**
     * Updates the camera and re-prints the image.
     * 
     * @param {type} dt The change in time since the last frame.
     */
    this.update = function(dt){
        this.print();
        
        user.getCtrl().vx = 0;
        user.getCtrl().vy = 0;
        user.getCtrl().vz = 0;
        var speed = 5;
        
        if(user.getCtrl().forward){
            user.getCtrl().vx += speed * Math.sin(camera.theta_y);
            user.getCtrl().vz -= speed * Math.cos(camera.theta_y);
        } else if (user.getCtrl().backward){
            user.getCtrl().vx -= speed * Math.sin(camera.theta_y);
            user.getCtrl().vz += speed * Math.cos(camera.theta_y);
        }
        
        if(user.getCtrl().left){
            user.getCtrl().vx -= speed * Math.cos(camera.theta_y);
            user.getCtrl().vz -= speed * Math.sin(camera.theta_y);
        } else if (user.getCtrl().right){
            user.getCtrl().vx += speed * Math.cos(camera.theta_y);
            user.getCtrl().vz += speed * Math.sin(camera.theta_y);
        }
        
        if(user.getCtrl().up){
            user.getCtrl().vy += speed;
        } else if (user.getCtrl().down){
            user.getCtrl().vy -= speed;
        }
        
        if(user.getCtrl().turnleft){
            camera.theta_y -= 0.01;
        } else if (user.getCtrl().turnright){
            camera.theta_y += 0.01;
        }
        
        if(user.getCtrl().turnup){
            camera.theta_x -= 0.01;
        } else if (user.getCtrl().turndown){
            camera.theta_x += 0.01;
        }
        
        camera.x += user.getCtrl().vx * dt;
        camera.y += user.getCtrl().vy * dt;
        camera.z += user.getCtrl().vz * dt;
    };
    
    /**
     * Prints all the objects in the list.
     */
    this.print = function(){
        // resize canvas to fit window. Resetting width or height clears canvas
        edit_canvas.width = canvas.width = window.innerWidth; 
        edit_canvas.height = canvas.height = window.innerHeight;
        
        // draw each shape 
        //edit_ctx.beginPaint();
        for (var q = 0; q < objects.length; q++) {
            if (typeof objects[q].faces[0].origin !== "undefined") {
                edit_ctx.renderShape(objects[q]);
            } else {
                edit_ctx.renderWireframeShape(objects[q]);
            }
        }
        //edit_ctx.finishPaint();
        this.printDebug();
        ctx.drawImage(edit_canvas, 0, 0);
    };
    
    /**
     * Generates a clip matrix.
     * 
     * @param {type} fov Field of view
     * @param {type} aspect The aspect ratio
     * @param {type} near The near point of the pupil (closest distance to render).
     * @param {type} far The far point of the pupil (farthest distance to render).
     * @returns {Array} The clip matrix
     */
    this.clipMatrix = function(fov, aspect, near, far){
        return [
                [fov*aspect,    0,      0,                          0],
                [0,             fov,    0,                          0],
                [0,             0,      (near+far)/(far-near),      1],
                [0,             0,      (2*near*far)/(near-far),    0]
            ];
    };
    
    /**
     * Prints the debug console in the top left corner.
     */
    this.printDebug = function() {
    	var t = this.time;
    	var lines = [
    		"inferiorGL.js in-dev v0.0.1 ("+ (Math.round(t.now / 1000) - 
    			Math.round(t.started / 1000)) +" seconds old)",
			t.dt*1000 + " ms / " + t.fps + " fps",
			objects.length + " objects",
        	"camera x: " + Math.trunc(camera.x * 100) / 100
                        + " y: "+ Math.trunc(camera.y * 100) / 100
                        + " z: "+ Math.trunc(camera.z * 100) / 100
    	];
        
    	edit_ctx.save(); //saves graphics settings without 'difference composition'
    	edit_ctx.globalCompositeOperation = "difference";
        edit_ctx.textColor = "black";
    	edit_ctx.font="14px monospace";
        
        var xspace = 12;
        var yspace = 12;
        for (var i = 1; i <= lines.length; i++) {
        	edit_ctx.fillText( lines[i - 1], xspace, yspace * (i + 1));
        }
        edit_ctx.restore(); //restores graphics settings
    };
}
