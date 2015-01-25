/**
 * Created by Sercan on 24.1.2015.
 */
var ctx, isDrawing, points = [];
var canvasElement;

function midPointBtw(p1, p2) {
    return {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
    };
}
var minRectDist = 81;
var preUsedPoint = null;
var lastPointUsed = false;
var defaultPaintLength = 100;
var backColors = ['#4183d9', '#3973bf', '#4192d9', '#3981bf', '#66b1f2'];
var backIndex;
function sqrtDistanceOfTwoPoints(p1, p2) {
    return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
}

function getLengthOfArray(arr) {
    if (arr.length < 2)return 0;
    var r = 0;
    var p = arr[0];
    for (var i = 1, n = arr.length; i < n; i++) {
        r += Math.sqrt(sqrtDistanceOfTwoPoints(p, arr[i]));
        p = arr[i];
    }
    return r;
}

Game.Play = function (game) {
};

Game.Play.prototype = {};

Game.Play.prototype.create = function () {
    backIndex = game.rnd.integerInRange(0, backColors.length - 1);
    game.stage.backgroundColor = backColors[backIndex % backColors.length];
    var self = this;
    var myBitmap = game.add.bitmapData(w, h);
    game.add.sprite(0, 0, myBitmap);
    ctx = myBitmap.context;

    canvasElement = document.getElementById('gameContainer');

    canvasElement.onMouseDown = null;
    canvasElement.onmousemove = null;
    canvasElement.onmouseup = null;

    canvasElement.onmousedown = function (e) {
        // if (self.painted_wall.body != null)
        self.painted_wall.body.clearShapes();
        isDrawing = true;
        points.push({x: e.clientX, y: e.clientY});
        lastPointUsed = false;
        preUsedPoint = points[0];
    };
    canvasElement.onmousemove = function (e) {
        if (!isDrawing) return;
        points.push({x: e.clientX, y: e.clientY});

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        var p1 = points[0];
        var p2 = points[1];

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);

        var last = points[points.length - 1];
        if (sqrtDistanceOfTwoPoints(last, preUsedPoint) >= minRectDist) {
            self.add_rect(preUsedPoint, last);
            preUsedPoint = last;
            lastPointUsed = true;
        }

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
        var length = getLengthOfArray(points);
        if (length > self.maxPaintLength) {
            isDrawing = false;
            lastPointUsed = true;
            preUsedPoint = null;
        }
    };
    canvasElement.onmouseup = function () {
        isDrawing = false;
        if (points.length > 1 && !lastPointUsed) {
            self.add_rect(points[points.length - 1], preUsedPoint);
        }
        preUsedPoint = null;
        lastPointUsed = false;
        points.length = 0;
        //if (self.painted_wall.body != null)
        self.painted_wall.body.setMaterial(self.worldMaterial);
    };

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setBoundsToWorld(true, true, false, true, false);
    game.physics.p2.gravity.y = 300;

    this.level = 1;
    this.levelFinished = false;
    death = 0;
    this.create_castle(0, 0);
    this.player = game.add.sprite(w / 2 - 50, h / 2, 'player');
    this.player.anchor.setTo(0.5, 0.5);
    this.player.frame = 2;
    this.player.animations.add('jump', [2, 0, 1, 3, 2], 15, false);
    this.painted_wall = game.add.sprite(w / 2, h / 2);

    var b = game.camera.bounds;
    game.camera.bounds = new Phaser.Rectangle(b.x - 5, b.y - 5, b.width + 10, b.height + 10);

    this.sfx_jump2 = game.add.audio('jump2');
    this.sfx_jump = game.add.audio('jump');
    this.sfx_dead = game.add.audio('dead');
    this.sfx_victory = game.add.audio('victory');
    this.sfx_speed_inc = game.add.audio('speed_inc');
    this.sfx_speed_dec = game.add.audio('speed_dec');
    this.sfx_boost = game.add.audio('boost');

    this.tutorial_sprites = [];
    this.tutorial_labels = [];

    this.next_level();
};

Game.Play.prototype.update = function () {
    if (this.player.position.y > h - 5 ||
        this.player.position.x > w - 5 ||
        this.player.position.x < 0) {
        return this.player_dead();
    }
    if (this.levelFinished) {
        this.next_level();
    }
};

Game.Play.prototype.next_level = function () {
    if (!this.player.alive)return;
    this.player.alive = false;
    this.levelFinished = false;
    if (this.level === 1) {
        this.load_map();
    } else {
        if (this.level > levelCount) {
            this.game.state.start('End');
            return;
        }
        this.load_map();
    }
};

Game.Play.prototype.load_map = function () {
    this.clear_map();
    game.stage.backgroundColor = backColors[(++backIndex) % backColors.length];

    this.map = game.add.tilemap('level' + this.level);
    this.map.addTilesetImage('tiles', 'tiles');
    this.map.setCollisionBetween(0, 10);
    // this.map.setTileIndexCallback(2, this.player_collision, this);
    this.layer = this.map.createLayer('layer');
    this.init_tutorials();
    this.level += 1;
    this.maxPaintLength = defaultPaintLength;
    //
    var arr = game.physics.p2.convertTilemap(this.map, this.layer);
    //Player
    game.physics.p2.enable(this.player);
    this.player.alive = true;
    this.player.body.clearShapes();
    this.player.body.addCircle(20, 0, 0, 0);
    this.player.body.fixedRotation = true;
    this.reset_player();

    //Materials
    var spriteMaterial = game.physics.p2.createMaterial('spriteMaterial', this.player.body);
    this.worldMaterial = game.physics.p2.createMaterial('worldMaterial');
    game.physics.p2.setWorldMaterial(this.worldMaterial, true, true, true, true);
    var contactMaterial = game.physics.p2.createContactMaterial(spriteMaterial, this.worldMaterial);

    for (var i = 0; i < arr.length; i++) {
        var body = arr[i];
        body.setMaterial(this.worldMaterial);
        if (body.tileIndex == 1) {
            body.createBodyCallback(this.player, this.player_jump_2, this);
        }
        else if (body.tileIndex == 2) {
            body.createBodyCallback(this.player, this.player_collision, this);
            this.create_castle(body.x, body.y);
        } else if (body.tileIndex == 3) {
            body.createBodyCallback(this.player, this.player_dead, this);
        } else if (body.tileIndex == 4) {
            body.createBodyCallback(this.player, this.boost_player, this);
        } else if (body.tileIndex == 6) {
            body.createBodyCallback(this.player, this.increase_horizontal_velocity, this);
        } else if (body.tileIndex == 7) {
            body.createBodyCallback(this.player, this.decrease_horizontal_velocity, this);
        }
    }

    contactMaterial.friction = 0.2;     // Friction to use in the contact of these two materials.
    contactMaterial.restitution = 1.0;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.

    //Wall
    game.physics.p2.enable(this.painted_wall);
    this.painted_wall.anchor.setTo(0.5, 0.5);
    var bs = game.physics.p2.getBodies();
    var contains = false;
    for (var ii = 0, n = bs.length; ii < n; ii++) {
        if (bs[ii] == this.painted_wall.body) {
            contains = true;
            break;
        }
    }
    if (!contains) {
        game.physics.p2.addBody(this.painted_wall.body);
    }
    this.painted_wall.body.clearShapes();
    this.painted_wall.body.static = true;

    this.painted_wall.body.setMaterial(this.worldMaterial);

    this.player.body.createBodyCallback(this.painted_wall, this.player_jump, this);
    game.physics.p2.setImpactEvents(true);
};

Game.Play.prototype.add_rect = function (p1, p2) {
    var p11 = {x: p1.x - w / 2, y: p1.y - h / 2};
    var p22 = {x: p2.x - w / 2, y: p2.y - h / 2};

    var l = Math.sqrt(sqrtDistanceOfTwoPoints(p11, p22));
    var x = (p11.x + p22.x) / 2;
    var y = (p11.y + p22.y) / 2;
    this.painted_wall.body.addRectangle(l, 5, x, y, Math.atan2(p22.y - p11.y, p22.x - p11.x))
};

Game.Play.prototype.clear_map = function () {
    if (this.layer) {
        this.layer.destroy();
        this.map.destroy();
        game.physics.p2.clear();
        this.clean_tutorials();
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
};

Game.Play.prototype.player_dead = function () {
    death += 1;
    this.shake_screen(10, 70);
    this.sfx_dead.play('', 0, 0.15);
    this.reset_player();
};

Game.Play.prototype.reset_player = function () {
    this.player.reset(30, 60);
    this.player.z = 50;
    this.player.body.velocity.x = 100;
    this.player.body.velocity.y = 140;
};

Game.Play.prototype.increase_horizontal_velocity = function () {
    this.player.body.velocity.x *= 4;
    this.shake_screen(3, 10);
    this.sfx_speed_inc.play('', 0, 0.15);
};

Game.Play.prototype.decrease_horizontal_velocity = function () {
    this.shake_screen(5, 20);
    this.player.body.velocity.x *= 0.65;
    this.sfx_speed_dec.play('', 0, 0.15);
};

Game.Play.prototype.boost_player = function () {
    this.player.body.velocity.y = -1000;
    this.player.body.velocity.x = 30 * this.player.body.velocity.x < 0 ? -1 : 1;
    this.shake_screen(3, 5);
    this.sfx_boost.play('', 0, 0.15);
};

Game.Play.prototype.create_castle = function (x, y) {
    if (!this.castle) {
        this.castle = game.add.sprite(x, y, 'castle');
        this.castle.anchor.setTo(0, 1);
        this.castle.z = 100;
    }
    this.castle.reset(x + 5, y);
};

Game.Play.prototype.shake_screen = function (i, t) {
    game.add.tween(game.camera)
        .to({y: i}, t, Phaser.Easing.Linear.None)
        .to({y: -i}, t, Phaser.Easing.Linear.None)
        .to({y: 0}, t, Phaser.Easing.Linear.None).start();

    game.add.tween(game.camera)
        .to({x: i}, t, Phaser.Easing.Linear.None)
        .to({x: -i}, t, Phaser.Easing.Linear.None)
        .to({x: 0}, t, Phaser.Easing.Linear.None).start();
};

Game.Play.prototype.player_collision = function () {
    this.sfx_victory.play('', 0, 0.15);

    this.levelFinished = true;
};

Game.Play.prototype.init_tutorials = function () {
    for (var i = 0; i < tutorials.length; i++) {
        if (tutorials[i].level === this.level)
            this.add_tutorial(tutorials[i]);
    }
};

Game.Play.prototype.add_tutorial = function (tut) {
    if (tut.viewed)return;

    var label = game.add.text(tut.x, tut.y - 80, tut.message, {font: '16px Arial', fill: tut.color});
    this.tutorial_labels.push(label);

    game.add.tween(label)
        .to({y: tut.y}, 300, "Linear")
        .to({y: tut.y}, 5000, "Linear")
        .to({y: tut.y - 80}, 300, "Linear")
        .start();

    tut.viewed = true;
};

Game.Play.prototype.clean_tutorials = function () {
    for (var i = 0; i < this.tutorial_sprites; i++) {
        this.tutorial_sprites[i].kill();
        this.tutorial_sprites[i].destroy();
    }
    for (var j = 0; j < this.tutorial_labels.length; j++) {
        this.tutorial_labels[j].destroy();
    }

    this.tutorial_sprites.length = 0;
    this.tutorial_labels.length = 0;
};

Game.Play.prototype.player_jump = function () {
    this.sfx_jump.play('', 0, 0.15);
    this.player.animations.play('jump');
};

Game.Play.prototype.player_jump_2 = function () {
    this.sfx_jump2.play('', 0, 0.15);
    this.player.animations.play('jump');

};