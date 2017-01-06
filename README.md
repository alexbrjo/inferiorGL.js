inferiorGL.js 
==================================================

The graphics library I'm doubtful you're looking for
----------------------------------------------------
InferiorGL was designed to function just like a traditional graphics library, 
but due to my own lack of experience and poor attention to detail it's hard to 
call it a graphics library at all. But in all seriousness...

Modern day computer graphics are almost unbelievable. Quite literally. A lot of 
movie scenes and video game clips are so realistic it's hard to separate reality 
from cgi. Thinking about the algorithms and research required to create todays 
rendering software is incredibly intimidating. And that is my goal with this 
project: To better understand the algorithms, optimization and concepts that 
are required to make 3D graphics.

How to try it out
----------------------
1. Requires Grunt 0.4+ and a web browser that supports HTML5 canvas
2. Clone git repo and run grunt task 'build'
3. Open js console in your web browser and open ../test/playground.html
4. Copy/paste one of the scripts below into your browser js console

```javascript
gl.clearShapes();
for (var i = 0; i < 16; i++) { 
    for(var j = 0; j < 16; j++) {
        gl.addShape(new cube( i, j, i^j));
    }
}
```

```javascript
gl.clearShapes(); 
var radius = 8;
var spacing = 8;
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

How does it work?
--------------------
InferiorGL.js works by wrapping the 2D RenderingContext of an HTML canvas. In 
addition to several of the normal RenderingContext2D functions, a dozen 3D 
rendering functions are added. 

RenderingContext3D is where the actual rendering happens and can be used stand
alone from the entire library. It does not handle shapes, animation loops or 
double buffering. But it can easily render a single frame with shapes.

Features 
-------------------------
- Created shapes with normal vectors and faces
- Optimized rendering by only drawing faces with normals facing towards the Camera
- Clip points completely behind plane tangent to camera
- Project 3D points onto the 2D display (thank you en.wikipedia.org/wiki/3D_projection)

To be implemented 
---------------------
- Better documentation
- Complete Test files 
- Sort faces better; sorting by face origin distance isn't perfect
- Implement clip space and clip lines
- Image rendering
- Object transformations
- parametric equation rendering

Disclaimer
-------------
This is an indev project so the API is extremely fluid. Expect function names to change. 
