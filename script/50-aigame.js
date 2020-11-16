AiGame = function (znakeConf) {
	Game.call(this, znakeConf);
}

// AiGame.prototype = new Game();
AiGame.prototype.constructor = Game;

AiGame.prototype.importConfig = function (znakeConf) {
	Game.prototype.importConfig.call(this, znakeConf);
}

AiGame.prototype.initialise = function () {
	Game.prototype.initialise.call(this);
}

AiGame.prototype.initialiseCrosshairs = function () {
	Game.prototype.initialiseCrosshairs.call(this);
}

AiGame.prototype.splashClicked = function () {
	Game.prototype.splashClicked.call(this);
	this.ai = new Ai(this);
}

AiGame.prototype.initialiseSound = function () {
	Game.prototype.initialiseSound.call(this);
}

AiGame.prototype.start = function () {
	Game.prototype.start.call(this);
}

AiGame.prototype.restart = function () {
	Game.prototype.restart.call(this);
}

AiGame.prototype.run = function () {
	this.ai.run();
}

AiGame.prototype.stopRunning = function () {
	this.ai.stopRunning();
}

AiGame.prototype.togglePause = function () {
	Game.prototype.togglePause.call(this);
}

AiGame.prototype.gameOver = function () {
	this.restart();
}

AiGame.prototype.speedUp = function () {
	return null;
}
