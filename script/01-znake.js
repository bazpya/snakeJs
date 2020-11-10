onload = function () {
	game = new Game(znakeConfig);
}

Game = function (config) {
	this.importConfig(config);
	this.initialise();
	this.bindHandlers();
	this.runLoopId = 0;
	this.feedLoopId = 0;
	let buttonElement = document.getElementById('button');
	this.button = new Button(this, buttonElement);
}

Game.prototype.importConfig = function (znakeConfig) {
	this.config = {}
	for (let key in znakeConfig)
		this.config[key] = znakeConfig[key];
}

Game.prototype.initialise = function () {
	this.movingTimeStep = this.config.movingTimeStep;
	this.feedingTimeStep = this.config.feedingTimeStep;

	this.gridContainer = document.getElementById('grid-container');
	this.grid = new Grid(this);

	let splashElement = document.getElementById('splash');
	this.splash = new Splash(this, splashElement);

	let pauseOverlayElement = document.getElementById('pause');
	this.pauseOverlay = new PauseOverlay(this, pauseOverlayElement);

	let scoreBoardElement = document.getElementById('score');
	this.scoreBoard = new ScoreBoard(this, scoreBoardElement);
	this.scoreBoard.reset();

	this.worm = new Worm(this);

	this.keyMapping = {};
	this.keyMapping[znakeConfig.keys.up.charCodeAt(0)] = directionEnum.up;
	this.keyMapping[znakeConfig.keys.right.charCodeAt(0)] = directionEnum.right;
	this.keyMapping[znakeConfig.keys.down.charCodeAt(0)] = directionEnum.down;
	this.keyMapping[znakeConfig.keys.left.charCodeAt(0)] = directionEnum.left;
	this.keyMapping[znakeConfig.keys.pause.charCodeAt(0)] = 4;

	this.keyFuncs = [];
}

Game.prototype.bindHandlers = function () {
	let me = this;
	document.onkeydown = function (keyDownEvent) {
		let directionCode = me.keyMapping[keyDownEvent.keyCode];
		if (isDefined(directionCode))
			me.keyFuncs[directionCode]();
	}
	document.oncontextmenu = (clickEvent) => clickEvent.preventDefault();

	document.onmousedown = function (clickEvent) {
		if (me.config.devMode && clickEvent.target.tagName == 'TD') {
			switch (clickEvent.which) {
				case 1: clickEvent.target.cell.beFood(); break;  // left click
				case 2: clickEvent.target.cell.beBlank(); break;  // middle click
				case 3: clickEvent.target.cell.beObstacle(); break;  // right click
				default: break;
			}
		}
	}
}

Game.prototype.initialiseSound = function () {
	if (isUndefined(this.sound) || isUndefined(this.sound.audioCtx)) {
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
	this.mapKeysForRunning()
	this.run();
	this.feed();
}

Game.prototype.restart = function () {
	if (this.isPaused) {
		this.pauseOverlay.popDown();
		this.isPaused = false;
	}
	this.stopRunning();
	this.stopFeeding();
	this.grid.erase();
	delete this.grid;
	delete this.worm;
	this.initialise();
	this.mapKeysForRunning()
	this.run();
	this.feed();
}

Game.prototype.run = function () {
	if (this.config.runMode === runModeEnum.manual) {
		this.runLoopId++;
		let me = this;
		this.runLoopHandle = setInterval(() => me.worm.update(), me.movingTimeStep);
	}
	else {
		log("Ai plays");
		ai = new Ai(game);
	}
}

Game.prototype.stopRunning = function () {
	clearInterval(this.runLoopHandle);
	delete this.runLoopHandle;
}

Game.prototype.togglePause = function () {
	if (this.isPaused) {
		this.run();
		this.feed();
		this.isPaused = false;
		this.mapKeysForRunning();
		this.pauseOverlay.popDown();
	}
	else {
		this.stopRunning();
		this.stopFeeding();
		this.isPaused = true;
		this.mapKeysForPause();
		this.pauseOverlay.popUp();
	}
}

Game.prototype.gameOver = function () {
	this.stopRunning();
	this.stopFeeding();
	this.disableKeys();
	this.worm.die();
}

Game.prototype.feed = function () {
	this.feedLoopId++;
	let me = this;
	this.feedLoopHandle = setInterval(() => me.dropFood(), me.feedingTimeStep);
}

Game.prototype.stopFeeding = function () {
	clearInterval(this.feedLoopHandle);
	delete this.feedLoopHandle;
}

Game.prototype.dropFood = function () {
	if (isDefined(this.foodCells))
		this.foodCells.forEach(function (cell, index) {
			if (cell.isFood)
				cell.beBlank();
		})

	let blankCells = this.grid.getBlankCells();
	this.foodCells = [];

	for (let i = 1; i <= this.config.numberOfFoodCellsAtOnce; i++) {
		let myRandom = new Random();
		let cell = myRandom.pickElement(blankCells);
		cell.beFood();
		this.foodCells.push(cell);
	}
}

Game.prototype.scoreUp = function (score) {
	this.sound.foodBeep();
	this.scoreBoard.update(score);
	this.speedUp();
}

Game.prototype.speedUp = function () {
	if (this.movingTimeStep > this.config.minimumMovingTimeStep) {
		this.movingTimeStep -= this.config.movingTimeStepDecrement;
		this.stopRunning();
		this.run();
	}
}

Game.prototype.mapKeysForRunning = function () {  //Todo: Rename to set keyFuncsForRunning
	let me = this;
	for (let directionName in directionEnum) {
		let directionValue = directionEnum[directionName];
		this.keyFuncs[directionValue] = function () { me.worm.directionFuncs[directionValue]() };
	}

	this.keyFuncs[4] = function () { me.togglePause() };
}

Game.prototype.mapKeysForPause = function () {
	for (let directionName in directionEnum) {
		let directionValue = directionEnum[directionName];
		this.keyFuncs[directionValue] = function () { };
	}
}

Game.prototype.disableKeys = function () {
	for (let key in this.keyFuncs)
		this.keyFuncs[key] = function () { };
}

Object.defineProperties(Game.prototype, {
	runLoopHandle: {
		get: function () { return this['runningLoop' + this.runLoopId]; },
		set: function (val) { this['runningLoop' + this.runLoopId] = val; }
	},
	feedLoopHandle: {
		get: function () { return this['feedingLoop' + this.feedLoopId]; },
		set: function (val) { this['feedingLoop' + this.feedLoopId] = val; }
	}
});
