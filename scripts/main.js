var GameState = function(game){};

GameState.prototype.preload = function() {
};

GameState.prototype.create = function() {
  this.game.stage.backgroundColor = 0x00FFF6;
	this.game.physics.arcade.gravity.y = GRAVITY;

  this.sounds = {
    hit: this.game.add.sound('hit'),
    sand: this.game.add.sound('sand'),
    shoot: this.game.add.sound('shoot'),
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
    this.game, this, this.groups.tree, this.groups.coconuts, this.sounds,
    SCREEN_WIDTH / 2, SAND_Y, 'tree');
  this.game.input.onDown.add(this.attack);
  this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(function(k) {
    this.attack();
  }, this);

  this.enemyGenerator = new EnemyGenerator(this.game, this.groups.tourists);

  this.music = this.game.add.audio('music');

  this.scoreText = this.game.add.text(SCREEN_WIDTH - 10, 10, "0", {
    font: "48px Courier New, monospace",
    fill: "#000",
    align: "right",
    fontWeight: "bold"
  });
  this.scoreText.scale.x = 2;
  this.scorePopupStyle = {
    font: "24px Courier New, monospace",
    fill: "#fff",
    align: 'center',
    fontWeight: 'bold'
  };

  this.title = this.game.add.sprite(
    SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 'title');
  this.title.anchor.setTo(0.5);

  this.started = false;
  this.score = 0;
};

GameState.prototype.start = function(k) {
  this.score = 0;
  // Positions score text
  this.addScore(0);

  this.groups.tourists.removeAll();
  this.groups.coconuts.removeAll();

  this.timeLast = this.game.time.now;
  var timer = this.game.time.create();
  timer.add(800, function() {
    this.music.play('', 0, 1, true);
  }, this);
  timer.start();

  this.tree.beat(this.timeLast);

  this.title.alpha = 0;

  this.started = true;
};

GameState.prototype.attack = function() {
  if (!this.started) {
    this.start();
  } else {
    this.tree.attack();
  }
};

GameState.prototype.update = function() {
  // Up the beat
  if (this.game.time.now - this.timeLast > BAR_MS * 2) {
    while (this.timeLast + BAR_MS * 2 < this.game.time.now) {
      this.timeLast += BAR_MS * 2;
    }
    this.tree.beat(this.timeLast);
    this.groups.tourists.forEach(function(tourist) {
      tourist.beat(this.timeLast);
    }, this);
  }

  this.game.physics.arcade.overlap(
    this.groups.coconuts, this.groups.tourists, function(coconut, tourist) {
    if (tourist.hit) {
      return;
    }
    if (coconut.body.velocity.y > 0) {
      coconut.body.velocity.y *= -0.56;
    }
    coconut.body.velocity.x *= 0.7;
    tourist.onHit();
    this.sounds.hit.play();
    coconut.hits++;
    this.addScore(100 * coconut.hits);

    // Popup score text
    var popup = this.game.add.text(
      coconut.x, coconut.y, 100 * coconut.hits, this.scorePopupStyle);
    popup.scale.x = 0.5;
    this.game.time.events.add(800, function() {
      popup.destroy();
    }, this);
  }, null, this);
  this.enemyGenerator.update();

  // Clear inactive objects
  this.groups.coconuts.forEach(function(coconut) {
    if (coconut.landed) {
      this.groups.coconuts.remove(coconut);
      this.groups.bg.add(coconut);
      this.sounds.sand.play();
    }
  }, this);
  this.groups.tourists.forEach(function(tourist) {
    if (tourist.hit) {
      this.groups.tourists.remove(tourist);
      this.groups.bg.add(tourist);
    }
  }, this);
  if (this.groups.bg.length > MAX_BG) {
    var s = this.groups.bg.removeChildAt(0);
    s.destroy();
  }
};

GameState.prototype.addScore = function(score) {
  this.score += score;
  this.scoreText.setText(this.score);
  this.scoreText.x = SCREEN_WIDTH - this.scoreText.width - 10;
}
