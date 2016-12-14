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
        joRes.universe = new Universe(16, joRes.rsc);
        var splashAni = new SplashGraphics(1500, 250, 300);
        joRes.universe.graphics.addTask(splashAni);
        joRes.universe.camera.scale = 8.0;
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
        
        var animationDone = false;
        var loadDone = false;
        this.rsc.whenReady(function () {
            if (animationDone) {
                joRes.menu();
            } else {
                loadDone = true;
            }
        });
        splashAni.whenComplete(function () {
            if (loadDone) {
                joRes.menu();
            } else {
                animationDone = true;
            }
        });
    };

    /** 
     * Starts the game part of the app
     * 
     * @param {Number} level_id Which level to load.
     */
    this.play = function (level_id) {
        
        this.universe.close();
        this.universe.graphics.addTask(new JoResLoadScreen());
        
        //loads level data
        this.rsc.load(this.getLevelPath(level_id));
        this.rsc.whenReady(function () {
            var level = InitLevel();
            // loads level resource data
            joRes.rsc.load(level.resources);
            joRes.rsc.whenReady(function () {
                // make sure universe is cleared
                joRes.universe.close();
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

    this.load = function (url) {
        this.rsc.load(url);
    };

    this.setImgPath = function (url) {
        imgPath = url;
    };
    
    this.getLevelPath = function (id) {
        return levelPath.replace("*", id);
    };
}
