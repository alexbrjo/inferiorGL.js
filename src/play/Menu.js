/**
 * So finally converting the game into having a menu is going to be difficult. 
 * I think the best move is to create a menu universe and have the World
 * Universe absorb all the existing grahics variable and add all the new ones it
 * has.
 * 
 * @param {Universe} universe The universe to transform in a World
 */

function Menu(universe){

    for (var variable in universe) {
        if (universe.hasOwnProperty(variable)) {
            this[variable] = universe[variable];
        }
    }

    this.graphics.addTask(new MenuGraphics());

    this.camera.setBounds(0, 0, 151 * 16, 30 * 16, true);

    /**
     * The main game loop. Called dt/1000 times a second.
     */
    this.update = function(){
        if (this.controller.space) {
            this.applicationStateChange = function (app) {
                app.play(0);
            };
        }
	this.time.update(); // updates the time 
        this.graphics.print(this); // draws things
    };
}
    
