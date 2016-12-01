/**
 * Controller for running all cases in a Test file
 * @author Alex Johnson
 */
function TestRunner(c){
    var testClass = c;
    var tests = [];
    this.run = function(name, expected, actual) {
        tests.push({name: name, exp: expected, act: actual});
    }
    this.publish = function(element) {
        var contents = "<table><h2>" + testClass + "</h2><tr><th>Test</th>" +
                "<th>Expected</th><th>Actual</th><th>Result</th></r>";
        for (var i = 0; i < tests.length; i++) {
            var act = tests[i].act();
            contents += "<tr><td>" + tests[i].name + "</td>" +
                    "<td>" + tests[i].exp + "</td>" + 
                    "<td>" + act + "</td>" + 
                    "<td>" + (tests[i].exp === act ? "PASS" : "FAIL") + "</td></tr>";
        }   
        contents += "</table>";
        element.innerHTML = contents;
    }
}