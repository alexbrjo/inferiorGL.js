/**
 * Ninja Level Builder
 * 
 */

document.addEventListener(
    "DOMContentLoaded",
    function () {
        var app = {rsc: null, universe: null};
        app.rsc = new ResourceLoader();
        app.rsc.load([
            "tiles.png", "rpgsoldier.png",
            "warrior.png", "enemy.png",
            "hud.png", "bg.png"
        ]);
        app.rsc.whenReady(function () {
            app.universe = new LevelCreator(16, true, app.rsc);
            app.universe.init();

            var main = function () {
                app.universe.update();
                aniFrame = window.requestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        window.oRequestAnimationFrame;
                aniFrame(main, app.universe.getCanvas());
            };
            main();
        });
    }
);

