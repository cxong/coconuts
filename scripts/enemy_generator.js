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
    new Tourist(
      this.game, this.group, x, dx, Math.floor(Math.random() * NUM_TOURISTS));
  }
};
