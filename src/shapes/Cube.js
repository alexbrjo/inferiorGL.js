/**
 * Creates an axis aligned cube
 * 
 * @author Alex Johnson
 * @param {Number} x The x coordinate of the shape
 * @param {Number} y The y coordinate of the shape
 * @param {Number} z The z coordinate of the shape
 * @param {Number} l The length of every side of the cube
 */
function cube(x, y, z, l) {
    
    var x = x | 0; // x coordiate of the shape, defaults to 0
    var y = y | 0; // y coordiate of the shape, defaults to 0
    var z = z | 0; // z coordiate of the shape, defaults to 0
    var l = l | 1; // The side length of the cube defaults to 1
    
    /**   
     * abcdegh are all the points that make up the faces of the cube.
     * i is the origin of the entire shape. 
     *         
     *      y
     *     d|____________c
     *     /|           /|
     *    / |          / |
     *   /___________ /  |
     *  h|  |        |g  |
     *   |  |a_ _ _ _|_ _|__ x
     *   |  /        |  /b
     *   | /         | /
     *  e|/__________|/
     *   /           f
     *   z 
     *   
     *   Axes labeled xyz. 
     *   
     */
    var a = new Point(  x,  y,  z);
    var b = new Point(l+x,  y,  z);
    var c = new Point(l+x,l+y,  z);
    var d = new Point(  x,l+y,  z);
    var e = new Point(  x,  y,l+z);
    var f = new Point(l+x,  y,l+z);
    var g = new Point(l+x,l+y,l+z);
    var h = new Point(  x,l+y,l+z);
    
    var i = new Point(l/2+x, l/2+y, l/2+z);                              
    
    /** Properties for each face
     *      The points that represent the face
     *      Default color 
     *      normal of face 
     *      The exact center of the face
     */
    var faces = [
        new Face([a,b,c,d,a], "red",   [0,0,-1], new Point(l/2+x,l/2+y,  z)),
        new Face([a,b,f,e,a], "blue",  [0,-1,0], new Point(l/2+x,  y,l/2+z)),
        new Face([b,c,g,f,b], "yellow",[ 1,0,0], new Point(l+x,l/2+y,l/2+z)),
        new Face([c,d,h,g,c], "blue",  [0, 1,0], new Point(l/2+x,l+y,l/2+z)),
        new Face([d,a,e,h,d], "green", [-1,0,0], new Point(  x,l/2+y,l/2+z)),
        new Face([e,f,g,h,e], "red",   [0,0, 1], new Point(l/2+x,l/2+y,l+z))
    ];
    
    return new Shape([a,b,c,d,e,f,g,h,i], faces, i);
}