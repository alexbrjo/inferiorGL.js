/** 
 * Tests the Main.js file.
 * 
 * @author Alex Johnson
 */

describe("Main", function() {
    
    var gl;

    /**
     * Document.getElementById() should throw a TypeError
     */
    it("testNoInitArgument", function() {
        expect(function(){
            gl = new inferiorGL();
            gl.init();
        }).not.toThrow(new TypeError("Cannot read property 'getContext' of undefined"));
    });
    
    it("testInvalidInitArgument", function() {
        expect(function(){
            gl = new inferiorGL();
            var a_canvas = document.createElement('img');
            gl.init(a_canvas);
        }).toThrow(new TypeError("canvas.getContext is not a function"));
    });
    
    it("testValidInitArgument", function() {
        expect(function(){
            gl = new inferiorGL();
            var a_canvas = document.createElement('canvas');
            gl.init(a_canvas);
        }).not.toThrow();
    });
});
