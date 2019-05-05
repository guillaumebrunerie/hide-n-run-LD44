class MenuScene extends Phaser.Scene {

    constructor(name, image, poss, left, right) {
        super(name);
        this.poss = poss;
        this.image = image;
        this.left = left;
        this.right = right;
    }

    preload ()
    {
        this.load.image('screen1', 'assets/screen1.png');
        this.load.image('credits', 'assets/credits.png');
        this.load.image('chooselvl', 'assets/chooselvl.png');
        this.load.image('pause', 'assets/pause.png');
        this.load.image('gameover', 'assets/gameover.png');
        this.load.image('youwon', 'assets/youwon.png');
        this.load.image('pointermenu', 'assets/pointermenu.png');

        var self = this;

        this.input.keyboard.on('keydown_DOWN', downcb)
        this.input.keyboard.on('keydown_UP', upcb)
        this.input.keyboard.on('keydown_LEFT', leftcb)
        this.input.keyboard.on('keydown_RIGHT', rightcb)
        this.input.keyboard.on('keydown_SPACE', function (event) {self.onSpace(self.pointerPosition)})
        this.input.keyboard.on('keydown_ENTER', function (event) {self.onSpace(self.pointerPosition)})

        function downcb() {
            self.pointerPosition = self.pointerPosition + 1;
            if (self.pointerPosition == self.poss.length)
                self.pointerPosition = 0;
            self.pointermenu.x = self.poss[self.pointerPosition].x;
            self.pointermenu.y = self.poss[self.pointerPosition].y;
        }

        function upcb() {
            self.pointerPosition = self.pointerPosition - 1;
            if (self.pointerPosition == -1)
                self.pointerPosition = self.poss.length - 1;
            self.pointermenu.x = self.poss[self.pointerPosition].x;
            self.pointermenu.y = self.poss[self.pointerPosition].y;
        }

        function leftcb() {
            if (self.left === undefined)
                return;
            self.pointerPosition = self.left[self.pointerPosition];
            self.pointermenu.x = self.poss[self.pointerPosition].x;
            self.pointermenu.y = self.poss[self.pointerPosition].y;
        }

        function rightcb() {
            if (self.right === undefined)
                return;
            self.pointerPosition = self.right[self.pointerPosition];
            self.pointermenu.x = self.poss[self.pointerPosition].x;
            self.pointermenu.y = self.poss[self.pointerPosition].y;
        }
    }

    create ()
    {
        this.pointermenu = this.add.image(0, 0, 'pointermenu');
        this.pointermenu.depth = 1;

        this.screen = this.add.image(400, 350, this.image);
        this.pointermenu.x = this.poss[0].x;
        this.pointermenu.y = this.poss[0].y;
        this.pointerPosition = 0;
        if (this.postCreate)
            this.postCreate();

        this.input.keyboard.addKeys({
            up:    KeyCodes.UP,
            down:  KeyCodes.DOWN,
            left:  KeyCodes.LEFT,
            right: KeyCodes.RIGHT,
            tab:   KeyCodes.TAB,
            space: KeyCodes.SPACE,
            ctrl:  KeyCodes.CTRL});
    }
}

var mainMenuScene  = new MenuScene('mainmenu', 'screen1', [{x: 270, y: 360}, {x: 270, y: 520}]);
var creditsScene   = new MenuScene('credits', 'credits', [{x: 260, y: 600}]);
var chooseLvlScene = new MenuScene('chooselvl', 'chooselvl', [{x: 125, y: 285}, {x: 125, y: 395}, {x: 125, y: 505},
                                                              {x: 335, y: 285}, {x: 335, y: 395}, {x: 335, y: 505},
                                                              {x: 545, y: 285}, {x: 545, y: 395}, {x: 545, y: 505},
                                                              // {x: 645, y: 285}, {x: 645, y: 395}, {x: 645, y: 505},
                                                              {x: 300, y: 620}],
                                   [6, 7, 8, 0, 1, 2, 3, 4, 5, 9],
                                   [3, 4, 5, 6, 7, 8, 0, 1, 2, 9]);
var pauseScene     = new MenuScene('pause', 'pause', [{x: 290, y: 340}, {x:290, y: 460}, {x:290, y:580}]);
var gameOverScene  = new MenuScene('gameover', 'gameover', [{x: 290, y: 385}, {x:290, y: 530}]);
var youWonScene    = new MenuScene('youwon', 'youwon', [{x: 260, y: 430}, {x: 260, y: 580}]);

mainMenuScene.onSpace = function (position)
{
    switch (position) {
    case 0: this.scene.switch('chooselvl'); break;
    case 1: this.scene.switch('credits'); break;
    default: alert("Error");
    }
}

creditsScene.onSpace = function (position)
{
    this.scene.switch('mainmenu');
}

chooseLvlScene.onSpace = function (position)
{
    if (position == 9)
        this.scene.switch('mainmenu');
    else
        launchLevel(this.scene, position);
}

function launchLevel(scene, k)
{
    if (scene.get('lvl') && scene.get('lvl').sys.isVisible())
        scene.remove('lvl');
    scene.add('lvl', new LvlScene('lvl', k), false);
    scene.stop('mainmenu');
    scene.stop('chooseLvl');
    scene.stop('credits');
    scene.stop('gameover');
    scene.stop('youwon');
    scene.stop('pause');
    scene.switch('lvl');
}

chooseLvlScene.postCreate = function(position)
{
    this.txts = [];
    
    this.txts[0] = this.add.text(160, 240, '1', { fontFamily: 'sans-serif', fontStyle: 'italic', fontSize: '75px', fill: '#000' });
    this.txts[1] = this.add.text(160, 350, '2', { fontFamily: 'sans-serif', fontStyle: 'italic', fontSize: '75px', fill: '#000' });
    this.txts[2] = this.add.text(160, 460, '3', { fontFamily: 'sans-serif', fontStyle: 'italic', fontSize: '75px', fill: '#000' });

    this.txts[3] = this.add.text(370, 240, '4', { fontFamily: 'sans-serif', fontStyle: 'italic', fontSize: '75px', fill: '#000' });
    this.txts[4] = this.add.text(370, 350, '5', { fontFamily: 'sans-serif', fontStyle: 'italic', fontSize: '75px', fill: '#000' });
    this.txts[5] = this.add.text(370, 460, '6', { fontFamily: 'sans-serif', fontStyle: 'italic', fontSize: '75px', fill: '#000' });

    this.txts[6] = this.add.text(580, 240, '7', { fontFamily: 'sans-serif', fontStyle: 'italic', fontSize: '75px', fill: '#000' });
    this.txts[7] = this.add.text(580, 350, '8', { fontFamily: 'sans-serif', fontStyle: 'italic', fontSize: '75px', fill: '#000' });
    this.txts[8] = this.add.text(580, 460, '9', { fontFamily: 'sans-serif', fontStyle: 'italic', fontSize: '75px', fill: '#000' });
}

pauseScene.onSpace = function (position)
{
    var thislvl = this.scene.get('lvl').nlvl;
    this.scene.stop('pause');
    switch (position) {
    case 0: this.scene.resume('lvl'); break;
    case 1: this.scene.remove('lvl'); launchLevel(this.scene, thislvl); break;
    case 2: this.scene.remove('lvl'); this.scene.switch('chooselvl'); break;
    }
}

gameOverScene.onSpace = function (position)
{
    this.scene.stop('gameover');    
    var thislvl = this.scene.get('lvl').nlvl;
    this.scene.remove('lvl');
    switch (position) {
    case 0: launchLevel(this.scene, thislvl); break;
    case 1: this.scene.switch('chooselvl');
    }
}

youWonScene.onSpace = function (position)
{
    this.scene.stop('youwon');
    var thislvl = this.scene.get('lvl').nlvl;
    this.scene.remove('lvl');
    var next = thislvl + 1;
    if (next >= 9)
        next -= 9;
    wons[thislvl] = true;
    this.scene.get('chooselvl').txts[thislvl].setFill('#0F0');
    switch (position) {
    case 0: launchLevel(this.scene, next); break;
    case 1: this.scene.switch('chooselvl');
    }
}
