/**
 * Created by Sercan on 24.1.2015.
 */
Game = {};
var w = 1200;
var h = 600;
var death = 0;
var levelCount = 4;
var tutorials = [
    {
        color: '#eaeaea',
        message: 'Draw to Survive!',
        level: 1,
        x: 100, y: 10,
        viewed: false
    }, {
        color: '#ffc428',
        message: 'Yellow is your target',
        level: 1,
        x: 800, y: 10,
        viewed: false
    }, {
        color: '#e82a18',
        message: "Don't touch to Red ones",
        level: 2,
        x: 300, y: 10,
        viewed: false
    }, {
        color: '#312db8',
        message: 'Blue ones will increase your speed',
        level: 3,
        x: 300, y: 10,
        viewed: false
    }, {
        color: '#464646',
        message: 'Black ones will decrease your speed',
        level: 4,
        x: 600, y: 10,
        viewed: false
    }
];
Game.Boot = function (game) {
};

Game.Boot.prototype = {
    preload: function () {
        game.stage.backgroundColor = '#3ce28e';
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

    game.load.spritesheet('player', 'img/player.png', 48, 48);

    game.load.tilemap('level1', 'levels/1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level2', 'levels/2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level3', 'levels/3.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('level4', 'levels/4.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.image('tiles', 'img/tiles.png');
    game.load.image('castle', 'img/castle.png');
    game.load.image('knife', 'img/knife.png');
    game.load.image('rect', 'img/white_rect.png');

    game.load.audio('jump', 'audio/jump.wav');
    game.load.audio('jump2', 'audio/jump2.wav');
    game.load.audio('dead', 'audio/dead.wav');
    game.load.audio('victory', 'audio/victory.wav');
    game.load.audio('speed_inc', 'audio/speed_inc.wav');
    game.load.audio('speed_dec', 'audio/speed_dec.wav');

};
Game.Load.prototype.create = function () {
    game.state.start('Menu');
};
