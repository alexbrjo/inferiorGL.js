/**
 * Ninja Level Builder
 * 
 */

document.addEventListener(
    "DOMContentLoaded",
    function () {
        var app = {rsc: null, world: null};
        app.rsc = new ResourceLoader();
        app.rsc.load([
            "tiles.png", "rpgsoldier.png",
            "warrior.png", "enemy.png",
            "hud.png", "bg.png"
        ]);
        app.rsc.whenReady(function () {
            app.world = new LevelCreator(16, true, app.rsc);

            var main = function () {
                app.world.update();
                aniFrame = window.requestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.msRequestAnimationFrame ||
                        window.oRequestAnimationFrame;
                aniFrame(main, app.world.getCanvas());
            };
            main();
        });
    }
);

