/* 
 * 
 * @author Alex Johnson
 */

var clockTest = new TestRunner("Clock.js");

clockTest.run("testNewRscLoader", "{ResoureceLoader, inQueue: 0, loaded: 0}",
        function () {
            return new ResourceLoader().toString();
        }
);

clockTest.run("testLoadWithCallback", "{ResoureceLoader, inQueue: 0, loaded: 0}",
        function () {
            return "Not implemented";
        }
);

clockTest.run("testLoadWithoutCallback", "{ResoureceLoader, inQueue: 0, loaded: 0}",
        function () {
            return "Not implemented";
        }
);


clockTest.publish(document.getElementById("clock"));