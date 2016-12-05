/************************************ Ninja OBJECT ************************************\
||                                                                                    ||
||            Contains the world and updates all objects and projectiles              ||
||                                                                                    ||
\**************************************************************************************/
                  
function Ninja(tileSize, debug){
    
    this.elem_background = "#background";
    var game_state = 1; // 0 title screen, 1 game screen
    var blocks_rendered = 0;

    this.tileSize = tileSize;

    /**
     * time, level and stats store most of the data. Other than manipulating data
     * they are not responsible for output or handling user input.
     */
    this.time = null;
    this.stats = null;
    this.level = null;

    /**
     * rsc loads and stores all files used by GameName
     * g(graphics) handles all output
     * unit handles game logic and physics 
     */
    this.rsc = null;
    this.g = null;
    this.units = null;
	
    this.getUnits = function(){ return this.units.list; };

    this.init = function(rsc){
    	this.rsc = rsc;
		this.time = new Clock();
 		this.g = new Graphics(16);     	
		this.units = new UnitHandler();
		this.units.init();
		this.level = new Level();
		this.stats = new Stats();
		
		// LevelData doesn't handle entities yet @BUG
		this.units.newPlayer(150, 70);
		this.units.newSoldier(14*16, 13*16);
		this.units.newSoldier(50*16, 13*16);
		this.units.newRPGsoldier(31*16, 13*16);
		this.units.newSoldier(84*16, 3*16);
		
		var units = this.units;
		/* add to KeyListener */
		window.onkeydown = function(x){
			 if(x.which == 48) units.p.inventory(1);
			 if(x.which == 32) units.p.setMove(0, true); // SPACEBAR
			 if(x.which == 65) units.p.setMove(4, true); //A
			 if(x.which == 68) units.p.setMove(2, true); //D
			 if(x.which == 83) units.p.setMove(3, true); //S
			 if(x.which == 87) units.p.setMove(1, true); //W
			 if(x.which == 74) units.p.setMove(5, true); //j
			 if(x.which == 75) units.p.setMove(6, true); //k
		};
		window.onkeyup = function(x){
			if(x.which == 32) units.p.setMove(0, false); // SPACEBAR
			if(x.which == 65) units.p.setMove(4, false); //A
			if(x.which == 68) units.p.setMove(2, false); //D
			if(x.which == 83) units.p.setMove(3, false); //S
			if(x.which == 87) units.p.setMove(1, false); //W
			if(x.which == 74) units.p.setMove(5, false); //j
			if(x.which == 75) units.p.setMove(6, false); //k
		};								  
    }
     /*
                   
    UPDATE AND RENDERING FUNCTIONS
         
    */
    this.update = function(speed){
        this.stats.addStat("fps", this.time.fps);
	this.time.update(); // updates the time 
        this.units.update(this); // moves things
        this.g.print(this); // draws things
    }
}
    