/**
 * Controller for running all cases in a Test file
 * @author Alex Johnson
 */
function DefaultTest(){
    this.tests = [];
    this.addTest = function(test) {
        this.tests += test;
    }
    this.run = function(test) {
        
        if(test instanceof array) {
            
            for (var i = 0; i < test.length; i++) {
                var j = 0;
                do {
                     j++;
                } while (tests[i].name === test) {
                    this.tests[test[i]].run;
                }
            }
            
        } else if(typeof test === 'String') {
            
            this.tests[test].run;
            
        } else if(typeof test === undefined || typeof test === 'undefined') {
            
            for (var i = 0; i < this.tests.length; i++) {
                this.tests[test[i]].run;
            }
            
        } else {
            // invalid argument
            throw new Error();
        }
    }
}
