inferiorGL.js 
==================================================

The graphics library I'm doubtful you're looking for
----------------------------------------------------

InferiorGL was designed to function just like a traditional graphics library, 
but due to my own lack of experience and poor attention to detail it's hard to 
call it a graphics library at all. But in all seriousness I'm writing this for 
better understand what goes into rending 3D graphics and to get practice 
writing larger code projects. 

How to try it out
----------------------
1. Requires Grunt 0.4+ and a web browser that supports HTML5 canvas
2. Clone git repo and run grunt task 'build'
3. Open js console in your web browser and open ../test/playground.html
4. Copy/paste one of the scripts below into your browser js console

```javascript
gl.clearShapes();
for (var i = 0; i < 16; i++) { 
    for(var j = 0; j < 32; j++) {
        gl.addShape(new cube( i, j, i^j));
    }
}
```

```javascript
gl.clearShapes(); 
var radius = 16;
var spacing = 16;
for(var i = 0; i < 2 * Math.PI; i += Math.PI / spacing) { 
    for(var j = 0; j < Math.PI; j += Math.PI / spacing) {
        gl.addShape(new cube( 
                        radius * Math.sin(j) * Math.sin(i), 
                        radius * Math.sin(j) * Math.cos(i), 
                        radius * Math.cos(j)
                    ));
    }
}
```

Current Indev Tasks
----------------------
- Complete Test files 
- Remove core dependency of ResourceLoader
- Calculate projection-dependent angle between face normal and eye
- Implement clip space and clip lines

Indev Tasks Completed
-------------------------
- Create normals for object faces
- Create objects for basic shapes
- Clip points completely behind plane tangent to camera
- Project 3D points onto the 2D display (thank you en.wikipedia.org/wiki/3D_projection)

Future Indev Tasks
---------------------
- Image rendering
- Object transformations
- parametric equation rendering

Disclaimer
-------------
This is an indev project so the API is extremely fluid. Expect function names to change. 
