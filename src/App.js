/**
 * The object that contains all the Application's data
 */
function JoResEngine() {

    /** The semi-global resourceLoader */
    this.rsc = new ResourceLoader();

    /** The universe */
    this.universe = null;

    /** Path of the level data */
    var levelPath = null;

    /** Path of the menu data */
    var menuPath = null;
    
    /** Path of the imgs used */
    var imgPath = null;

    /** 
     * A lot of functions need to pass the app to a callback function so a 
     * reference to this object is needed. 
     */
    var joRes = this;

    /**
     * Starts the main game loop using requestAnimationFrame
     */
    this.start = function () {
        this.rsc.load([menuPath]);
        this.rsc.whenReady(function () {
            joRes.universe = new Universe(16, joRes.rsc);
            joRes.menu();
            function loop() {
                if (typeof joRes.universe.applicationStateChange === "function") {
                    joRes.universe.applicationStateChange(joRes);
                    joRes.universe.applicationStateChange = null;
                } else {
                    joRes.update();
                }
                frame = window.requestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        window.oRequestAnimationFrame;
                frame(loop, joRes.universe.getCanvas());
            };
            loop();
        });
    };

    /** 
     * Starts the game part of the app
     * 
     * @param {Number} level_id Which level to load.
     */
    this.play = function (level_id) {
        this.universe.close();
        //loads level data
        this.rsc.load(this.getLevelPath(level_id));
        this.rsc.whenReady(function () {
            var level = InitLevel();
            //loads level resource data
            joRes.rsc.load(level.resources);
            joRes.rsc.whenReady(function () {
                joRes.universe = new World(joRes.universe, level);
            });
        });
    };

    /** 
     * Starts the level builder part of the app
     */
    this.create = function () {
        this.universe.close();
        this.universe = new LevelCreator(this.universe);
    };

    this.update = function () {
        this.universe.update();
    };

    /** 
     * Starts the main menu
     */
    this.menu = function () {
        this.universe.close();
        this.universe = new Menu(this.universe);
    };

    this.setLevelPath = function (url) {
        levelPath = url;
    };

    this.setMenuPath = function (url) {
        menuPath = url;
    };

    this.setImgPath = function (url) {
        imgPath = url;
    };
    
    this.getLevelPath = function (id) {
        return levelPath.replace("*", id);
    };
}
