// The spawners

class Spawner extends MovingSprite {
    constructor(scene, spawner) {
        super(scene, spawner.j * 32, spawner.i * 32, 'spawner');

        this.timeout = 1000;
    }

    update(delta) {
        if (this.timeout < 0)
        {
            this.spawn();
            this.timeout = 5000;
        }
        else
            this.timeout -= delta;
    }

    spawn() {
        var chosendx = 0;
        var chosendy = 0;
        var pos = this.getPos();
        var i = pos.i;
        var j = pos.j;
        for (var dir = 0; dir < 2; dir++)
        {
            for (var eps = 0; eps < 2; eps++)
            {
                var dx = (dir == 0) ? 0 : (2*eps - 1);
                var dy = (dir == 1) ? 0 : (2*eps - 1);
                if (this.terrain[i + dy][j + dx].type == 0) {
                    chosendx = dx;
                    chosendy = dy;
                }
            }
        }
        if (chosendx != 0 || chosendy != 0)
        {
            this.scene.enemies[this.scene.enemies.length] = new Enemy(this.scene, {i: i + chosendy, j: j + chosendx});
        }
    }
}
