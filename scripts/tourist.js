var Tourist = function(game, group, x, dx, spriteI) {
  Phaser.Sprite.call(this, game, x, SAND_Y, 'tourist' + spriteI);
  game.physics.arcade.enable(this);
  this.body.allowGravity = false;
  this.dx = dx;
  this.body.velocity.setTo(dx * TOURIST_SPEED, 0);
  this.anchor.setTo(0.5, 1);
  group.add(this);
  this.hit = false;

  this.timeLast = game.time.now;
};
Tourist.prototype = Object.create(Phaser.Sprite.prototype);
Tourist.prototype.constructor = Tourist;

Tourist.prototype.update = function() {
  // Wobble
  if (!this.hit) {
    var elapsed = this.game.time.now - this.timeLast;
    var f = (elapsed / (BAR_MS / 2)) % 1;
    var d;
    if (f < 0.5) {
      // Nudge forward
      d = Phaser.Easing.Quintic.Out(f * 2);
    } else {
      // Slide back
      f = 1 - f;
      d = Phaser.Easing.Linear.None(f * 2);
    }
    d -= 0.5;
    d *= 0.3;
    this.anchor.x = d * -this.dx + 0.5;

    // Bobble
    this.scale.y = 1 + 0.3 * Phaser.Easing.Cubic.InOut(f * 2);
  }

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

Tourist.prototype.beat = function(timeLast) {
  this.timeLast = timeLast;
};
