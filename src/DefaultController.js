/**
 * The Default camera controller
 * 
 * @author Alex Johnson
 */
function DefaultController () {

    /** The state of the controller */
    var ctrl = {
        vx: 0, left:  false, turnleft:  false,
        vy: 0, right: false, turnright: false,
        vz: 0, up:    false, turnup:    false,
               down:  false, turndown:  false
    };

    /** Gets a reference to the state of the controller*/
    this.getCtrl = function () {
        return ctrl;
    };

    /** Handle resize */
    window.onresize = this.resize;

    /** Handle keydown */
    window.onkeydown = function(x){
        if(x.which === "A".charCodeAt()) { 
            ctrl.left = true;
        } else if(x.which === "D".charCodeAt()) {
            ctrl.right = true;
        } else if(x.which === "S".charCodeAt()) {
            ctrl.backward = true;
        } else if(x.which === "W".charCodeAt()) {
            ctrl.forward = true;
        }
        
        if(x.which === "J".charCodeAt()) {
            ctrl.turnleft = true;
        } else if(x.which === "L".charCodeAt()) {
            ctrl.turnright = true;
        }
        
        if(x.which === "I".charCodeAt()) {
            ctrl.turnup = true;
        } else if(x.which === "K".charCodeAt()) {
            ctrl.turndown = true;
        }
        
        if(x.which === "Q".charCodeAt()) { 
            ctrl.up = true;
        } else if(x.which === "E".charCodeAt()) { 
            ctrl.down = true;
        }
    };

    /** Handle keyup */
    window.onkeyup = function(x){
        if(x.which === "A".charCodeAt()) { 
            ctrl.left = false;
        } else if(x.which === "D".charCodeAt()) {
            ctrl.right = false;
        } else if(x.which === "S".charCodeAt()) {
            ctrl.backward = false;
        } else if(x.which === "W".charCodeAt()) {
            ctrl.forward = false;
        }
        
        if(x.which === "J".charCodeAt()) {
            ctrl.turnleft = false;
        } else if(x.which === "L".charCodeAt()) {
            ctrl.turnright = false;
        }
        
        if(x.which === "I".charCodeAt()) {
            ctrl.turnup = false;
        } else if(x.which === "K".charCodeAt()) {
            ctrl.turndown = false;
        }
        
        if(x.which === "Q".charCodeAt()) ctrl.up = false; 
        if(x.which === "E".charCodeAt()) ctrl.down = false;
    };
}
