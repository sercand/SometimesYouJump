/**
 * Created by Sercan on 24.1.2015.
 */
Game.Menu = function (game) {
};

Game.Menu.prototype = {
    create: function () {
        game.stage.backgroundColor = '#d8254c';

        var logo = game.add.sprite(w / 2, h / 2 - 100, 'logo');
        logo.anchor.setTo(0.5, 0.5);

        var textImg = game.add.sprite(w / 2, h / 2 + 140, 'menuImg');
        textImg.anchor.setTo(0.5, 0.5);
        this.sfx_blip = game.add.audio('blip');
        var self = this;
        // var label1 = game.add.text(w / 2, h / 2 + 100, 'Click to Play game', {font: '30px KemcoPixel', fill: '#fff'});
        // label1.anchor.setTo(0.5, 0.5);
//
        function gofull() {
            self.sfx_blip.play('', 0, 0.15);
            game.state.start('Play');
        }

        button = game.add.button(game.world.centerX - 95, 500);
        button.visible = false;
        game.input.onDown.add(gofull, this);

    },
    update: function () {
    }
};