/**
 * Generates levelData from a level object
 * 
 * @param {Level} level Level to generate data for.
 */
function LevelDataGenerator (level) {
    var file = "var JoResLevel = function () {";
    
    // Prints width and height variables
    file += "this.w = " + level.data.length + "; ";
    file += "this.h = " + level.data[0].length + "; ";
    
    // Prints tileSize variable
    file += "this.tileSize = " + level.tileSize + "; ";

    file += "this.terrain_sprite =" + level.terrain_sprite + "; ";
    
    // Prints resources list
    file += "this.resources = [";
    for (var i = 0; i < level.resources.length; i++) {
        file += level.resources[i];
        if (i !== level.resources.length - 1) file += ",";
    }
    file += "]; ";
    
    // Prints the sprite list
    file += "this.sprite_index = [";
    for (var i = 0; i < level.sprite_index.length; i++) {
        var s = level.sprite_index[i];
        file += "{sprite:{x:" + s.sprite.x + ",y:" + s.sprite.y; 
        file += ",w:" + s.sprite.w + ",h:" + s.sprite.h + "},"; 
        file += "AABB:{x:" + s.AABB.x + ",y:" + s.AABB.y; 
        file += ",w:" + s.AABB.w + ",h:" + s.AABB.h + "}"; 
        file += "}";
        if (i !== level.sprite_index.length - 1) file += ",";
    }
    file += "]; ";
    
    // Prints level.data
    file += "this.data = [\n";
    for (var i = 0; i < level.data.length; i++) {
        file += "\t[";
        for (var j = 0; j < level.data[i].length; j++) {
            file += "\t\t[";
            for (var k = 0; k < level.data[i][j].length; k++) {
                file += level.data[i][j][k];
                if (k !== level.data[i][j].length - 1) file += ",";
            }
            file += "]";
            if (j !== level.data[i].length - 1) file += ",";
            file += "\n";
        }
        file += "]";
        if (i !== level.data.length - 1) file += ",";
        file += "\n";
    }
    file += "]; ";
    
    return file + "}";
}