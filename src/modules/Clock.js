/** 
 * Handles all time calculations including delta time and iterations per second. 
 *
 * @author Alex Johnson
 */
 function Clock() {
    this.started = -1;          // time stamp of first game loop
    this.now = 		0;      // time of current frame
    this.last = 	0;      // time of last frame
    this.dt = 		0;      // delta time
    this.secLoop = 	0;      // second loop
    this.sec = 		false;  // is it a second?
    this.nextsec = 	0;      // time of the next second
    this.frames = 	0;      // frames to calculate fps
    this.fps = 		0;      // fps (refresh loops per second)
    this.it_10 = 	0;      //10 iterations per second 0,1,2,3,4,5,6,7,8,9
    this.it_12 = 	0;      //12 iterations per second
    this.it_16 = 	0;      //16 iterations per second
    this.it_24 = 	0;      //24 iterations per second
    
    var min_spf = 0.032; // minimum seconds per frame
    
    /**
     * Determines when to use delta_t. If the framerate is low then delta_t
     * shouldn't be used.
     * 
     * @returns {Number} The number to be used as delta_t in game logic 
     *      calculations
     */
    this.getSPF = function(){ return (this.dt < min_spf) ? this.dt : min_spf; };
                
    /**
     * Updates iterations, current time and delta_t. 
     */
    this.update = function(){
        this.last = this.now;
        this.now = Date.now();
        if(this.started < 0) this.started = this.now;
        this.secLoop = 0;
        this.dt = (this.now - this.last) / 1000;
        this.frames++;
                  
        this.sec = (this.now >= this.nextsec);
        if(this.sec){
            this.nextsec = this.now + 1000;
            this.fps = this.frames;
            this.frames = 0;
        }
                  
        var n = this.now / 1000;
        this.it_10 = Math.round( (n - Math.trunc(n) )* 10 - 0.5);
        this.it_12 = Math.round( (n - Math.trunc(n) )* 12 - 0.5);
        this.it_16 = Math.round( (n - Math.trunc(n) )* 16 - 0.5);
        this.it_24 = Math.round( (n - Math.trunc(n) )* 24 - 0.5);
    };
}
