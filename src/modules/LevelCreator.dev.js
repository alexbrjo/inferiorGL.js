/**
 * Converts a game universe into a Level Designer
 */  
function LevelCreator(){
    var universe = new Universe();
    
    universe.resources.push("button_1.png");
    
    universe.hud = new LevelCreatorHUD();
    
    universe.init = function (world, graphics) {
        this.hud.init(world, graphics);
        graphics.addTask(new LevelGraphics());
        graphics.addTask(this.hud);
        graphics.disableDebug();
        world.getCamera().setFocusObj(this.wizard);
        world.getCamera().setScaleBounds(1.0, 2.0);
    };
    
    universe.wizard = {
            x: 0,
            y: 0,
            update: function (world) {
                var ctrl = world.getController();
                if (ctrl.a) this.x--;
                if (ctrl.d) this.x++;
                if (ctrl.w) this.y--;
                if (ctrl.s) this.y++;
            }
        };
    
    /**
     * The main game loop. Called dt/1000 times a second.
     * 
     * @param {Universe} world The entire universe
     */
    universe.update = function(world){
        this.wizard.update(world);
        this.hud.update(world);
    };
    
    return universe;
}
    