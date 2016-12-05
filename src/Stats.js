/** 
 * Keeps track of game statistics. Mainly for debugging 
 *
 *	@author Alex Johnson
 */
 var Stats = function() {
    this.blocks_rendered = new Array(300);
    this.entities_rendered = new Array(300);
 	this.frame_rate = new Array(300);
    
	this.addStat = function(stat, value) {
		if (stat == "blocks_rendered" || stat == "br") {
    		this.blocks_rendered.unshift(this.blocks_rendered.pop());
    		this.blocks_rendered[0] = value;
    		return this.blocks_rendered;
    	} else if (stat == "entities_rendered" || stat == "er") {
    		this.entities_rendered.unshift(this.entities_rendered.pop());
    		this.entities_rendered[0] = value;
    		return this.entities_rendered;
    	} else if (stat == "frame_rate" || stat == "fps") {
    		this.frame_rate.unshift(this.frame_rate.pop());
    		this.frame_rate[0] = value;
    		return this.frame_rate;
    	} else {
    		return false;
    	}
    }
}
