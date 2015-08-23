var Coconut = function(game, group, x, y, dx, dy) {
  Phaser.Sprite.call(this, game, x, y, 'coconut');
  game.physics.arcade.enable(this);
  this.body.velocity.setTo(dx, dy);
  this.body.angularVelocity = Math.random() * 600 - 300;
  this.anchor.setTo(0.5, 0.5);
  group.add(this);
  this.landed = false;
  this.hits = 0;
};
Coconut.prototype = Object.create(Phaser.Sprite.prototype);
Coconut.prototype.constructor = Coconut;

Coconut.prototype.update = function() {
  if (this.y > SAND_Y) {
    this.land();
  }
};

Coconut.prototype.bounce = function() {
  if (this.body.velocity.y > 0) {
    this.body.velocity.y *= -0.56;
  }
  this.body.velocity.x *= 0.7;
};

Coconut.prototype.land = function() {
  this.landed = true;
  this.body.allowGravity = false;
  this.y = SAND_Y;
  this.body.immovable = true;
  this.body.velocity.setTo(0);
  this.body.angularVelocity = 0;
};
