function App() {
    this.rsc = null;
    this.universe = null;
    
    this.play = function (level_id) {
        this.universe.close();
        var level = new Level();
        this.universe = new World(this.universe, level);
    };
    
    this.create = function () {
        this.universe.close();
        this.universe = new LevelCreator(this.universe);
    };
    
    this.menu = function () {
        this.universe.close();
        this.universe = new Menu(this.universe);
    };
}
