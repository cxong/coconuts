var EnemyGenerator = function(game, group) {
  this.touristCounter = 100;
  this.game = game;
  this.group = group;
};

EnemyGenerator.prototype.update = function() {
  this.touristCounter--;
  if (this.touristCounter <= 0) {
    this.touristCounter = 100;
    var x, dx;
    if (Math.random() < 0.5) {
      x = -30;
      dx = 1;
    } else {
      x = SCREEN_WIDTH + 30;
      dx = -1;
    }
    var choice = Math.floor(Math.random() * 10);
    if (choice < 5) {
      new Tourist(this.game, this.group, x, dx, 0.7, 1, 2);
    } else if (choice < 8) {
      new Tourist(this.game, this.group, x, dx, 1, 2, 1);
    } else {
      new Tourist(this.game, this.group, x, dx, 1.5, 4, 0);
    }
  }
};
