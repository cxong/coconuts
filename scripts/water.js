var Water = function(game, group) {
  Phaser.Sprite.call(this, game, 0, SCREEN_HEIGHT, 'water');
  this.anchor.y = 1;
  group.add(this);

  this.timeLast = game.time.now;
};
Water.prototype = Object.create(Phaser.Sprite.prototype);
Water.prototype.constructor = Water;

Water.prototype.update = function() {
  // Bobble
  var elapsed = this.game.time.now - this.timeLast + BAR_MS * 0.25;
  var f = (elapsed / BAR_MS) % 1;
  if (f < 0.5) {
  } else {
    f = 1 - f;
  }
  this.scale.y = 1 + 0.2 * Phaser.Easing.Cubic.InOut(f * 2);
};

Water.prototype.beat = function(timeLast) {
  this.timeLast = timeLast;
};
