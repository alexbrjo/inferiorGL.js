/**
 * The Heads up display for the LevelCreator
 */
function LevelCreatorHUD () {
    
    var buttons = [];
    
    var tools = [];
    
    /** Block selector variables */
    var rowLength = 10;
    
    var tileSize = 0;
    
    this.init = function (world, graphics) {
        
        var level = world.getUniverse();
        var terrain = level.sprite_index;
        tileSize = level.tileSize;
        
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
                (i % rowLength) * (tileSize + 1) + 1, 
                -Math.floor(i / rowLength) * (tileSize + 1) - 1, 
                tileSize, tileSize, "bottom", "left", i));
        }
    };
    
    this.update = function (world, wiz) {
        for (var i = 0; i < buttons.length; i++) {
            var u = buttons[i].update(world);
            if (typeof u === "number" ) {
               wiz.brush = u;
            }
        }
    };
    
    this.print = function (world, c) {
        this.printBlockSelector(world, c);
    };
    
    this.printBlockSelector = function (world, c) {
        var cam = world.getCamera();
        
        var menuHeight = 48;
        
        c.fillStyle = "#577f63";
        c.fillRect(0, cam.canvasHeight - (menuHeight + 2), cam.canvasWidth, 1);
        c.fillStyle = "#bfd8bd";
        c.fillRect(0, cam.canvasHeight - (menuHeight + 1), 
                cam.canvasWidth, menuHeight + 2);
        
        c.fillStyle = "#77bfa3";
        c.fillRect(0, cam.canvasHeight - (menuHeight + 1), 
                rowLength * (tileSize + 1) + 1, menuHeight + 1);
        c.fillStyle = "#577f63";
        c.fillRect(rowLength * (tileSize + 1) + 1, 
                cam.canvasHeight - (menuHeight + 1), 1, menuHeight + 1);
        
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].graphics.print(world, c);
        }
    };
}
