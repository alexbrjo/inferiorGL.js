/**
 * Controller for running all cases in a Test file
 * @author Alex Johnson
 * 
 * @param {String} c The name of the class of testing
 */
function TestRunner(c){
    var testClass = c;
    var tests = [];
    var passText = function() { return "<span style=\"font-weight: bold; color:green;\">PASS\n</span>";};
    var failText = function() { return "<span style=\"font-weight: bold; color:red;\">FAIL\n</span>";};
    var elseText = function(e) { return "<span style=\"font-weight: bold; color:#FFA500;\">" + e + "\n</span>";};
    
    /**
     * Adds a new test to the test array.
     * 
     * @param {String} name Name of the test
     * @param {var} expected Expected result of test
     * @param {var} actual Actual result of the test
     * @param {String|function} comparator Type of comparision to evaluate the test by
     */
    this.run = function(name, expected, actual, comparator) {
        
        if (typeof comparator === "string") {
            
            comparator = comparator.toLowerCase();
            
            if (comparator === "string") {
                comparator = compareString;
            } else if (comparator === "number") {
                comparator = compareNumber;
            } else if (comparator === "array") {
                comparator = compareArray;
            } else {
                throw new TypeError();
            }
            
        } else if (typeof comparator === "undefined"){
            comparator = compareDefault;
        }
        
        tests.push({name: name, exp: expected, act: actual, compare: comparator});
    };
    
    /**
     * Adds the test result to a HTML table
     * @param {HTMLelement} element The element to append the result to
     */
    this.publish = function(element) {
        var contents = "<tr></tr><tr><th>Test</th>" +
                "<th>Expected</th><th>Actual</th><th>Result</th></tr>";
        for (var i = 0; i < tests.length; i++) {
            
            // Having try-catch here means skipping them in test cases
            var act = "";
            
            try {
                act = tests[i].act();
            } catch (err) {
                act = err;
            }
            
            contents += "<tr><td>" + tests[i].name + "</td>" +
                    "<td>" + tests[i].exp + "</td>" + 
                    "<td>" + act + "</td>" + 
                    "<td>" + tests[i].compare(tests[i].exp, act) + 
                    "</td></tr>";
            
        }   
        element.innerHTML = element.innerHTML +  "<h2>" + testClass + "</h2>" + contents;
    };
    
    /**
     * Compares two numbers to 10 decimal places
     * 
     * @param {Number} a first number to compare 
     * @param {Number} b first number to compare 
     * @return {String} test result
     */
    function compareNumber(a, b) {
        
        if (typeof a !== "number" || typeof b !== "number") {
            return false;
        }
        
        return a.toFixed(10) === b.toFixed(10) ? passText() : failText();
    };
    
    /**
     * Compares two arrays of numbers by cell to avoid false fails.
     * 
     * @param {Array} a first array to compare 
     * @param {Array} b first array to compare 
     * @return {String} test result
     */
    function compareArray(a, b) {
        if (!(a instanceof Array && b instanceof Array)) {
            return failText();
        }
        
        var equalCells = 0;
        var total = 0;
        if (a.length === b.length) {
            for (var i = 0; i < a.length; i++) {
                if (a[i].toFixed(10) === b[i].toFixed(10)) {
                    equalCells++;
                }
                total++;
            }
            return equalCells === total ? passText() : failText();
            
        } else {
            return failText();
        }
    }
    
    /**
     * Compares two Strings
     * 
     * @param {String} a first number to compare 
     * @param {String} b first number to compare 
     * @return {String} test result
     */
    function compareString(a, b) {
        
        if (typeof a !== "string" || typeof b !== "string") {
            return false;
        }
        
        return (a === b) ? passText() : failText();
    }
    
    /**
     * Compares two variables. Default comparison 
     * 
     * @param {var} a first variable to compare 
     * @param {var} b first variable to compare 
     * @return {String} test result
     */
    function compareDefault(a, b) {
        return (a === b) ? passText() : failText();
    }
}
