/**
 * Created by Sercan on 24.1.2015.
 */
Game = {};
var w = 1200;
var h = 600;
var death = 0;

Game.Boot = function (game) {
};

Game.Boot.prototype = {
    preload: function () {
        game.stage.backgroundColor = '#00a2ff';
        game.load.image('loading', '/img/loading.png');
        game.load.image('loading2', '/img/loading2.png');
    },
    create: function () {
        this.game.state.start('Load');
    }
};


Game.Load = function (game) {
};
Game.Load.prototype = {};
Game.Load.prototype.preload = function () {
    var label2 = game.add.text(Math.floor(w / 2) + 0.5, Math.floor(h / 2) - 15 + 0.5, 'loading...', {
        font: '30px Arial',
        fill: '#fff'
    });
    label2.anchor.setTo(0.5, 0.5);

    var preloading2 = game.add.sprite(w / 2, h / 2 + 15, 'loading2');
    preloading2.x -= preloading2.width / 2;
    var preloading = game.add.sprite(w / 2, h / 2 + 19, 'loading');
    preloading.x -= preloading.width / 2;
    game.load.setPreloadSprite(preloading);

    game.load.spritesheet('player', 'img/player3.png', 24, 30);

    this.game.load.tilemap('level1', 'levels/1.json', null, Phaser.Tilemap.TILED_JSON);

    this.game.load.image('tiles', 'img/tiles.png');

};
Game.Load.prototype.create = function () {
    game.state.start('Menu');
};
