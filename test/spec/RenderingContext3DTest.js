/* 
 * 
 * @author Alex Johnson
 */

var renderingContext3DTest = new TestRunner("RenderingContext3D.js");

renderingContext3DTest.run("testNewRscLoader", "{ResoureceLoader, inQueue: 0, loaded: 0}",
        function () {
            return new ResourceLoader().toString();
        }
);

renderingContext3DTest.run("testLoadWithCallback", "{ResoureceLoader, inQueue: 0, loaded: 0}",
        function () {
            return "Not implemented";
        }
);

renderingContext3DTest.run("testLoadWithoutCallback", "{ResoureceLoader, inQueue: 0, loaded: 0}",
        function () {
            return "Not implemented";
        }
);

renderingContext3DTest.publish(document.getElementById("renderingContent3D"));