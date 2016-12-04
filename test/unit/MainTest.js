/* 
 * 
 * @author Alex Johnson
 */

var mainTest = new TestRunner("main.js");

/**
 * Document.getElementById() should throw a TypeError
 */
mainTest.run("testNoInitArgument", "TypeError: Cannot read property 'getContext' of undefined",
        function () {
            var gl = new inferiorGL();
            gl.init();
            return "no errors";
        }
);

/**
 * Document.getElementById() should throw a TypeError
 */
mainTest.run("testInvalidInitArgument", "TypeError: canvas.getContext is not a function",
        function () {
            var gl = new inferiorGL();
            var a_canvas = document.createElement('img');
            gl.init(a_canvas);
            return "no errors";
        }
);

mainTest.run("testValidInitArgument", "no errors",
        function () {
            var gl = new inferiorGL();
            var a_canvas = document.createElement('canvas');
            gl.init(a_canvas);
            return "no errors";
        }
);

mainTest.run("testValidInitArgument", "Visual tests",
        function () {
            var gl = new inferiorGL();
            var a_canvas = document.createElement('canvas');
            gl.init(a_canvas);
            return "TODO";
        }
);


mainTest.publish(document.getElementById("tests"));