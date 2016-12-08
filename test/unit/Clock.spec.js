/**
 * Tests the clock object. Need to add test that manually test 
 * update calculations.
 * 
 * @author Alex Johnson
 */

describe("Clock", function() {
    
    var clock;
    
    it("testNewClock", function() {
        expect(function(){
            clock = new Clock();
        }).not.toThrow();
    });
    
    it("testUpdate", function() {
        expect(function(){
            clock = new Clock();
            clock.update();
        }).not.toThrow();
    });
    
    it("testGetSPF", function() {
        expect(function(){
            clock = new Clock();
            clock.getSPF();
        }).not.toThrow();
    });
});