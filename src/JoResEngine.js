/**
 * The object that contains all the Application's data
 */
function JoResEngine() {

    /** The semi-global resourceLoader */
    this.rsc = new ResourceLoader();

    /** The core object that handles modules */
    this.core = null;

    /** Path of the level data and imgs used */
    var levelPath = null, imgPath = null;
    

    /** 
     * A lot of functions need to pass the app to a callback function so a 
     * reference to this object is needed. 
     */
    var joRes = this;

    /**
     * Starts the main game loop using requestAnimationFrame
     */
    this.start = function () {
        joRes.core = new CoreManager(16, joRes.rsc);
        var splashAni = new SplashGraphics(1500, 250, 300);
        joRes.core.graphics.addTask(splashAni);
        joRes.core.camera.scale = 8.0;
        function loop() {
            joRes.update();
            frame = window.requestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    window.oRequestAnimationFrame;
            frame(loop, joRes.core.getCanvas());
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
     * Updates the core or changes the application state
     */
    this.update = function () {
        if (typeof joRes.core.applicationStateChange === "function") {
            joRes.core.applicationStateChange(joRes);
            joRes.core.applicationStateChange = null;
        } else {
            this.core.update();
        }
    };

    /** 
     * Starts the game part of the app
     * 
     * @param {Number} level_id Which level to load.
     */
    this.play = function (level_id) {
        
        this.core.close();
        this.core.graphics.addTask(new JoResLoadScreen());
        
        //loads level data
        this.rsc.load(this.getLevelPath(level_id));
        this.rsc.whenReady(function () {
            joRes.core.component = new Universe();
            // loads level resource data
            joRes.rsc.load(joRes.core.component.resources);
            joRes.rsc.whenReady(function () {
                joRes.core.close();
                joRes.core.graphics.addTask(new LevelGraphics());
                joRes.core.graphics.addTask(new HudGraphics());
                joRes.core.camera.setBounds(0, 0, 151 * 16, 30 * 16, true);
                joRes.core.camera.setFocusObj(joRes.core.component.units[0]);
                joRes.core.camera.scale = 4.0;
            });
        });
    };

    /** 
     * Starts the level builder part of the app
     * 
     * @param {Number} level_id Which level to load.
     */
    this.levelCreator = function (level_id) {
        
        this.core.close();
        this.core.graphics.addTask(new JoResLoadScreen());
        
        //loads level data
        this.rsc.load(this.getLevelPath(level_id));
        this.rsc.whenReady(function () {
            joRes.core.component = LevelCreator();
            // loads level resource data
            joRes.rsc.load(joRes.core.component.resources);
            joRes.rsc.whenReady(function () {
                joRes.core.close();
                joRes.core.graphics.addTask(new LevelGraphics());
                joRes.core.camera.setFocusObj(joRes.core.component.wizard);
                joRes.core.camera.scale = 1.0;
            });
        });
    };

    /** 
     * Starts the main menu
     */
    this.menu = function () {
        this.core.close();
        this.core.graphics.addTask(new JoResMainMenu());
        this.core.camera.setFocusObj({x: 0, y: 0});
        this.core.camera.scale = 4.0;
        this.core.component = new Menu();
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
