// The player

class Player extends MovingSprite {
    constructor(scene, player) {
        super(scene, player.j * 32, player.i * 32, 'hero');

        this.nbblocks = {};
        this.nbblocks[BOX] = 0;
        this.nbblocks[WALL] = 0;
        this.choice = BOX;
        this.speed = 5;
        this.isPlayer = true;
    }

    update(time, delta)
    {
        var dx = 0;
        var dy = 0;
        switch (this.state) {
        case MOVING:
            this.move(delta);
            break;
        case PAYING:
            if (this.hasPayed(delta)) {
                this.state = WAITING;
                this.setTexture('hero');
                switch (this.item) {
                case BOX:
                    this.nbblocks[BOX] += 1;
                    break;
                case WALL:
                    this.nbblocks[WALL] += 1;
                    break;
                case WIN:
                    this.scene.win();
                    return;
                }
                this.scene.updateText();
            }
            break;
        case WAITING:
            if (cursors.space.isDown)
                this.startPaying();
            else if (cursors.left.isDown)
                dx = -1;
            else if (cursors.right.isDown)
                dx = 1;
            else if (cursors.up.isDown)
                dy = -1;
            else if (cursors.down.isDown)
                dy = 1;

            if (dx != 0 || dy != 0)
            {
                if (cursors.ctrl.isDown)
                    this.putBlock(dx, dy, this.choice);
                else
                    this.startMoving(delta, dx, dy);
            }
        }
    }

    nextChoice()
    {
        this.choice = next(this.choice);
        this.scene.updatePointer();
    }

    hasPayed(delta)
    {
        this.amountPayed += delta;
        return (this.amountPayed >= 1000 * price(this.item));
    }

    putBlock(dx, dy) {
        var pos = this.getPos();
        if (this.nbblocks[this.choice] == 0 || this.terrain[pos.i + dy][pos.j + dx].type != 0)
            return;
        this.scene.setTerrain(pos.i + dy, pos.j + dx, toNumber(this.choice));
        this.nbblocks[this.choice]--;
        this.scene.updateText();
    }

    startPaying() {
        this.setTexture('heroW');
        this.state = PAYING;
        this.item = this.choice;
        this.amountPayed = 0;
        this.scene.counters[this.scene.counters.length] = new Counter(this.scene, this.x + 8, this.y - 8, 'bluecounter', 1000 * price(this.item));
    }
}

function next(item)
{
    switch (item) {
    case BOX: return WALL;
    case WALL: return WIN;
    case WIN: return BOX;
    }
}
