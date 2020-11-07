onload = function () {
	game = new Game(znakeConfig);
}

Game = function (config) {
	this.importConfig(config);
	this.initialise();
	this.bindHandlers();
}

Game.prototype.importConfig = function (znakeConfig) {
	this.config = {}
	for (let key in znakeConfig)
		this.config[key] = znakeConfig[key];

	this.config.keyCodeForUp = znakeConfig.keyForUp.charCodeAt(0);
	this.config.keyCodeForRight = znakeConfig.keyForRight.charCodeAt(0);
	this.config.keyCodeForDown = znakeConfig.keyForDown.charCodeAt(0);
	this.config.keyCodeForLeft = znakeConfig.keyForLeft.charCodeAt(0);
	this.config.keyCodeForPause = znakeConfig.keyForPause.charCodeAt(0);
}

Game.prototype.initialise = function () {
	let me = this;
	this.runLoopId = 0;
	this.feedLoopId = 0;
	this.movingTimeStep = this.config.movingTimeStep;
	this.feedingTimeStep = this.config.feedingTimeStep;

	this.gridContainer = document.getElementById('grid-container');
	this.grid = new Grid(this.gridContainer, this.config.gridHeight, this.config.gridWidth);

	let buttonElement = document.getElementById('button');
	this.button = new Button(this, buttonElement);

	let splashElement = document.getElementById('splash');
	this.splash = new Splash(this, splashElement);

	let pauseOverlayElement = document.getElementById('pause');
	this.pauseOverlay = new PauseOverlay(this, pauseOverlayElement);

	let scoreBoardElement = document.getElementById('score');
	this.scoreBoard = new ScoreBoard(this, scoreBoardElement);
	this.scoreBoard.reset();

	this.worm = new Worm(this);
	this.keyMapping = [];
}

Game.prototype.bindHandlers = function () {
	let me = this;
	onkeydown = function (keyDownEvent) {
		if (typeof me.keyMapping[keyDownEvent.keyCode] === 'function')
			me.keyMapping[keyDownEvent.keyCode]();
	}
	document.oncontextmenu = function (clickEvent) {
		clickEvent.preventDefault();
	}
	document.onmousedown = function (clickEvent) {
		if (me.config.devMode && clickEvent.target.tagName == 'TD') {
			switch (clickEvent.which) {
				case 1: clickEvent.target.element.beFood(); break;  // left click
				case 2: clickEvent.target.element.beBlank(); break;  // middle click
				case 3: clickEvent.target.element.beObstacle(); break;  // right click
				default: break;
			}
		}
	}
}

Game.prototype.initialiseSound = function () {
	if (typeof this.sound === 'undefined' || typeof this.sound.audioCtx === 'undefined') {
		this.sound = new Sound(this.config.soundVolume);
	}
}

Game.prototype.initialiseCrosshairs = function () {
	let targets = document.getElementsByClassName('target');
	let me = this;

	Array.prototype.forEach.call(targets, function (item) {
		let cornerTopLeft = document.createElement('div');
		cornerTopLeft.classList.add('corners', 'corner-top-left');
		item.appendChild(cornerTopLeft);
		let cornerTopRight = document.createElement('div');
		cornerTopRight.classList.add('corners', 'corner-top-right');
		item.appendChild(cornerTopRight);
		let cornerBottomLeft = document.createElement('div');
		cornerBottomLeft.classList.add('corners', 'corner-bottom-left');
		item.appendChild(cornerBottomLeft);
		let cornerBottomRight = document.createElement('div');
		cornerBottomRight.classList.add('corners', 'corner-bottom-right');
		item.appendChild(cornerBottomRight);
		item.onmouseenter = () => me.sound.mouseInBeep();  // Could replace with global event listeners!
		item.onmouseleave = () => me.sound.mouseOutBeep();
	});
}

Game.prototype.start = function () {
	this.button.beRestartButton();
	this.run();
	this.feed();
}

Game.prototype.restart = function () {
	this.pauseOverlay.popDown();
	this.stopRunning();
	this.stopFeeding();
	this.grid.erase();
	delete this.grid;
	delete this.worm;
	this.initialise();
	this.run();
	this.feed();
}

Game.prototype.run = function () {
	this.worm.mapKeys()
	this.mapKeysForRunning()
	this.runLoopId++;
	this['runningLoop' + this.runLoopId] = setInterval(() => this.worm.update(), this.movingTimeStep);
}

Game.prototype.stopRunning = function () {
	clearInterval(this['runningLoop' + this.runLoopId]);
	delete this['runningLoop' + this.runLoopId];
}

Game.prototype.togglePause = function () {
	(this.isPaused) ? this.unPause() : this.pause();
}

Game.prototype.pause = function () {
	this.isPaused = true;
	this.stopRunning();
	this.stopFeeding();
	this.mapKeysForPause();
	this.pauseOverlay.popUp();
}

Game.prototype.unPause = function () {
	this.isPaused = false;
	this.run();
	this.feed();
	this.pauseOverlay.popDown();
}

Game.prototype.gameOver = function () {
	this.stopRunning();
	this.stopFeeding();
	this.disableKeys();
	this.worm.die();
}

Game.prototype.feed = function () {
	this['foodDroppingInterval' + this.feedLoopId] = setInterval(() => this.dropFood(), this.feedingTimeStep);
}

Game.prototype.stopFeeding = function () {
	clearInterval(this['foodDroppingInterval' + this.feedLoopId]);
	delete this['foodDroppingInterval' + this.feedLoopId++];
}

Game.prototype.dropFood = function () {
	if (typeof this.previousFoodCell !== 'undefined' && this.previousFoodCell.isFood)
		this.previousFoodCell.beBlank();
	let nextFoodCell;
	do {
		let foodVer = 1 + Math.floor(Math.random() * (this.config.gridHeight - 2));
		let foodHor = 1 + Math.floor(Math.random() * (this.config.gridWidth - 2));
		nextFoodCell = this.grid.cells[foodHor][foodVer];
	} while (!nextFoodCell.isBlank);
	nextFoodCell.beFood();
	this.previousFoodCell = nextFoodCell;
}

Game.prototype.scoreUp = function (score) {
	this.sound.foodBeep();
	this.scoreBoard.update(score);
	this.speedUp();
}

Game.prototype.speedUp = function () {
	if (this.movingTimeStep > this.config.minimumMovingTimeStep) {
		this.movingTimeStep -= this.config.movingTimeStepDecrement;
		clearInterval(this['runningLoop' + this.runLoopId]);
		delete this['runningLoop' + this.runLoopId];
		this.run();
	}
}

Game.prototype.mapKeysForRunning = function () {
	this.worm.mapKeys()
	let me = this;
	this.keyMapping[this.config.keyCodeForUp] = function () { me.worm.keyMapping[me.config.keyCodeForUp]() };
	this.keyMapping[this.config.keyCodeForRight] = function () { me.worm.keyMapping[me.config.keyCodeForRight]() };
	this.keyMapping[this.config.keyCodeForDown] = function () { me.worm.keyMapping[me.config.keyCodeForDown]() };
	this.keyMapping[this.config.keyCodeForLeft] = function () { me.worm.keyMapping[me.config.keyCodeForLeft]() };
	this.keyMapping[this.config.keyCodeForPause] = function () { me.togglePause() };
}

Game.prototype.mapKeysForPause = function () {
	this.disableKeys();
	let me = this;
	this.keyMapping[this.config.keyCodeForPause] = function () { me.togglePause() };
}

Game.prototype.disableKeys = function () {
	this.keyMapping.discardElements();
}
