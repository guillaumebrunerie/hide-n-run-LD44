var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 700,
    scene: [mainMenuScene, creditsScene, chooseLvlScene, pauseScene, gameOverScene, youWonScene],
};

game = new Phaser.Game(config);

// var lvlScene = new Phaser.Scene('lvl')

function toNumber(choice) {
    switch (choice) {
    case BOX:
        return 1;
    case WALL:
        return 2;
    case WIN:
        return 3;
    }
}

function price(item) {
    switch (item) {
    case BOX: return 1;
    case WALL: return 10;
    case WIN: return 20;
    }
}

function drillingTime(item) {
    switch (item) {
    case 0: return 0;
    case 1: return 3000;
    case 2: return 15000;
    }
}
