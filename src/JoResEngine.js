/**
 * The object that contains all the Application's data
 */
function JoResEngine() {

    /** The semi-global resourceLoader */
    this.rsc = new ResourceLoader();
    
    // Default Screens
    this.screens = {
        mainMenu: JoResMainMenu,
        loading: JoResLoad,
        splash: JoResSplash,
        levelSelect: null,
        settings: null
    };
    
    // DEFAULT IMAGES
    var logo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAAlCAYAAAD7u09NAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AwOAQAtu6IdUgAAAiVJREFUaN7tWDGugzAMdb4ycQnmLFyhh6mYCluP0S1lqjjMv0IXZi6RNX8hyIQ4CXzgF/1YqoiCndgv2H4pQJIkSRYIc01+57mOtb30/eJNX89H9PpldT8UEE45U2fZzGmp1Dius0xLpVghBLy7brUDsmlnc/XtCgCgB/AOBebLNXnpe3h3HbN/ezlR364MAJz7yKbVAACFEH8HyH+WBEgCJAGSAEmAHMBDFkuAzJEkznCO4enkJ3gcIHUzzrJUn60Nus4ykEqx4TmZdxE5DAp2Egdrg2I7HGk32lD6ls1kj11SRirFbLAN83URLEPMyupuH5Bhq15CF0vkMAEsqzuTTQuyabVs2lH/42qIDcqeTBWx8PH6wT11YPXl7ROFqFWzGkIW1a0ub0cGaOqEeZbVnRVCaMLWpCR7PR8jKPysJ+66JeNTN4dIXEpxsdX17ToePD9xCpAdyNFlov9C4Na1n5k6MrRMLZUCyHM7nSZP0o7Q/03BRUHOOtDw1WgAYIUQWN/ZrewUI3mIK+9Cn2aE3UTf0g2t5bPd1K8kSZIkKYTQkXXQXVBcxrh/2+9d795dx/A4xtZXyI1ezN6+tZfae4PwbYABoO4J9jrUuj69mPEaG8qeU8EsacNmgxBIp/yDCAfkQ3JpTodSZone1vUG78l9n/qW12zsABVsrN6evnEDAFV8qPexm9m2riBj9UI2e/j2L1vtrO2eFYBQM0iSJMnu8gON3OByW0Ib0QAAAABJRU5ErkJggg==";
    var startPic = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAPCAYAAAB9YDbgAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAAL5JREFUSA3Vko0KgCAMhC16/1cuJp4ca/4sGGlg03me34YpbfQdhfXegBmsaXXYzHcZHW2BS2W9PVixpnZj4iyfg5dE9sh5CCVi5I3y0zm9hlby/PHaOuPJpZOdO3Op7lWh0jMYb7XyrJmaz8JOmUWLrDeLO3VHRp3FuVH87KthLSCYS7T2NRz0Oo81PEY66GuMeAYCg1EvMiZuaA0r1borNkBCUtYzaAGjEyEgHtNlu1mKyHzc2dWBPc3/X/sAP64pCEy0Ns8AAAAASUVORK5CYII=";
    var buildPic = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAPCAYAAAB9YDbgAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAAKZJREFUSA3VlFEKhTAMBOvD+19ZX4ojy9rgnyQFSbvZ1DEtjtFobBfr0YAZ1lEddvLt1tEM+v6qvx9PppG3rUf4yWlt+NBXNbfmsCR0s9goHtXwrSI+AFivvK6p9/Hen7srr1vBZteAI6TRejxon8cM1uGAd/1T4FbXoBVsdg04dj1mrkBEfiuaZ+61rKkPH1rMM91zsZ5Di9Eqxcmnna0OXKl57ywnQVkaHYFStjUAAAAASUVORK5CYII=";
    
    this.rsc.load([
        {name: "JoRes_logo",    path: logo}, 
        {name: "JoRes_start",   path: startPic}, 
        {name: "JoRes_build",   path: buildPic} 
    ]);
    // DEFAULT IMAGES
    
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
        this.core = new CoreManager(16, joRes.rsc);
        this.core.update();
        
        var animationDone = false;
        var loadDone = false;
        
        this.rsc.whenReady(function () {
            if (animationDone) joRes.screen("mainMenu");
            else loadDone = true;
        });
        
        this.screen("splash", function () {
            if (loadDone) joRes.screen("mainMenu");
            else animationDone = true;
        });
        
        function loop() {
            joRes.update();
            frame = window.requestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    window.oRequestAnimationFrame;
            frame(loop, joRes.core.graphics.getCanvas());
        };
        loop();
    };
    
    /**
     * Updates the core or changes the application state
     */
    this.update = function () {
        if (typeof this.core.applicationStateChange === "function") {
            this.core.applicationStateChange(this);
            this.core.applicationStateChange = null;
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
        this.screen("loading");
        
        //loads level data
        this.rsc.load(this.getLevelPath(level_id));
        this.rsc.whenReady(function () {
            joRes.core.component = new Universe();
            // loads level resource data
            joRes.rsc.load(joRes.core.component.resources);
            // @FIX move below 8 lines "joRes.core" to init()
            joRes.rsc.whenReady(function(){ joRes.core.init(); });
        });
    };

    /** 
     * Starts the level builder part of the app
     * 
     * @param {Number} level_id Which level to load.
     */
    this.levelCreator = function (level_id) {
        
        this.core.close();
        this.screen("loading");
        
        //loads level data
        this.rsc.load(this.getLevelPath(level_id));
        this.rsc.whenReady(function () {
            joRes.core.component = LevelCreator();
            // loads level resource data
            joRes.rsc.load(joRes.core.component.resources);
            joRes.rsc.whenReady(function () {
            });
        });
    };

    /** 
     * Starts the main menu
     * 
     * @param {String} screen_name Name of the screen to switch to
     * @param {Function|null} f Function to call when screen is complete
     */
    this.screen = function (screen_name, f) {
        this.core.close();
        var screen = new this.screens[screen_name](f);
        screen.init(this.core.public());
        this.core.graphics.addTask(screen);
        this.core.camera.setFocusObj({x: 0, y: 0});
        this.core.component = screen;
    };
    
    /** Quits the application */
    this.quit = function () {
        // Save game in a cookie
        this.core.close();
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
