Kboard = function (game) {
	this.game = game;
	this.keyMapping = {}; //Todo: Rename to mapping
	this.keyFuncs = [];  //Todo: Rename to funcs
	this.mapKeys();
	this.bind();
}

Kboard.prototype.mapKeys = function () {
	this.keyMapping[this.game.config.keys.up.charCodeAt(0)] = directionEnum.up; //Todo: Replace with a loop
	this.keyMapping[this.game.config.keys.right.charCodeAt(0)] = directionEnum.right;
	this.keyMapping[this.game.config.keys.down.charCodeAt(0)] = directionEnum.down;
	this.keyMapping[this.game.config.keys.left.charCodeAt(0)] = directionEnum.left;
	this.keyMapping[this.game.config.keys.pause.charCodeAt(0)] = 0;
}

Kboard.prototype.mapKeysForRunning = function () {  //Todo: Rename to setFuncsForRunning
	let me = this;
	for (let directionName in directionEnum) {
		let directionCode = directionEnum[directionName];
		this.keyFuncs[directionCode] = function () { me.game.worm.directionFuncs[directionCode]() };
	}

	this.keyFuncs[0] = function () { me.game.togglePause() };
}

Kboard.prototype.mapKeysForPause = function () {  //Todo: Rename to setFuncsForPause
	for (let directionName in directionEnum) {
		let directionCode = directionEnum[directionName];
		this.keyFuncs[directionCode] = function () { };
	}
}

Kboard.prototype.disableKeys = function () {  //Todo: Rename to disable
	for (let key in this.keyFuncs)
		this.keyFuncs[key] = function () { };
}

Kboard.prototype.bind = function () {
	let me = this;
	document.onkeydown = function (keyDownEvent) {
		let directionCode = me.keyMapping[keyDownEvent.keyCode];
		if (isDefined(directionCode))
			me.keyFuncs[directionCode]();
	}
}
