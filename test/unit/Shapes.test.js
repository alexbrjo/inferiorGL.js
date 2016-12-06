/**
 * Tests the Shapes file
 * @author Alex Johnson
 */

var shapesTest = new TestRunner("shapes.js");

/**
 * TEST VALID POINT 2D
 */
shapesTest.run("testValidPoint2D", "{Point2D, 123, 456, null, 1}",
        function () {
            return new Point(123, 456).toString();
        }
);

/**
 * TEST VALID POINT 3D
 */
shapesTest.run("testValidPoint3D", "{Point3D, 4, 5.5, -3.0001, 1}",
        function () {
            return new Point(4, 5.5, -3.0001).toString();
        }
);

/**
 * TEST INVALID POINT
 * The Point object is treated as a primative and won't throw errors if 
 * set up improperly. It's the responsibilty of parent functions to check
 * if point is valid.
 */
shapesTest.run("testInValidPoint", "{Invalid, -4, 35, 47, 1}",
        function () {
            return new Point("-4", 35, 47).toString();
        }
);

shapesTest.publish(document.getElementById("tests"));
