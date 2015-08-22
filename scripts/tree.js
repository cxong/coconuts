var Tree = function(game, theGame, group, coconuts, x, y, sprite) {
  Phaser.Sprite.call(this,
                     game,
                     x, y,
                     sprite);
  this.theGame = theGame;
  this.anchor.setTo(0.5, 1.0);
  group.add(this);

  this.coconuts = coconuts;
};
Tree.prototype = Object.create(Phaser.Sprite.prototype);
Tree.prototype.constructor = Tree;

Tree.prototype.attack = function() {
  new Coconut(this.game, this.coconuts, this.x, this.y - this.height * 0.7, 10, 10);
};

Tree.prototype.update = function() {
};
