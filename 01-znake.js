onload = function () {
	game = new Game(znakeConfig);
};

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
