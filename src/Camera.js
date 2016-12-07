/**
 * Represents a 3D camera object
 * @construct
 */
function Camera(x, y, z){
    
    if (typeof x != "number") {
        throw new TypeError("x is not a number");
    }
    if (typeof y != "number") {
        throw new TypeError("y is not a number");
    }
    if (typeof z != "number") {
        throw new TypeError("z is not a number");
    }
    
    /* x, y, z Position  */
    this.x = x;
    this.y = y;
    this.z = z;
    
    /** The yaw of the camera */
    this.theta_x = -Math.PI/4;
    
    /** The pitch of the camera */
    this.theta_y = -Math.PI/4;
    
    /** The roll of the camera */
    this.theta_z = 0;
    
    /**
     * The current rotation of the camera
     * 
     * @returns {Array} The rotation in pitch, yaw, spin
     */
    this.getRotation = function(){
        return [
            Math.sin(this.theta_y),
            Math.sin(this.theta_x),
           -Math.cos(this.theta_y)
        ];
    };
    
    /**
     * Creates an object with the postition of the camera.
     * 
     * @returns {Object} The location of the camera relative to the origin
     */
    this.getTransform = function(){
        return {
            x: this.x,
            y: this.y,
            z: this.z
        };
    };
}
