var Coconut = function(game, group, x, y, dx, dy) {
  Phaser.Sprite.call(this, game, x, y, 'coconut');
  game.physics.arcade.enable(this);
  this.anchor.setTo(0.5, 0.5);
  group.add(this);
};
Coconut.prototype = Object.create(Phaser.Sprite.prototype);
Coconut.prototype.constructor = Coconut;

Coconut.prototype.update = function() {
  if (this.y > SAND_Y) {
    this.body.allowGravity = false;
    this.y = SAND_Y;
    this.body.immovable = true;
  }
};
