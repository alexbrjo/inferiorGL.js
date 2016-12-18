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
