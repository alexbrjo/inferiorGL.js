/**
 * Stores data for all the Units. Updates and manages them too.
 */
function UnitHandler() {

    /** The master list of unit objects */
    this.list = [];
    
    /** Handy reference to Player object */
    this.p = null;

    /**
     * Creates and adds a new Player object to the Unit array. 
     * 
     * @param {Number} x The x coordinate to create the Unit.
     * @param {Number} y The y coordinate to create the Unit.
     */
    this.newPlayer = function (x, y) {
        var e = Object.assign(new Unit(this.list.length, x, y), new Player());
        this.list.push(e);
        this.p = e;
    };
    
    /**
     * Creates and adds a new Soldier to the Unit array.
     * 
     * @param {Number} x The x coordinate to create the Unit.
     * @param {Number} y The y coordinate to create the Unit.
     */
    this.newSoldier = function (x, y) {
        var e = Object.assign(new Unit(this.list.length, x, y), new Soldier());
        this.list.push(e);
    };
    
    /**
     * Creates and adds a new RPG Soldier to the Unit array.
     * 
     * @param {Number} x The x coordinate to create the Unit.
     * @param {Number} y The y coordinate to create the Unit.
     */
    this.newRPGsoldier = function (x, y) {
        var e = Object.assign(new Unit(this.list.length, x, y), new RPGsoldier());
        this.list.push(e);
    };

    /**
     * Updates units and removes ref if scheduled to be deleted.
     * 
     * @param {Ninja} world @TODO can't be passing the entire universe around like this smh
     */
    this.update = function (world) {
        if (this.list[0].x > 0) {
            var toDestroy = [];
            // move this.units and objects
            for (var i = 0; i < this.list.length; i++) {
                var u = this.list[i];
                u.update(world);
                if (u.destroy)
                    toDestroy.push(u.id);
            }
            for (var i = 0; i < toDestroy.length; i++) {
                for (var j = 0; i < this.list.length; j++) {
                    if (this.list[j].id === toDestroy[i]) {
                        this.list.splice(j, 1);
                        break;
                    }
                }
            }
        }
    };
};
