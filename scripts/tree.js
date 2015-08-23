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
  this.timeLastUpdate = game.time.now;
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
  var elapsed = this.game.time.now - this.timeLast;
  var f = (elapsed / (BAR_MS / 2)) % 1;
  if (f > 0.5) {
    f = 1 - f;
  }
  this.scale.y = 1 + 0.3 * Phaser.Easing.Cubic.InOut(f * 2);

  // Rotate
  f = (elapsed / (BAR_MS * 2)) % 1;
  if (f < 0.5) {
    // rotate right
    this.shootX = 0;
    if (f > 0.25) {
      f = 0.5 - f;
      this.shootX = 1;
    }
    this.angle = 30 * Phaser.Easing.Cubic.InOut(f * 4);
  } else {
    // rotate left
    this.shootX = 0;
    if (f > 0.75) {
      this.shootX = -1;
      f = 1 - f;
    } else {
      f -= 0.5;
    }
    this.angle = -30 * Phaser.Easing.Cubic.InOut(f * 4);
  }

  // attack
  if (this.attackNext) {
    var minibeatLast =
      Math.floor((this.game.time.now - this.timeLast) / (BAR_MS / TREE_ATTACKS_PER_BAR));
    var minibeat =
      Math.floor((this.timeLastUpdate - this.timeLast) / (BAR_MS / TREE_ATTACKS_PER_BAR));
    if (minibeat < minibeatLast) {
      this.doAttack();
      this.attackNext = false;
    }
  }

  this.timeLastUpdate = this.game.time.now;
};

Tree.prototype.beat = function(timeLast) {
  this.timeLast = timeLast;
};
