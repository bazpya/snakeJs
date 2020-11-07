//###########################  Splash  ############################################
//#################################################################################

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
//#################################################################################

PauseOverlay = function (game, element) {
	this.game = game;
	this.element = element;

}

PauseOverlay.prototype.popUp = function () {
	this.element.classList.replace('popdown', (this.game.config.debugMode) ? 'popup-debug' : 'popup');
}

PauseOverlay.prototype.popDown = function () {
	this.element.classList.replace((this.game.config.debugMode) ? 'popup-debug' : 'popup', 'popdown');
}
