var viewsize = 600;
var fieldsize = 1200;

var config = {
    type: Phaser.AUTO,
    width: 600,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var enemies;
var cursors;

var game = new Phaser.Game(config);

var background = [];

// var level = [[2,2,2,2,2,2,2],
//              [2,0,0,0,0,1,0],
//              [2,0,0,0,0,0,0],
//              [2,2,2,2,2,2,2]];

var level = [[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
             [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
             [2,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,2],
             [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
             [2,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,2],
             [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
             [2,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,2],
             [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
             [2,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,2],
             [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
             [2,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,2],
             [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
             [2,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,2],
             [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
             [2,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,2],
             [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
             [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]];

function preload ()
{
    this.load.image('ground', 'assets/ground.png');
    this.load.image('wall', 'assets/wall.png');
    this.load.image('box', 'assets/box.png');
    this.load.image('hero', 'assets/hero.png');
    this.load.image('spawner', 'assets/spawner.png');
    this.load.image('enemy', 'assets/enemy.png');
//    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

function updateBackgroundAt(scene, i, j)
{
    var texture;
    switch (level[i][j]) {
    case 0:
        texture = 'ground';
        break;
    case 1:
        texture = 'box';
        break;
    case 2:
        texture = 'wall';
        break;
    }
    background[i][j] = scene.add.image(32 * j, 32 * i, texture);
}

function create ()
{
    for (var i = 0; i < level.length; i++)
    {
        background[i] = [];
        for (var j = 0; j < level[i].length; j++)
        {
            updateBackgroundAt(this, i, j);
        }
    }

    player = this.add.sprite(32, 32, 'hero');

    this.cameras.main.centerOn(32 * level.length / 2, 32 * level[0].length / 2);

    enemies = this.add.group();
    enemies.add(this.add.sprite(15*32, 1*32, 'enemy'));
    enemies.add(this.add.sprite(15*32, 5*32, 'enemy'));
    enemies.add(this.add.sprite(15*32, 10*32, 'enemy'));
    enemies.children.each(function(obj){obj.dx = 0; obj.dy = 0;});

    var KeyCodes = Phaser.Input.Keyboard.KeyCodes;
    //  Input Events
    cursors = this.input.keyboard.addKeys({
        up:    KeyCodes.UP,
        down:  KeyCodes.DOWN,
        left:  KeyCodes.LEFT,
        right: KeyCodes.RIGHT,
        ctrl:  KeyCodes.CTRL});

    // //  The score
    // scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    player.dx = 0;
    player.dy = 0;
}
function isMoving(obj) {
    return (obj.dx != 0 || obj.dy != 0)
}

function getPos(obj) {
    return {i : Math.round(obj.y / 32),
            j : Math.round(obj.x / 32)}
}

function startMoving(dx, dy) {
    var pos = getPos(player);
    if (level[pos.i + dy] === undefined || level[pos.i + dy][pos.j + dx] === undefined || level[pos.i + dy][pos.j + dx] > 0)
        return;
    player.oldx = player.x;
    player.oldy = player.y;
    player.dx = dx;
    player.dy = dy;
}

function checkIfFinishedMoving(obj) {
    if (obj.x > obj.oldx + 32) {
        obj.x = obj.oldx + 32;
        obj.dx = 0;
    }
    if (obj.x < obj.oldx - 32) {
        obj.x = obj.oldx - 32;
        obj.dx = 0;
    }
    if (obj.y > obj.oldy + 32) {
        obj.y = obj.oldy + 32;
        obj.dy = 0;
    }
    if (obj.y < obj.oldy - 32) {
        obj.y = obj.oldy - 32;
        obj.dy = 0;
    }
}

function putBlock(dx, dy) {
    var pos = getPos(player);
    level[pos.i + dy][pos.j + dx] = 1;
    updateBackgroundAt(player.scene, pos.i + dy, pos.j + dx);
}

function update()
{
    var speed = 5;
    var dx = 0
    var dy = 0;

    // The player

    if (isMoving(player))
    {
        player.x += player.dx * speed;
        player.y += player.dy * speed;
        checkIfFinishedMoving(player);
    } else
    {
        if (cursors.left.isDown)
            dx = -1;
        else if (cursors.right.isDown)
            dx = 1;
        else if (cursors.up.isDown)
            dy = -1;
        else if (cursors.down.isDown)
            dy = 1;

        if (cursors.ctrl.isDown)
        {
            if (dx != 0 || dy != 0)
                putBlock(dx, dy);
        }
        else
            startMoving(dx, dy);
    }

    // The enemies

    enemies.children.each(moveEnemy);
}

var espeed = 1;

function moveEnemy(enemy)
{
    var distancesEstimates = [];
    for (var i = 0; i < level.length; i++)
    {
        distancesEstimates[i] = [];
        for (var j = 0; j < level[i].length; j++)
        {
            distancesEstimates[i][j] = INFINITY;
        }
    }

    if (isMoving(enemy))
    {
        enemy.x += enemy.dx * espeed;
        enemy.y += enemy.dy * espeed;
        checkIfFinishedMoving(enemy);
    } else
    {
        posP = getPos(player);
        posE = getPos(enemy);
        distancesEstimates[posP.i][posP.j] = 0;
        computeDE(distancesEstimates, posP.i, posP.j);
        dir = chooseDirection(distancesEstimates, posE.i, posE.j);
        enemy.dx = dir.dx;
        enemy.dy = dir.dy;
        enemy.oldx = enemy.x;
        enemy.oldy = enemy.y;
    }
}

var INFINITY = 10000;

function initDE(DE)
{
    DE = [];
    for (var i = 0; i < level.length; i++)
    {
        DE[i] = [];
        for (var j = 0; j < level[i].length; j++)
        {
            DE[i][j] = INFINITY;
        }
    }
}

function oob(i, j)
{
    return (i < 0 || i >= level.length || j < 0 || j >= level[0].length)
}

// DE is already non-infinity at (i, j)
function computeDE(DE, i, j)
{
    var k;

    for (var dir = 0; dir < 2; dir++)
    {
        for (var eps = 0; eps < 2; eps++)
        {
            dx = (dir == 0) ? 0 : (2*eps - 1);
            dy = (dir == 1) ? 0 : (2*eps - 1);
            if (oob(i + dy, j + dx)) continue;

            k = INFINITY;

            switch (level[i + dy][j + dx]) {
            case 0: k = 1; break;
//            case 1: k = 4; break;
            }

            if (k != INFINITY)
            {
                if (DE[i][j] + k < DE[i + dy][j + dx])
                {
                    DE[i + dy][j + dx] = DE[i][j] + k;
                    computeDE(DE, i + dy, j + dx);
                }
            }
        }
    }
    //  The score
//    scoreText = player.scene.add.text(j*32, i*32, DE[i][j], { fontSize: '32px', fill: '#000' });
}

function chooseDirection(DE, i, j)
{
    var chosendx;
    var chosendy;
    var best = INFINITY + 1;
    for (var dir = 0; dir < 2; dir++)
    {
        for (var eps = 0; eps < 2; eps++)
        {
            var dx = (dir == 0) ? 0 : (2*eps - 1);
            var dy = (dir == 1) ? 0 : (2*eps - 1);
            if (DE[i + dy][j + dx] < best) {
                best = DE[i + dy][j + dx];
                chosendx = dx;
                chosendy = dy;
            }
        }
    }
    return {dx: chosendx, dy: chosendy};
}
