// Class for things that evolve on the grid (player, enemies, spawners)

class MovingSprite extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.scene.add.existing(this);

        this.state = WAITING;

        this.terrain = scene.terrain;
        this.dx = 0;
        this.dy = 0;
        this.oldx = this.x;
        this.oldy = this.y;
        this.isPlayer = false;
    }
    
    getPos() {
        return {i : Math.round(this.y / 32),
                j : Math.round(this.x / 32)}
    }

    startMoving(delta, dx, dy) {
        var pos = this.getPos();
        if (this.scene.walledSpot(pos.i + dy, pos.j + dx))
            return;
        this.oldx = this.x;
        this.oldy = this.y;
        this.dx = dx;
        this.dy = dy;
        this.state = MOVING;
        this.move(delta);
    }

    move(delta) {
        this.x += this.dx * this.speed * delta * 32/1000;
        this.y += this.dy * this.speed * delta * 32/1000;
        this.checkIfFinishedMoving();
    }
        
    checkIfFinishedMoving() {
        var finished = false;
        if (this.x >= this.oldx + 32) {
            this.x = this.oldx + 32;
            finished = true;
        }
        if (this.x <= this.oldx - 32) {
            this.x = this.oldx - 32;
            finished = true;
        }
        if (this.y >= this.oldy + 32) {
            this.y = this.oldy + 32;
            finished = true;
        }
        if (this.y <= this.oldy - 32) {
            this.y = this.oldy - 32;
            finished = true;
        }

        if (finished)
        {
            this.dx = 0;
            this.dy = 0;
            this.state = WAITING;
            if (this.isPlayer)
                this.scene.recomputeDE();
        }
    }
}
