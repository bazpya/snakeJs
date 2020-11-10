Kboard = function (game) {
	this.game = game;
	this.mapping = {};
	this.funcs = [];
	this.mapKeys();
	this.bind();
}

Kboard.prototype.mapKeys = function () {
	for (let directionName in directionEnum)
		this.mapping[this.game.config.keys[directionName].charCodeAt(0)] = directionEnum[directionName];
	this.mapping[this.game.config.keys.pause.charCodeAt(0)] = 0;
}

Kboard.prototype.setForRunning = function () {
	let me = this;
	for (let directionName in directionEnum) {
		let directionCode = directionEnum[directionName];
		this.funcs[directionCode] = function () { me.game.worm.directionFuncs[directionCode]() };
	}

	this.funcs[0] = function () { me.game.togglePause() };
}

Kboard.prototype.setForPause = function () {
	for (let directionName in directionEnum) {
		let directionCode = directionEnum[directionName];
		this.funcs[directionCode] = function () { };
	}
}

Kboard.prototype.disable = function () {
	for (let key in this.funcs)
		this.funcs[key] = function () { };
}

Kboard.prototype.bind = function () {
	let me = this;
	document.onkeydown = function (keyDownEvent) {
		let directionCode = me.mapping[keyDownEvent.keyCode];
		if (isDefined(directionCode))
			me.funcs[directionCode]();
	}
}
