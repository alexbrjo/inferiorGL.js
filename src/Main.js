/**
 * InferiorGL.js indev 
 * 
 * @author Alex Johnson 2016 
 */  
function inferiorGL(){
    var objects = [];
    this.addShape = function(s) {
        objects[objects.length] = s;
        return s;
    };
    this.addShapes = function(arr) {
        var th = this;
        arr.forEach(function(shape){
            th.addShape(shape);
        });
        return arr;
    };

    this.getShape = function(x){return objects[x];};
    
    var canvas = null;
    var ctx = null;
              
    var edit_canvas = null;
    var edit_ctx = null;
            
    var smoothing = true;
    this.target_spf = 0.016;
              
    var rsc = new ResourceLoader();
    var user = new DefaultController();
    var camera = new Camera(10, 15, 10);                
    // time = now, last, delta Time
    this.time = new Clock();
              
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
            "\tgl.add(\"square\", <x>, <y>, <z>)\n\tgl.add(\"triangle\", <x>, <y>, <z>)\n"
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
    }
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
    this.print = function(){
        // resize canvas to fit window. Resetting width or height clears canvas
        edit_canvas.width = canvas.width = window.innerWidth; 
        edit_canvas.height = canvas.height = window.innerHeight;
        
        // draw each shape       
        for (var q = 0; q < objects.length; q++) {
            if (q == 0) {
                edit_ctx.renderShape(objects[q]);
            } else {
                edit_ctx.renderWireframeShape(objects[q]);
            }
        }
        
        this.printDebug();
        ctx.drawImage(edit_canvas, 0, 0);
    };
    
    this.clipMatrix = function(fov, aspect, near, far){
        return [
                [fov*aspect,    0,      0,                          0],
                [0,             fov,    0,                          0],
                [0,             0,      (near+far)/(far-near),      1],
                [0,             0,      (2*near*far)/(near-far),    0]
            ];
    };
    
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
