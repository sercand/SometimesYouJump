/**
 * Created by Sercan on 24.1.2015.
 */
Game.End = function (game) {
};

Game.End.prototype = {
    create: function () {
        game.stage.backgroundColor = '#f2671d';

        var logo = game.add.sprite(w / 2, h / 2 - 150, 'finished');
        logo.anchor.setTo(0.5, 0.5);

        var eText = game.add.sprite(w / 2, h / 2 + 150, 'endText');
        eText.anchor.setTo(0.5, 0.5);

        var label1 = game.add.text(w / 2 + 85, h / 2 + 115, death.toString(), {font: '64px Arial', fill: '#fff'});

        label1.anchor.setTo(0.5, 0.5);

        this.sfx_blip = game.add.audio('blip');
        var self = this;


       function gofull() {
           self.sfx_blip.play('', 0, 0.15);
           location.reload();
       }

       button = game.add.button(game.world.centerX - 95, 500);
       button.visible = false;
       game.input.onDown.add(gofull, this);
    }
};