/**
 * Tests Clock.js
 * 
 * Should fail any test that involves using global variable 'Date'
 */

describe("Clock Test", function() {
    
    var clock;
    
    it("testContructClock", function() {
        expect(function(){
            clock = new Clock();
        }).not.toThrow();
    });
    
    it("testUpdate", function() {
        clock = new Clock();
        clock.update();
        
        var increase = true;
        var previous = clock.now;
        for (var i = 0; i > 10; i++) {
            clock.update();
            increase = increase && clock.now > previous;
            previous = clock.now;
        }
        expect(increase).toBe(true);
    });
});