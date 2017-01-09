/* Copyright Alex Johnson 2016 */
  
var vector_2D = {
    add: function(a, b) { return {x: a.x + b.x, y: a.y + b.y}; }// both a and b need variables x and y
};

/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number} z (optional), if not provided point will be 2D
 * @param {number} w (optional) 
 */       
function Point(x,y,z,w) {
    this.x = x;
    this.y = y;
    this.z = z || null;
    this.w = w || 1;
    var isValid = typeof x === "number" && typeof y === "number";
    this.type = isValid ? (typeof z === "number" ?  "Point3D" : "Point2D") 
        : "Invalid";

    this.toString = function(){
        return "{"
            + this.type + ", "
            + this.x + ", " 
            + this.y + ", " 
            + this.z + ", " 
            + this.w + "}";
    };
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
    };
    
    this.dot = function (v) {
        
        if (typeof v === undefined || v === undefined){
            error("vector is undefined");
            return;
        }
        
        if (v.who !== "Vector") {
            error("object is not a vector");
            return;
        }
    
        var x0 = this.x*v.x; 
        var y0 = this.y*v.y;
        var z0 = 2;
        return new Vector(x0, y0, z0);
    };
    
    this.cross = function (v) {
    
    };
        
}

function Face(p, c, n, o) {
    this.points = p; // array of ordered points
    this.normal = n;
    this.origin = o;
    this.color = c;
}

/**
 * A 3D shape is defined by its points 
 * 
 * @param p Array of points that make up the Shape
 * @param f Array of object references to the faces that make up the shape
 * @param o Point origin (optional) 
 */ 
function Shape(p, f, o) {
    this.points = p; // array of points
    this.faces = f; // array of Face objects
    this.origin = o;
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
        new Face([o,a], "black"),
        new Face([o,b], "black"),
        new Face([o,c], "black"),
        new Face([a,d], "black"),
        new Face([a,e], "black"),
        new Face([b,f], "black"),
        new Face([b,g], "black"),
        new Face([c,h], "black"),
        new Face([c,i], "black")
    ];
    
    return new Shape([a,b,c,d,e,f,g,h,i,o], faces, o);
}
