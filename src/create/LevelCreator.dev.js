/**
 * Contains the game loop, level data, graphics and units. Responsible for 
 * updating Units, the game board and the screen.
 * 
 * @param {Universe} universe The universe to transform in a World
 */  
function LevelCreator(universe){

    for (var variable in universe) {
        if (universe.hasOwnProperty(variable)) {
            this[variable] = universe[variable];
        }
    }
    
    this.graphics.addTask(new LevelGraphics());
    
    /** {UnitHandler} Stores, manages and updates Units  */
    this.units = new UnitHandler();
    
    /** {Level} The data for the tiles, entites, and units in a level */
    this.level = new Level();
    
    this.units.newPlayer(150, 70);
    this.wizard = new Wizard(0, 0);
    this.wizard.setController(this.controller);
    this.camera.setFocusObj(this.wizard);
    this.camera.scale = 2.0;
    
    /**
     * The main game loop. Called dt/1000 times a second.
     */
    this.update = function(){
	this.time.update(); // updates the time 
        this.camera.update(window.innerWidth, window.innerHeight);
        this.graphics.print(this, this.units.p); // draws things
        this.wizard.update();
    };
    
    this.close = function () {
        this.units = null;
        this.wizard = null;
        this.graphics.clearTasks();
        this.camera.scale = 1.0;
    };
}
    