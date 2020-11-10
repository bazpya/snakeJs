Kboard = function (game) {
	this.game = game;
	this.mapping = {};
	this.funcs = [];
	this.mapKeys();
	this.bind();
}

Kboard.prototype.mapKeys = function () {
	this.mapping[this.game.config.keys.up.charCodeAt(0)] = directionEnum.up; //Todo: Replace with a loop
	this.mapping[this.game.config.keys.right.charCodeAt(0)] = directionEnum.right;
	this.mapping[this.game.config.keys.down.charCodeAt(0)] = directionEnum.down;
	this.mapping[this.game.config.keys.left.charCodeAt(0)] = directionEnum.left;
	this.mapping[this.game.config.keys.pause.charCodeAt(0)] = 0;
}

Kboard.prototype.setForRunning = function () {  //Todo: Rename to setFuncsForRunning
	let me = this;
	for (let directionName in directionEnum) {
		let directionCode = directionEnum[directionName];
		this.funcs[directionCode] = function () { me.game.worm.directionFuncs[directionCode]() };
	}

	this.funcs[0] = function () { me.game.togglePause() };
}

Kboard.prototype.setForPause = function () {  //Todo: Rename to setFuncsForPause
	for (let directionName in directionEnum) {
		let directionCode = directionEnum[directionName];
		this.funcs[directionCode] = function () { };
	}
}

Kboard.prototype.disable = function () {  //Todo: Rename to disable
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
