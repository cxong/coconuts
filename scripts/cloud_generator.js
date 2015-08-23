var CloudGenerator = function(game, group) {
  this.counter = 300;
  this.game = game;
  this.group = group;
};

CloudGenerator.prototype.update = function() {
  this.counter--;
  if (this.counter <= 0) {
    this.counter = 300;
    var x, dx;
    if (Math.random() < 0.5) {
      x = -200;
      dx = 1;
    } else {
      x = SCREEN_WIDTH + 200;
      dx = -1;
    }
    new Cloud(this.game, this.group, x, Math.random() * 300, dx);
  }
};
