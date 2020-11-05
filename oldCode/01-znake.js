onload = function () {
	game = new Game(znakeConfig);
	runLoopId = 0;
	feedLoopId = 0;
	initialise();
	bindEventHandlers();
};

start = function () {
	game.start();
	theButton.firstChild.textContent = "Restart";
	theButton.onmousedown = restart;
	run();
	feed();
};
// TODO: can we use functions defined below in this function?
restart = function () {
	game.restart();
	pauseOverlay.classList.replace((debugMode) ? 'popup-debug' : 'popup', 'popdown');
	stopRunning();
	stopFeeding();
	gridContainer.removeChild(grid);
	delete grid;
	delete worm;
	initialise();
	run();
	feed();
};

run = function () {
	game.run();
	runLoopId++;
	window['runningLoop' + runLoopId] = setInterval(function () { worm.update(); }, movingTimeStep);
};

stopRunning = function () {
	game.stopRunning();
	clearInterval(window['runningLoop' + runLoopId]);
	delete window['runningLoop' + runLoopId];
};

togglePause = function () {
	(isPaused) ? unPause() : pause();
};

pause = function () {
	isPaused = true;
	stopRunning();
	stopFeeding();
	definePausedKeyCodeMapping();
	pauseOverlay.classList.replace('popdown', (debugMode) ? 'popup-debug' : 'popup');
};

unPause = function () {
	isPaused = false;
	(worm.length === 1) ? defineInitialKeyCodeMapping() : defineSelfBiteAvoidingKeyCodeMapping();
	run();
	feed();
	pauseOverlay.classList.replace((debugMode) ? 'popup-debug' : 'popup', 'popdown');
};

gameOver = function () {
	stopRunning();
	stopFeeding();
	disableKeys();
	worm.sections.forEach(function (section) {
		section.beObstacle();
	});
	console.log('Over!');
};

feed = function () {
	window['foodDroppingInterval' + feedLoopId] = setInterval(dropFood, feedingTimeStep);
};

stopFeeding = function () {
	clearInterval(window['foodDroppingInterval' + feedLoopId]);
	delete window['foodDroppingInterval' + feedLoopId++];
};

dropFood = function () {
	if (typeof previousFoodCell !== 'undefined' && previousFoodCell.isFood) previousFoodCell.beNormal();
	let nextFoodCell;
	do {
		foodX = 1 + Math.floor(Math.random() * (gridWidth - 2));
		foodY = 1 + Math.floor(Math.random() * (gridHeight - 2));
		nextFoodCell = grid.cells[foodX][foodY];
	} while (!nextFoodCell.isNormal);
	nextFoodCell.beFood();
	previousFoodCell = nextFoodCell;
};

speedUp = function () {
	if (movingTimeStep > minimumMovingTimeStep) movingTimeStep -= movingTimeStepDecrement;
};

Object.defineProperties(Array.prototype, {
	last: { get: function () { return this[this.length - 1] } }
});

//#######################  Game  #######################

Game = function (config) {
	console.log("construct a game");

	for (let key in config)
		this[key] = config[key];

	this.runLoopId = 0;
	this.feedLoopId = 0;
	this.initialise();
	this.bindHandlers();
};

Game.prototype.initialise = function () {
	console.log("initialise");
	console.log(this.movingTimeStep);
};

Game.prototype.bindHandlers = function () {
	console.log("bindHandlers")
};

Game.prototype.start = function () {
	console.log("start")
};

Game.prototype.restart = function () {
	console.log("restart")
};

Game.prototype.run = function () {
	console.log("run")
};

Game.prototype.stopRunning = function () {
	console.log("stopRunning")
};

Game.prototype.togglePause = function () {
	console.log("togglePause")
};

Game.prototype.pause = function () {
	console.log("pause")
};

Game.prototype.unPause = function () {
	console.log("unPause")
};

Game.prototype.gameOver = function () {
	console.log("gameOver")
};

Game.prototype.feed = function () {
	console.log("feed")
};

Game.prototype.stopFeeding = function () {
	console.log("stopFeeding")
};

Game.prototype.dropFood = function () {
	console.log("dropFood")
};

Game.prototype.speedUp = function () {
	console.log("speedUp")
};
