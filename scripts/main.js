var GameState = function(game){};

GameState.prototype.preload = function() {
};

GameState.prototype.create = function() {
  this.game.stage.backgroundColor = 0x00FFF6;

  this.sounds = {
  };

  this.groups = {
    bg: this.game.add.group(),
    player: this.game.add.group(),
    tourists: this.game.add.group(),
    coconuts: this.game.add.group(),
    title: this.game.add.group()
  };

/*
  this.player = new Player(this.game);
  this.groups.player.add(this.player);
  */
};

GameState.prototype.update = function() {
};

GameState.prototype.reset = function(k) {
};
