onload = function () {
	game = new Game(znakeConfig);
};

Game = function (config) {
	this.importConfig(config);
	this.initialise();
	this.bindHandlers();
};

Game.prototype.importConfig = function (znakeConfig) {
	this.config = {}
	for (let key in znakeConfig)
		this.config[key] = znakeConfig[key];

	this.config.keyCodeForUp = znakeConfig.keyForUp.charCodeAt(0);
	this.config.keyCodeForRight = znakeConfig.keyForRight.charCodeAt(0);
	this.config.keyCodeForDown = znakeConfig.keyForDown.charCodeAt(0);
	this.config.keyCodeForLeft = znakeConfig.keyForLeft.charCodeAt(0);
	this.config.keyCodeForPause = znakeConfig.keyForPause.charCodeAt(0);
};

Game.prototype.initialise = function () {
	let me = this;
	this.runLoopId = 0;
	this.feedLoopId = 0;
	this.movingTimeStep = this.config.movingTimeStep;
	this.feedingTimeStep = this.config.feedingTimeStep;
	this.gridContainer = document.getElementById('grid-container');
	this.grid = new Grid(this.gridContainer, this.config.gridHeight, this.config.gridWidth);
	this.splash = document.getElementById('splash'); //Todo: Refactor to an object type
	this.button = document.getElementById('button'); //Todo: Refactor to an object
	this.pauseOverlay = document.getElementById('pause'); //Todo: Refactor to an object
	this.scoreDisplay = document.getElementById('score'); //Todo: Refactor to an object
	this.worm = new Worm(this);
	this.nextCellGettingFunctions = [
		function () { return me.grid.cells[me.worm.head.row - 1][me.worm.head.column] },
		function () { return me.grid.cells[me.worm.head.row][me.worm.head.column + 1] },
		function () { return me.grid.cells[me.worm.head.row + 1][me.worm.head.column] },
		function () { return me.grid.cells[me.worm.head.row][me.worm.head.column - 1] }
	];
	this.keyMapping = {};
	this.defineInitialKeyCodeMapping();
	this.directions = [2];
	this.currentDirection = 2;
	this.lastDirectionCommand = 2;
};

Game.prototype.bindHandlers = function () {
	let me = this;
	this.splash.onclick = function () {
		me.initialiseSound();
		me.initialiseCrosshairs();
		me.splash.classList.replace('popup', 'popdown');
	};
	this.button.onmousedown = () => this.start(); // To fix the 'this' context issue
	onkeydown = function (keyDownEvent) {
		if (typeof me.keyMapping[keyDownEvent.keyCode] === 'function')
			me.keyMapping[keyDownEvent.keyCode]();
	};
	document.oncontextmenu = function (clickEvent) {
		clickEvent.preventDefault();
	};
	document.onmousedown = function (clickEvent) {
		if (me.config.debugMode && clickEvent.target.tagName == 'TD') {
			switch (clickEvent.which) {
				case 1: clickEvent.target.element.beFood(); break;  // left click
				case 2: clickEvent.target.element.beBlank(); break;  // middle click
				case 3: clickEvent.target.element.beObstacle(); break;  // right click
				default: break;
			};
		};
	};
};

Game.prototype.initialiseSound = function () {
	if (typeof this.sound === 'undefined' || typeof this.sound.audioCtx === 'undefined') {
		this.sound = new Sound(this.config.soundVolume);
	}
}

Game.prototype.start = function () {
	this.button.firstChild.textContent = "Restart";
	this.button.onmousedown = () => this.restart();
	this.run();
	this.feed();
};

Game.prototype.restart = function () {
	this.pauseOverlay.classList.replace((this.config.debugMode) ? 'popup-debug' : 'popup', 'popdown');
	this.stopRunning();
	this.stopFeeding();
	this.grid.erase();
	delete this.grid;
	delete this.worm;
	this.initialise();
	this.run();
	this.feed();
};

Game.prototype.run = function () {
	this.runLoopId++;
	this['runningLoop' + this.runLoopId] = setInterval(() => this.worm.update(), this.movingTimeStep);
};

Game.prototype.stopRunning = function () {
	clearInterval(this['runningLoop' + this.runLoopId]);
	delete this['runningLoop' + this.runLoopId];
};

Game.prototype.togglePause = function () {
	(this.isPaused) ? this.unPause() : this.pause();
};

Game.prototype.pause = function () {
	this.isPaused = true;
	this.stopRunning();
	this.stopFeeding();
	this.definePausedKeyCodeMapping();
	this.pauseOverlay.classList.replace('popdown', (this.config.debugMode) ? 'popup-debug' : 'popup');
};

Game.prototype.unPause = function () {
	this.isPaused = false;
	(this.worm.length === 1) ? this.defineInitialKeyCodeMapping() : this.defineSelfBiteAvoidingKeyCodeMapping();
	this.run();
	this.feed();
	this.pauseOverlay.classList.replace((this.config.debugMode) ? 'popup-debug' : 'popup', 'popdown');
};

Game.prototype.gameOver = function () {
	this.stopRunning();
	this.stopFeeding();
	this.disableKeys();
	this.worm.sections.forEach(function (section) {
		section.beObstacle();
	});
	log('Over!');
};

Game.prototype.feed = function () {
	this['foodDroppingInterval' + this.feedLoopId] = setInterval(() => this.dropFood(), this.feedingTimeStep);
};

Game.prototype.stopFeeding = function () {
	clearInterval(this['foodDroppingInterval' + this.feedLoopId]);
	delete this['foodDroppingInterval' + this.feedLoopId++];
};

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
};

Game.prototype.speedUp = function () {
	if (this.movingTimeStep > this.config.minimumMovingTimeStep) this.movingTimeStep -= this.config.movingTimeStepDecrement;
};

Game.prototype.defineInitialKeyCodeMapping = function () {
	let me = this;
	this.keyMapping[this.config.keyCodeForUp] = function () { me.directions.push(0); me.lastDirectionCommand = 0; };
	this.keyMapping[this.config.keyCodeForRight] = function () { me.directions.push(1); me.lastDirectionCommand = 1; };
	this.keyMapping[this.config.keyCodeForDown] = function () { me.directions.push(2); me.lastDirectionCommand = 2; };
	this.keyMapping[this.config.keyCodeForLeft] = function () { me.directions.push(3); me.lastDirectionCommand = 3; };
	this.keyMapping[this.config.keyCodeForPause] = function () { me.togglePause() };
};

Game.prototype.defineSelfBiteAvoidingKeyCodeMapping = function () {
	let me = this;
	this.keyMapping[this.config.keyCodeForUp] = function () { if (!Boolean(this.lastDirectionCommand % 2)) return; me.directions.push(0); this.lastDirectionCommand = 0; };
	this.keyMapping[this.config.keyCodeForRight] = function () { if (Boolean(this.lastDirectionCommand % 2)) return; me.directions.push(1); this.lastDirectionCommand = 1; };
	this.keyMapping[this.config.keyCodeForDown] = function () { if (!Boolean(this.lastDirectionCommand % 2)) return; me.directions.push(2); this.lastDirectionCommand = 2; };
	this.keyMapping[this.config.keyCodeForLeft] = function () { if (Boolean(this.lastDirectionCommand % 2)) return; me.directions.push(3); this.lastDirectionCommand = 3; };
};

Game.prototype.definePausedKeyCodeMapping = function () {
	this.keyMapping[this.config.keyCodeForUp] = function () { };
	this.keyMapping[this.config.keyCodeForRight] = function () { };
	this.keyMapping[this.config.keyCodeForDown] = function () { };
	this.keyMapping[this.config.keyCodeForLeft] = function () { };
};

Game.prototype.disableKeys = function () {
	this.definePausedKeyCodeMapping();
	this.keyMapping[this.config.keyCodeForPause] = function () { };
};
