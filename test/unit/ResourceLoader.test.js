/* 
 * 
 * @author Alex Johnson
 */

var resourceLoaderTest = new TestRunner("ResourceLoader.js");

resourceLoaderTest.run("testNewRscLoader", "{ResoureceLoader, inQueue: 0, loaded: 0}",
        function () {
            var rsc =  new ResourceLoader();
            return rsc.toString();
        }
);

resourceLoaderTest.run("testLoadAddToQueue", "{ResoureceLoader, inQueue: 1, loaded: 0}",
        function () {
            var rsc =  new ResourceLoader();
            rsc.load(["unit/ClockTest.js"]);
            return rsc.toString();
        }
);

resourceLoaderTest.run("testLoadAddDuplicateToQueue", "{ResoureceLoader, inQueue: 1, loaded: 0}",
        function () {
            var rsc =  new ResourceLoader();
            rsc.load(["unit/ClockTest.js", "unit/ClockTest.js"]);
            return rsc.toString();
        }
);


resourceLoaderTest.publish(document.getElementById("tests"));