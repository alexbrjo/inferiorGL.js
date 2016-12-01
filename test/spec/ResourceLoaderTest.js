/* 
 * 
 * @author Alex Johnson
 */

var resourceLoaderTest = new TestRunner("ResourceLoader.js");

resourceLoaderTest.run("testNewRscLoader", "{ResoureceLoader, inQueue: 0, loaded: 0}",
        function () {
            return new ResourceLoader().toString();
        }
);

resourceLoaderTest.run("testLoadWithCallback", "{ResoureceLoader, inQueue: 0, loaded: 0}",
        function () {
            return "Not implemented";
        }
);

resourceLoaderTest.run("testLoadWithoutCallback", "{ResoureceLoader, inQueue: 0, loaded: 0}",
        function () {
            return "Not implemented";
        }
);


resourceLoaderTest.publish(document.getElementById("resourceloader"));