var Tree = function(game, theGame, group, coconuts, sounds, x, y, sprite) {
  Phaser.Sprite.call(this,
                     game,
                     x, y + 10,
                     sprite);
  this.theGame = theGame;
  this.anchor.setTo(0.5, 1.0);
  group.add(this);

  this.coconuts = coconuts;
  this.sounds = sounds;

  this.timeLast = game.time.now;
  this.shootX = 0;
  this.attackNext = false;
};
Tree.prototype = Object.create(Phaser.Sprite.prototype);
Tree.prototype.constructor = Tree;

Tree.prototype.attack = function() {
  this.attackNext = true;
};

Tree.prototype.doAttack = function() {
  var x = Math.random() * 100 - 50 + this.shootX * 200;
  new Coconut(
    this.game, this.coconuts, this.x, this.y - this.height * 0.7, x, -700);
    this.sounds.shoot.play();
};

Tree.prototype.update = function() {
  // Bounce up/down
  var now = this.game.time.now;
  var elapsed = now - this.timeLast;
  var f = (elapsed / (BAR_MS / 2)) % 1;
  if (f > 0.5) {
    f = 1 - f;
  }
  this.scale.y = 1 + 0.3 * Phaser.Easing.Cubic.InOut(f * 2);

  // Rotate
  f = (elapsed / (BAR_MS * 2)) % 1;
  var shootChanged = false;
  if (f < 0.5) {
    // rotate right
    if (f > 0.25) {
      f = 0.5 - f;
      shootChanged = shootChanged || this.shootX !== 1;
      this.shootX = 1;
    } else {
      shootChanged = shootChanged || this.shootX !== 0;
      this.shootX = 0;
    }
    this.angle = 30 * Phaser.Easing.Cubic.InOut(f * 4);
  } else {
    // rotate left
    if (f > 0.75) {
      shootChanged = shootChanged || this.shootX !== -1;
      this.shootX = -1;
      f = 1 - f;
    } else {
      f -= 0.5;
      shootChanged = shootChanged || this.shootX !== 0;
      this.shootX = 0;
    }
    this.angle = -30 * Phaser.Easing.Cubic.InOut(f * 4);
  }

  // attack
  if (this.attackNext && shootChanged) {
    this.doAttack();
    this.attackNext = false;
  }
};

Tree.prototype.beat = function(timeLast) {
  this.timeLast = timeLast;
};
