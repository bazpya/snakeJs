Game = function (config) {
	this.importConfig(config);
	this.initialise();
	this.loopId = 0;
}

Game.prototype.importConfig = function (znakeConfig) {
	this.config = {}
	for (let key in znakeConfig)
		this.config[key] = znakeConfig[key];
}

Game.prototype.initialise = function () {
	this.movingTimeStep = this.config.movingTimeStep;
	this.grid = new Grid(this, document.getElementById('grid-container'));
	this.pauseOverlay = new PauseOverlay(this);
	this.scoreBoard = new ScoreBoard(this, document.getElementById('score'));
	this.control = new Control(this);
	this.mouse = new Mouse(this);
	this.splash = new Splash(this);
	this.feeder = new Feeder(this);
	this.button = new Button(this, document.getElementById('button'));
}

Game.prototype.splashClicked = function () {
	this.initialiseSound();
	this.initialiseCrosshairs();
	this.worm = new Worm(this);
}

Game.prototype.initialiseSound = function () {
	if (isUndefined(this.sound) || isUndefined(this.sound.audioCtx)) {
		this.sound = new Sound(this.config.soundVolume);
	}
}

Game.prototype.start = function () {
	this.button.beRestartButton();
	this.control.setForRunning()
	this.run();
	this.feeder.feed();
}

Game.prototype.restart = function () {
	if (this.isPaused) {
		this.pauseOverlay.popDown();
		this.isPaused = false;
	} else {
		this.stopRunning();
		this.feeder.stopFeeding();
	}
	this.movingTimeStep = this.config.movingTimeStep;
	this.worm.reset();
	this.control.setForRunning();
	this.run();
	this.feeder.feed();
}

Game.prototype.run = function () {
	if (this.config.runMode === runModeEnum.auto) {
		ai.run();
	}
	else {
		this.loopId++;
		let me = this;
		this.loopHandle = setInterval(() => me.worm.update(), me.movingTimeStep);
	}
}

Game.prototype.stopRunning = function () {
	clearInterval(this.loopHandle);
}

Game.prototype.togglePause = function () {
	if (this.isPaused) {
		this.run();
		this.feeder.feed();
		this.isPaused = false;
		this.control.setForRunning();
		this.pauseOverlay.popDown();
	}
	else {
		this.stopRunning();
		this.feeder.stopFeeding();
		this.isPaused = true;
		this.control.setForPause();
		this.pauseOverlay.popUp();
	}
}

Game.prototype.gameOver = function () {
	if (this.config.runMode === runModeEnum.auto) {
		ai.stopRunning();
		this.worm.reset();
		ai.run();
	}
	else {
		this.stopRunning();
		this.feeder.stopFeeding();
		this.control.disable();
		this.worm.die();
	}
}

Game.prototype.speedUp = function () {
	if (this.movingTimeStep > this.config.minimumMovingTimeStep) {
		this.movingTimeStep -= this.config.movingTimeStepDecrement;
		this.stopRunning();
		this.run();
	}
}

Object.defineProperties(Game.prototype, {
	loopHandle: {
		get: function () { return this['runningLoop' + this.loopId]; },
		set: function (val) { this['runningLoop' + this.loopId] = val; }
	},
});
