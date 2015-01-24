/**
 * Created by Sercan on 24.1.2015.
 */
var ctx, isDrawing, points = [];

function midPointBtw(p1, p2) {
    return {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
    };
}

Game.Play = function (game) {
};

Game.Play.prototype = {};

Game.Play.prototype.create = function () {
    game.stage.backgroundColor = '#00a2ff';

    var myBitmap = game.add.bitmapData(w, h);
    game.add.sprite(0, 0, myBitmap);
//    var label1 = game.add.text(w / 2, h / 2 - 20, 'This is a game', {font: '30px Arial', fill: '#fff'});
//    var label2 = game.add.text(w / 2, h / 2 + 20, 'Deal with it ', {
//        font: '20px Arial',
//        fill: '#fff'
//    });
//    label1.anchor.setTo(0.5, 0.5);
//    label2.anchor.setTo(0.5, 0.5);
    ctx = myBitmap.context;

    var el = document.getElementById('gameContainer');
    el.onmousedown = function (e) {
        isDrawing = true;
        points.push({x: e.clientX, y: e.clientY});
    };
    el.onmousemove = function (e) {
        if (!isDrawing) return;
        points.push({x: e.clientX, y: e.clientY});

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        var p1 = points[0];
        var p2 = points[1];

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        for (var j = 0; j < points.length; j++)
            console.log(points[j]);

        for (var i = 1, len = points.length; i < len; i++) {
            // we pick the point between pi+1 & pi+2 as the
            // end point and p1 as our control point
            var midPoint = midPointBtw(p1, p2);
            ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
            p1 = points[i];
            p2 = points[i + 1];
        }
        // Draw last line as a straight line while
        // we wait for the next point to be able to calculate
        // the bezier control point
        ctx.lineTo(p1.x, p1.y);
        ctx.stroke();
    };
    el.onmouseup = function () {
        isDrawing = false;
        points.length = 0;
    };

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setBoundsToWorld(true, true, false, true, false);
    game.physics.p2.gravity.y = 300;


    this.level = 1;
    death = 0;
    this.player = game.add.sprite(w / 2 - 50, h / 2, 'player');
    this.player.anchor.setTo(0.5, 0.5);

    this.painted_wall = game.add.sprite(w / 2, h / 2);


    this.next_level();
};

Game.Play.prototype.update = function () {
    if (this.player.position.y > h - 20) {
        return this.player_dead();
    }
};
function hitPanda(body1, body2) {

    //  body1 is the space ship (as it's the body that owns the callback)
    //  body2 is the body it impacted with, in this case our panda
    //  As body2 is a Phaser.Physics.P2.Body object, you access its own (the sprite) via the sprite property:
    body2.sprite.alpha -= 0.1;
}
Game.Play.prototype.next_level = function () {
    if (!this.player.alive)return;
    this.player.alive = false;

    if (this.level === 1) {
        this.load_map();
    } else {

        this.load_map();
    }
};

Game.Play.prototype.load_map = function () {
    this.clear_map();

    this.map = game.add.tilemap('level' + this.level);
    this.map.addTilesetImage('tiles', 'tiles');
    this.map.setCollisionBetween(0, 10);
    this.map.setTileIndexCallback(2, this.player_dead, this);
    this.layer = this.map.createLayer('layer');
    this.level += 1;

    //
    var arr = game.physics.p2.convertTilemap(this.map, this.layer);
    //Player
    game.physics.p2.enable(this.player);
    this.player.alive = true;
    this.player.reset(100, 60);
    this.player.body.velocity.x = 100;
    this.player.body.velocity.y = 140;
    this.player.body.fixedRotation = true;

    //Materials
    var spriteMaterial = game.physics.p2.createMaterial('spriteMaterial', this.player.body);
    this.worldMaterial = game.physics.p2.createMaterial('worldMaterial');
    game.physics.p2.setWorldMaterial(this.worldMaterial, true, true, true, true);
    var contactMaterial = game.physics.p2.createContactMaterial(spriteMaterial, this.worldMaterial);

    for (var i = 0; i < arr.length; i++) {
        arr[i].setMaterial(this.worldMaterial);
    }

    contactMaterial.friction = 0.2;     // Friction to use in the contact of these two materials.
    contactMaterial.restitution = 1.0;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.

    //Wall
    game.physics.p2.enable(this.painted_wall);
    this.painted_wall.anchor.setTo(0.5, 0.5);

    this.painted_wall.body.clearShapes();
    this.painted_wall.body.static = true;

    this.painted_wall.body.addLine(100, 0, 0, Math.PI / 6);
    //this.painted_wall.body.addLine(100, 200, 0, Math.PI / 6);

    this.painted_wall.body.setMaterial(this.worldMaterial);

    this.player.body.createBodyCallback(this.painted_wall, function (x, y) {
        console.log("hit wall");
    });
    game.physics.p2.setImpactEvents(true);

    this.painted_wall.body.debug = true
};


Game.Play.prototype.clear_map = function () {
};

Game.Play.prototype.player_movement = function () {
};

Game.Play.prototype.player_dead = function () {
    console.log("player_dead");
};

Game.Play.prototype.player_collision = function () {
    console.log("Collision");
};