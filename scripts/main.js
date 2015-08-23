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
    clouds: this.game.add.group(),
    rubbish: this.game.add.group(),
    tree: this.game.add.group(),
    tourists: this.game.add.group(),
    coconuts: this.game.add.group(),
    sand: this.game.add.group(),
    title: this.game.add.group()
  };

  this.groups.bg.add(this.game.add.sprite(0, 0, 'bg'));
  var sand = this.game.add.sprite(0, SCREEN_HEIGHT, 'sand');
  sand.anchor.y = 1;
  this.groups.sand.add(sand);
  this.water = new Water(this.game, this.groups.sand);

  this.tree = new Tree(
    this.game, this.groups.tree, this.groups.coconuts, this.sounds,
    SCREEN_WIDTH / 2, SAND_Y, 'tree');
  this.game.input.onDown.add(function() {
    this.attack();
  }, this);
  this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(function() {
    this.attack();
  }, this);

  this.enemyGenerator = new EnemyGenerator(this.game, this.groups.tourists);

  this.cloudGenerator = new CloudGenerator(this.game, this.groups.clouds);

  this.music = this.game.add.audio('music');

  this.bigTextStyle = {
    font: "36px Courier New, monospace",
    fill: "#000",
    fontWeight: "bold"
  };
  this.highStyle = {
    font: "36px Courier New, monospace",
    fill: "#f00",
    fontWeight: "bold"
  };
  var scoreTitle = this.game.add.text(10, 10, "SCORE", this.bigTextStyle);
  scoreTitle.scale.x = TEXT_X_SCALE;
  var secondRowText = scoreTitle.y + scoreTitle.height + 5;
  this.scoreText = this.game.add.text(
    10, secondRowText, "0", this.bigTextStyle);
  this.scoreText.scale.x = TEXT_X_SCALE;

  var barsLeftTitle = this.game.add.text(
    SCREEN_WIDTH / 2, 10, "LEFT", this.bigTextStyle);
  barsLeftTitle.scale.x = TEXT_X_SCALE;
  barsLeftTitle.anchor.x = 0.5;
  this.barsLeftText = this.game.add.text(
    SCREEN_WIDTH / 2, secondRowText, "0", this.bigTextStyle);
  this.barsLeftText.scale.x = TEXT_X_SCALE;
  this.barsLeftText.anchor.x = 0.5;

  var highTitle = this.game.add.text(
    SCREEN_WIDTH - 10, 10, "HIGH SCORE", this.bigTextStyle);
  highTitle.scale.x = TEXT_X_SCALE;
  highTitle.anchor.x = 1;
  this.high = parseInt(localStorage["Coconuts.HighScore"]);
  if (this.high < 5000 || isNaN(this.high)) {
    this.high = 5000;
  }
  this.highText = this.game.add.text(
    SCREEN_WIDTH - 10, secondRowText, this.high, this.bigTextStyle);
  this.highText.scale.x = TEXT_X_SCALE;
  this.highText.anchor.x = 1;

  this.promptText = this.game.add.text(
    SCREEN_WIDTH / 2, SCREEN_HEIGHT * 0.65,
    'CLICK or SPACE to start', this.bigTextStyle);
  this.promptText.scale.x = TEXT_X_SCALE;
  this.promptText.anchor.x = 0.5;
  this.promptText.alpha = 0;

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
  this.barsLeft = 100;

  this.readyTime = this.game.time.now + 1000;
};

GameState.prototype.start = function() {
  this.score = 0;
  this.scoreText.setText(this.score);

  this.barsLeft = 100;
  this.barsLeftText.setText(this.barsLeft);

  this.groups.tourists.removeAll();
  this.groups.coconuts.removeAll();

  this.timeLast = this.game.time.now;
  this.timeLastHalf = this.timeLast;
  var timer = this.game.time.create();
  timer.add(800, function() {
    this.music.play('', 0, 1, true);
  }, this);
  timer.start();

  this.tree.beat(this.timeLast);

  this.title.alpha = 0;

  this.started = true;

  this.highText.setStyle(this.bigTextStyle);

  this.promptText.alpha = 0;
};

GameState.prototype.stop = function() {
  this.barsLeft = 0;
  this.barsLeftText.setText(this.barsLeft);

  this.music.stop();

  this.title.alpha = 1;

  this.started = false;

  var storedHigh = parseInt(localStorage["Coconuts.HighScore"]);
  if (localStorage["Coconuts.HighScore"] == null ||
      storedHigh < this.high) {
    localStorage["Coconuts.HighScore"] = this.high;
  }

  this.readyTime = this.game.time.now + 1000;
};

GameState.prototype.attack = function() {
  if (!this.started) {
    if (this.readyTime < this.game.time.now) {
      this.start();
    }
  } else {
    this.tree.attack();
  }
};

GameState.prototype.update = function() {
  if (!this.started && this.readyTime < this.game.time.now) {
    this.promptText.alpha = 1;
  }
  // Up the beat
  if (this.started) {
    if (this.game.time.now - this.timeLast > BAR_MS * 2) {
      while (this.timeLast + BAR_MS * 2 < this.game.time.now) {
        this.timeLast += BAR_MS * 2;
      }
      this.water.beat(this.timeLast);
      this.tree.beat(this.timeLast);
      this.groups.tourists.forEach(function(tourist) {
        tourist.beat(this.timeLast);
      }, this);
      this.groups.clouds.forEach(function(cloud) {
        cloud.beat(this.timeLast);
      }, this);
    }
    if (this.game.time.now - this.timeLastHalf > BAR_MS) {
      while (this.timeLastHalf + BAR_MS < this.game.time.now) {
        this.timeLastHalf += BAR_MS;
      }
      this.barsLeft--;
      this.barsLeftText.setText(this.barsLeft);
      if (this.barsLeft === 0) {
        this.stop();
      }
    }
  }

  this.game.physics.arcade.overlap(
    this.groups.coconuts, this.groups.tourists, function(coconut, tourist) {
    if (tourist.hit) {
      return;
    }
    coconut.bounce();
    tourist.onHit();
    this.sounds.hit.play();
    coconut.hits++;
    var score = 100 * coconut.hits * tourist.score;
    this.score += score;
    this.scoreText.setText(this.score);
    if (this.score >= this.high) {
      this.high = this.score;
      this.highText.setText(this.high);
      this.highText.setStyle(this.highStyle);
    }

    // Popup score text
    var popup = this.game.add.text(
      coconut.x, coconut.y, score, this.scorePopupStyle);
    popup.scale.x = 0.5;
    this.game.time.events.add(800, function() {
      popup.destroy();
    }, this);
  }, null, this);
  this.enemyGenerator.update();

  this.cloudGenerator.update();

  // Clear inactive objects
  this.groups.coconuts.forEach(function(coconut) {
    if (coconut.landed) {
      this.groups.coconuts.remove(coconut);
      this.groups.rubbish.add(coconut);
      this.sounds.sand.play();
    }
  }, this);
  this.groups.tourists.forEach(function(tourist) {
    if (tourist.hit) {
      this.groups.tourists.remove(tourist);
      this.groups.rubbish.add(tourist);
    }
  }, this);
  if (this.groups.rubbish.length > MAX_RUBBISH) {
    var s = this.groups.rubbish.removeChildAt(0);
    s.destroy();
  }
};
