var Tree = function(game, group, coconuts, sounds, x, y, sprite) {
  Phaser.Sprite.call(this,
                     game,
                     x, y + 10,
                     sprite);
  this.game = game;
  this.anchor.setTo(0.5, 1.0);
  group.add(this);

  this.coconuts = coconuts;
  this.start();

  this.sounds = sounds;
};
Tree.prototype = Object.create(Phaser.Sprite.prototype);
Tree.prototype.constructor = Tree;

Tree.prototype.start = function() {
  for (var i = 0; i < 3; i++) {
    this.addCoconut();
  }
  this.timeLast = this.game.time.now;
  this.shootX = 0;
  this.attackNext = false;
}

Tree.prototype.addCoconut = function() {
  if (this.children.length >= 3) {
    return;
  }
  var child = this.game.make.sprite(0, 0 - this.height * 0.65, 'coconut');
  child.anchor.setTo(0.5);
  if (this.children.length === 0) {
  } else if (this.children.length === 1) {
    child.y += 20;
    child.x -= 15;
  } else if (this.children.length === 2) {
    child.y += 20;
    child.x += 15;
  }
  child.rotation = Math.random() * 360;
  this.game.add.tween(child.scale).from(
    {x: 0, y: 0}, 800, Phaser.Easing.Elastic.Out, true);
  this.addChild(child);
};

Tree.prototype.attack = function() {
  this.attackNext = true;
};

Tree.prototype.doAttack = function() {
  if (this.children.length === 0) {
    return;
  }
  var theChosen = this.removeChildAt(0);
  // Shuffle the remaining coconuts to take up the lost position
  var elder = theChosen;
  for (var i = 0; i < this.children.length; i++) {
    var child = this.getChildAt(i);
    this.game.add.tween(child).to(
      {x: elder.x, y: elder.y}, 400, Phaser.Easing.Cubic.Out, true);
    elder = child;
  }
  var x = Math.random() * 100 - 50 + this.shootX * 200;
  new Coconut(
    this.game, this.coconuts, theChosen.world.x, theChosen.world.y, x, -700);
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
  this.scale.y = 1 + TREE_BOUNCE * Phaser.Easing.Cubic.InOut(f * 2);

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
    this.angle = TREE_ROTATE * Phaser.Easing.Cubic.InOut(f * 4);
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
    this.angle = -TREE_ROTATE * Phaser.Easing.Cubic.InOut(f * 4);
  }

  // attack
  if (this.attackNext && shootChanged) {
    this.doAttack();
    this.attackNext = false;
  }
  if (shootChanged && this.shootX === 0) {
    this.addCoconut();
  }
};

Tree.prototype.beat = function(timeLast) {
  this.timeLast = timeLast;
};
