/**
 * Prints the default main menu graphic
 */
function JoResMainMenu () {
    
    var logo = null;
    
    var buttons = [];
    
    /**
     * Initalizes the Main Menu variables
     * 
     * @param {Universe} world The entire universe
     */
    this.init = function (world) {
        logo = world.get("JoRes_logo");
        
        buttons.push(new Button(
                world.get("JoRes_start"), 
                0, 0, null, null, "center", "center",
                function(app) { 
                    app.play(0); 
                }
            ));
                
        buttons.push(new Button(
                world.get("JoRes_build"), 
                0, 16, null, null, "center", "center", 
                function(app) { 
                    app.levelCreator(0); 
                }
            ));
    };
    
        
    /**
     * The main game loop. Called dt/1000 times a second.
     * 
     * @param {World} world The entire world.
     */
    this.update = function(world){
        for (var i = 0; i < buttons.length; i++) {
            var u = buttons[i].update(world);
            if (typeof u === "function") return u;
        }
    };
    
    /**
     * Prints the main menu
     * 
     * @param {Universe} world The entire universe
     * @param {RenderingContext2D} c The context to draw on
     */
    this.print = function (world, c) {
        
        c.drawImage(logo, -(logo.width/2) - c.camera.x, 
                    -(logo.height/2) - c.camera.y - 32);
                    
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].graphics.print(world, c);
        }
    };
}

/**
 * Prints the default loading screen graphic
 */
function JoResLoadScreen () {
    
    /**
     * Prints the main menu
     * 
     * @param {Universe} world The entire universe
     * @param {RenderingContext2D} c The context to draw on
     */
    this.print = function (world, c) {
        c.fillStyle = "black";
        c.fillText("Load Screen", -50 - c.camera.x, 0 - c.camera.y);
    };
}

/**
 * Default LevelData
 */
function JoResLevel () {
    /** height, width and tileSize of the level */
    this.h = 0, this.w = 0, this.tileSize = 0; 
    
    /** every image sprite used in the level */
    this.resources = []; 
    
    /** the sprite sheet for the terrain */
    this.terrain_sprite = []; 
    
    /** <BLock data> LARGE ARRAY HOLDS TERRAIN SPRITE INFO */
    this.sprite_index = []; 
    
    /** <Level data> VERY LARGE ARRAY HOLDS ALL BLOCKS */
    this.data = []; 
    
    /** not implemented */
    this.unitList = []; 
}
