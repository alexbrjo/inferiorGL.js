/**
 * The object that contains all the Application's data
 */
function App() {
    
    /** The semi-global resourceLoader */
    this.rsc = new ResourceLoader();
    
    /** The universe */
    this.universe = null;
    
    var app = this;
    
    this.rsc.load([
        "tiles.png", "rpgsoldier.png",
        "warrior.png", "enemy.png",
        "hud.png", "bg.png"
    ]);
    
    this.rsc.whenReady(function () {  
        app.universe = new Universe(16, app.rsc);
        app.menu();
        app.startLoop();
    });
    
    /**
     * Starts the main game loop using requestAnimationFrame
     */
    this.startLoop = function (){
        function loop() {
            if (typeof app.universe.applicationStateChange === "function") {
                app.universe.applicationStateChange(app);
                app.universe.applicationStateChange = null;
            } else {
                app.universe.update();
            }
            frame = window.requestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    window.oRequestAnimationFrame;
            frame(loop, app.universe.getCanvas());
        };
        loop();
    };
    
    /** 
     * Starts the game part of the app
     * 
     * @param {Number} level_id Which level to load.
     */
    this.play = function (level_id) {
        this.universe.close();
        var level = new Level();
        this.universe = new World(this.universe, level);
    };
    
    /** 
     * Starts the level builder part of the app
     */
    this.create = function () {
        this.universe.close();
        this.universe = new LevelCreator(this.universe);
    };
    
    /** 
     * Starts the main menu
     */
    this.menu = function () {
        this.universe.close();
        this.universe = new Menu(this.universe);
    };
}
