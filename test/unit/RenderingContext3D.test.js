/* 
 * 
 * @author Alex Johnson
 */

var renderingContext3DTest = new TestRunner("RenderingContext3D.js");
// static camera should not be moved in any tests
var testCamera = new Camera(0,0,0);
var testCanvas = document.createElement('canvas');
var textCtx2D = testCanvas.getContext('2d');
var math = new RenderingContext3D(textCtx2D, testCamera);

renderingContext3DTest.run("testValidConstuctor", "no errors",
        function () {
            try {
                var testCanvas = document.createElement('canvas');
                var textCtx2D = testCanvas.getContext('2d');
                var testCtx = new RenderingContext3D(textCtx2D, testCamera);
            } catch (err) {
                
            }
        }
);

renderingContext3DTest.run("testInvalidConstuctor", "{ResoureceLoader, inQueue: 0, loaded: 0}",
        function () {
            return "Not implemented";
        }
);

renderingContext3DTest.run("testLoadWithoutCallback", "{ResoureceLoader, inQueue: 0, loaded: 0}",
        function () {
            return "Not implemented";
        }
);

renderingContext3DTest.publish(document.getElementById("tests"));