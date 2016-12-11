/**
 * Preloads and loads IMG and additional JS files.
 */
function ResourceLoader() {

    /** Object containing all loaded resources */
    var rscElements = {};
    
    /** Function to call when all files from queue have been loaded */
    var callback = function () {};
    
    /** The number of files currently in queue to be loaded */
    var inQueue = 0;

    /** Path to where IMG files are stored */
    var path_img = "rsc/img/";
    
    /** Path to where JS files are stored */
    var path_js = "";

    /** 
     * Loads a new file or series of files.
     * 
     * @param {String|Array} f File name or array of file names to load. 
     */
    this.load = function (f) {
        if (f instanceof Array) {
            inQueue += f.length;
            f.forEach(function (file) {
                doLoad(file);
            });
        } else {
            inQueue++;
            doLoad(f);
        }
    };

    /**
     * Determines file type and if the file has already been loaded.
     * 
     * @param {String} file Name of file to load.
     * @returns {HTMLelement} Returns file if it's already loaded.
     */
    function doLoad(file) {
        if (rscElements[file]) {
            return rscElements[file];
        } else {
            if (file.includes(".png")) {
                loadIMG(file);
            } else if (file.includes(".js")) {
                loadJS(file);
            }
        }
    }

    /**
     * Loads IMG and calls callback if queue is empty.
     * 
     * @param {String} file Path of the IMG to load
     * @throws {Error} if file doesn't exsist
     */
    function loadIMG(file) {
        var img = new Image();
        img.onload = function () {
            rscElements[file] = img;
            inQueue--;
            if (inQueue === 0) {
                callback();
            }
        };
        img.onerror = function () {
            console.log("file " + path_img + file + " doesn't exist");
            rscElements[file] = null;
            inQueue--;
            if (inQueue === 0) {
                callback();
            }
        };
        rscElements[file] = false;
        img.src = path_img + file;

    }

    /**
     * Loads JS file and calls callback if queue is empty.
     * 
     * @param {String} file Path of the JS file to load
     * @throws {Error} if file doesn't exsist
     */
    function loadJS(file) {
        var js = document.createElement("script");

        js.type = "text/javascript";
        js.src = path_js + file;


        document.body.appendChild(js);
        js.onload = function () {
            rscElements[file] = js;
            inQueue--;
            if (inQueue === 0) {
                callback();
            }
        };
        js.onerror = function () {
            console.log("file " + path_js + file + " doesn't exist");
            rscElements[file] = null;
            inQueue--;
            if (inQueue === 0) {
                callback();
            }
        };
        rscElements[file] = false;
        js.src = path_js + file;
    }

    /** 
     * Gets the reloaded image element for it's file path
     * 
     * @param {String} path The path of the img to load
     * @returns {object|img} element
     */
    this.get = function (path) {
        return rscElements[path];
    };

    /**
     * Sets the callback function.
     * 
     * @param {Function} f Function to call when all files are loaded.
     */
    this.whenReady = function (f) {
        callback = f;
    };

}