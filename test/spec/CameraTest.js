/* 
 * 
 * @author Alex Johnson
 */

var cameraTest = new TestRunner("Camera.js");

cameraTest.run("testNewRscLoader", "{ResoureceLoader, inQueue: 0, loaded: 0}",
        function () {
            return new ResourceLoader().toString();
        }
);

cameraTest.run("testLoadWithCallback", "{ResoureceLoader, inQueue: 0, loaded: 0}",
        function () {
            return "Not implemented";
        }
);

cameraTest.run("testLoadWithoutCallback", "{ResoureceLoader, inQueue: 0, loaded: 0}",
        function () {
            return "Not implemented";
        }
);


cameraTest.publish(document.getElementById("camera"));