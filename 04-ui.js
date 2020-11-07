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
