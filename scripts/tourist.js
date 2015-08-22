var Tourist = function(game, group, x, dx, spriteI) {
  Phaser.Sprite.call(this, game, x, SAND_Y, 'tourist' + spriteI);
  game.physics.arcade.enable(this);
  this.body.allowGravity = false;
  this.body.velocity.setTo(dx * TOURIST_SPEED, 0);
  this.anchor.setTo(0.5, 1);
  group.add(this);
  this.hit = false;
};
Tourist.prototype = Object.create(Phaser.Sprite.prototype);
Tourist.prototype.constructor = Tourist;

Tourist.prototype.update = function() {
  // Off screen kill
  if (this.body.velocity > 0) {
    if (this.x > SCREEN_WIDTH + 30) {
      this.destroy();
    }
  } else {
    if (this.x < -30) {
      this.destroy();
    }
  }
};

Tourist.prototype.onHit = function() {
  if (this.hit) {
    return;
  }
  this.hit = true;
  this.y -= this.height * 0.4;
  this.scale.y = -1;
  this.body.velocity.setTo(0);
};
