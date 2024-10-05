class Control {
	#directionFunc;
	#pauseFunc;
	#enabled;
	#mapping;

	constructor(gameDirFunc, gamePauseFunc, config) {
		this.#directionFunc = gameDirFunc;
		this.#pauseFunc = gamePauseFunc;
		this.#enabled = false;
		this.#mapping = {
			[config[Direction.up].charCodeAt(0)]: Direction.up,
			[config[Direction.right].charCodeAt(0)]: Direction.right,
			[config[Direction.down].charCodeAt(0)]: Direction.down,
			[config[Direction.left].charCodeAt(0)]: Direction.left,
			[config.pause.charCodeAt(0)]: 0,
		};
		this.bind();
	}

	enable() {
		this.#enabled = true;
	}

	disable() {
		this.#enabled = false;
	}

	bind() {
		let me = this;
		document.onkeydown = function (keyDownEvent) {
			if (!me.#enabled)
				return;
			const direction = me.#mapping[keyDownEvent.keyCode];
			if (Var.isUndefined(direction))
				return;
			if (direction === 0) {
				me.#pauseFunc();
				return;
			}
			me.#directionFunc(direction);
		}
	}
}
