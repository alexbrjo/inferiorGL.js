/**
 * Represents a 3D camera object
 * @construct
 */
function Camera(x, y, z){
    this.x = x;
    this.y = y;
    this.z = z;
    this.theta_x = -Math.PI/4;
    this.theta_y = -Math.PI/4;
    this.theta_z = 0;
    this.scale = 4.0;
    this.maxScale = 6;
    this.edgeBuffer = 2;
    this.range = {x:0, y:0};
    
    this.getRotation = function(){
        return [
            Math.sin(this.theta_y),
            Math.sin(this.theta_x),
           -Math.cos(this.theta_y)
        ];
    };
    
    this.getTransform = function(){
        return {
            x: this.x,
            y: this.y,
            z: this.z
        };
    };
}