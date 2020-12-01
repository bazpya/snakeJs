Game = function (znakeConf) {
	this.importConfig(znakeConf);
	this.initialise();
}

Game.prototype.importConfig = function (znakeConf) {
	this.config = {}
	for (let key in znakeConf)
		this.config[key] = znakeConf[key];
	if (this.config["grid.height"] < 4)
		throw "Grid height must be at least 4"
	if (this.config["grid.width"] < 4)
		throw "Grid width must be at least 4"
}

Game.prototype.initialise = function () {
	this.mouse = new Mouse(this);
	this.grid = new Grid(this, document.getElementById('grid-container'));
	this.infoboard = new Infoboard('stats', [infoboardKeysEnum.Score], [infoboardKeysEnum.Age, 0]);
	this.control = new Control(this);
	this.overlay = new Overlay(this);
	this.feeder = new Feeder(this);
	this.button = new Button(this, document.getElementById('button'));
	let me = this;
	this.intervaller = new Intervaller(() => { //Todo: Move to worm
		me.worm.step();
		me.infoboard.set(infoboardKeysEnum.Age, me.worm.age);
	}, this.config.stepTime.initial);
}

Game.prototype.splashClicked = function () {
	this.initialiseSound();
	let me = this;
	Crosshairs(() => me.sound.mouseInBeep(), () => me.sound.mouseOutBeep());
	this.worm = new Worm(this);
	this.infoboard.set(infoboardKeysEnum.Score, this.worm.length);
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
	this.worm.disappear();
	this.worm = new Worm(this);
	this.infoboard.set(infoboardKeysEnum.Score, this.worm.length);
	this.control.setForRunning();
	this.intervaller.setPeriod(this.config.stepTime.initial);
}

Game.prototype.run = function () {
	this.intervaller.run();
}

Game.prototype.stopRunning = function () {
	this.intervaller.stop();
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
	this.infoboard.set(infoboardKeysEnum.Score, this.worm.length);
	this.speedUp();
	this.feeder.dropFood();
}

Game.prototype.speedUp = function () {
	if (this.intervaller.period > this.config.stepTime.min) {
		const newPeriod = this.intervaller.period - this.config.stepTime.decrement;
		this.intervaller.setPeriod(newPeriod);
	}
}
