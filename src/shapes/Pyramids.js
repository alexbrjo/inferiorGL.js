/**
 * 
 * @param {Number} x 
 * @param {Number} y
 * @param {Number} z
 * @param {Number} s The number of sides of the base
 */
function pyramid (x,y,z,s) {
    if (s === 3) {
        return triangularPyramid(x,y,z);
    } else if (s === 4) {
        return triangularPyramid(x,y,z);
    } else {
        throw new Error("Pyramid must be retangular or triangular");
    }
}

/** 
 * Creates a regular triangular pyramid
 * @todo make triangular pyramid regular
 * @todo add parameters for side lengths
 * @param {Number} x The x coordinate of the pyramid
 * @param {Number} y The y coordinate of the pyramid
 * @param {Number} z The z coordinate of the pyramid
 */
function triangularPyramid(x, y, z) { 

    var a = new Point( x, y, z);
    var b = new Point(1+x, y, z);
    var c = new Point(0.5+x,1+y, z);
    var d = new Point(0.5+x,0.5+y,1+z);
    var e = new Point(0.5+x,0.5+y,0.5+z);

    var faces = [
        new Face([a,b,c,a], "red"),
        new Face([a,b,d,a], "green"),
        new Face([b,c,d,b], "blue"),
        new Face([c,a,d,c], "yellow")
    ];
    
    return new Shape([a,b,c,d,e], faces, e);
}

/** 
 * Creates an axis-aligned retangluar pyramid
 * @todo make retangular pyramid regular
 * @todo add parameters for side lengths
 * @todo fix face normals, they're very incorrect
 * @todo add precise face origins 
 * @param {Number} x The x coordinate of the pyramid
 * @param {Number} y The y coordinate of the pyramid
 * @param {Number} z The z coordinate of the pyramid
 */
function retangularPyramid(x, y, z) { 

    var a = new Point( x, y, z);
    var b = new Point(1+x, y, z);
    var c = new Point(1+x,1+y, z);
    var d = new Point(x,1+y,z);
    var e = new Point(0.5+x,0.5+y,1+z);
    
    var f = new Point(0.5+x,0.5+y,0.33+z);
    
    /**   
     * abcde are all the points that make up the faces of the cube.
     * f is the origin of the entire shape. 
     *        
     *      |            
     *      |   e           
     *      |  / \      
     *      |a/_ _\_ _ _ __ x
     *      //     \    /b
     *     //       \  /
     *    //_________\/
     *   / d         c
     *   z 
     *   
     *  Axes labeled xyz. 
     */

    var faces = [
        new Face([a,b,c,d,a], "red",  [0,0,-1], f), // the sqaure face
        new Face([a,b,e,a], "green",  [0,0.5,-0.5], f),
        new Face([b,c,e,b], "orange", [0.5,0.5,0], f),
        new Face([c,d,e,c], "blue",   [0,0.5,0.5], f),
        new Face([d,a,e,d], "yellow", [-0.5,0.5,0], f)
    ];
    
    return new Shape([a,b,c,d,e], faces, e);
}