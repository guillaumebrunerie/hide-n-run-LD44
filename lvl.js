class LvlScene extends Phaser.Scene {
    constructor(name, nlvl) {
        super(name);
        this.nlvl = nlvl;
        this.lvl = lvls[nlvl];
        this.terrain = [];
        this.distancesEstimates = [];
        this.background = [];
        for (var i = 0; i < this.lvl.terrain.length; i++)
        {
            this.distancesEstimates[i] = [];
            this.terrain[i] = [];
            this.background[i] = [];
            for (var j = 0; j < this.lvl.terrain[i].length; j++)
            {
                this.distancesEstimates[i][j] = INFINITY;
                this.terrain[i][j] = {type: this.lvl.terrain[i][j], health: drillingTime(this.lvl.terrain[i][j])};
            }
        }
        this.counters = [];
    }

    preload ()
    {
        this.load.image('ground', 'assets/ground.png');
        this.load.image('wall', 'assets/wall.png');
        this.load.image('box', 'assets/box.png');
        this.load.image('boxD1', 'assets/boxD1.png');
        this.load.image('hero', 'assets/hero.png');
        this.load.image('heroW', 'assets/heroW.png');
        this.load.image('spawner', 'assets/spawner.png');
        this.load.image('enemy', 'assets/enemy.png');
        this.load.image('win', 'assets/win.png');
        this.load.image('pointer', 'assets/pointer.png');
        this.load.image('background', 'assets/background.png');
        this.load.image('emptycounter', 'assets/emptycounter.png');
        this.load.image('redcounter', 'assets/redcounter.png');
        this.load.image('bluecounter', 'assets/bluecounter.png');
    }

    create ()
    {
        this.cameras.main.setScroll(-144, -64);

        var KeyCodes = Phaser.Input.Keyboard.KeyCodes;

        cursors = this.input.keyboard.addKeys({
            up:    KeyCodes.UP,
            down:  KeyCodes.DOWN,
            left:  KeyCodes.LEFT,
            right: KeyCodes.RIGHT,
            tab:   KeyCodes.TAB,
            space: KeyCodes.SPACE,
            ctrl:  KeyCodes.CTRL});

        var self = this;
        this.input.keyboard.on('keydown_ESC', esccb)
        this.input.keyboard.on('keydown_TAB', function() {self.entercb(self)})

        this.loadLevel();
    }

    entercb(self)
    {
        self.player.nextChoice();
    }

    update(time, delta)
    {
        // Check game over
        if (this.checkGameOver())
            return;

        // The player
        this.player.update(time, delta);

        // Enemies
        for (var i = 0; i < this.enemies.length; i++)
            this.enemies[i].update(delta);

        // Spawners
        for (var i = 0; i < this.spawners.length; i++)
            this.spawners[i].update(delta);

        // Counters
        for (var i = 0; i < this.counters.length; i++)
            this.counters[i].update(delta);
    }

    updateBackgroundAt(i, j)
    {
        var texture;
        switch (this.terrain[i][j].type) {
        case 0:
            texture = 'ground';
            break;
        case 1:
            if (this.terrain[i][j].health == drillingTime(1))
                texture = 'box';
            else
                texture = 'boxD1';
            break;
        case 2:
            texture = 'wall';
            break;
        case 3:
            texture = 'win';
            break;
        }
        if (this.background[i][j] === undefined)
            this.background[i][j] = this.add.image(32 * j, 32 * i, texture);
        else
            this.background[i][j].setTexture(texture);
    }

    loadLevel() {
        this.add.image(400-144, 350-64, 'background');
        this.add.text(-144, -64, 'Level ' + (this.nlvl + 1), { fontFamily: 'sans-serif', fontSize: '32px', fill: '#FFF' });

        this.background = [];
        for (var i = 0; i < this.terrain.length; i++)
        {
            this.background[i] = [];
            for (var j = 0; j < this.terrain[i].length; j++)
            {
                this.updateBackgroundAt(i, j);
            }
        }

        // Player init

        this.player = new Player(this, this.lvl.player);
        this.recomputeDE();

        this.pointer = this.add.sprite(0, 580, 'pointer');
        this.updatePointer();

        // Enemies and spawners init

        this.enemies = [];
        for (var index = 0; index < this.lvl.enemies.length; index++)
            this.enemies[this.enemies.length] = new Enemy(this, this.lvl.enemies[index]);

        this.spawners = [];
        for (var index = 0; index < this.lvl.spawners.length; index++)
            this.spawners[this.spawners.length] = new Spawner(this, this.lvl.spawners[index])

        // Text init

        this.add.image(20, 580, 'box');
        this.add.image(220, 580, 'wall');
        this.add.image(420, 580, 'win');
        this.text = [this.add.text(40, 565, '×?', { fontSize: '32px', fill: '#FFF' }),
                     this.add.text(240, 565, '×?', { fontSize: '32px', fill: '#FFF' })]
        this.updateText();
    }

    updatePointer()
    {
        switch (this.player.choice) {
        case BOX: this.pointer.x = 20; break;
        case WALL: this.pointer.x = 220; break;
        case WIN: this.pointer.x = 420; break;
        }
    }

    checkGameOver()
    {
        for (var i = 0; i < this.enemies.length; i++)
            if (this.checkHit(this.enemies[i]))
                return true;
        return false;
    }

    checkHit(enemy) {
        var dx = Math.abs(this.player.x - enemy.x);
        var dy = Math.abs(this.player.y - enemy.y);
        if (dx <= 32 && dy <= 32 && (dx < 16 || dy < 16))
        {
            this.gameOver();
            return true;
        }
        return false;
    }

    gameOver() {
        game.scene.pause('lvl');
        game.scene.start('gameover');
        game.scene.bringToTop('gameover');
    }

    win() {
        game.scene.pause('lvl');
        game.scene.start('youwon');
        game.scene.bringToTop('youwon');
    }

    walledSpot(i, j)
    {
        return (this.terrain[i] === undefined || this.terrain[i][j] === undefined || this.terrain[i][j].type > 0)
    }

    updateText()
    {
        this.text[0].setText('×' + this.player.nbblocks[BOX]);
        this.text[1].setText('×' + this.player.nbblocks[WALL]);
    }

    recomputeDE()
    {
        initDE(this.terrain, this.distancesEstimates);
        var pos = this.player.getPos();
        this.distancesEstimates[pos.i][pos.j] = 0;
        computeDE(this.terrain, this.distancesEstimates, pos.i, pos.j);
    }

    setTerrain(i, j, type)
    {
        this.terrain[i][j] = {};
        this.terrain[i][j].type = type;
        this.terrain[i][j].health = drillingTime(type);
        this.updateBackgroundAt(i, j);
        this.recomputeDE();
    }
}

function esccb()
{
    game.scene.pause('lvl');
    game.scene.start('pause');
    game.scene.bringToTop('pause');
}

function initDE(level, DE)
{
    for (var i = 0; i < level.length; i++)
    {
        for (var j = 0; j < level[i].length; j++)
        {
            DE[i][j] = INFINITY;
        }
    }
}

function oob(level, i, j)
{
    return (i < 0 || i >= level.length || j < 0 || j >= level[0].length)
}

// Invariant: DE is already non-infinity at (i, j)
function computeDE(level, DE, i, j)
{
    var k;

    for (var dir = 0; dir < 2; dir++)
    {
        for (var eps = 0; eps < 2; eps++)
        {
            dx = (dir == 0) ? 0 : (2*eps - 1);
            dy = (dir == 1) ? 0 : (2*eps - 1);
            if (oob(level, i + dy, j + dx)) continue;

            k = 1 + level[i + dy][j + dx].health / 1000;

            if (DE[i][j] + k < DE[i + dy][j + dx])
            {
                DE[i + dy][j + dx] = DE[i][j] + k;
                computeDE(level, DE, i + dy, j + dx);
            }
        }
    }
}
