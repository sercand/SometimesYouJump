/**
 * Created by Sercan on 24.1.2015.
 */
Game.Menu = function (game) {
};

Game.Menu.prototype = {
    create: function () {
        game.stage.backgroundColor = '#d8254c';

        var label1 = game.add.text(w / 2, h / 2 - 20, 'Click to Play game', {font: '30px Arial', fill: '#fff'});
        label1.anchor.setTo(0.5, 0.5);

        function gofull() {
            game.state.start('Play');
        }
        
        button = game.add.button(game.world.centerX - 95, 500);
        button.visible = false;
        game.input.onDown.add(gofull, this);

    },
    update: function () {
    }
};