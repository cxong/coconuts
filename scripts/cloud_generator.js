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
    var cloud = this.game.add.sprite(x, Math.random() * 200, 'cloud');
    cloud.anchor.setTo(0.5);
    this.game.physics.arcade.enable(cloud);
    cloud.body.allowGravity = false;
    cloud.body.velocity.x = dx * CLOUD_SPEED * (1 + Math.random());
    cloud.outOfBoundsKill = true;
    this.group.add(cloud);
  }
};
