/** 
 * Keeps track of game statistics. Mainly for debugging 
 *
 * @author Alex Johnson
 */
var Stats = function () {

    /** The history of the number of blocks rendered for the last 300 frames */
    this.blocks_rendered = new Array(300);

    /** The history of the number of entities rendered for the last 300 frames */
    this.entities_rendered = new Array(300);

    /** The history of the frame rate for the last 300 frames */
    this.frame_rate = new Array(300);

    /**
     * Adds a value to a statistic and returns the statistic array.
     * 
     * @param {String} stat The 2 char String that corresonds to a statistic.
     * @param {Number} value The value to add to the statistic array.
     * @returns {Array|Boolean} Array of stats or false if invalid stat param
     */
    this.addStat = function (stat, value) {
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
