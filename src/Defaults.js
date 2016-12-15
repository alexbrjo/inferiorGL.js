/**
 * Prints the default main menu graphic
 */
function JoResMainMenu () {
    
    /**
     * Prints the main menu
     * 
     * @param {Universe} world The entire universe
     * @param {RenderingContext2D} c The context to draw on
     */
    this.print = function (world, c) {
        c.fillStyle = "black";
        c.fillText("Main menu", -50 - c.camera.x, 0 - c.camera.y);
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
