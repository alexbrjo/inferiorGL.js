/**
 * Represents a 3D camera object
 * @construct
 * 
 * @param {Number} x The x position of the Camera
 * @param {Number} y The y position of the Camera
 * @param {Number} z The z position of the Camera
 * @param {Number} yaw The rotation in the x plane
 * @param {Number} pitch The rotation in the y plane
 * @param {Number} roll The rotation in the z plane

 */
function Camera(x, y, z, yaw, pitch , roll){
    
    if (typeof x !== "number") {
        throw new TypeError("x is not a number");
    }
    if (typeof y !== "number") {
        throw new TypeError("y is not a number");
    }
    if (typeof z !== "number") {
        throw new TypeError("z is not a number");
    }
    
    /* x, y, z Position  */
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    
    /** The yaw of the camera */
    this.theta_x = yaw || 0;
    
    /** The pitch of the camera */
    this.theta_y = pitch || 0;
    
    /** The roll of the camera */
    this.theta_z = roll || 0;
    
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
