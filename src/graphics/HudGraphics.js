/**
 * Prints the heads up display which includes health, scoreboard and any
 * in-game options.
 */
function HudGraphics () {
    
    /**
     * Prints the HUD
     * 
     * @param {Universe} world The entire Universe
     * @param {RenderingContext2D} c The context to draw on
     */
    this.print = function(world, c) {
        this.printHUD(world, c);
    };
    
    /**
     * Prints the HUD (heads up display)
     * TODO:
     *	- Design new health bar
     *	- Implement scoreboard
     *	
     * @param {Universe} world The entire universe
     * @param {RenderingContext2D} c The context to draw graphics
     * 
     * @fix world.units, world.rsc
     */
    this.printHUD = function(world, c) {
    	var p = world.getUniverse().player();
    	//last thing drawn is HUD
        for (var i = 0; i < p.maxHealth; i++) {
    	    if (i < p.health) {
        	    c.drawImage(world.get("hud.png"),
                        0, 0, 9, 9,
                	2, 30 + 9 * i, 9, 9);
            } else {
            	c.drawImage(world.get("hud.png"),
                        9, 0, 9, 9,
                	2, 30 + 9 * i, 9, 9);
            }
        }
    };
}
