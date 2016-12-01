/* 
 * 
 * @author Alex Johnson
 */

var mainTest = new TestRunner("main.js");

mainTest.run("testNewRscLoader", "{ResoureceLoader, inQueue: 0, loaded: 0}",
        function () {
            return new ResourceLoader().toString();
        }
);

mainTest.run("testLoadWithCallback", "{ResoureceLoader, inQueue: 0, loaded: 0}",
        function () {
            return "Not implemented";
        }
);

mainTest.run("testLoadWithoutCallback", "{ResoureceLoader, inQueue: 0, loaded: 0}",
        function () {
            return "Not implemented";
        }
);


mainTest.publish(document.getElementById("main"));