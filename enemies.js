// The enemies

class Enemy extends MovingSprite {
    constructor(scene, enemy) {
        super(scene, enemy.j * 32, enemy.i * 32, 'enemy');
        this.speed = 1;
    }

    startDrilling(dir)
    {
        var pos = this.getPos();
        this.state = DRILLING;
        this.drillingI = pos.i + dir.dy;
        this.drillingJ = pos.j + dir.dx;
        this.scene.counters[this.scene.counters.length] = new Counter(this.scene, this.x + dir.dx * 32 + 8, this.y + dir.dy * 32 - 8, 'redcounter', drillingTime(this.terrain[this.drillingI][this.drillingJ].type));
        this.terrain[this.drillingI][this.drillingJ].health -= 1;
        this.scene.updateBackgroundAt(this.drillingI, this.drillingJ);
    }

    drill(delta)
    {
        this.terrain[this.drillingI][this.drillingJ].health -= delta;
        if (this.terrain[this.drillingI][this.drillingJ].health <= 0)
        {
            this.state = WAITING;
            var pos = this.getPos();
            this.scene.setTerrain(this.drillingI, this.drillingJ, 0);
        }
    }

    update(delta)
    {
        switch (this.state) {
        case MOVING:
            this.move(delta);
            break;
        case DRILLING:
            this.drill(delta);
            break;
        case WAITING:
            var pos = this.getPos();
            var dir = this.chooseDirection(pos);
            if (this.terrain[pos.i + dir.dy][pos.j + dir.dx].type != 0)
                this.startDrilling(dir);
            else
                this.startMoving(delta, dir.dx, dir.dy);
        }
    }

    chooseDirection(pos)
    {
        var chosendx = [];
        var chosendy = [];
        var best = INFINITY + 1;
        var DE = this.scene.distancesEstimates;
        for (var dir = 0; dir < 2; dir++)
        {
            for (var eps = 0; eps < 2; eps++)
            {
                var dx = (dir == 0) ? 0 : (2*eps - 1);
                var dy = (dir == 1) ? 0 : (2*eps - 1);
                if (DE[pos.i + dy][pos.j + dx] < best) {
                    best = DE[pos.i + dy][pos.j + dx];
                    chosendx = [];
                    chosendy = [];
                }
                if (DE[pos.i + dy][pos.j + dx] <= best) {
                    chosendx[chosendx.length] = dx;
                    chosendy[chosendy.length] = dy;
                }
            }
        }
        if (chosendx.length == 0)
            return {dx: 0, dy: 0};
        var index = Math.floor(Math.random() * chosendx.length);
        return {dx: chosendx[index], dy: chosendy[index]};
    }
}
