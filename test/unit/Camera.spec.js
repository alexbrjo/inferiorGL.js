/** 
 * Tests the Camera object
 * 
 * @author Alex Johnson
 */

describe("Camera", function() {
    
    var cam;
    
    it("testValidCamera", function() {
        expect(function(){
            cam = new Camera(40, 20, 10);
        }).not.toThrow();
    });
    
    it("testInvalidValidCamera", function() {
        expect(function(){
            cam = Camera(40, 20, "10");
        }).toThrow(new TypeError("z is not a number"));
    });
    
    it("testGetTransformationMatrix", function() {
        cam = new Camera(40, 20, 10);
        expect(cam.getTransform()).toEqual({x:40, y:20, z:10});
    });
});