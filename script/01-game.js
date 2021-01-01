class Game { //Todo: Make all fields private
	#config = {};
	#sound;
	#mouse;
	#grid;
	#button;
	#infoboard;
	#control;
	#overlay;
	#isPaused = false;
	#worm;

	constructor(znakeConf) {
		let me = this;
		this.#importConfig(znakeConf);
		this.#mouse = new Mouse();

		this.#grid = new Grid(
			document.getElementById('grid-container'),
			this.#config.grid,
			(...args) => this.#mouse.bindByTag(...args),
			this.#config.devMode);

		this.#infoboard = new Infoboard(
			document.getElementById('stats'),
			{
				Score: 0,
				Age: 0,
			}
		);

		this.#control = new Control(
			(...args) => this.#directionInput(...args),
			() => this.#togglePause(),
			this.#config.keys);

		this.#overlay = new Overlay(document.getElementById('body'),
			() => {
				me.#overlay.popDown();
				me.#overlay.unbindHandler();
				me.#overlay.beTranslucent();
				me.#overlay.line1 = "PAUSE";
				me.#overlay.line2 = "";
				me.#overlay.line3 = "";
				me.#onSplashClicked();
			},
			{
				line1: "Znake",
				line2: this.#config.devMode ? "Developer mode" : "",
				line3: "Click me!",
			});

		this.feeder = new Feeder(this.#grid, this.#config.numberOfFoodCellsAtOnce);

		this.#button = new MultiFuncButton(document.getElementById('button'),
			{
				Start: () => me.#start(),
				Restart: () => me.#restart()
			});
	}

	#importConfig(znakeConf) {
		for (let key in znakeConf)
			this.#config[key] = znakeConf[key];
		if (this.#config["grid.height"] < 4)
			throw "Grid height must be at least 4"
		if (this.#config["grid.width"] < 4)
			throw "Grid width must be at least 4"
	}

	#onSplashClicked() {
		this.#initialiseSound();
		let me = this;
		new Crosshairs(() => me.#sound.mouseInBeep(), () => me.#sound.mouseOutBeep());
		this.#worm = new Worm(
			this.#grid,
			this.#config.startAtCentre,
			this.#config.stepTime,
			{
				onWormBorn: (...args) => this.#onWormBorn(...args),
				onStepTaken: (...args) => this.#onStepTaken(...args),
				onFoodEaten: (...args) => this.#onFoodEaten(...args),
				onWormDied: (...args) => this.#onWormDied(...args),
			});
		this.#infoboard.set({ Score: this.#worm.length });
	}

	#initialiseSound() {
		if (isUndefined(this.#sound) || isUndefined(this.#sound.audioCtx)) {
			this.#sound = new znakeSound(this.#config.soundVolume);
		}
	}

	#start() {
		this.#button.bind("Restart");
		this.#run();
		this.#control.enable();
		this.feeder.dropFoodInitial();
	}

	#restart() {
		if (this.#isPaused) {
			this.#overlay.popDown();
			this.#isPaused = false;
		} else {
			this.stopRunning();
		}
		this.#worm.disappear();
		this.#worm = new Worm(
			this.#grid,
			this.#config.startAtCentre,
			this.#config.stepTime,
			{
				onWormBorn: (...args) => this.#onWormBorn(...args),
				onStepTaken: (...args) => this.#onStepTaken(...args),
				onFoodEaten: (...args) => this.#onFoodEaten(...args),
				onWormDied: (...args) => this.#onWormDied(...args),
			});
		let me = this;
		this.#control.enable();
		this.#worm.run();
		this.#infoboard.set({ Score: this.#worm.length });
	}

	#run() {
		this.#worm.run();
	}

	stopRunning() {
		this.#worm.stop();
	}

	#togglePause() {
		if (this.#isPaused) {
			this.#run();
			this.#isPaused = false;
			this.#overlay.popDown();
		}
		else {
			this.stopRunning();
			this.#isPaused = true;
			this.#overlay.popUp();
		}
	}

	#directionInput(dir) {
		if (this.#isPaused)
			return;
		this.#worm.input(dir);
	}

	#onWormBorn(replacedFoodCell = false) {
		if (replacedFoodCell)
			this.feeder.dropFood();
	}

	#onStepTaken(age) {
		this.#infoboard.set({ Age: age });
	}

	#onFoodEaten(foodCell) {
		this.#sound.foodBeep();
		this.#infoboard.set({ Score: this.#worm.length });
		this.#worm.speedUp();
		this.feeder.dropFood();
	}

	#onWormDied() {
		this.stopRunning();
		this.#control.disable();
	}
}
