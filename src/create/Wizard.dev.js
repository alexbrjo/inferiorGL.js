function Wizard(x, y) {
    this.x = x;
    this.y = y;
    
    this.vx = 0;
    this.vy = 0;
   
   var ctrl = null;
   this.setController = function (c){
       ctrl = c;
   };
   
    this.update = function () {
        if (ctrl.a) this.x--;
        if (ctrl.d) this.x++;
        if (ctrl.w) this.y--;
        if (ctrl.s) this.y++;
    };
}
