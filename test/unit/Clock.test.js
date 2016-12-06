/* 
 * 
 * @author Alex Johnson
 */

var clockTest = new TestRunner("Clock.js");

clockTest.run("testNewClock", "no errors",
        function () {
            var clock = new Clock();
            return "no errors";
        }
);

clockTest.run("testUpdate", "no errors",
        function () {
            var clock = new Clock();
            clock.update();
            return "no errors";
        }
);

clockTest.run("testGetSPF", "no errors",
        function () {
            var clock = new Clock();
            clock.getSPF();
            return "no errors";
        }
);


clockTest.publish(document.getElementById("tests"));