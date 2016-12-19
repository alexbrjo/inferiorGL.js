/**
 * Converts a game universe into a Level Designer
 */  
function LevelCreator(){
    var universe = new Universe();
    
    universe.resources.push("button_1.png");
    
    universe.hud = new LevelCreatorHUD();
    
    universe.init = function (world, graphics) {
        this.hud.init(world, graphics, this.wizard);
        graphics.addTask(new LevelGraphics());
        graphics.addTask(this.hud);
        graphics.disableDebug();
        world.getCamera().setFocusObj(this.wizard);
        world.getCamera().setScaleBounds(1.0, 2.0);
        
        var level = world.getUniverse();
        for (var i = 0; i < level.unit_data.length; i++) {
            if (level.unit_data[i] === 1) {
                this.newPlayer(i * level.tileSize, 0);
            } else if (level.unit_data[i] === 1) {
                this.newSoldier(i * level.tileSize, 0);
            } else if (level.unit_data[i] === 2) {
                this.newRPGsoldier(i * level.tileSize, 0);
            }
        }
    };
    
    universe.wizard = {
            x: 0,
            y: 0,
            speed: 2,
            brush: 0,
            update: function (world) {
                var ctrl = world.getController();
                if (ctrl.a) this.x -= this.speed;
                if (ctrl.d) this.x += this.speed;
                if (ctrl.w) this.y -= this.speed;
                if (ctrl.s) this.y += this.speed;
                
                if (ctrl.space) {
                    var fileData = LevelDataGenerator(world.getUniverse());
                    var file = document.getElementsByTagName('html');
                    file[0].innerHTML = fileData;
                }
                
                if (ctrl.isDown) {
                    var mouse = ctrl.current;
                    var cam = world.getCamera();
                    var x = Math.trunc((mouse.offsetX / 2 + cam.x) / 16);
                    var y = Math.trunc((mouse.offsetY / 2  + cam.y) / 16);
                    world.getUniverse().setData(x, y, this.brush);
                }
            }
        };
    
    /**
     * The main game loop. Called dt/1000 times a second.
     * 
     * @param {Universe} world The entire universe
     */
    universe.update = function(world){
        this.hud.update(world, this.wizard);
        this.wizard.update(world);
    };
    
    return universe;
}
    