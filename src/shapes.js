/* Copyright Alex Johnson 2016 */
  
var vector_2D = {
    add: function(a, b) { return {x: a.x + b.x, y: a.y + b.y} }// both a and b need variables x and y
}

/**
 *
 *
 * 
 * @param x 
 * @param y 
 * @param z number (optional), if not provided point will be 2D
 * @param w number (optional) 
 */       
function Point(x,y,z,w) {
    this.isValid = typeof x === "number" && typeof y === "number";
    this.x = x;
    this.y = y;
    this.z = typeof z === "number" ? z : 0;
    this.w = typeof w === "number" ? w : 1;
    this.type = typeof z === "number" ?  "Point3D" : "Point2D";
    
    var type = "Point";
    this.toString = function(){
        if (this.type = "Point2D") { 
            return type + "{"
                + this.x + ", " 
                + this.y + ", " 
                + this.z + "}";
        } else {
            return type + "{"
                + this.x + ", " 
                + this.y + ", " 
                + this.z + "}";
        }
    }
}

function Vector(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
    var type = "Vector";
    this.toString = function(){
        return type + "{" + this.x + ", " 
                          + this.y + ", " 
                          + this.z + "}";
    }
    
    this.dot = function (v) {
        
        if (typeof v === undefined || v == undefined){
            error("vector is undefined");
            return;
        }
        
        if (v.who != "Vector") {
            error("object is not a vector");
            return;
        }
    
        var x0 = this.x*v.x; 
        var y0 = this.y*v.y;
        var z0 = 2;
        return new Vector(x0, y0, z0);
    }
    
    this.cross = function (v) {
    
    } 
        
}

function Face(p, c) {
    this.lines = p; // array of lines
    this.normal;
    this.origin;
    this.color = c;
}

/**
 *
 * @param f array of Faces
 * @param o Point origin (optional) 
 */ 
function Shape(p, f, o) {
    this.points = p; // array of points
    this.faces = f; // array of Face objects
    this.origin = o;
}
    
function square(x, y, z) {
    
    var a = new Point(  x,  y,  z);
    var b = new Point(1+x,  y,  z);
    var c = new Point(1+x,1+y,  z);
    var d = new Point(  x,1+y,  z);
    var e = new Point(  x,  y,1+z);
    var f = new Point(1+x,  y,1+z);
    var g = new Point(1+x,1+y,1+z);
    var h = new Point(  x,1+y,1+z);
    var i = new Point(0.5+x, 0.5+y, 0.5+z);
    
    var faces = [
        new Face([[a,b],[b,c],[c,d],[d,a]], "red"),
        new Face([[a,b],[b,f],[f,e],[e,a]], "blue"),
        new Face([[b,c],[c,g],[g,f],[e,a]], "yellow"),
        new Face([[c,d],[d,h],[h,g],[g,c]], "blue"),
        new Face([[d,a],[a,e],[e,h],[h,d]], "green"),
        new Face([[e,f],[f,g],[g,h],[h,e]], "red")
    ];
    
    return new Shape([a,b,c,d,e,f,g,h,i], faces, i);
}

function triangle(x, y, z) { 

    var a = new Point( x, y, z);
    var b = new Point(1+x, y, z);
    var c = new Point(0.5+x,1+y, z);
    var d = new Point(0.5+x,0.5+y,1+z);
    var e = new Point(0.5+x,0.5+y,0.5+z);

    var faces = [
        new Face([[a,b],[b,c],[c,a]], "red"),
        new Face([[a,b],[b,d],[d,a]], "green"),
        new Face([[b,c],[c,d],[d,b]], "blue"),
        new Face([[c,a],[a,d],[d,c]], "yellow")
    ];
    
    return new Shape([a,b,c,d,e], faces, e);
}

function coordinatePlane(x, y, z, m) { 

    if(typeof m === undefined) m = 10;

    var o = new Point( x, y, z);
    var a = new Point( m+x, y, z);
    var b = new Point( x, m+y, z);
    var c = new Point( x, y, m+z);
    
    var d = new Point( m+x-0.5, y-0.25, z);
    var e = new Point( m+x-0.5, y+0.25, z);
    
    var f = new Point( x, m+y-0.5, z-0.25);
    var g = new Point( x, m+y-0.5, z+0.25);
    
    var h = new Point( x-0.25, y, m+z-0.5);
    var i = new Point( x+0.25, y, m+z-0.5);
    
    var faces = [
        new Face([
            [o,a],[o,b],[o,c],
            [a,d],[a,e],
            [b,f],[b,g],
            [c,h],[c,i]
        ], "black")
    ];
    
    return new Shape([a,b,c,d,e,f,g,h,i,o], faces, o);
}