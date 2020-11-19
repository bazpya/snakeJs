Game = function (znakeConf) {
	this.importConfig(znakeConf);
	this.initialise();
	this.loopId = 0;
}

Game.prototype.importConfig = function (znakeConf) {
	this.config = {}
	for (let key in znakeConf)
		this.config[key] = znakeConf[key];
	if (this.config["gridHeight"] < 4)
		throw "Grid height must be at least 4"
	if (this.config["gridWidth"] < 4)
		throw "Grid width must be at least 4"
}

Game.prototype.initialise = function () {
	this.wormStepTime = this.config.wormStepTime;
	this.mouse = new Mouse(this);
	this.grid = new Grid(this, document.getElementById('grid-container'));
	this.infoboard = new InfoBoard(this);
	this.control = new Control(this);
	this.overlay = new Overlay(this);
	this.feeder = new Feeder(this);
	this.button = new Button(this, document.getElementById('button'));
}

Game.prototype.splashClicked = function () {
	this.initialiseSound();
	let me = this;
	Crosshairs(() => me.sound.mouseInBeep(), () => me.sound.mouseOutBeep());
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
	this.feeder.dropFoodInitial();
}

Game.prototype.restart = function () {
	if (this.isPaused) {
		this.overlay.popDown();
		this.isPaused = false;
	} else {
		this.stopRunning();
	}
	this.wormStepTime = this.config.wormStepTime;
	this.worm.disappear();
	this.worm = new Worm(this);
	this.control.setForRunning();
	this.run();
}

Game.prototype.run = function () {
	this.loopId++;
	let me = this;
	this.loopHandle = setInterval(() => {
		me.worm.step();
		me.infoboard.updateAge(me.worm.age);
	}, me.wormStepTime);
}

Game.prototype.stopRunning = function () {
	clearInterval(this.loopHandle);
}

Game.prototype.togglePause = function () {
	if (this.isPaused) {
		this.run();
		this.isPaused = false;
		this.control.setForRunning();
		this.overlay.popDown();
	}
	else {
		this.stopRunning();
		this.isPaused = true;
		this.control.setForPause();
		this.overlay.popUp();
	}
}

Game.prototype.wormDied = function () {
	this.stopRunning();
	this.control.disable();
}

Game.prototype.foodEaten = function (foodCell) {
	this.sound.foodBeep();
	this.infoboard.updateScore(this.worm.length);
	this.speedUp();
	this.feeder.dropFood();
}

Game.prototype.speedUp = function () {
	if (this.wormStepTime > this.config.wormStepTimeMin) {
		this.wormStepTime -= this.config.wormStepTimeDecrement;
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
