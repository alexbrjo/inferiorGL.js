/* Copyright Alex Johnson 2016 */

function ResourceLoader() {

    var rscElements = {};
    var callback = function () {};
    var inQueue = 0;

    var path_img = "rsc/img/";
    var path_js = "";

    // gets load request
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

    // when all resources are done
    this.whenReady = function (f) {
        callback = f;
    }

}