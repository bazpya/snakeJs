class Control {
	constructor(game) {
		this.game = game;
		this.mapping = {};
		this.funcs = [];
		this.mapKeys();
		this.bind();
	}

	mapKeys() {
		for (let directionName in directionEnum)
			this.mapping[this.game.config.keys[directionName].charCodeAt(0)] = directionEnum[directionName];
		this.mapping[this.game.config.keys.pause.charCodeAt(0)] = 0;
	}

	setForRunning() {
		let me = this;
		for (let directionName in directionEnum) {
			let directionCode = directionEnum[directionName];
			this.funcs[directionCode] = function () { me.game.worm.direction.funcs[directionCode]() };
		}

		this.funcs[0] = function () { me.game.togglePause() };
	}

	setForPause() {
		for (let directionName in directionEnum) {
			let directionCode = directionEnum[directionName];
			this.funcs[directionCode] = function () { };
		}
	}

	disable() {
		for (let key in this.funcs)
			this.funcs[key] = function () { };
	}

	bind() {
		let me = this;
		document.onkeydown = function (keyDownEvent) {
			let directionCode = me.mapping[keyDownEvent.keyCode];
			ifFunctionRun(me.funcs[directionCode]);
		}
	}
}
