/**
 * The Heads up display for the LevelCreator
 */
function LevelCreatorHUD () {
    
    var buttons = [];
    
    var tools = [];
    
    this.init = function (world) {
        
        var level = world.getUniverse();
        var terrain = level.sprite_index;
        var tileSize = level.tileSize;
        
        // creates buttons for every terrain sprite
        for (var i = 0; i < terrain.length; i++) {
            var sprite = terrain[i].sprite;
            var converted_image = document.createElement("canvas");
            converted_image.width = sprite.w;
            converted_image.height = sprite.h;
            converted_image.getContext("2d").drawImage(world.get(level.terrain_sprite),
                sprite.x * tileSize, sprite.y * tileSize, sprite.w, sprite.h, 
                0, 0, sprite.w, sprite.h);
                
            buttons.push(new Button(converted_image, 
                i * tileSize, 0, tileSize, tileSize, "top", "left",
                function() { 
                    // tool
                }
            ));
        }
    };
    
    this.update = function (world) {
        for (var i = 0; i < buttons.length; i++) {
            var u = buttons[i].update(world);
        }
    };
    
    this.print = function (world, c) {
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].graphics.print(world, c);
        }
    };
}
