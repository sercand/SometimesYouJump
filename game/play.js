/**
 * Created by Sercan on 24.1.2015.
 */
Game.Play = function (game) {
};

var ctx, isDrawing, points = [ ];

function midPointBtw(p1, p2) {
    return {
        x: p1.x + (p2.x - p1.x) / 2,
        y: p1.y + (p2.y - p1.y) / 2
    };
}

Game.Play.prototype = {
    create: function () {
        game.stage.backgroundColor = '#9b59b6';


        var myBitmap = game.add.bitmapData(800, 600);

        game.add.sprite(0, 0, myBitmap);

        var label1 = game.add.text(w / 2, h / 2 - 20, 'This is a game', {font: '30px Arial', fill: '#fff'});
        var label2 = game.add.text(w / 2, h / 2 + 20, 'Deal with it ', {
            font: '20px Arial',
            fill: '#fff'
        });
        label1.anchor.setTo(0.5, 0.5);
        label2.anchor.setTo(0.5, 0.5);
        ctx = myBitmap.context;
        var el = document.getElementById('gameContainer');
        el.onmousedown = function(e) {
            isDrawing = true;
            points.push({ x: e.clientX, y: e.clientY });
        };

        el.onmousemove = function(e) {
            if (!isDrawing) return;
            points.push({ x: e.clientX, y: e.clientY });

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            var p1 = points[0];
            var p2 = points[1];

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            console.log(points);

            for (var i = 1, len = points.length; i < len; i++) {
                // we pick the point between pi+1 & pi+2 as the
                // end point and p1 as our control point
                var midPoint = midPointBtw(p1, p2);
                ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
                p1 = points[i];
                p2 = points[i+1];
            }
            // Draw last line as a straight line while
            // we wait for the next point to be able to calculate
            // the bezier control point
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
        };
        el.onmouseup = function() {
            isDrawing = false;
            points.length = 0;
        };
    }
};