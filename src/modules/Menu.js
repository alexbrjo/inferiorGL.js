/**
 * So finally converting the game into having a menu is going to be difficult. 
 * I think the best move is to create a menu universe and have the World
 * Universe absorb all the existing grahics variable and add all the new ones it
 * has.
 */

function Menu(){
    
    /**
     * The main game loop. Called dt/1000 times a second.
     * 
     * @param {World} world The entire world.
     */
    this.update = function(world){
        if (world.getController().space) {
            return function (app) {
                app.play(0);
            };
        } else if (world.getController().c) {
            return function (app) {
                app.levelCreator(0);
            };
        }
    };
}
    
