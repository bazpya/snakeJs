class Game {
	constructor(znakeConf) {
		this.importConfig(znakeConf);
		this.initialise();
	}

	importConfig(znakeConf) {
		this.config = {}
		for (let key in znakeConf)
			this.config[key] = znakeConf[key];
		if (this.config["grid.height"] < 4)
			throw "Grid height must be at least 4"
		if (this.config["grid.width"] < 4)
			throw "Grid width must be at least 4"
	}

	initialise() {
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

	onSplashClicked() {
		this.initialiseSound();
		let me = this;
		Crosshairs(() => me.sound.mouseInBeep(), () => me.sound.mouseOutBeep());
		this.worm = new Worm(this);
		this.infoboard.set(infoboardKeysEnum.Score, this.worm.length);
	}

	initialiseSound() {
		if (isUndefined(this.sound) || isUndefined(this.sound.audioCtx)) {
			this.sound = new znakeSound(this.config.soundVolume);
		}
	}

	start() {
		this.button.beRestartButton();
		this.control.setForRunning()
		this.run();
		this.feeder.dropFoodInitial();
	}

	restart() {
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

	run() {
		this.intervaller.run();
	}

	stopRunning() {
		this.intervaller.stop();
	}

	togglePause() {
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

	onWormBorn(replacedFoodCell = false) {
		if (replacedFoodCell)
			this.feeder.dropFood();
	}

	onWormDied() {
		this.stopRunning();
		this.control.disable();
	}

	onFoodEaten(foodCell) {
		this.sound.foodBeep();
		this.infoboard.set(infoboardKeysEnum.Score, this.worm.length);
		this.speedUp();
		this.feeder.dropFood();
	}

	speedUp() {
		if (this.intervaller.period > this.config.stepTime.min) {
			const newPeriod = this.intervaller.period - this.config.stepTime.decrement;
			this.intervaller.setPeriod(newPeriod);
		}
	}
}
