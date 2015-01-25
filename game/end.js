/**
 * Created by Sercan on 24.1.2015.
 */
Game.End = function (game) {
};

Game.End.prototype= {
    create: function () {
        game.stage.backgroundColor = '#f2671d';

        var label1 = game.add.text(w / 2, h / 2 - 20, 'you finished the game! :-D', {font: '30px Arial', fill: '#fff'});
        var label2 = game.add.text(w / 2, h / 2 + 20, 'and died ' + death + ' times\ncan you do better?', {
            font: '20px Arial',
            fill: '#fff'
        });
        label1.anchor.setTo(0.5, 0.5);
        label2.anchor.setTo(0.5, 0.5);
    }
};