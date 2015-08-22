var Tree = function(game, theGame, group, coconuts, sounds, x, y, sprite) {
  Phaser.Sprite.call(this,
                     game,
                     x, y,
                     sprite);
  this.theGame = theGame;
  this.anchor.setTo(0.5, 1.0);
  group.add(this);

  this.coconuts = coconuts;
  this.sounds = sounds;

  game.add.tween(this.scale).to(
    {y: 1.3}, BAR_MS / 4, Phaser.Easing.Cubic.InOut,
    true, // autostart
    0,  // delay
    -1, // loop forever
    true // yoyo
  );
};
Tree.prototype = Object.create(Phaser.Sprite.prototype);
Tree.prototype.constructor = Tree;

Tree.prototype.attack = function() {
  new Coconut(
    this.game, this.coconuts, this.x, this.y - this.height * 0.7,
    Math.random()*1000 - 500, -700);
    this.sounds.shoot.play();
};

Tree.prototype.update = function() {
};
