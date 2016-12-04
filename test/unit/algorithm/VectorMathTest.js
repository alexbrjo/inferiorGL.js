/* 
 * 
 * @author Alex Johnson
 */

var vectorMathTest = new TestRunner("Vector Math Test");
// static camera should not be moved in any tests
var v0 = [0,0,0];
var v1 = [3,4,5];
var v2 = [12,33,0];
var v3 = [4,0,9];
var v4 = [2.2, 1.1, 3.3];
var testCanvas = document.createElement('canvas');
var textCtx2D = testCanvas.getContext('2d');
var math = new RenderingContext3D(textCtx2D, testCamera).math;

/**
 * Dot Product 
 * 
 * v0[0,0,0] * v1[3,4,5]
 * 0*3 + 0*4 + 0*5
 * 0
 */
vectorMathTest.run("testDotProduct int", 0,
        function () {
            return math.dot(v0, v1);
        },
"number");

/**
 * Dot Product 
 * 
 * v2[12,33,0] * v3[4,0,9]
 * 12*4 + 33*0 + 0*9
 * 48 + 0 + 0 = 48
 */
vectorMathTest.run("testDotProduct int", 48,
        function () {
            return math.dot(v2, v3);
        },
"number");

/**
 * Dot Product: a1*b1 + a2*b2 + a2*b2
 * 
 * v2[12,33,0] * v1[3,4,5]
 * 12*3 + 33*4 + 0*5
 * 36 + 132 + 0 = 168
 */
vectorMathTest.run("testDotProduct int", 168,
        function () {
            return math.dot(v2, v1);
        },
"number");

/**
 * Dot Product: a1*b1 + a2*b2 + a2*b2
 * 
 * v2[12,33,0] * v4[2.2, 1.1, 3.3]
 * 12*2.2 + 33*1.1 + 0*3.3
 * 26.4 + 36.3 + 0 = 62.7
 */
vectorMathTest.run("testDotProduct double", 62.7,
        function () {
            return math.dot(v2, v4);
        },
"number");

/**
 * Cross Product: < a2*b3 - a3*b2,
 *                  a3*b1 - a1*b3, 
 *                  a1*b2 - a2*b1 >
 * 
 * By the right hand rule [1,0,0] x [0,1,0] will be [0,0,1]
 */
vectorMathTest.run("testCrossProduct int", [0, 0, 1],
        function () {
            return math.cross([1, 0, 0], [0, 1, 0]);
        },
"array");

/**
 * Cross Product: < a2*b3 - a3*b2,
 *                  a3*b1 - a1*b3, 
 *                  a1*b2 - a2*b1 >
 * 
 * v1[3,4,5] x v2[12,33,0]
 * < 4*0  - 5*33,
 *   5*12 - 3*0, 
 *   3*33 - 4*12 >
 * < 0 - 165, 60 - 0, 99 - 48>
 * <-165, 60, 51>
 */
vectorMathTest.run("testCrossProduct int", [-165, 60, 51],
        function () {
            return math.cross(v1, v2);
        },
"array");

/**
 * Cross Product: < a2*b3 - a3*b2,
 *                  a3*b1 - a1*b3, 
 *                  a1*b2 - a2*b1 >
 * 
 * v1[3, 4, 5] x v4[2.2, 1.1, 3.3]
 * < 4*3.3 - 5*1.1,
 *   5*2.2 - 3*3.3, 
 *   3*1.1 - 4*2.2 >
 * < 13.2 - 5.5, 11.0 - 9.9, 3.3 - 8.8>
 * < 7.7, 1.1, -5.5>
 */
vectorMathTest.run("testCrossProduct double", [7.7, 1.1, -5.5],
        function () {
            return math.cross(v1, v4);
        },
"array");

/**
 * Angle Test
 * 
 * [1, 0, 0] [0, 1, 0]
 * Should be PI/2 because they are orthogonal vectors
 */
vectorMathTest.run("testAngle int", Math.PI/2,
        function () {
            return math.angle([1, 0, 0], [0, 1, 0]);
        },
"number");

/**
 * Angle Test
 * 
 * [1, 1, 0] [1, 0, 0]
 * Should be PI/4 because they trace out a 45/45/90 triangle
 */
vectorMathTest.run("testAngle int", Math.PI/4,
        function () {
            return math.angle([1, 1, 0], [1, 0, 0]);
        },
"number");

/**
 * Angle Test
 * 
 * [Math.sqrt(3), 1, 0] [Math.sqrt(3), 0, 0]
 * Should be PI/6 because they trace out the longer sides of a 30/60/90 
 * triangle.
 */
vectorMathTest.run("testAngle double", Math.PI/6,
        function () {
            return math.angle([Math.sqrt(3), 1, 0], [Math.sqrt(3), 0, 0]);
        },
"number");

/**
 * Angle Test
 * 
 * [1, Math.sqrt(3), 0] [1, 0, 0]
 * Should be PI/3 because they trace out a 30/60/90 triangle
 */
vectorMathTest.run("testAngle double", Math.PI/3,
        function () {
            return math.angle([1, Math.sqrt(3), 0], [1, 0, 0]);
        },
"number");

vectorMathTest.publish(document.getElementById("tests"));