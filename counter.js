class Counter {
    constructor(scene, x, y, texture, time) {
        this.empty = scene.add.image(x, y, 'emptycounter');
        this.full  = scene.add.image(x, y, texture);
        scene.add.existing(this.empty);
        scene.add.existing(this.full);
        this.totalTime = time;
        this.remainingTime = time;
        this.texture = texture;
        this.empty.alpha = 1;
        this.full.alpha = 0.75;
        this.scene = scene;
    }

    update(delta) {
        this.remainingTime -= delta;
        var y = 4 + 22 * (this.remainingTime / this.totalTime);
        this.full.setCrop(0, y, 32, 32-y);
        this.isDone();
    }

    isDone() {
        var result = this.remainingTime <= 0;
        if (result) {
            this.empty.destroy();
            this.full.destroy();
        }
    }
}
