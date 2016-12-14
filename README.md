JoRes Game Engine
==================================================
A personal HTML5 canvas Game Engine for simple 2D platformers. 

Try out the sample game
--------------------------
1. Requires Grunt 0.4+ and a web browser that supports HTML5 canvas
2. Clone git repo and run grunt task 'build'
3. Open ../sample/play.html

How it's done
--------------------------
1. Build JoResEngine.js and add the script to your webpage. 
    ```html
    <script type="text/javascript" src="JoResEngine.js"></script> 
    ```
    Your page must have a canvas element with id "JoRes-target".
    ```html 
    <canvas id="JoRes-target"></canvas>
    ```

2. Create an instance of the Engine.
    ```javascript
    var joRes = new JoResEngine();
    ```

3. Override the default menu and load screen.
    ```javascript 
    joRes.load(['MyMenu.js', 'MyLoadScreen.js']);
    ```

4. Add the relative level data and image paths for JoRes to find.
    ```javascript
    joRes.setLevelPath('myLevels/level*.js');
    joRes.setImgPath('myImages/*.png');
    ```

5. Start!
    ```javascript 
    joRes.start();
    ```

History
------------
Over the past decade I've collected maybe a hundred half-started coding 
projects. This began as a platformer game and was re-adopted in March 2016.
Decemeber 2016 it was developed a ton and converted into a stand alone Game
Engine.

