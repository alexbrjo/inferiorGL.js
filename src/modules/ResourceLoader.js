/**
 * Preloads and loads IMG and additional JS files.
 */
function ResourceLoader() {

    /** Object containing all loaded resources */
    var rscElements = {};
    this.getRsc = function() {
        return rscElements;
    };
    /** Function to call when all files from queue have been loaded */
    var callback = function () {};
    
    /** The number of files currently in queue to be loaded */
    var inQueue = 0;

    /** Path to where IMG files are stored */
    var path_img = "rsc/img/";
    
    /** Path to where JS files are stored */
    var path_js = "";
    
    /** Regex for a string of Base64 data */
    var base64 = /data:image\/(png);base64\,[a-zA-Z|0-9|\/|+|=]*/;

    /** 
     * Loads a new file or series of files.
     * 
     * @param {String|Array} f File name or array of file names to load. 
     */
    this.load = function (f) {
        if (f instanceof Array) {
            inQueue += f.length;
            for (var i = 0; i < f.length; i++) {
                doLoad(convertToFileInfo(f[i]));
            }
        } else {
            inQueue++;
            doLoad(convertToFileInfo(f));
        }
    };
    
    /**
     * Converts to a FileInfo object which has a name and path of the resource
     * FileInfo {
     *              name: <The name to store the resource data under>,
     *              path: <The path to load the resource>
     *          }
     * 
     * @param {String|Object} filedata The file data input
     * @return {Object} FileInfo object which has the name and path of the
     *                  resource
     */
    function convertToFileInfo (filedata) {
        if (typeof filedata === "string") {
            return {
                name: filedata,
                path: filedata
            };
        } else if (typeof filedata === "object") {
            return filedata;
        } else {
            console.log(filedata);
        }
    };

    /**
     * Determines file type and if the file has already been loaded.
     * 
     * @param {Object} fileInfo Object containing name and path of file to load.
     * @returns {HTMLelement} Returns file if it's already loaded.
     */
    function doLoad(fileInfo) {
        var name = fileInfo.name;
        var path = fileInfo.path;
        if (rscElements[name]) {
            return rscElements[name];
        } else {
            if (path.includes(".png")) {
                loadIMG(name, path);
            } else if (path.includes(".js")) {
                loadJS(name, path);
            } else if (path.match(base64)) {
                loadBase64(name, path);
            }
        }
    }
    
    /**
     * Loads Base64 image and calls callback if queue is empty.
     * 
     * @param {String} name Name to storge the Base64 image under
     * @param {String} path Path of the Base64 image to load
     * @throws {Error} if the string isnt valid base64 data
     */
    function loadBase64 (name, path) {
        var img = new Image();
        if (path.match(base64)) {
            img.src = path;
            rscElements[name] = img;
            inQueue--;
            if (inQueue === 0) {
                callback();
            }
        } else {
            throw new Error("Data is not base64");
        }
    }

    /**
     * Loads IMG and calls callback if queue is empty.
     * 
     * @param {String} name Name to storge the IMG under
     * @param {String} path Path of the IMG to load
     * @throws {Error} if file doesn't exsist
     */
    function loadIMG (name, path) {
        var img = new Image();
        img.onload = function () {
            rscElements[name] = img;
            inQueue--;
            if (inQueue === 0) {
                callback();
            }
        };
        img.onerror = function () {
            console.log("file " + path_img + path + " doesn't exist");
            rscElements[name] = null;
            inQueue--;
            if (inQueue === 0) {
                callback();
            }
        };
        rscElements[name] = false;
        img.src = path_img + path;

    }

    /**
     * Loads JS file and calls callback if queue is empty.
     * 
     * @param {String} name Name to storge the JS script under
     * @param {String} path Path of the JS script to load
     * @throws {Error} if file doesn't exsist
     */
    function loadJS(name, path) {
        var js = document.createElement("script");

        js.type = "text/javascript";
        js.src = path_js + path;


        document.body.appendChild(js);
        js.onload = function () {
            rscElements[name] = js;
            inQueue--;
            if (inQueue === 0) {
                callback();
            }
        };
        js.onerror = function () {
            console.log("file " + path_js + path + " doesn't exist");
            rscElements[name] = null;
            inQueue--;
            if (inQueue === 0) {
                callback();
            }
        };
        rscElements[name] = false;
        js.src = path_js + path;
    }

    /** 
     * Gets the preloaded resource for it's name or path
     * 
     * @param {String} name The name of the resource to get
     * @returns {object|img} element
     */
    this.get = function (name) {
        return rscElements[name];
    };

    /**
     * Sets the callback function.
     * 
     * @param {Function} f Function to call when all files are loaded.
     */
    this.whenReady = function (f) {
        callback = f;
        
        //if Resource loader is already ready then callback
        if (inQueue === 0) {
            callback();
            callback = function(){};
        }
    };
    
    /**
     * Sets the default path to find images
     * 
     * @param {type} path The path to set to
     */
    this.setImagePath = function (path) {
        path_img = path;
    };
    
    /**
     * Sets the default path to find scripts
     * 
     * @param {type} path The path to set to
     */
    this.setScriptPath = function (path) {
        path_js = path;
    };
}
