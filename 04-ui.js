//###########################  Splash  ############################################

Splash = function (game, element) {
	this.game = game;
	this.element = element;
	this.bindHandler();
}

Splash.prototype.bindHandler = function () {
	let me = this;
	this.element.onclick = function () {
		me.game.initialiseSound();
		me.game.initialiseCrosshairs();
		me.popDown();
	}
}

Splash.prototype.popDown = function () {
	this.element.classList.replace('popup', 'popdown');
}

//###########################  Pause Overlay  #####################################

PauseOverlay = function (game, element) {
	this.game = game;
	this.element = element;
}

PauseOverlay.prototype.popUp = function () {
	this.element.classList.replace('popdown', (this.game.config.devMode) ? 'popup-debug' : 'popup');
}

PauseOverlay.prototype.popDown = function () {
	this.element.classList.replace((this.game.config.devMode) ? 'popup-debug' : 'popup', 'popdown');
}

//############################  Score Board  ######################################

ScoreBoard = function (game, element) {
	this.game = game;
	this.element = element;
}

ScoreBoard.prototype.update = function (number) {
	this.element.innerHTML = number;
}

ScoreBoard.prototype.reset = function () {
	this.update(1); // Minimum length
}

//############################  Button  ######################################

Button = function (game, element) {
	this.game = game;
	this.element = element;
	this.beStartButton();
}

Button.prototype.beStartButton = function () {
	let me = this;
	this.element.onmousedown = () => me.game.start();
}

Button.prototype.beRestartButton = function () {
	this.element.firstChild.textContent = "Restart";
	let me = this;
	this.element.onmousedown = () => me.game.restart();
}
