class Control {
	constructor(game) {
		this.game = game;
		this.mapping = {};
		this.funcs = [];
		this.mapKeys();
		this.bind();
	}

	mapKeys() {
		this.mapping[this.game.config.keys[Direction.up].charCodeAt(0)] = Direction.up;
		this.mapping[this.game.config.keys[Direction.right].charCodeAt(0)] = Direction.right;
		this.mapping[this.game.config.keys[Direction.down].charCodeAt(0)] = Direction.down;
		this.mapping[this.game.config.keys[Direction.left].charCodeAt(0)] = Direction.left;
		this.mapping[this.game.config.keys.pause.charCodeAt(0)] = 0;
	}

	setForRunning() {
		let me = this;
		this.funcs[Direction.up] = function () { me.game.worm.input(Direction.up) };
		this.funcs[Direction.right] = function () { me.game.worm.input(Direction.right) };
		this.funcs[Direction.down] = function () { me.game.worm.input(Direction.down) };
		this.funcs[Direction.left] = function () { me.game.worm.input(Direction.left) };

		this.funcs[0] = function () { me.game.togglePause() };
	}

	setForPause() {
		this.funcs[Direction.up] = function () { };
		this.funcs[Direction.right] = function () { };
		this.funcs[Direction.down] = function () { };
		this.funcs[Direction.left] = function () { };
	}

	disable() {
		for (let key in this.funcs)
			this.funcs[key] = function () { };
	}

	bind() {
		let me = this;
		document.onkeydown = function (keyDownEvent) {
			let direction = me.mapping[keyDownEvent.keyCode];
			ifFunctionRun(me.funcs[direction]);
		}
	}
}
