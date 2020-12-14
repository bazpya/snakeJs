class Control {
	#config;
	#wormInput;
	#enabled;
	constructor(game, config) {
		this.game = game;
		this.#config = config;
		this.#enabled = false;
		this.mapping = {
			[this.#config[Direction.up].charCodeAt(0)]: Direction.up,
			[this.#config[Direction.right].charCodeAt(0)]: Direction.right,
			[this.#config[Direction.down].charCodeAt(0)]: Direction.down,
			[this.#config[Direction.left].charCodeAt(0)]: Direction.left,
			[this.#config.pause.charCodeAt(0)]: 0,
		};
		this.bind();
	}

	attach(wormInput) {
		this.#wormInput = wormInput;
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
			const direction = me.mapping[keyDownEvent.keyCode];
			if (isUndefined(direction))
				return;
			if (direction === 0) {
				me.game.togglePause();
				return;
			}
			if (me.game.isPaused)
				return;
			me.#wormInput(direction);
		}
	}
}
