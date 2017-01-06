/**
 * Canvas RenderingContext2D wrapper that implements 3D functions
 * 
 * @contructor
 * @param {RenderingContext2D} c RendingContext of a html canvas element
 * @param {Camera} camera
 */
function RenderingContext3D (c, camera) {
    var ctx = c;
    this.strokeStyle = c.strokeStyle;
    this.textColor = "#000";
    this.fillStyle = c.fillStyle;
    this.globalCompositeOperation = c.globalCompositeOperation;
    this.font = c.font;

    /** List of faces to draw */
    this.paintQueue = [];

    /*
     * Wrapped and unmodified canvas.renderingContext2D functions
     */
    this.save = function() {ctx.save();};
    this.restore = function() {ctx.restore();};
    this.beginPath = function() {ctx.beginPath();};
    this.fillRect = function(a, b, c, d) {ctx.fillStyle = this.fillStyle; ctx.fillRect(a, b, c, d);}; 
    
    this.fov = 1.0/Math.tan((Math.PI/2)/2.0);
    this.camera;
    this.clipSpace = {matrix: [], far: 0, near: 0};
    
    /**
     * Wraps the canvas.renderingContext2D.moveTo(). Rounds both coordinates to 
     * opitmize speed.
     * 
     * @param {number} x x screen coordindate to move path to
     * @param {number} y y screen coordindate to move path to
     */
    this.moveTo = function(x, y) {
        ctx.moveTo(r(x), r(y));
    };
    
    /**
     * Wraps the canvas.renderingContext2D.liveTo(). Rounds both coordinates to 
     * opitmize speed.
     * 
     * @param {number} x x screen coordindate to move path to
     * @param {number} y y screen coordindate to move path to
     */
    this.lineTo = function(x, y) {
        ctx.lineTo(r(x), r(y));
    };
    
    /**
     * Strokes current path with current stroke color
     */
    this.stroke = function() {
        ctx.strokeStyle = this.strokeStyle;
        ctx.stroke();
    };
    
    /**
     * Fill current path with current fill color
     */
    this.fill = function() {
        ctx.fillStyle = this.fillStyle;
        ctx.fill();
    };
    
    /**
     * Draw text with current fill color
     * @param {String} t String of text to draw
     * @param {number} x x screen coordindate to draw text 
     * @param {number} y y screen coordindate to draw text
     */
    this.fillText = function(t, x, y) {
        ctx.fillStyle = this.textColor;
        ctx.fillText(t, x, y);
    };
    
    /**
     * Clears the faces to draw
     */
    this.beginPaint = function () {
        this.paintQueue = [];
    };
    
    /**
     * Adds faces to the paint queue
     * @param {Face} face Shape to paint
     */
    this.paintFace = function (face) {
        if (face.origin instanceof Point) {
            this.paintQueue.push([face, distanceBetween(face.origin, camera)]);
        } 
        this.paintQueue.push([face, distanceBetween(new Point(0,0,0), camera)]);
    };
    
    /**
     * Adds faces of a shape to the paint queue
     * @param {Shape} shape Shape to paint
     */
    this.paintShape = function (shape) {
        for (var i = 0; i < shape.faces.length; i++) {
            this.paintFace(shape.faces[i]);
        }
    };
    
    /**
     * Paints the shapes
     */
    this.finishPaint = function () {
        this.paintQueue.sort(function(a, b) {return b[1] - a[1];});
        for (var i = 0; i < this.paintQueue.length; i++) {
            var t = this.paintQueue[i][0];
            if (typeof t === "object") {
                if (t instanceof Face) {
                    if (t.origin instanceof Point) {
                        this.renderFace(t);
                    } else {
                        this.renderWireframeFace(t);
                    }
                }
            }
        }
    };
    
    /**
     * Renders a single face. A face is not drawn if it's normal vector is 
     * facing away from the camera.
     * @param {Face} face The face to render
     */
    this.renderFace = function (face) {
        var o = face.origin;
        var t = camera.getTransform();
        var adjustedCameraRotationVector = [t.x - o.x, t.y - o.y, t.z - o.z];

        if (angle(face.normal, adjustedCameraRotationVector) < Math.PI/2) { 
            this.fillStyle = face.color;
            this.projectPath(face.points);
            this.fill();
        }
    };
    
    /**
     * Fills each face of a shape with a solid color.
     * @param {Shape} shape Shape to draw
     */
    this.renderShape = function(shape){
        for (var i = 0; i <= shape.faces.length - 1; i++) { 
            this.renderFace(shape.faces[i]);
        }
    };
    
    /**
     * Renders a wireframe face. All faces are drawn.
     * @param {Face} face The face to render
     */
    this.renderWireframeFace = function (face) {
        this.strokeStyle = face.color;
        this.projectPath(face.points);
        this.stroke();
    };
    
    /**
     * Renders the wireframe image of a shape.
     * @param {Shape} shape Shape to draw outline of
     * @returns {undefined}
     */
    this.renderWireframeShape = function(shape) {
        for (var i = 0; i <= shape.faces.length - 1; i++) {
            this.renderWireframeFace(shape.faces[i]);
        }
    };
    
    /**
     * Projects a 3D point onto the 2D viewing plane.
     * @param {Point} p A 3D point
     * @returns {Point} The projected 2D point
     */
    this.projectPoint = function(p) {
        
        var ez = 0.707;
        var c = camera;
        
        var sx = Math.sin(c.theta_x), sy = Math.sin(c.theta_y), sz = Math.sin(c.theta_z);
        var cx = Math.cos(c.theta_x), cy = Math.cos(c.theta_y), cz = Math.cos(c.theta_z);

        var x0 = p.x - c.x, y0 = p.y - c.y, z0 = p.z - c.z;

        var dx = cy * (sz * y0 - cz * x0) - sy * z0;
        var dy = sx * (cy * z0 + sy * (sz * y0 - cz * x0)) + cx * (cz * y0 - sz * x0);
        var dz = cx * (cy * z0 + sy * (sz * y0 - cz * x0)) - sx * (cz * y0 - sz * x0);

        var bx = (ez / dz) * dx;
        var by = (ez / dz) * dy;
    
        return new Point(bx, by, 0, dz);
    };
    
    /**
     * Traces a path by cycling through an array of points.
     * @private
     * @param {Array|Point} path Face to outline
     */
    this.projectPath = function(path){
        this.beginPath();
        for (var i = 0; i <= path.length - 1; i++) {
            var pro3d = this.projectPoint(path[i]);
            if(pro3d.w < 0){ // if in front of the camera
                if (i > 0) {
                    this.lineTo(pro3d.x * canvas.width + canvas.width / 2,
                        pro3d.y * canvas.width + canvas.height / 2);
                } else {
                    this.moveTo(pro3d.x * canvas.width + canvas.width / 2,
                        pro3d.y * canvas.width + canvas.height / 2);
                }
            } 
        }
    };
    
    /*
     * To be implemented 
     */
    this.clipLine = function() {};
    this.clipFace = function() {};
    this.clipImage = function() {};
    this.projectImage = function() {};
    this.projectLine = function() {};
    
    /**
     * Rounds a number to the nearest whole number or to a specified number
     * of decimal places.
     * @param {Number} a number to round
     * @param {Number} b number of decimal places to round to, optional
     * @returns {Number} Whole number rounded to 0 or b decimal places
     */
    function r(a, b) {
        if(typeof b === 'undefined' || b === 'undefined'){
            return Math.round(a);
        } else {
            return Math.round(a * Math.pow(10, b)) / Math.pow(10, b);
        }   
    }
    
    /**
     * Finds the magnitude of a vector using the Pythagonean Theorem.
     * @param {Number} a First side length 
     * @param {Number} b Second side length 
     * @param {Number} c Third side length (optional)
     * @returns {Number} magnitude of the vector 
     */
    function magnitude(a, b, c) {
        if (typeof c === 'undefined' || c === 'undefined') {
            return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
        } else {
            return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2) + Math.pow(c, 2));
        }
    }
    
    /**
     * Finds the distance of a line connecting two 2D or 3D points.
     * @param {Point} p1 Starting point line
     * @param {Point} p2 Ending point line
     * @returns {Number} distance between the two points
     */
    function distanceBetween(p1, p2) {
        if (p1.type === "Point2D") {
            return magnitude(p2.x - p1.x,
            p2.y - p1.y,
            p2.z - p2.z);
        } else {
            return magnitude(p2.x - p1.x,
            p2.y - p1.y,
            p2.z - p2.z);
        }
    }
    
    /**
     * Calculates cross product of two vectors
     * @param {Array} v1 First  vector "[x,y,z]"
     * @param {Array} v2 Second vector "[x,y,z]"
     * @returns {Array} Cross product
     */
    function cross(v1, v2) {
        return [
            v1[1] * v2[2] - v1[2] * v2[1],
            v1[2] * v2[0] - v1[0] * v2[2],
            v1[0] * v2[1] - v1[1] * v2[0]
        ];
    }
    
    /**
     * Calculates the dot product of two vectors
     * @param {Array} v1 First  vector "[x,y,z]" or "[x,y]"
     * @param {Array} v2 Second vector "[x,y,z]" or "[x,y]"
     * @returns {Array} Cross product
     */
    function dot(v1, v2){
        return v1[0] * v2[0] +
            v1[1] * v2[1] +
            v1[2] * v2[2] ;
    }
    
    /**
     * Calculates the angle between two vectors
     * @param {Array} v1 First  vector "[x,y,z]" or "[x,y]"
     * @param {Array} v2 Second vector "[x,y,z]" or "[x,y]"
     * @returns {Number} Angle between the vectors
     */
    function angle(v1, v2) {
        var m1 = magnitude(v1[0], v1[1], v1[2]);
        var m2 = magnitude(v2[0], v2[1], v2[2]);
        return Math.acos( dot(v1, v2) / (m1 * m2));
    }
    
    this.math = {round: r, magnitude: magnitude, dist: distanceBetween, 
        cross: cross, dot: dot, angle: angle};

}
