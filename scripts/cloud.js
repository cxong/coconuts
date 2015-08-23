var Cloud = function(game, group, x, y, dx) {
  Phaser.Sprite.call(this, game, x, y, 'cloud');
  game.physics.arcade.enable(this);
  this.body.allowGravity = false;
  this.body.velocity.x = dx * CLOUD_SPEED * (1 + Math.random());
  this.anchor.setTo(0.5, 1.3);
  this.outOfBoundsKill = true;
  group.add(this);

  this.timeLast = game.time.now;
};
Cloud.prototype = Object.create(Phaser.Sprite.prototype);
Cloud.prototype.constructor = Cloud;

Cloud.prototype.update = function() {
  // Bobble
  var elapsed = this.game.time.now - this.timeLast;
  var f = (elapsed / (BAR_MS / 2)) % 1;
  if (f < 0.5) {
  } else {
    f = 1 - f;
  }
  this.scale.y = 1 + 0.3 * Phaser.Easing.Cubic.InOut(f * 2);
};

Cloud.prototype.beat = function(timeLast) {
  this.timeLast = timeLast;
};
