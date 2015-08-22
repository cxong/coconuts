var GameState = function(game){};

GameState.prototype.preload = function() {
};

GameState.prototype.create = function() {
  this.game.stage.backgroundColor = 0x00FFF6;
	this.game.physics.arcade.gravity.y = GRAVITY;

  this.sounds = {
  };

  this.groups = {
    bg: this.game.add.group(),
    tree: this.game.add.group(),
    tourists: this.game.add.group(),
    coconuts: this.game.add.group(),
    sand: this.game.add.group(),
    title: this.game.add.group()
  };

  this.groups.sand.add(this.game.add.sprite(0, SAND_Y, 'sand'));

  this.tree = new Tree(
    this.game, this, this.groups.tree, this.groups.coconuts,
    SCREEN_WIDTH / 2, SAND_Y, 'tree');
  this.game.input.onDown.add(this.tree.attack, this.tree);

  this.enemyGenerator = new EnemyGenerator(this.game, this.groups.tourists);
};

GameState.prototype.update = function() {
  this.game.physics.arcade.overlap(
    this.groups.coconuts, this.groups.tourists, function(coconut, tourist) {
    if (tourist.hit) {
      return;
    }
    coconut.body.velocity.y *= -0.5;
    coconut.body.velocity.x /= 2;
    tourist.onHit();
  });
  this.enemyGenerator.update();

  // Clear inactive objects
  this.groups.coconuts.forEach(function(coconut) {
    if (coconut.landed) {
      this.groups.coconuts.remove(coconut);
      this.groups.bg.add(coconut);
    }
  }, this);
  this.groups.tourists.forEach(function(tourist) {
    if (tourist.hit) {
      this.groups.tourists.remove(tourist);
      this.groups.bg.add(tourist);
    }
  }, this);
};

GameState.prototype.reset = function(k) {
};
