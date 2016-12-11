/** Copyright Alex Johnson 2016 
 *
 *  Special thanks to:
 *  https://hacks.mozilla.org/2011/08/animating-with-javascript-from-
 *  setinterval-to-requestanimationframe/
 *  
 *  http://programmers.stackexchange.com/questions/194822/when-to-separate-a-project-in-multiple-subprojects
 *
 *  The Pros and cons of Variable framerate
 *  http://www.learn-cocos2d.com/2013/10/game-engine-multiply-delta-time-or-not/
 * 
 *  http://zackbellgames.com/2014/10/27/how-to-make-a-platformer-feel-good/
 *
 *	- Stung by a dead bee
 *	- Corner a dog in a deadend street and he will turn around and bite
 *	- Prey that fights back is not prey
 *	- What kills you makes you stronger
 *	- Pain is gain
 *	
 * 
 *   1/3/2016:
 *   - Cannot do full srceen uses two much ram to render terrain. Must be doing something 
 *   	wrong
 *      - uses  50% ram at ~250 blocks and 60 fps (capped by chrome canvas implementation?)
 *      - uses  60% ram at ~300 blocks and 60 fps (capped?)
 *      - uses 100% ram at ~650 blocks and 50 fps (fps dips)
 *
 *  2/3/2016: 
 *  - fps issue resolved (was defining large array every time l.terrain() was called)
 *      - uses 50% ram at  ~650 blocks and 60 fps
 *      - uses 55% ram at ~1700 blocks and 60 fps
 *      - uses 60% ram at 3000+ blocks and 60 fps
 *
 *  30/9/2016:
 *	- Finally found time to start dev again. Current issues/tasks:
 *  	[+] Entire app needs to be doc'd and named better. This is barely readable
 *		[+] File structure needs to be redone
 *		[+] Break up the massive main object
 *		[+] Git or some sort of source control
 *	[-] Core TODO:
 *		[-] ResourceLoader should be able to handle js and json
 *		[-] Change levelData from JS functions to json
 *      [+/-] Change debug console display from HTML to canvas
 *		[+] Consider removing jQuery dependency; only used 10 times total
 *		[-] Add settings .json for constants. 
 *	[+/-] Game TODO: 
 *		[-] Plan out plot/story line/characters/scenes
 *		[-] Design backgrounds
 *		[+] Clean up and separate Units.js
 *		[-] Add entities to LevelData
 *
 *  4/12/2016
 *      Alright free time coming up. This is still a mess, but recoverable.
 *      Docs and unit tests are a real must right now.
 *        1. Organizing and cleaning
 *              a. [+] DOCS
 *              b. [ ] Unit tests via Karma
 *              c. [ ] Recode the level designer
 *        2. Plan remainder of project. As in like design the enemies, bosses,
 *           environment and levels.
 *
 *  @author Alex Johnson 
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
            app.universe = new World(16, true, app.rsc);
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
