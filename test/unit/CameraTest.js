/* 
 * 
 * @author Alex Johnson
 */

var cameraTest = new TestRunner("Camera.js");

cameraTest.run("testValidCamera", "no errors",
        function () {
            var cam = new Camera(40, 20, 10);
            return "no errors";
        }
);

cameraTest.run("testInvalidValidCamera", "TypeError: z is not a number",
        function () {
            var cam = new Camera(40, 20, "10");
            return "no errors";
        }
);

cameraTest.run("testGetTransformationMatrix", "4, 5, 6",
        function () {
            var cam = new Camera(4, 5, 6);
            return cam.getTransform().x + ", " +
                   cam.getTransform().y + ", " +
                   cam.getTransform().z;
        }
);

cameraTest.publish(document.getElementById("tests"));