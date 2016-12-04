/**
 * Controller for running all cases in a Test file
 * @author Alex Johnson
 */
function TestRunner(c){
    var testClass = c;
    var tests = [];
    var passText = function() { return "<span style=\"font-weight: bold; color:green;\">PASS\n</span>"};
    var failText = function() { return "<span style=\"font-weight: bold; color:red;\">FAIL\n</span>"};
    var elseText = function(e) { return "<span style=\"font-weight: bold; color:#FFA500;\">" + e + "\n</span>"};
    this.run = function(name, expected, actual, comparator) {
        
        if (typeof comparator == "string") {
            
            comparator = comparator.toLowerCase();
            
            if (comparator == "string") {
                comparator = compareString;
            } else if (comparator == "number") {
                comparator = compareNumber;
            } else if (comparator == "array") {
                comparator = compareArray;
            } else {
                throw new TypeError();
            }
            
        } else {
            comparator = compareDefault;
        }
        
        tests.push({name: name, exp: expected, act: actual, compare: comparator});
    }
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
    }
    
    /**
     * Compares two numbers to 10 decimal places
     * @param {Number} a first number to compare 
     * @param {Number} b first number to compare 
     */
    function compareNumber(a, b) {
        
        if (typeof a != "number" || typeof b != "number") {
            return false;
        }
        
        return a.toFixed(10) == b.toFixed(10) ? passText() : failText();
    }
    
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
     * @param {String} a first number to compare 
     * @param {String} b first number to compare 
     */
    function compareString(a, b) {
        
        if (typeof a != "string" || typeof b != "string") {
            return false;
        }
        
        return (a == b) ? passText() : failText();
    }
    
    /**
     * Compares two variables. Default comparison 
     * @param {var} a first variable to compare 
     * @param {var} b first variable to compare 
     */
    function compareDefault(a, b) {
        return (a == b) ? passText() : failText();
    }
}
