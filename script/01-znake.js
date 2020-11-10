onload = function () {
	game = new Game(znakeConfig);
	if (znakeConfig.runMode === runModeEnum.auto)
		ai = new Ai(game);
}

Game = function (config) {
	this.importConfig(config);
	this.initialise();
	this.runLoopId = 0;
	this.feedLoopId = 0;
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

	this.kboard = new Kboard(this);
	this.mouse = new Mouse(this);
	this.worm = new Worm(this);

	let buttonElement = document.getElementById('button');
	this.button = new Button(this, buttonElement);
}

Game.prototype.initialiseSound = function () {
	if (isUndefined(this.sound) || isUndefined(this.sound.audioCtx)) {
		this.sound = new Sound(this.config.soundVolume);
	}
}

Game.prototype.start = function () {
	this.button.beRestartButton();
	this.kboard.setForRunning()
	this.run();
	this.feed();
}

Game.prototype.restart = function () {
	if (this.isPaused) {
		this.pauseOverlay.popDown();
		this.isPaused = false;
	}
	this.mouse.unbindAll();
	this.stopRunning();
	this.stopFeeding();
	this.grid.erase();
	delete this.grid;
	delete this.worm;
	this.initialise();
	this.button.beRestartButton();
	this.kboard.setForRunning()
	this.run();
	this.feed();
}

Game.prototype.run = function () {
	if (this.config.runMode === runModeEnum.auto) {
		ai.run();
	}
	else {
		this.runLoopId++;
		let me = this;
		this.runLoopHandle = setInterval(() => me.worm.update(), me.movingTimeStep);
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
		this.kboard.setForRunning();
		this.pauseOverlay.popDown();
	}
	else {
		this.stopRunning();
		this.stopFeeding();
		this.isPaused = true;
		this.kboard.setForPause();
		this.pauseOverlay.popUp();
	}
}

Game.prototype.gameOver = function () {
	this.stopRunning();
	this.stopFeeding();
	this.kboard.disable();
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
