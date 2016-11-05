/**
 * ResoureLoader is simple a resource preloader that can callback a function on
 * completion and update (via callback) when progress is made
 * @author Alex Johnson
 */

function ResourceLoader() {

    var rscElements = {};
    var callback = function () {};
    var progress = function () {};
    var inQueue = 0;

    var path_img = "";
    var path_js = "";
    
    this.setPath = function(s) {
        if (typeof s === 'string') {
            path_img = s;
            path_js = s;
        } else {
            throw new Error(); // invalid argument
        }
    }
    
    /**
     * Queues 
     * @param {Array|String} f Array of paths of files to load 
     */
    this.load = function (f) {
        if (f instanceof Array) {
            if (f.length > 0) {
                inQueue += f.length;
                f.forEach(function (file) {
                    doLoad(file);
                    progress();
                });
            } else {
                throw new Error(); // empty array
            }
        } else if (typeof f === 'string') {
            inQueue++;
            doLoad(f);
        } else {
            throw new Error(); // invalid argument
        }
    }

    // does the actual loading, creates <img>
    function doLoad(file) {
        if (rscElements[file]) {
            return rscElements[file];
        } else {
            if (file.includes(".png")) {
                loadIMG(file);
            } else if (file.includes(".js")) {
                loadJS(file);
            } else {
                throw new Error();
            }
        }
    }

    function loadIMG(file) {
        var img = new Image();
        img.onload = function () {
            rscElements[file] = img;
            inQueue--;
            if (inQueue == 0) {
                callback();
            }
        };
        img.onerror = function () {
            console.log("file " + path_img + file + " doesn't exist");
            rscElements[file] = null;
            inQueue--;
            if (inQueue == 0) {
                callback();
            }
        };
        rscElements[file] = false;
        img.src = path_img + file;

    }

    function loadJS(file) {
        var js = document.createElement("script");

        js.type = "text/javascript";
        js.src = path_js + file;


        document.body.appendChild(js);
        js.onload = function () {
            rscElements[file] = js;
            inQueue--;
            if (inQueue == 0) {
                callback();
            }
        };
        js.onerror = function () {
            console.log("file " + path_js + file + " doesn't exist");
            rscElements[file] = null;
            inQueue--;
            if (inQueue == 0) {
                callback();
            }
        };
        rscElements[file] = false;
        js.src = path_js + file;
    }

    /** 
     * Gets the reloaded image element for it's file path
     * 
     * @param String path
     * @returns object|img element
     */
    this.get = function (path) {
        return rscElements[path];
    }

    /** 
     * Gets the reloaded image element for it's file path
     * 
     * @param f Function to call when files are loaded
     */
    this.whenReady = function (f) {
        callback = f;
    }
    
    /** 
     * Set progress callback function 
     * @param f Function to call when files are loaded
     */
    this.onProgress = function (f) {
        progress = f;
    }

}
