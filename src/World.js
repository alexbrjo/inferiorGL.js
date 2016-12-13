/**
 * Extends a Universe. Contains the game loop, level data, graphics and units. 
 * Responsible for updating Units, the game board and the screen.
 * 
 * @param {Universe} universe The universe to transform in a World
 * @param {Level} level The level that the world is playing.
 */  
function World(universe, level){

    for (var variable in universe) {
        if (universe.hasOwnProperty(variable)) {
            this[variable] = universe[variable];
        }
    }
    
    this.graphics.addTask(new LevelGraphics());
    this.graphics.addTask(new HudGraphics());
    
    /** {UnitHandler} Stores, manages and updates Units  */
    this.units = new UnitHandler();
    
    /** {Level} The data for the tiles, entites, and units in a level */
    this.level = level;
    
    // ----- LevelData doesn't handle entities yet @TODO ----\\
    this.units.newPlayer(150, 70);
    this.units.newSoldier(14*16, 13*16);
    this.units.newSoldier(50*16, 13*16);
    this.units.newRPGsoldier(31*16, 13*16);
    this.units.newSoldier(84*16, 3*16);
    // ------------------------------------------------------//

    this.camera.setBounds(0, 0, 151 * 16, 30 * 16, true);
    this.camera.setFocusObj(this.units.p);
    this.camera.scale = 4.0;

    this.units.p.setController(this.controller);

    /**
     * The main game loop. Called dt/1000 times a second.
     */
    this.update = function(){
	this.time.update(); // updates the time 
        this.units.update(this); // moves things
        this.camera.update(window.innerWidth, window.innerHeight);
        this.graphics.print(this); // draws things
    };
}
    