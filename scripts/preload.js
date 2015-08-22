var BasicGame = {};
BasicGame.Preload = function (game) {
    this.preloadBar = null;
};

BasicGame.Preload.prototype = {
    preload: function () {
      var barBack = this.add.sprite(SCREEN_WIDTH / 2,
                                    SCREEN_HEIGHT / 2,
                                    'bar_back');
      barBack.anchor.setTo(0.5, 0.5);
      this.preloadBar = this.add.sprite(SCREEN_WIDTH / 2,
                                        SCREEN_HEIGHT / 2,
                                        'bar');
      this.preloadBar.anchor.setTo(0, 0.5);
      this.preloadBar.x -= this.preloadBar.width / 2;
      this.load.setPreloadSprite(this.preloadBar);

      this.game.load.image('coconut', 'images/coconut.png');
      this.game.load.image('tree', 'images/tree.png');
      this.game.load.image('sand', 'images/sand.png');
      for (var i = 0; i < NUM_TOURISTS; i++) {
        this.game.load.image('tourist' + i, 'images/tourists/' + i + '.png');
      }

      //this.game.load.audio('bump', 'sounds/bump.wav');
    },

    create: function () {
        this.state.start('game');
    }
};
