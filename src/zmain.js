/**
 * InferiorGL.js indev 
 * @author Alex Johnson 2016 
 */  
function inferiorGL(){

    var objects = [];
    this.addShape = function(s) {
        objects[objects.length] = s;
        return s;
    }
    this.addShapes = function(arr) {
        var th = this;
        arr.forEach(function(shape){
            th.addShape(shape);
        });
        return arr;
    }

    var canvas = null;
    var ctx = null;
              
    var edit_canvas = null;
    var edit_ctx = null;
            
    var zoomed = false;
    var smoothing = true;
    this.target_spf = 0.016;
    this.fov = 1.0/Math.tan((Math.PI/2)/2.0);
              
    var rsc = new ResourceLoader();
    var camera = {
        x:10, y:10, z:10,
        theta_x: -Math.PI/4, theta_y:-Math.PI/4, theta_z: 0,
        scale: 4.0,
        maxScale: 6,
        edgeBuffer: 2,
        range: {x:0, y:0},
        zoom: function(factor){
            this.scale *= factor;
            if(this.scale > this.maxScale) this.scale = this.maxScale;
        },
        getRotation: function(){
            return [
                [1,0,0],
                [0,1,0],
                [0,0,1]
            ];
        },
        getTransform: function(){
            return {x:this.x,y:this.y,z:this.z};
        }
    };
                    
    // time = now, last, delta Time
    this.time = new Clock();
              
    this.init = function(){
              
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
              
        edit_canvas = document.createElement('canvas');
        edit_ctx = edit_canvas.getContext('2d');
         
        rsc.setPath("rsc/");
        rsc.load(['bg.png']);
        var th = this;
        rsc.whenReady(function(){
            var main = function() {
                th.time.update();
                th.update(10 < 1/th.time.dt);
                th.print();
                aniFrame = window.requestAnimationFrame  ||
                    window.mozRequestAnimationFrame    ||
                    window.webkitRequestAnimationFrame ||
                    window.msRequestAnimationFrame     ||
                    window.oRequestAnimationFrame;
                    aniFrame(main, canvas);
            }
            console.log("Welcome to InferiorGL.js indev\n\tby Alex Johnson\nAvailable functions:\n"+
            "\tgl.add(\"square\", <x>, <y>, <z>)\n\tgl.add(\"triangle\", <x>, <y>, <z>)\n"
            +"Camera Controls:\n\tA - left\t\tW - forward\t\t\tQ - up\n"
            +"\tD - right\t\tS - backward\t\tE - down\n"
            );
            main();
        });
    }
    this.resize = function(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        edit_canvas.width = canvas.width;
        edit_canvas.height = canvas.height;
        camera.range.x = canvas.width;
        camera.range.y = canvas.height;
           
        if (!smoothing){   
            ctx.mozImageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
        }
    }
    /*
               
    UPDATE AND RENDERING FUNCTIONS
     
    */
    this.update = function(speed){
        this.print();
        
        control.vx = 0;
        control.vy = 0;
        control.vz = 0;
        
        if(control.forward){
            control.vx += 0.1*Math.sin(camera.theta_y);
            control.vz -= 0.1*Math.cos(camera.theta_y);
        } else if (control.backward){
            control.vx -= 0.1*Math.sin(camera.theta_y);
            control.vz += 0.1*Math.cos(camera.theta_y);
        }
        
        if(control.left){
            control.vx -= 0.1*Math.cos(camera.theta_y);
            control.vz -= 0.1*Math.sin(camera.theta_y);
        } else if (control.right){
            control.vx += 0.1*Math.cos(camera.theta_y);
            control.vz += 0.1*Math.sin(camera.theta_y);
        }
        
        if(control.up){
            control.vy += 0.1;
        } else if (control.down){
            control.vy -= 0.1;
        }
        
        if(control.turnleft){
            camera.theta_y -= 0.01;
        } else if (control.turnright){
            camera.theta_y += 0.01;
        }
        
        if(control.turnup){
            camera.theta_x -= 0.01;
        } else if (control.turndown){
            camera.theta_x += 0.01;
        }
        
        camera.x += control.vx;
        camera.y += control.vy;
        camera.z += control.vz;
    }
    this.print = function(){
        edit_ctx.clearRect(0, 0, edit_canvas.width, edit_canvas.height);
        if(!zoomed){this.resize();}
                
        // draw each shape       
        for (var q = 0; q <= objects.length-1; q++) {
            var shape = objects[q]; 
            for (var i = 0; i <= shape.faces.length-1; i++) {
                var face = shape.faces[i]; 
                for (var j = 0; j <= face.lines.length-1; j++) {
                    var vec2d = [
                            this.project2d(face.lines[j][0], camera), 
                            this.project2d(face.lines[j][1], camera)
                        ];
            
                    if(vec2d[0].w < 0 || vec2d[1].w < 0){ // if in front of the camera
                        edit_ctx.strokeStyle = face.color;
                        edit_ctx.beginPath();
                        edit_ctx.moveTo(vec2d[0].x*canvas.width + canvas.width/2,
                                vec2d[0].y*canvas.width + canvas.height/2);
                        edit_ctx.lineTo(vec2d[1].x*canvas.width + canvas.width/2,
                                vec2d[1].y*canvas.width + canvas.height/2);
                        edit_ctx.stroke();   
                    } 
                } // j
            } // i
        } // q
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(edit_canvas, 0, 0);
    }
    
    this.project2d = function(p, c) {
    
        var ex = 0, ey = 0, ez = 0.5;
        
        var sx = Math.sin(c.theta_x), sy = Math.sin(c.theta_y), sz = Math.sin(c.theta_z);
        var cx = Math.cos(c.theta_x), cy = Math.cos(c.theta_y), cz = Math.cos(c.theta_z);

        var x0 = p.x - c.x, y0 = p.y - c.y, z0 = p.z - c.z;

        var dx = cy * (sz * y0 - cz * x0) - sy * z0;
        var dy = sx * (cy * z0 + sy * (sz * y0 - cz * x0)) + cx * (cz * y0 - sz * x0);
        var dz = cx * (cy * z0 + sy * (sz * y0 - cz * x0)) - sx * (cz * y0 - sz * x0);

        var bx = (ez / dz) * dx - ex;
        var by = (ez / dz) * dy - ey;
    
        return new Point(bx, by, 0, dz);
    }
    
    this.clipMatrix = function(fov, aspect, near, far){
        return [
                [fov*aspect,    0,      0,                          0],
                [0,             fov,    0,                          0],
                [0,             0,      (near+far)/(far-near),      1],
                [0,             0,      (2*near*far)/(near-far),    0]
            ];
    }
    
    var control = {vx:0, vy:0, vz: 0, left: false, right: false, up: false, down:false,
                turnleft: false, turnright: false, turnup: false, turndown: false};
            
    window.onresize = this.resize;
    window.onkeydown = function(x){
        if(x.which == "A".charCodeAt()) { 
            control.left = true;
        } else if(x.which == "D".charCodeAt()) {
            control.right = true;
        } else if(x.which == "S".charCodeAt()) {
            control.backward = true;
        } else if(x.which == "W".charCodeAt()) {
            control.forward = true;
        }
        
        if(x.which == "J".charCodeAt()) {
            control.turnleft = true;
        } else if(x.which == "L".charCodeAt()) {
            control.turnright = true;
        }
        
        if(x.which == "I".charCodeAt()) {
            control.turnup = true;
        } else if(x.which == "K".charCodeAt()) {
            control.turndown = true;
        }
        
        if(x.which == "Q".charCodeAt()) { 
            control.up = true;
        } else if(x.which == "E".charCodeAt()) { 
            control.down = true;
        }
    };
    window.onkeyup = function(x){
        if(x.which == "A".charCodeAt()) { 
            control.left = false;
        } else if(x.which == "D".charCodeAt()) {
            control.right = false;
        } else if(x.which == "S".charCodeAt()) {
            control.backward = false;
        } else if(x.which == "W".charCodeAt()) {
            control.forward = false;
        }
        
        if(x.which == "J".charCodeAt()) {
            control.turnleft = false;
        } else if(x.which == "L".charCodeAt()) {
            control.turnright = false;
        }
        
        if(x.which == "I".charCodeAt()) {
            control.turnup = false;
        } else if(x.which == "K".charCodeAt()) {
            control.turndown = false;
        }
        
        if(x.which == "Q".charCodeAt()) control.up = false; 
        if(x.which == "E".charCodeAt()) control.down = false;
    };
}