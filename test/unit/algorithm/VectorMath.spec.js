/**
 * Tests all the basic vector math used in RenderingContext3D
 * 
 * @author Alex Johnson
 */


describe("Vector Math", function () {

    var v0 = [0, 0, 0];
    var v1 = [3, 4, 5];
    var v2 = [12, 33, 0];
    var v3 = [4, 0, 9];
    var v4 = [2.2, 1.1, 3.3];

    // static camera should not be moved in any tests
    var testCamera = new Camera(0, 0, 0);
    var testCanvas = document.createElement('canvas');
    var textCtx2D = testCanvas.getContext('2d');
    var math = new RenderingContext3D(textCtx2D, testCamera).math;

    /**
     * Dot Product: a1*b1 + a2*b2 + a2*b2
     * 
     * v0[0,0,0] * v1[3,4,5]
     * 0*3 + 0*4 + 0*5
     * 0
     *      
     * v2[12,33,0] * v3[4,0,9]
     * 12*4 + 33*0 + 0*9
     * 48 + 0 + 0 = 48
     * 
     * v2[12,33,0] * v1[3,4,5]
     * 12*3 + 33*4 + 0*5
     * 36 + 132 + 0 = 168
     */
    it("testDotProduct int", function () {
        expect(math.dot(v0, v1)).toBeCloseTo(0, 10);
        expect(math.dot(v2, v3)).toBeCloseTo(48, 10);
        expect(math.dot(v2, v1)).toBeCloseTo(168, 10);
    });

    /**
     * Dot Product: a1*b1 + a2*b2 + a2*b2
     * 
     * v2[12,33,0] * v4[2.2, 1.1, 3.3]
     * 12*2.2 + 33*1.1 + 0*3.3
     * 26.4 + 36.3 + 0 = 62.7
     */
    it("testDotProduct double", function () {
        expect(math.dot(v2, v4)).toBeCloseTo(62.7, 10);
    });

    /**
     * Cross Product: < a2*b3 - a3*b2,
     *                  a3*b1 - a1*b3, 
     *                  a1*b2 - a2*b1 >
     * 
     * By the right hand rule [1,0,0] x [0,1,0] will be [0,0,1]
     * 
     * v1[3,4,5] x v2[12,33,0]
     * < 4*0  - 5*33,
     *   5*12 - 3*0, 
     *   3*33 - 4*12 >
     * < 0 - 165, 60 - 0, 99 - 48>
     * <-165, 60, 51>
     */
    it("testCrossProduct int", function () {
        expect(math.cross([1, 0, 0], [0, 1, 0])).toEqual([0, 0, 1]);
    });

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
    it("testCrossProduct double", function () {
        expect(math.cross(v1, v4)).toEqual([7.7, 1.1, -5.5]);
    });

    /**
     * Angle Test
     * 
     * cosA = [Dot product of vectors] / [product of the magnitude of the vectors]
     * 
     * [1, 0, 0] [0, 1, 0]
     * Should be PI/2 because they are orthogonal vectors
     * 
     * [1, 1, 0] [1, 0, 0]
     * Should be PI/4 because they trace out a 45/45/90 triangle
     * 
     */
    it("testAngle int", function () {
        expect(math.angle([1, 0, 0], [0, 1, 0])).toBeCloseTo(Math.PI / 2, 10);
        expect(math.angle([1, 1, 0], [1, 0, 0])).toBeCloseTo(Math.PI / 4, 10);
    });


    /**
     * Angle Test
     * 
     * cosA = [Dot product of vectors] / [product of the magnitude of the vectors]
     * 
     * [Math.sqrt(3), 1, 0] [Math.sqrt(3), 0, 0]
     * Should be PI/6 because they trace out the longer sides of a 30/60/90 
     * triangle.
     * 
     * [1, Math.sqrt(3), 0] [1, 0, 0]
     * Should be PI/3 because they trace out a 30/60/90 triangle
     * 
     */
    it("testAngle double", function () {
        expect(math.angle([Math.sqrt(3), 1, 0], [Math.sqrt(3), 0, 0])).toBeCloseTo(Math.PI / 6, 10);
        expect(math.angle([1, Math.sqrt(3), 0], [1, 0, 0])).toBeCloseTo(Math.PI / 3, 10);
    });

    /**
     * Magnitude Test
     * 
     * <0, 0, 0>
     * Should be 0 because all components are 0.
     * 
     * <1, 0, 0>
     * Should be 1 because the only component is length 1.
     * 
     * Sign should not effect magnitude.
     * 
     * <4, 3, 0>
     * sqrt(4^2 + 3^2 +0^2)
     * sqrt(16 + 9)
     * sqrt(25)
     * 5
     * 
     */
    it("testMagnitude int", function () {
        expect(math.magnitude(0, 0, 0)).toBeCloseTo(0, 10);
        expect(math.magnitude(1, 0, 0)).toBeCloseTo(1, 10);
        expect(math.magnitude(-1, 0, 0)).toBeCloseTo(1, 10);
        expect(math.magnitude(4, 3, 0)).toBeCloseTo(5, 10);
    });

    /**
     * Magnitude Test
     * 
     * <0.5, 1.5, 3>
     * sqrt(0.5^2 + 1.5^2 +3^2)
     * sqrt(0.25 + 2.25 + 9)
     * sqrt(11.50)
     * 3.39116499156
     */
    it("testMagnitude double", function () {
        expect(math.magnitude(0.5, 1.5, 3)).toBeCloseTo(3.39116499156, 10);
    });
});