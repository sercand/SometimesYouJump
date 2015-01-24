/**
 * Created by Sercan on 24.1.2015.
 */
Game = {};
var w = 800;
var h = 600;
var death = 0;

Game.Load = function (game) {

};

Game.Load.prototype = {
    create: function () {
        game.state.start('Menu');
    }
};