Game = function (znakeConf) {
	this.importConfig(znakeConf);
	this.initialise();
	this.loopId = 0;
}

Game.prototype.importConfig = function (znakeConf) {
	this.config = {}
	for (let key in znakeConf)
		this.config[key] = znakeConf[key];
}

Game.prototype.initialise = function () {
	this.movingTimeStep = this.config.movingTimeStep;
	this.grid = new Grid(this, document.getElementById('grid-container'));
	this.scoreBoard = new ScoreBoard(this, document.getElementById('score'));
	this.control = new Control(this);
	this.mouse = new Mouse(this);
	this.overlay = new Overlay(this);
	this.feeder = new Feeder(this);
	this.button = new Button(this, document.getElementById('button'));
}

Game.prototype.splashClicked = function () {
	this.initialiseSound();
	let me = this;
	Crosshairs("target", () => me.sound.mouseInBeep(), () => me.sound.mouseOutBeep());
	this.worm = new Worm(this);
}

Game.prototype.initialiseSound = function () {
	if (isUndefined(this.sound) || isUndefined(this.sound.audioCtx)) {
		this.sound = new znakeSound(this.config.soundVolume);
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
		this.overlay.popDown();
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
	this.loopId++;
	let me = this;
	this.loopHandle = setInterval(() => me.worm.update(), me.movingTimeStep);
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
		this.overlay.popDown();
	}
	else {
		this.stopRunning();
		this.feeder.stopFeeding();
		this.isPaused = true;
		this.control.setForPause();
		this.overlay.popUp();
	}
}

Game.prototype.gameOver = function () {
	this.stopRunning();
	this.feeder.stopFeeding();
	this.control.disable();
	this.worm.die();
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
